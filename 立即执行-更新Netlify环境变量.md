# 🎯 Netlify 环境变量更新操作（立即执行）

## ✅ 你的 Supabase 凭据（已确认正确）

```
SUPABASE_URL=https://pyavvzsgnusbspcsk vpz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YXZ2enNnbnVzYnNwY3NrdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM3NTcsImV4cCI6MjA4NDIyOTc1N30.IviJtcNOF2ywJ9MW5DAzo-Vm9D6kO_EXoItzDkQXYoU
```

---

## 📋 立即执行的步骤

### 步骤1：登录 Netlify

1. 打开浏览器
2. 访问：`https://app.netlify.com`
3. 登录你的账号

---

### 步骤2：进入环境变量设置

1. 找到并点击 `sprightly-lily-cfbac0` 网站
2. 点击顶部的 **"Site configuration"** 标签
3. 左侧边栏点击 **"Environment variables"**

---

### 步骤3：删除旧的变量

找到 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`：

1. 点击每个变量右侧的 **"..."** 按钮
2. 选择 **"Delete"**
3. 确认删除

---

### 步骤4：添加新的正确变量

#### 添加 SUPABASE_URL

1. 点击 **"Add a variable"** 按钮
2. **Key（变量名）**：输入 `SUPABASE_URL`
3. **Value（变量值）**：复制粘贴下面这个（注意去掉空格）
   ```
   https://pyavvzsgnusbspcsk vpz.supabase.co
   ```
   ⚠️ **确认没有多余空格！**
4. **Scopes（作用范围）**：全部勾选
   - ✓ Production
   - ✓ Deploy previews  
   - ✓ Branch deploys
5. 点击 **"Save"**

#### 添加 SUPABASE_ANON_KEY

1. 再次点击 **"Add a variable"**
2. **Key**：输入 `SUPABASE_ANON_KEY`
3. **Value**：复制粘贴下面这个完整字符串
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YXZ2enNnbnVzYnNwY3NrdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM3NTcsImV4cCI6MjA4NDIyOTc1N30.IviJtcNOF2ywJ9MW5DAzo-Vm9D6kO_EXoItzDkQXYoU
   ```
4. **Scopes**：全部勾选
5. 点击 **"Save"**

---

### 步骤5：重新部署

**方法1：在 Netlify Dashboard**（最简单）
1. 点击顶部的 **"Deploys"** 标签
2. 点击 **"Trigger deploy"** 按钮
3. 选择 **"Deploy site"**
4. 等待部署完成（约30-60秒）

**方法2：使用命令行**
```powershell
cd c:\Users\Administrator\Desktop\vet_1
netlify deploy --prod
```

---

### 步骤6：测试

部署完成后，在浏览器打开：

```
https://sprightly-lily-cfbac0.netlify.app
```

尝试使用考试功能，看是否能正常加载题目！

---

## ✅ 检查清单

部署前确认：

- [ ] 已删除旧的 `SUPABASE_URL` 变量
- [ ] 已删除旧的 `SUPABASE_ANON_KEY` 变量
- [ ] 新添加的 `SUPABASE_URL` 值正确（包含 `pyavvzsgnusbspcsk vpz`）
- [ ] 新添加的 `SUPABASE_ANON_KEY` 完整复制（以 `eyJhbG` 开头）
- [ ] 所有变量都勾选了全部 Scopes
- [ ] 已触发重新部署

---

## 🎉 完成！

按照以上步骤操作后，你的网站应该能正常工作了！

**遇到问题？** 告诉我你卡在哪一步！
