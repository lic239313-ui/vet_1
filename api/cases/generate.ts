
// 动态导入以避免顶层副作用
let deepseekService: any;

const loadServices = async () => {
    if (!deepseekService) {
        deepseekService = await import('../../server/deepseekService');
    }
};

export default async function handler(req: any, res: any) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 🔍 环境变量检查
        const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
        // Vercel 环境变量通常在 process.env 中可用

        console.log('[Vercel Function] 环境变量状态:');
        console.log(`  - DEEPSEEK_API_KEY: ${hasDeepSeek ? '✅ 已配置' : '❌ 未配置'}`);

        // 如果 DeepSeek API Key 缺失，提前返回错误
        if (!hasDeepSeek) {
            console.error('[Vercel Function] ❌ DEEPSEEK_API_KEY 未配置！');
            return res.status(500).json({
                error: '服务器配置错误',
                message: 'DeepSeek API密钥未配置，请在Vercel环境变量中设置DEEPSEEK_API_KEY'
            });
        }

        // 加载服务模块
        await loadServices();

        // 解析请求体 (Vercel 自动解析 JSON body)
        const rank = req.body?.rank;

        if (!rank) {
            return res.status(400).json({ error: '缺少参数: rank' });
        }

        console.log(`[Vercel Function] 开始为 ${rank} 生成病例...`);
        const startTime = Date.now();

        // 调用生成病例服务
        const clinicalCase = await deepseekService.generateClinicalCase(rank);

        const duration = Date.now() - startTime;
        console.log(`[Vercel Function] ✅ 病例生成成功！用时: ${duration}ms, ID: ${clinicalCase.id}`);

        return res.status(200).json(clinicalCase);
    } catch (error: any) {
        console.error('[Vercel Function] ❌ 病例生成失败:', error);

        // 检查是否是超时错误
        const isTimeout = error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT');
        const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network');

        return res.status(500).json({
            error: '病例生成失败',
            message: error.message,
            type: isTimeout ? 'timeout' : isNetworkError ? 'network' : 'unknown',
            hint: isTimeout
                ? 'DeepSeek API 响应超时，请由于 Vercel Hobby 限制（10秒），建议重试或升级'
                : '未知错误，请查看服务器日志'
        });
    }
}
