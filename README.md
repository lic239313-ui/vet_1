# 智能兽医大亨 - 设置指南

## 概述
本项目已升级为**前后端一体**的全栈应用，后端使用Express.js，集成DeepSeek AI和Supabase数据库。

## 环境配置步骤

### 1. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env.local`，然后填入以下配置：

```env
# DeepSeek API配置
DEEPSEEK_API_KEY=sk-8f140e71f91f4751827b7a8beaa3c192

# Supabase数据库配置
SUPABASE_URL=https://pyavvzsgnusbspcskvpz.supabase.co
SUPABASE_ANON_KEY=sb_publishable_PbPh4cON9tDZFwMvuoawLA_To9dkhBH

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 2. 安装依赖

在项目根目录运行：

```bash
npm install
```

这将安装前端和后端所需的所有依赖包。

### 3. 初始化Supabase数据库

1. 登录您的Supabase项目控制台：https://supabase.com
2. 进入SQL编辑器
3. 执行 `database/schema.sql` 文件创建表结构
4. 执行 `database/seed.sql` 文件插入病例模板数据

**验证数据库**：
- 在Supabase的Table Editor中应该能看到 `case_templates` 表
- 表中应该有8条病例记录（细小病毒、猫瘟、猫癣等）

### 4. 启动应用

有三种方式启动：

#### 方式1：同时启动前后端（推荐）
```bash
npm run dev:all
```
这会同时启动前端(端口通常是5173)和后端(端口3000)

#### 方式2：分别启动

**启动后端服务器**（在第1个终端）：
```bash
npm run dev:server
```
看到以下信息表示成功：
```
╔════════════════════════════════════════╗
║   智能兽医大亨 - 后端API服务器          ║
║   端口: 3000                           ║
║   状态: 运行中 ✓                       ║
╚════════════════════════════════════════╝
```

**启动前端开发服务器**（在第2个终端）：
```bash
npm run dev:client
```

#### 方式3：只启动前端（传统方式）
```bash
npm run dev
```

### 5. 访问应用

- 前端界面：http://localhost:5173 (Vite默认端口)
- 后端API：http://localhost:3000
- API健康检查：http://localhost:3000/api/health

## 架构说明

### 前端
- React + TypeScript
- Vite构建工具
- 调用后端API获取病例和评估

### 后端
- Express.js服务器
- DeepSeek AI生成病例和评估诊断
- Supabase数据库存储病例模板

### API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/cases/generate` | POST | 生成临床病例 |
| `/api/cases/evaluate` | POST | 评估诊断和治疗方案 |
| `/api/quiz/from-case` | POST | 基于病例生成题目 |
| `/api/quiz/textbook` | POST | 生成教科书题目 |
| `/api/quiz/qualification` | POST | 生成资格考试题目 |

## 功能测试

### 1. 测试后端服务
打开浏览器访问：http://localhost:3000/api/health

应该看到JSON响应：
```json
{
  "status": "OK",
  "message": "兽医大亨后端服务运行中",
  "timestamp": "2026-01-17T..."
}
```

### 2. 测试病例生成
1. 在前端点击"接诊下一位"
2. 系统会：
   - 从Supabase获取病例模板
   - 调用DeepSeek AI生成完整病例
   - 返回病例数据到前端
3. 查看浏览器控制台和后端终端的日志

### 3. 测试诊断评估
1. 完成SOAP流程（主诉、检查、诊断、方案）
2. 提交诊断
3. AI会评估并返回得分和反馈

## 常见问题

### 问题1：无法连接到后端服务器
- 确认后端服务器正在运行（端口3000）
- 检查防火墙设置
- 确认.env.local文件配置正确

### 问题2：数据库连接失败
- 验证Supabase URL和密钥是否正确
- 确认网络可以访问Supabase
- 检查数据库表是否已创建

### 问题3：DeepSeek API调用失败
- 验证API密钥是否正确
- 检查API额度是否充足
- 查看后端控制台的错误信息

## 开发说明

### 修改后端代码
后端代码位于 `server/` 目录：
- `server.ts` - 主服务器
- `deepseekService.ts` - AI服务
- `supabaseClient.ts` - 数据库客户端
- `routes/api.ts` - API路由

### 修改前端代码  
前端代码位于根目录：
- `services/geminiService.ts` - 现在调用后端API
- `views/` - 各个页面组件
- `App.tsx` - 主应用组件

### 添加新病例模板
在Supabase中向 `case_templates` 表插入新记录，或修改 `database/seed.sql` 重新执行。

## 部署建议

生产环境部署时：
1. 后端：部署到Node.js服务器或云平台（如Railway、Render）
2. 前端：部署到静态托管（如Vercel、Netlify）
3. 环境变量：使用云平台的环境变量管理
4. 数据库：已经在Supabase云端
5. CORS：配置允许的前端域名

## 技术支持

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 查看后端终端的日志
3. 确认所有依赖都已安装
4. 确认环境变量配置正确
