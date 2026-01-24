# 🐛 API 调用错误排查

## 问题描述

在线网站调用 API 时出现错误：
```
Error: 未知错误
at callAPI (geminiService.ts:24:13)
at async getExamQuestions (geminiService.ts:90:16)
```

---

## 🔍 可能的原因

### 1. Netlify Functions 超时

**最可能的原因**：Supabase 数据库连接或查询超时

Netlify Functions 免费版限制：
- 执行时间：最多 10 秒
- 如果超过 10 秒，会返回错误

### 2. 环境变量未正确加载

Functions 可能无法读取环境变量。

### 3. Supabase 数据库问题

- 数据库连接失败
- 表中没有数据
- 查询语法错误

---

## ✅ 诊断步骤

### 步骤1：测试健康检查端点

在浏览器打开：
```
https://sprightly-lily-cfbac0.netlify.app/api/health
```

**如果看到 JSON 响应**：✅ Functions 基本正常

**如果看到 404 或错误**：❌ Functions 未正确部署

---

### 步骤2：查看 Netlify Functions 日志

这是最重要的步骤！

#### 操作步骤

1. **打开浏览器**访问：
   ```
   https://app.netlify.com
   ```

2. **登录**你的 Netlify 账号

3. **进入你的网站**：
   - 点击 `sprightly-lily-cfbac0` 网站

4. **查看 Functions 日志**：
   - 点击顶部的 **"Functions"** 标签
   - 找到 `exam-questions` 函数
   - 点击进入
   - 查看 **"Logs"**（日志）

#### 在日志中查找

**查找关键信息**：
- 红色的错误信息
- `Error:` 开头的行
- `timeout` 或 `超时` 字样
- Supabase 相关错误

**把你看到的错误信息复制给我！**

---

### 步骤3：检查 Supabase 数据库

#### 检查题目表是否有数据

1. **登录 Supabase**：
   访问 `https://supabase.com`

2. **进入你的项目**

3. **打开 Table Editor**：
   - 左侧菜单 → Table Editor
   - 找到 `vet_exam_questions` 表
   - 查看是否有数据行

**如果表是空的**：需要先导入题目数据

**如果有数据**：继续下一步

---

## 🔧 可能的解决方案

### 方案1：检查并修复环境变量

确认 Netlify 环境变量设置正确：

1. Netlify Dashboard → Site configuration → Environment variables
2. 确认这三个变量存在且值正确：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`  
   - `DEEPSEEK_API_KEY`

**如果有任何拼写错误或值不对**：
- 修改正确
- 重新部署：`netlify deploy --prod`

---

### 方案2：添加超时处理和详细日志

修改 `exam-questions.ts` 函数，添加更详细的错误信息。

让我创建一个改进版本...

---

### 方案3：检查 Supabase 数据库中是否有题目

如果数据库中没有题目，需要先导入：

#### 快速导入题目（如果你有 SQL 文件）

1. 登录 Supabase Dashboard
2. 点击 SQL Editor
3. 新建查询
4. 粘贴你的 SQL INSERT 语句
5. 运行

---

## 📝 临时解决方案：使用本地数据

如果 Supabase 有问题，可以暂时让考试模块使用本地题库（不需要后端）。

但这需要修改代码。

---

## 🎯 下一步行动

**请你做以下操作，并告诉我结果**：

1. **测试健康检查端点**
   - 访问：`https://sprightly-lily-cfbac0.netlify.app/api/health`
   - 告诉我看到了什么

2. **查看 Netlify Functions 日志**
   - 进入 Netlify Dashboard → Functions → exam-questions → Logs
   - 复制任何错误信息给我

3. **检查 Supabase 表**
   - 打开 `vet_exam_questions` 表
   - 告诉我：表中有多少条数据？

**根据你提供的信息，我会给出精确的解决方案！** 🔍
