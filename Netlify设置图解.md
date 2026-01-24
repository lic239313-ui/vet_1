# 🖼️ Netlify 环境变量设置 - 图解版

> 💡 **配合图示使用本指南，设置会更简单！**

---

## 📋 准备工作

### 1. 打开 `.env.local` 文件（你已经打开了✓）

你现在应该能看到3个变量：

```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciO...很长的字符串...
```

### 2. 复制这些值

**重要**：只复制 `=` 后面的部分！

| 变量名 | 要复制的部分 | 特征 |
|-------|------------|------|
| DEEPSEEK_API_KEY | `sk-` 开头的字符串 | 通常40-50个字符 |
| SUPABASE_URL | `https://` 开头的网址 | 包含 `supabase.co` |
| SUPABASE_ANON_KEY | `eyJ` 开头的长字符串 | 很长，100多个字符 |

**做法**：
1. 鼠标选中要复制的部分
2. 右键 → 复制（或按 `Ctrl + C`）
3. 粘贴到记事本备用

---

## 🌐 Netlify 设置步骤（跟着图片做）

### 步骤 1：找到你的网站并点击 "Site configuration"

![第一步](C:/Users/Administrator/.gemini/antigravity/brain/4614ff96-43eb-49ec-b4f8-cf4a3e434978/netlify_env_step1_1769096245269.png)

**操作**：
1. 访问 `https://app.netlify.com`
2. 找到你的 `vet-tycoon-ai` 网站卡片
3. 点击进入
4. 点击顶部的 **"Site configuration"** 标签

---

### 步骤 2：进入环境变量设置

![第二步](C:/Users/Administrator/.gemini/antigravity/brain/4614ff96-43eb-49ec-b4f8-cf4a3e434978/netlify_env_step2_1769096274695.png)

**操作**：
1. 在左侧边栏找到 **"Environment variables"**
2. 点击它
3. 点击右上角的绿色按钮 **"+ Add a variable"**

---

### 步骤 3：添加第一个变量

![第三步](C:/Users/Administrator/.gemini/antigravity/brain/4614ff96-43eb-49ec-b4f8-cf4a3e434978/netlify_env_step3_1769096297690.png)

**填写表单**：

| 字段 | 填什么 | 示例 |
|-----|--------|------|
| **Key（变量名）** | `DEEPSEEK_API_KEY` | 必须完全一致，区分大小写 |
| **Value（变量值）** | 粘贴你复制的 DeepSeek API Key | `sk-xxxxxxxxxxxxxxxxxx` |
| **Scopes（作用范围）** | 全部勾选 ✓ | Production ✓ Deploy previews ✓ Branch deploys ✓ |

**然后**：点击 **"Save"** 按钮

---

### 步骤 4：添加第二个变量

重复步骤 3，但这次填写：

| 字段 | 填什么 |
|-----|--------|
| **Key** | `SUPABASE_URL` |
| **Value** | 粘贴你的 Supabase URL |

点击 **"Save"**

---

### 步骤 5：添加第三个变量

再次重复步骤 3，填写：

| 字段 | 填什么 |
|-----|--------|
| **Key** | `SUPABASE_ANON_KEY` |
| **Value** | 粘贴你的 Supabase 匿名密钥（很长） |

点击 **"Save"**

---

## ✅ 检查

完成后，你应该在环境变量页面看到 **3个变量**：

```
✓ DEEPSEEK_API_KEY
✓ SUPABASE_URL
✓ SUPABASE_ANON_KEY
```

---

## 🚀 重新部署

### 方法：推送代码（如果你连接了 Git）

打开 PowerShell，执行：

```powershell
cd c:\Users\Administrator\Desktop\vet_1
git add .
git commit -m "设置环境变量"
git push
```

### 或者：手动触发部署

1. 在 Netlify 点击 **"Deploys"** 标签
2. 点击 **"Trigger deploy"** → **"Deploy site"**

---

## 🎉 完成！

等待部署完成（1-3分钟），然后打开你的网站测试功能。

---

## ❓ 遇到问题？

| 问题 | 解决方法 |
|-----|---------|
| 找不到变量名输入框 | 确保点击了 "Add a variable" 按钮 |
| 不确定复制对了没 | 检查特征：API Key 以 `sk-` 开头，URL 包含 `supabase.co` |
| 保存后没反应 | 刷新页面，检查变量是否出现在列表中 |
| 网站还是报错 | 确保重新部署了，等待部署完成 |

**具体卡在哪一步？告诉我，我继续帮你！** 😊
