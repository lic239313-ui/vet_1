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
        // 🔍 环境变量检查
        const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
        const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;

        console.log('[Netlify Function] 环境变量状态:');
        console.log(`  - DEEPSEEK_API_KEY: ${hasDeepSeek ? '✅ 已配置' : '❌ 未配置'}`);
        console.log(`  - SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}`);
        console.log(`  - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}`);

        // 如果 DeepSeek API Key 缺失，提前返回错误
        if (!hasDeepSeek) {
            console.error('[Netlify Function] ❌ DEEPSEEK_API_KEY 未配置！');
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: '服务器配置错误',
                    message: 'DeepSeek API密钥未配置，请在Netlify环境变量中设置DEEPSEEK_API_KEY',
                    debug: {
                        hasDeepSeek,
                        hasSupabase
                    }
                })
            };
        }

        // 加载服务模块
        console.log('[Netlify Function] 正在加载服务模块...');
        await loadServices();

        // 解析请求体
        const { rank } = JSON.parse(event.body || '{}');

        if (!rank) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: '缺少参数: rank' })
            };
        }

        console.log(`[Netlify Function] 开始为 ${rank} 生成病例...`);
        const startTime = Date.now();

        // 调用生成病例服务
        const clinicalCase = await deepseekService.generateClinicalCase(rank);

        const duration = Date.now() - startTime;
        console.log(`[Netlify Function] ✅ 病例生成成功！用时: ${duration}ms, ID: ${clinicalCase.id}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clinicalCase)
        };
    } catch (error: any) {
        console.error('[Netlify Function] ❌ 病例生成失败:');
        console.error('  错误类型:', error.name);
        console.error('  错误消息:', error.message);
        console.error('  错误堆栈:', error.stack);

        // 检查是否是超时错误
        const isTimeout = error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT');
        const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network');

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: '病例生成失败',
                message: error.message,
                type: isTimeout ? 'timeout' : isNetworkError ? 'network' : 'unknown',
                hint: isTimeout
                    ? 'DeepSeek API 响应超时，请稍后重试'
                    : isNetworkError
                        ? 'DeepSeek API 网络连接失败，请检查API密钥是否有效'
                        : '未知错误，请查看服务器日志',
                debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
