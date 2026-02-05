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
        const { count = 10, subject } = JSON.parse(event.body || '{}');

        console.log(`[Netlify Function] 正在获取考试题目... (数量:${count}, 科目:${subject})`);

        // 获取随机题目
        const questions = await supabaseClient.getRandomExamQuestions(count, subject);

        console.log(`[Netlify Function] 获取了 ${questions.length} 道题目`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(questions)
        };
    } catch (error: any) {
        console.error('[Netlify Function] 获取题目失败:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: '获取题目失败',
                message: error.message
            })
        };
    }
};
