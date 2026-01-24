# Vercel 错误修复：使用 Netlify 部署

## 问题总结

您在 **Vercel** 部署后遇到"未知错误"，原因是：
- ❌ 项目配置为 **Netlify** serverless functions
- ❌ Vercel 无法识别 Netlify 的函数格式
- ❌ API 调用失败导致前端显示"未知错误"

**解决方案：使用 Netlify 部署（项目已完整配置）**

---

## Netlify 部署完整指南

### 步骤 1：创建 Netlify 账号并连接仓库

1. 访问 [https://app.netlify.com](https://app.netlify.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择您的 Git 仓库（vet_1）
5. 构建设置会自动从 `netlify.toml` 读取：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 步骤 2：配置环境变量 ⚙️

> **非常重要！** 必须配置以下环境变量，否则病例生成会失败。

在 Netlify 控制台：

1. 进入您的站点设置：**Site settings**
2. 点击左侧 **Environment variables**
3. 点击 **"Add a variable"** 按钮

配置以下 3 个环境变量：

#### 变量 1: DEEPSEEK_API_KEY
- **Key**: `DEEPSEEK_API_KEY`
- **Value**: `sk-xxxxx`（您的 DeepSeek API 密钥）
- **Scopes**: 勾选所有 scopes

#### 变量 2: SUPABASE_URL
- **Key**: `SUPABASE_URL`
- **Value**: `https://xxxxx.supabase.co`（您的 Supabase 项目 URL）
- **Scopes**: 勾选所有 scopes

#### 变量 3: SUPABASE_ANON_KEY
- **Key**: `SUPABASE_ANON_KEY`
- **Value**: `eyJxxx...`（您的 Supabase 匿名密钥）
- **Scopes**: 勾选所有 scopes

### 步骤 3：触发部署

环境变量配置完成后：

1. 点击顶部 **"Deploys"** 标签
2. 点击 **"Trigger deploy"** → **"Deploy site"**
3. 等待构建完成（约 2-3 分钟）

### 步骤 4：验证部署

部署成功后，测试功能：

1. 访问您的 Netlify 站点 URL（例如 `https://your-site.netlify.app`）
2. 进入 **"VetLogic 临床轮转"** 模块
3. 点击 **"接诊下一位"** 按钮
4. 检查病例是否成功生成

---

## 环境变量获取方法

### 1. DeepSeek API Key

1. 访问 [https://platform.deepseek.com](https://platform.deepseek.com)
2. 登录您的账号
3. 点击 **API Keys** → **Create API Key**
4. 复制生成的 key（格式：`sk-xxxxxxxx`）

### 2. Supabase URL 和 ANON_KEY

1. 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 点击左侧 **Settings** → **API**
4. 找到：
   - **Project URL**（即 `SUPABASE_URL`）
   - **Project API keys** → **anon** **public**（即 `SUPABASE_ANON_KEY`）

---

## 常见问题排查

### ❓ 部署成功但病例生成仍然失败

**检查清单：**

1. ✅ 环境变量是否正确配置？
   - 在 Netlify: **Site settings** → **Environment variables** 中查看
   - 确保 3 个变量都存在且值正确

2. ✅ 是否在配置环境变量后重新部署？
   - 修改环境变量后必须手动触发重新部署

3. ✅ DeepSeek API 是否有余额？
   - 访问 DeepSeek 控制台检查账户余额

4. ✅ Supabase 数据库中是否有病例模板数据？
   - 检查 `clinical_case_templates` 表是否有数据

### ❓ 查看详细错误日志

在 Netlify 控制台：

1. 点击 **Functions** 标签
2. 找到 `cases-generate` 函数
3. 点击查看最近的调用日志
4. 检查错误详情

---

## 项目配置说明

您的项目已经包含完整的 Netlify 配置：

### [netlify.toml](file:///c:/Users/Administrator/Desktop/vet_1/netlify.toml)
- ✅ 构建命令和输出目录
- ✅ Functions 超时设置（26秒）
- ✅ API 路由重定向规则

### [netlify/functions/](file:///c:/Users/Administrator/Desktop/vet_1/netlify/functions)
- ✅ `cases-generate.ts` - 病例生成函数
- ✅ `cases-evaluate.ts` - 病例评估函数
- ✅ `exam-questions.ts` - 题目获取函数
- ✅ 其他支持函数

**无需修改任何代码，只需配置环境变量！**

---

## 下一步建议

部署成功后，您可以：

1. 🔗 在 Netlify 设置自定义域名
2. 🔒 启用 HTTPS（Netlify 自动提供）
3. 📊 查看函数调用统计和日志
4. 🚀 设置持续部署（Git push 自动部署）

---

## 需要帮助？

如果遇到问题，请提供：
- Netlify 部署日志截图
- Functions 调用日志截图
- 浏览器控制台错误信息

我会帮您进一步诊断！
