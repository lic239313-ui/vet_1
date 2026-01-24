import { Handler } from '@netlify/functions';

// 动态导入以避免顶层副作用
let deepseekService: any;

const loadServices = async () => {
    if (!deepseekService) {
        deepseekService = await import('../../server/deepseekService');
    }
};

export const handler: Handler = async (event, context) => {
    // 只允许 POST 请求
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
        const { clinicalCase, diagnosis, plan } = JSON.parse(event.body || '{}');

        if (!clinicalCase || !diagnosis || !plan) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: '缺少参数: clinicalCase, diagnosis, plan'
                })
            };
        }

        console.log(`[Netlify Function] 正在评估病例 ${clinicalCase.id}...`);

        // 调用评估服务
        const evaluation = await deepseekService.evaluateTreatment(
            clinicalCase,
            diagnosis,
            plan
        );

        console.log(`[Netlify Function] 评估完成，得分: ${evaluation.score}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evaluation)
        };
    } catch (error: any) {
        console.error('[Netlify Function] 评估失败:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: '评估失败',
                message: error.message
            })
        };
    }
};
