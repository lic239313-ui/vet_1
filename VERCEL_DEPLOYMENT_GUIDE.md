# VetLogic Vercel 部署指南

由于您选择使用 Vercel 进行部署，本项目已进行适配改造。请按照以下步骤操作以确保应用正常运行。

## ⚠️ 关键注意事项

1.  **超时限制**：Vercel Hobby（免费版）的 Serverless Function 超时限制为 **10秒**。DeepSeek 生成复杂病例可能会超过此限制。建议使用 Vercel Pro 或改用 Netlify（默认 26秒）。
2.  **环境变量**：Vercel 部署**必须**在云端控制台配置环境变量，否则所有 API 都会失败。

## 第一步：检查项目文件

确保您的项目包含以下新文件（脚本已自动为您创建）：

-   ✅ `vercel.json` - 包含路由重写和超时配置
-   ✅ `api/` 目录 - 包含所有后端 API 函数 (`cases/generate.ts`, `cases/evaluate.ts` 等)

## 第二步：配置 Vercel 环境变量

这是最重要的一步。

1.  登录 [Vercel Dashboard](https://vercel.com/dashboard)。
2.  进入您的项目设置：**Settings** > **Environment Variables**。
3.  添加以下 3 个关键变量：

| 变量名 (Key) | 示例值 (Value) | 说明 |
| :--- | :--- | :--- |
| `DEEPSEEK_API_KEY` | `sk-abc12345...` | 您的 DeepSeek API 下钥 |
| `SUPABASE_URL` | `https://xyz.supabase.co` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | `eyJhbGcis...` | Supabase 匿名 Key |

**提示**：添加完变量后，必须**重新部署 (Redeploy)** 才能生效。

## 第三步：部署

1.  将代码推送到 GitHub/GitLab。
2.  Vercel 会自动触发部署。
3.  部署完成后，访问生成的 URL。

## 第四步：功能验证

部署成功后，请按顺序测试：

1.  **健康检查**：访问 `https://您的域名.vercel.app/api/health`
    *   **预期结果**：返回 `{"status":"ok","platform":"vercel"}`
    *   **失败处理**：如果 404，说明 `vercel.json` 或 `api/` 目录结构有误。
2.  **生成病例**：在首页点击“接诊下一位”。
    *   **预期结果**：成功生成并在 UI 显示病例。
    *   **失败处理**：如果显示“未知错误”，请检查 Vercel Logs。

## 故障排查 (Logs)

如果遇到错误，请务必查看日志：

1.  在 Vercel控制台点击 **Logs** 标签。
2.  过滤及搜索 `[Vercel Function]`。
    *   **Env Check Error**: 会明确提示哪个环境变量未配置。
    *   **Timeout Error**: 如果看到 `Task timed out`，说明 AI 生成时间超过了 Vercel 的限制（10秒）。

---

**技术支持**：
本项目后端逻辑已迁移至 `api/` 目录，完全兼容 Vercel Serverless 规范。原 `netlify/` 目录已不再使用，但作为备份保留。
