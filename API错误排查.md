# Netlify API 错误排查指南

## 当前错误
```
Error: 病例生成失败
```

## 排查步骤

### 1. 检查 Netlify 环境变量配置 ⭐

这是最常见的问题。需要在 Netlify 仪表板中配置以下环境变量：

1. 登录 [Netlify Dashboard](https://app.netlify.com/)
2. 选择你的站点
3. 进入 **Site settings** → **Environment variables**
4. 确保配置了以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `sk-8f140e71f91f4751827b7a8beaa3c192` | DeepSeek API 密钥 |
| `SUPABASE_URL` | `https://pyavvzsgnusbspcskvpz.supabase.co` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Supabase 匿名密钥 |

> ⚠️ **重要**: 添加环境变量后需要**重新部署**站点才能生效！

### 2. 触发重新部署

在 Netlify 仪表板中：
1. 进入 **Deploys** 标签
2. 点击 **Trigger deploy** → **Deploy site**

### 3. 检查函数日志

1. 在 Netlify 仪表板中进入 **Functions** 标签
2. 点击 `cases-generate` 函数
3. 查看 **Function log** 中的错误详情

常见错误信息：
- `DEEPSEEK_API_KEY 未配置` → 环境变量问题
- `DeepSeek API密钥无效` → API 密钥错误或过期
- `timeout` → API 响应超时，可能是网络问题

### 4. 本地测试健康检查

在浏览器中访问：
```
https://你的netlify站点/.netlify/functions/health
```

应该返回：
```json
{"status":"ok","timestamp":"..."}
```

### 5. 常见问题

#### Q: 配置了环境变量还是报错？
A: 确保重新部署了站点。环境变量更改后需要重新构建。

#### Q: 本地可以但 Netlify 不行？
A: 本地使用 `.env.local`，Netlify 使用仪表板配置的环境变量。两者是独立的。

#### Q: DeepSeek API 余额不足？
A: 检查 DeepSeek 账户余额，可能需要充值。

---

## 快速命令

```bash
# 本地开发（前端 + 后端）
npm run dev:all

# 仅本地开发前端（使用 Netlify Dev 模拟函数）
npm run dev:netlify

# 构建生产版本
npm run build
```
