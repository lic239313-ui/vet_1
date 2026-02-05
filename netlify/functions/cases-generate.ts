import { Handler } from '@netlify/functions';

// 动态导入以避免顶层副作用
let deepseekService: any;

const loadServices = async () => {
    if (!deepseekService) {
        try {
            console.log('[Netlify Function] Importing deepseekService...');
            deepseekService = await import('../../server/deepseekService');
            console.log('[Netlify Function] deepseekService imported successfully');
        } catch (error: any) {
            console.error('[Netlify Function] Failed to import deepseekService:', error);
            throw new Error(`Service import failed: ${error.message}`);
        }
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
        // 🔍 环境变量检查
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        const debugInfo = {
            hasDeepSeekKey: !!apiKey,
            deepSeekKeyLength: apiKey ? apiKey.length : 0,
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            nodeVersion: process.version,
            region: process.env.AWS_REGION || 'unknown'
        };

        console.log('[Netlify Function] Environment Debug:', JSON.stringify(debugInfo));

        if (!apiKey) {
            console.error('[Netlify Function] ❌ DEEPSEEK_API_KEY Missing');
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'Configuration Error',
                    message: 'DeepSeek API Key is missing in Netlify environment variables.',
                    debug: debugInfo
                })
            };
        }

        // 加载服务模块
        await loadServices();

        // 解析请求体
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON body' })
            };
        }

        const { rank } = body;

        if (!rank) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing parameter: rank' })
            };
        }

        console.log(`[Netlify Function] Generating case for rank: ${rank}`);
        const startTime = Date.now();

        // 调用生成病例服务
        const clinicalCase = await deepseekService.generateClinicalCase(rank);

        const duration = Date.now() - startTime;
        console.log(`[Netlify Function] ✅ Success! Duration: ${duration}ms`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(clinicalCase)
        };
    } catch (error: any) {
        console.error('[Netlify Function] ❌ Error:', error);

        // 详细错误分析
        const errorDetails = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            isTimeout: error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT'),
            isNetwork: error.message?.includes('fetch') || error.message?.includes('network')
        };

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Case Generation Failed',
                message: error.message,
                details: errorDetails,
                hint: errorDetails.isTimeout
                    ? 'The AI service timed out. Please try again.'
                    : 'An internal server error occurred. Check the details for more info.'
            })
        };
    }
};
