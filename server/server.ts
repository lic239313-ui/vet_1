// 第一步：加载环境变量（必须在所有其他导入之前）
// 注意：必须通过单独的文件导入，以确保在其他模块（如 supabaseClient）加载前执行
import './configEnv';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

console.log('[配置] 环境变量检查:');
console.log(`  - DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '已设置 ✓' : '未设置 ✗'}`);
console.log(`  - SUPABASE_URL: ${process.env.SUPABASE_URL ? '已设置 ✓' : '未设置 ✗'}`);
console.log(`  - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '已设置 ✓' : '未设置 ✗'}`);

// 第二步：导入其他模块
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors()); // 允许前端跨域请求
app.use(express.json()); // 解析JSON请求体

// 请求日志
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// API路由
app.use('/api', apiRoutes);

// 根路径
app.get('/', (req: Request, res: Response) => {
    res.json({
        name: '智能兽医大亨 API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            generateCase: 'POST /api/cases/generate',
            evaluateCase: 'POST /api/cases/evaluate',
            quizFromCase: 'POST /api/quiz/from-case',
            textbookQuiz: 'POST /api/quiz/textbook',
            qualificationQuiz: 'POST /api/quiz/qualification'
        }
    });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[服务器错误]', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: err.message
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   智能兽医大亨 - 后端API服务器          ║
║   端口: ${PORT}                        ║
║   状态: 运行中 ✓                       ║
╚════════════════════════════════════════╝
  `);
    console.log(`API文档: http://localhost:${PORT}/`);
    console.log(`健康检查: http://localhost:${PORT}/api/health\n`);
});

export default app;
