# 🎓 初中生版：Netlify 环境变量设置教程

## 📚 什么是环境变量？

**简单理解**：环境变量就像是你的应用的"密码本"。

- **DEEPSEEK_API_KEY**：DeepSeek AI 的"钥匙"，让你的应用能使用 AI 功能
- **SUPABASE_URL**：数据库的"地址"
- **SUPABASE_ANON_KEY**：数据库的"门卡"

这些信息很重要，所以**不能直接写在代码里**（别人会看到），要放在 Netlify 的"保险箱"里。

---

## 🎯 第一步：准备好你的3个"钥匙"

在设置之前，你需要先找到这3个值。它们在你电脑的这个文件里：

**文件位置**：`c:\Users\Administrator\Desktop\vet_1\.env.local`

### 如何查看这个文件？

**方法1：用记事本打开**
1. 右键点击 `vet_1` 文件夹
2. 选择"在文件资源管理器中显示"
3. 找到 `.env.local` 文件
4. 右键 → 选择"打开方式" → "记事本"

**方法2：用 VS Code 打开**（如果你有安装）
1. 直接在 VS Code 左侧文件树找到 `.env.local`
2. 点击打开

**文件内容类似这样**：
```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx
```

> ⚠️ **重要提示**：
> - 复制时**不要包含前面的变量名**，只复制 `=` 后面的部分
> - 例如：只复制 `sk-xxxxxxx`，不要复制 `DEEPSEEK_API_KEY=`

**准备工作**：
1. 打开记事本（或其他文本编辑器）
2. 把这3个值分别复制粘贴到记事本里备用
3. 保持记事本窗口开着，待会要用

---

## 🌐 第二步：登录 Netlify

### 1. 打开浏览器

推荐使用 **Chrome** 或 **Edge** 浏览器。

### 2. 访问 Netlify 网站

在地址栏输入：`https://app.netlify.com`

按 **回车键**。

### 3. 登录你的账号

- 如果你已经登录，会直接进入主页
- 如果没登录，输入你的邮箱和密码登录

**登录成功后**，你应该能看到你的所有网站列表。

---

## 🏠 第三步：进入你的网站设置

### 1. 找到你的兽医大亨网站

在 Netlify 主页上，你会看到你部署的所有网站，每个网站是一个卡片。

找到你的**兽医大亨**网站（可能叫 `vet-tycoon-ai` 或你自己起的名字）。

### 2. 点击进入

**点击这个网站的卡片**，进入网站详情页。

你会看到：
- 网站的预览图
- 网站的网址（类似 `https://你的网站名.netlify.app`）
- 一些按钮和菜单

---

## ⚙️ 第四步：进入环境变量设置页面

### 1. 找到顶部菜单栏

在网站详情页的**顶部**，你会看到几个标签页：

```
Overview  |  Deploys  |  Site configuration  |  ...
```

### 2. 点击 "Site configuration"

点击 **Site configuration**（网站配置）标签。

### 3. 找到 "Environment variables"

在左侧边栏，向下滚动，找到 **Environment variables**（环境变量）。

点击它。

---

## 🔑 第五步：添加环境变量（最关键！）

现在你应该在"环境变量"页面了。

### 添加第1个变量：DEEPSEEK_API_KEY

#### 步骤1：点击"Add a variable"按钮

页面上应该有一个绿色或蓝色的按钮，写着 **"Add a variable"** 或 **"Add environment variable"**。

**点击这个按钮**。

#### 步骤2：填写变量信息

会弹出一个对话框，有两个输入框：

**输入框1（Key / 键）**：
- 输入：`DEEPSEEK_API_KEY`
- ⚠️ 注意：必须**完全一样**，包括大小写
- ⚠️ 不要有空格

**输入框2（Value / 值）**：
- 从你的记事本里**复制** DeepSeek API Key
- **粘贴**到这个输入框
- 应该类似这样：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`

**选择作用范围**（Scopes）：
- 通常会有几个选项：`Production`, `Deploy previews`, `Branch deploys`
- **全部勾选**（如果有的话）
- 或者选择 **"All"**（全部）

#### 步骤3：保存

点击 **"Save"** 或 **"Add variable"** 按钮。

✅ **第1个变量添加成功！**

---

### 添加第2个变量：SUPABASE_URL

重复上面的步骤：

1. **再次点击** "Add a variable" 按钮
2. **输入框1（Key）**：输入 `SUPABASE_URL`
3. **输入框2（Value）**：粘贴你的 Supabase URL（类似 `https://xxxxx.supabase.co`）
4. **选择作用范围**：全部勾选
5. **点击保存**

✅ **第2个变量添加成功！**

---

### 添加第3个变量：SUPABASE_ANON_KEY

最后一个：

1. **再次点击** "Add a variable" 按钮
2. **输入框1（Key）**：输入 `SUPABASE_ANON_KEY`
3. **输入框2（Value）**：粘贴你的 Supabase 匿名密钥（很长，类似 `eyJhbGci...`）
4. **选择作用范围**：全部勾选
5. **点击保存**

✅ **第3个变量添加成功！**

---

## ✅ 第六步：检查确认

### 确认所有变量都添加了

在环境变量页面，你应该能看到**3个变量**：

```
✓ DEEPSEEK_API_KEY    sk-xxxxxx...
✓ SUPABASE_URL        https://xxxxx.supabase.co
✓ SUPABASE_ANON_KEY   eyJhbGci...
```

**如果少了某个变量**，重新添加缺失的那个。

---

## 🚀 第七步：重新部署网站

添加完环境变量后，需要**重新部署**网站，新的设置才会生效。

### 方法1：自动部署（推荐）

如果你的 Netlify 连接了 Git 仓库（GitHub/GitLab）：

1. 在你的电脑上打开 **PowerShell** 或 **命令提示符**
2. 进入项目文件夹：
   ```powershell
   cd c:\Users\Administrator\Desktop\vet_1
   ```
3. 执行以下命令：
   ```powershell
   git add .
   git commit -m "配置环境变量"
   git push
   ```
4. Netlify 会自动检测到更新并重新部署

### 方法2：手动部署

如果你没有连接 Git：

1. 在 Netlify 网站页面，点击顶部的 **"Deploys"** 标签
2. 点击右上角的 **"Trigger deploy"** 按钮
3. 选择 **"Deploy site"**
4. 等待部署完成（通常需要1-3分钟）

---

## 🎉 第八步：测试是否成功

### 等待部署完成

在 "Deploys" 页面，等待部署状态变成 **"Published"**（已发布）。

### 打开你的网站

点击网站网址（类似 `https://你的网站名.netlify.app`），打开你的应用。

### 测试功能

试试以下功能是否正常：

1. **临床病例生成**：点击"生成病例"按钮，看是否能成功生成
2. **考试题目**：进入考试模块，看是否能加载题目

**如果功能正常**：🎊 恭喜你，设置成功！

**如果还是报错**：
1. 检查环境变量是否拼写正确（区分大小写）
2. 检查变量值是否正确（没有多余空格）
3. 重新触发部署

---

## 🆘 常见问题

### Q1：找不到 `.env.local` 文件？

**答**：这个文件可能被隐藏了。

**解决方法**：
1. 在文件资源管理器中
2. 点击顶部的"查看"菜单
3. 勾选"隐藏的项目"
4. 现在应该能看到 `.env.local` 了

### Q2：不确定变量值对不对？

**答**：
- **DEEPSEEK_API_KEY**：应该以 `sk-` 开头
- **SUPABASE_URL**：应该是一个网址，包含 `supabase.co`
- **SUPABASE_ANON_KEY**：通常很长，以 `eyJ` 开头

### Q3：Netlify 页面是英文看不懂？

**答**：
- 可以用浏览器的翻译功能（右键 → 翻译成中文）
- 或者对照这个教程的步骤，按位置找按钮

### Q4：添加变量后网站还是不工作？

**答**：
1. 确保重新部署了网站
2. 等待部署完全成功
3. 清除浏览器缓存（Ctrl + F5 强制刷新）
4. 检查 Netlify 的 Functions 日志（Deploys → Functions）

---

## 📝 总结检查清单

完成以下所有步骤打 ✓：

- [ ] 找到并打开了 `.env.local` 文件
- [ ] 复制了3个环境变量的值到记事本
- [ ] 登录了 Netlify
- [ ] 找到了我的网站
- [ ] 进入了 Site configuration → Environment variables
- [ ] 添加了 DEEPSEEK_API_KEY
- [ ] 添加了 SUPABASE_URL
- [ ] 添加了 SUPABASE_ANON_KEY
- [ ] 确认3个变量都显示在列表中
- [ ] 重新部署了网站
- [ ] 等待部署成功
- [ ] 测试网站功能正常

**全部打勾？恭喜你完成了！** 🎉

---

## 💡 提示

- 环境变量设置一次就够了，以后不用再设置
- 如果以后要修改，可以在同一个页面点击变量旁边的"编辑"按钮
- **永远不要把这些密钥分享给别人**
- 如果不小心泄露了，要立即去对应平台重新生成新的密钥

---

**还有不明白的地方？** 告诉我你卡在哪一步，我可以更详细地解释！
