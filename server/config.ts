import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录并加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env.local 文件
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 打印环境变量加载状态（用于调试）
console.log('[配置] 环境变量加载状态:');
console.log(`  - DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '已设置 ✓' : '未设置 ✗'}`);
console.log(`  - SUPABASE_URL: ${process.env.SUPABASE_URL ? '已设置 ✓' : '未设置 ✗'}`);
console.log(`  - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '已设置 ✓' : '未设置 ✗'}`);
console.log(`  - PORT: ${process.env.PORT || 3000}`);
