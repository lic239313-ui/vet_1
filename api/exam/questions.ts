
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

        const { count = 10, subject } = req.body || {};

        console.log(`[Vercel Function] 正在获取考试题目... (数量:${count}, 科目:${subject})`);

        const questions = await supabaseClient.getRandomExamQuestions(count, subject);

        console.log(`[Vercel Function] 获取了 ${questions.length} 道题目`);

        return res.status(200).json(questions);
    } catch (error: any) {
        console.error('[Vercel Function] 获取题目失败:', error);
        return res.status(500).json({
            error: '获取题目失败',
            message: error.message
        });
    }
}
