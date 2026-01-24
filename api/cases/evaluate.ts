
// 动态导入以避免顶层副作用
let deepseekService: any;

const loadServices = async () => {
    if (!deepseekService) {
        deepseekService = await import('../../server/deepseekService');
    }
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await loadServices();

        const { clinicalCase, diagnosis, plan } = req.body || {};

        if (!clinicalCase || !diagnosis || !plan) {
            return res.status(400).json({
                error: '缺少参数: clinicalCase, diagnosis, plan'
            });
        }

        console.log(`[Vercel Function] 正在评估病例 ${clinicalCase.id}...`);

        const evaluation = await deepseekService.evaluateTreatment(
            clinicalCase,
            diagnosis,
            plan
        );

        console.log(`[Vercel Function] 评估完成，得分: ${evaluation.score}`);

        return res.status(200).json(evaluation);
    } catch (error: any) {
        console.error('[Vercel Function] 评估失败:', error);
        return res.status(500).json({
            error: '评估失败',
            message: error.message
        });
    }
}
