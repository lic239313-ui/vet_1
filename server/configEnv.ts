
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('[配置] 环境变量加载完成');
