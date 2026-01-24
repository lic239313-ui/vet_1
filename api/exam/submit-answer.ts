
// 动态导入以避免顶层副作用
let supabaseClient: any;

const loadServices = async () => {
    if (!supabaseClient) {
        supabaseClient = await import('../../server/supabaseClient');
    }
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await loadServices();

        const { userId, questionId, userAnswer, timeSpent } = req.body || {};

        if (!userId || !questionId || userAnswer === undefined) {
            return res.status(400).json({
                error: '缺少参数: userId, questionId, userAnswer'
            });
        }

        console.log(`[Vercel Function] 用户 ${userId} 提交答案: 题目${questionId}`);

        const question = await supabaseClient.getQuestionById(questionId);

        if (!question) {
            return res.status(404).json({ error: '题目不存在' });
        }

        // 验证答案
        let isCorrect = false;
        if (Array.isArray(question.correct_answer)) {
            const correctSet = new Set(question.correct_answer);
            const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
            isCorrect = correctSet.size === userSet.size &&
                [...correctSet].every(val => userSet.has(val));
        } else {
            isCorrect = question.correct_answer === userAnswer;
        }

        // 记录答题
        await supabaseClient.recordUserAnswer(userId, questionId, userAnswer, isCorrect, timeSpent || 0);

        console.log(`[Vercel Function] 答案${isCorrect ? '正确' : '错误'}`);

        return res.status(200).json({
            isCorrect,
            explanation: question.explanation,
            correctAnswer: question.correct_answer
        });
    } catch (error: any) {
        console.error('[Vercel Function] 提交答案失败:', error);
        return res.status(500).json({
            error: '提交答案失败',
            message: error.message
        });
    }
}
