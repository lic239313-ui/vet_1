import { Router, Request, Response } from 'express';
import * as deepseekService from '../deepseekService';

const router = Router();

/**
 * 健康检查端点
 */
router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: '兽医大亨后端服务运行中',
        timestamp: new Date().toISOString()
    });
});

/**
 * 生成临床病例
 * POST /api/cases/generate
 * Body: { rank: string }
 */
router.post('/cases/generate', async (req: Request, res: Response) => {
    try {
        const { rank } = req.body;

        if (!rank) {
            return res.status(400).json({ error: '缺少参数: rank' });
        }

        console.log(`[API] 正在为 ${rank} 生成病例...`);
        const clinicalCase = await deepseekService.generateClinicalCase(rank);

        console.log(`[API] 病例生成成功: ${clinicalCase.id}`);
        res.json(clinicalCase);
    } catch (error: any) {
        console.error('[API] 病例生成失败:', error);
        res.status(500).json({
            error: '病例生成失败',
            message: error.message
        });
    }
});

/**
 * 评估诊断和治疗方案
 * POST /api/cases/evaluate
 * Body: { clinicalCase: object, diagnosis: string, plan: string }
 */
router.post('/cases/evaluate', async (req: Request, res: Response) => {
    try {
        const { clinicalCase, diagnosis, plan } = req.body;

        if (!clinicalCase || !diagnosis || !plan) {
            return res.status(400).json({
                error: '缺少参数: clinicalCase, diagnosis, plan'
            });
        }

        console.log(`[API] 正在评估病例 ${clinicalCase.id}...`);
        const evaluation = await deepseekService.evaluateTreatment(
            clinicalCase,
            diagnosis,
            plan
        );

        console.log(`[API] 评估完成，得分: ${evaluation.score}`);
        res.json(evaluation);
    } catch (error: any) {
        console.error('[API] 评估失败:', error);
        res.status(500).json({
            error: '评估失败',
            message: error.message
        });
    }
});

/**
 * 获取执业兽医考试题目
 * POST /api/exam/questions
 * Body: { count?: number, subject?: string }
 */
router.post('/exam/questions', async (req: Request, res: Response) => {
    try {
        const { count = 10, subject } = req.body;

        console.log(`[API] 正在获取考试题目... (数量:${count}, 科目:${subject})`);

        const { getRandomExamQuestions } = await import('../supabaseClient');
        const questions = await getRandomExamQuestions(count, subject);

        console.log(`[API] 获取了 ${questions.length} 道题目`);
        res.json(questions);
    } catch (error: any) {
        console.error('[API] 获取题目失败:', error);
        res.status(500).json({
            error: '获取题目失败',
            message: error.message
        });
    }
});

/**
 * 提交答案并验证
 * POST /api/exam/submit-answer
 * Body: { userId: string, questionId: string, userAnswer: number | number[], timeSpent: number }
 */
router.post('/exam/submit-answer', async (req: Request, res: Response) => {
    try {
        const { userId, questionId, userAnswer, timeSpent } = req.body;

        if (!userId || !questionId || userAnswer === undefined) {
            return res.status(400).json({
                error: '缺少参数: userId, questionId, userAnswer'
            });
        }

        console.log(`[API] 用户 ${userId} 提交答案: 题目${questionId}`);

        const { getQuestionById, recordUserAnswer } = await import('../supabaseClient');

        // 获取题目
        const question = await getQuestionById(questionId);

        if (!question) {
            return res.status(404).json({ error: '题目不存在' });
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
        await recordUserAnswer(userId, questionId, userAnswer, isCorrect, timeSpent || 0);

        console.log(`[API] 答案${isCorrect ? '正确' : '错误'}`);

        res.json({
            isCorrect,
            explanation: question.explanation,
            correctAnswer: question.correct_answer
        });
    } catch (error: any) {
        console.error('[API] 提交答案失败:', error);
        res.status(500).json({
            error: '提交答案失败',
            message: error.message
        });
    }
});

export default router;

