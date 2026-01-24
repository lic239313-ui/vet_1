# 进修模块故障排查指南

## 🔍 问题诊断清单

### 步骤 1：检查后端服务器是否运行

打开浏览器访问：
```
http://localhost:3000/api/health
```

**预期结果：**
```json
{
  "status": "OK",
  "message": "兽医大亨后端服务运行中",
  "timestamp": "2026-01-20T..."
}
```

❌ **如果无法访问：**
- 后端服务器未启动或端口被占用
- 解决方案：重启后端 `npm run dev:server`

---

### 步骤 2：检查进修 API 是否有数据

打开浏览器访问：
```
http://localhost:3000/api/training/subjects
```

**预期结果：**
```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "执业兽医资格证",
    "description": "系统学习兽医基础知识...",
    "difficulty": 2,
    "icon": "🎓",
    "cost": 0,
    "experience_reward": 200
  }
]
```

❌ **如果返回空数组 `[]`：**
- 数据库表为空，未导入数据
- 解决方案：执行数据库导入

❌ **如果返回错误：**
- 数据库表不存在
- Supabase 配置错误
- 解决方案：检查 `.env.local` 和执行 `training_schema.sql`

---

### 步骤 3：检查前端页面

打开浏览器访问：
```
http://localhost:5173
```

1. **检查导航栏**
   - 是否有"进修学院"按钮？
   - 图标是否显示？

2. **点击进修学院**
   - 是否显示"加载中..."？
   - 是否显示科目卡片？
   - 是否有错误提示？

3. **查看浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签
   - 是否有红色错误信息？

---

## 🛠️ 常见问题解决方案

### 问题 1：没有"进修学院"按钮

**可能原因：**
- 前端代码未正确部署
- 浏览器缓存

**解决方案：**
```bash
# 1. 停止前端服务 (Ctrl+C)
# 2. 清除缓存并重启
npm run dev
# 3. 硬刷新浏览器 (Ctrl+Shift+R 或 Ctrl+F5)
```

---

### 问题 2：显示"加载中..."但没有科目

**可能原因：**
- API 请求失败
- 数据库未导入

**排查步骤：**

1. **检查浏览器控制台 (F12)**
   ```
   查找错误信息，例如：
   - Failed to fetch
   - 404 Not Found
   - CORS error
   ```

2. **检查网络请求**
   - F12 → Network 标签
   - 刷新页面
   - 查找 `training/subjects` 请求
   - 点击查看响应内容

3. **验证数据库**
   - 登录 Supabase Dashboard
   - SQL Editor 执行：
   ```sql
   SELECT * FROM training_subjects;
   SELECT COUNT(*) FROM training_questions;
   ```

---

### 问题 3：点击科目没有反应

**可能原因：**
- 题目表为空
- API 端点错误

**解决方案：**

1. 浏览器访问：
   ```
   http://localhost:3000/api/training/questions/11111111-1111-1111-1111-111111111111
   ```

2. 应该返回 25 道题目的数组

3. 如果返回 `[]`，说明题目未导入

---

## 📝 快速修复步骤

### 如果数据库未导入：

1. **前往 Supabase Dashboard**
   - 访问 https://supabase.com/dashboard
   - 选择你的项目

2. **执行 SQL**
   ```sql
   -- 1. 创建表
   -- 复制粘贴 database/training_schema.sql 的全部内容
   
   -- 2. 导入数据
   -- 复制粘贴 database/training_seed.sql 的全部内容
   ```

3. **验证导入**
   ```sql
   SELECT COUNT(*) FROM training_subjects;  -- 应该返回 1
   SELECT COUNT(*) FROM training_questions; -- 应该返回 25
   ```

---

### 如果后端未运行：

```bash
# 停止所有 npm 进程
# Ctrl+C in terminals

# 重新启动
cd server
npx tsx server.ts
```

或使用：
```bash
npm run dev:server
```

---

### 如果前端有问题：

```bash
# 重新启动前端
npm run dev

# 或使用完整命令
npm run dev:client
```

---

## 🔧 完整重启流程

如果以上都不行，执行完整重启：

```bash
# 1. 停止所有服务 (Ctrl+C)

# 2. 验证数据库（Supabase SQL Editor）
SELECT * FROM training_subjects;
SELECT COUNT(*) FROM training_questions;

# 3. 如果数据库为空，导入数据
-- 执行 training_schema.sql
-- 执行 training_seed.sql

# 4. 重启服务
# Terminal 1 - 后端
cd server
npx tsx server.ts

# Terminal 2 - 前端
npm run dev

# 5. 打开浏览器
http://localhost:5173

# 6. 硬刷新浏览器 (Ctrl+Shift+R)
```

---

## 🎯 诊断命令

### 测试后端 API

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/training/subjects | Select-Object -Expand Content

# 或使用浏览器直接访问
```

### 查看前端日志

```
1. 打开浏览器 http://localhost:5173
2. 按 F12
3. Console 标签
4. 点击进修学院
5. 查看日志输出
```

---

## 📞 需要帮助？

如果以上步骤都无法解决，请提供：

1. **浏览器控制台截图** (F12 → Console)
2. **Network 请求截图** (F12 → Network → training/subjects)
3. **Supabase 查询结果**
   ```sql
   SELECT COUNT(*) FROM training_subjects;
   SELECT COUNT(*) FROM training_questions;
   ```

我会根据具体错误信息帮你解决！
