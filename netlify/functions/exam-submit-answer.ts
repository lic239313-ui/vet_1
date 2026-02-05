import { Handler } from '@netlify/functions';

// 动态导入以避免顶层副作用
let supabaseClient: any;

const loadServices = async () => {
    if (!supabaseClient) {
        supabaseClient = await import('../../server/supabaseClient');
    }
};

export const handler: Handler = async (event, context) => {
    // 允许跨域预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // 加载服务模块
        await loadServices();

        // 解析请求体
        const { userId, questionId, userAnswer, timeSpent } = JSON.parse(event.body || '{}');

        if (!userId || !questionId || userAnswer === undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: '缺少参数: userId, questionId, userAnswer'
                })
            };
        }

        console.log(`[Netlify Function] 用户 ${userId} 提交答案: 题目${questionId}`);

        // 获取题目
        const question = await supabaseClient.getQuestionById(questionId);

        if (!question) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: '题目不存在' })
            };
        }

        // 验证答案
        let isCorrect = false;
        if (Array.isArray(question.correct_answer)) {
            // 多选题：数组比较
            const correctSet = new Set(question.correct_answer);
            const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
            isCorrect = correctSet.size === userSet.size &&
                [...correctSet].every(val => userSet.has(val));
        } else {
            // 单选题：直接比较
            isCorrect = question.correct_answer === userAnswer;
        }

        // 记录答题
        await supabaseClient.recordUserAnswer(userId, questionId, userAnswer, isCorrect, timeSpent || 0);

        console.log(`[Netlify Function] 答案${isCorrect ? '正确' : '错误'}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                isCorrect,
                explanation: question.explanation,
                correctAnswer: question.correct_answer
            })
        };
    } catch (error: any) {
        console.error('[Netlify Function] 提交答案失败:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: '提交答案失败',
                message: error.message
            })
        };
    }
};
