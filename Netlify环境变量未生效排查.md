# ⚠️ Netlify 环境变量未生效排查指南

## 🔍 常见原因

### 1. 配置后未重新部署 ⭐ 最常见

**问题**：添加环境变量后，必须重新部署才能生效！

**解决**：
1. 进入 Netlify Dashboard
2. 点击 **Deploys** 标签
3. 点击 **Trigger deploy** → **Deploy site**
4. 等待部署完成

---

### 2. 变量名拼写错误

**检查清单**：

在 Netlify → Site configuration → Environment variables 中确认：

- [ ] 变量名是 `SUPABASE_URL`（全大写，有下划线）
- [ ] 变量名是 `SUPABASE_ANON_KEY`（全大写，有下划线）
- [ ] 没有多余空格
- [ ] 没有拼写错误（SUPABSE ❌ vs SUPABASE ✅）

---

### 3. Scopes 未正确勾选

环境变量的 **Scopes** 必须包含 Production！

**检查**：
1. 在环境变量列表中
2. 点击每个变量查看详情
3. 确认 **Production** ✓ 已勾选

**如果没勾选**：
1. 点击变量旁的 "..." 菜单
2. 选择 "Edit"
3. 勾选 **Production**
4. Save

---

### 4. 查看的是旧部署的日志

**步骤**：
1. 在 Netlify → Deploys
2. 确认你查看的是**最新**的部署
3. 最新的应该在列表最上面
4. 点击进入查看详细日志

---

## ✅ 正确配置步骤

### Step 1: 添加变量

在 Environment variables 页面：

**变量 1**：
```
Key: SUPABASE_URL
Value: https://pyavvzsgnusbspcskvpz.supabase.co
Scopes: ✓ All (Production, Deploy previews, Branch deploys)
```

**变量 2**：
```
Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YXZ2enNnbnVzYnNwY3NrdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM3NTcsImV4cCI6MjA4NDIyOTc1N30.IviJtcNOF2ywJ9MW5DAzo-Vm9D6kO_EXoItzDkQXYoU
Scopes: ✓ All (Production, Deploy previews, Branch deploys)
```

### Step 2: 保存确认

添加后，环境变量列表应该显示：

```
SUPABASE_URL          All scopes
SUPABASE_ANON_KEY     All scopes
DEEPSEEK_API_KEY      All scopes (如果有)
```

### Step 3: 重新部署 ⚡ 关键步骤

```
Deploys → Trigger deploy → Deploy site
```

**等待部署完成**（约1-2分钟）

### Step 4: 验证

部署完成后，查看最新部署的 **Function logs**：

应该看到：
```
✅ Supabase客户端初始化成功
```

而不是：
```
⚠️ Supabase配置未设置
```

---

## 🧪 快速测试

部署完成后，在浏览器访问：

```
https://sprightly-lily-cfbac0.netlify.app/api/health
```

**如果成功**：会看到 JSON 响应  
**如果失败**：说明还有问题

---

## 📸 截图验证

**请发送截图给我**：

1. Netlify → Site configuration → Environment variables 页面
   - 显示所有环境变量的列表

2. Netlify → Deploys 页面
   - 显示最新的部署状态

这样我能准确诊断问题！

---

## ⚡ 立即执行

1. **检查变量名**：完全一致吗？
2. **检查 Scopes**：Production 勾选了吗？
3. **重新部署**：这是最重要的！
4. **等待完成**：确保看的是最新部署的日志

**完成这些步骤了吗？告诉我结果！** 🔍
