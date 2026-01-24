# Netlify 部署指南

## 🎯 已完成的迁移工作

您的应用已成功从 Express 后端迁移到 Netlify Functions（无服务器架构）。

### ✅ 创建的文件

1. **配置文件**
   - [`netlify.toml`](file:///c:/Users/Administrator/Desktop/vet_1/netlify.toml) - Netlify 构建和重定向配置

2. **Serverless Functions** (在 `netlify/functions/` 目录)
   - [`cases-generate.ts`](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions/cases-generate.ts) - 生成临床病例
   - [`cases-evaluate.ts`](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions/cases-evaluate.ts) - 评估诊断和治疗方案
   - [`exam-questions.ts`](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions/exam-questions.ts) - 获取考试题目
   - [`exam-submit-answer.ts`](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions/exam-submit-answer.ts) - 提交答案验证
   - [`health.ts`](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions/health.ts) - 健康检查端点

3. **更新的文件**
   - [`package.json`](file:///c:/Users/Administrator/Desktop/vet_1/package.json) - 添加了 `dev:netlify` 脚本

---

## 📋 部署前检查清单

### 1. 本地测试（可选但推荐）

```powershell
# 确保 netlify-cli 已安装（正在安装中...）
npm install -g netlify-cli

# 在本地运行 Netlify Dev 环境
npm run dev:netlify
```

**测试端点**：
- 健康检查: `http://localhost:8888/api/health`
- 生成病例: `POST http://localhost:8888/api/cases/generate` (Body: `{"rank": "初级"}`)

---

### 2. Netlify 环境变量配置 ⚠️ **必须完成**

登录 Netlify Dashboard，进入您的站点设置：

**路径**: Site settings → Environment variables → Add a variable

添加以下环境变量：

| 变量名 | 说明 | 获取位置 |
|-------|------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek AI 密钥 | [DeepSeek 控制台](https://platform.deepseek.com/) |
| `SUPABASE_URL` | Supabase 项目URL | Supabase 项目设置 |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase 项目API设置 |

> [!CAUTION]
> **如果不设置这些环境变量，API 调用将失败！**

---

### 3. 推送代码到 Git

```powershell
# 添加新文件
git add netlify.toml netlify/ package.json

# 提交更改
git commit -m "迁移到 Netlify Functions 以支持 serverless 部署"

# 推送到远程仓库
git push
```

如果您的 Netlify 站点已连接到 Git 仓库，推送后会自动触发部署。

---

### 4. 手动部署（如果未连接 Git）

```powershell
# 构建项目
npm run build

# 使用 Netlify CLI 部署
netlify deploy --prod
```

---

## 🔍 部署后验证

### 检查部署日志

在 Netlify Dashboard 查看构建日志，确认：
- ✅ 构建成功完成
- ✅ Functions 被正确检测（应显示 5 个函数）
- ✅ 没有错误信息

### 测试 API 端点

在浏览器控制台或使用工具（如 Postman）测试：

```javascript
// 健康检查
fetch('https://你的站点.netlify.app/api/health')
  .then(r => r.json())
  .then(console.log);

// 生成病例
fetch('https://你的站点.netlify.app/api/cases/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ rank: '初级' })
})
  .then(r => r.json())
  .then(console.log);
```

---

## 🐛 常见问题排查

### 问题 1: 仍然出现 "未知错误"

**可能原因**: 环境变量未设置

**解决方案**:
1. 进入 Netlify Dashboard → Site settings → Environment variables
2. 确认所有三个变量都已添加
3. 重新部署站点（Deploys → Trigger deploy → Deploy site）

---

### 问题 2: Functions 超时

**症状**: 请求超过 10 秒失败

**可能原因**: 
- DeepSeek API 响应慢
- Supabase 查询慢

**解决方案**: 
- 免费版函数执行时间限制为 10 秒
- 考虑升级到付费计划（26 秒执行时间）
- 优化 API 调用逻辑

---

### 问题 3: CORS 错误

**症状**: 浏览器控制台显示跨域错误

**解决方案**: 
- 检查 `netlify.toml` 中的 CORS 头配置
- 当前配置已包含 `Access-Control-Allow-Origin: *`

---

## 📊 架构对比

### 之前 (Express)
```
前端 (Vite) → Vite Proxy → Express 后端 (端口 3000)
                                ↓
                          DeepSeek API / Supabase
```

**问题**: Netlify 无法运行 Express 服务器

### 现在 (Netlify Functions)
```
前端 (静态文件) → Netlify CDN
                     ↓
              Netlify Functions (Serverless)
                     ↓
              DeepSeek API / Supabase
```

**优势**: 
- ✅ 完全托管，自动扩展
- ✅ 按需付费（免费额度充足）
- ✅ 全球 CDN 加速

---

## 🚀 下一步行动

1. **立即**: 在 Netlify 设置环境变量
2. **推荐**: 本地测试 `npm run dev:netlify`
3. **部署**: 推送代码或手动部署
4. **验证**: 测试线上 API 端点

---

## 💡 提示

- Netlify Functions 日志可在 Dashboard → Functions → [函数名] → Logs 查看
- 前端代码无需修改，`/api/*` 路径会自动重定向到函数
- 本地开发仍可使用 `npm run dev:all`（Express 服务器）
- 生产环境将使用 Netlify Functions

---

**有问题？** 检查 Netlify 构建日志和函数日志，或告诉我具体错误信息。
