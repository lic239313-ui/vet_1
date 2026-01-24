# 🎯 Supabase 数据库导入题目 - 超简单版

## 问题

你的网站显示 "获取题目失败"，因为 Supabase 数据库是空的。

## 解决方案

将题目数据导入 Supabase 数据库。

---

## 📋 步骤

### 步骤1：登录 Supabase

1. 访问：`https://supabase.com`
2. 登录你的账号
3. 进入你的项目（应该能看到 `pyavvzsgnusbspcskvpz`）

### 步骤2：打开 SQL Editor

1. 点击左侧菜单的 **SQL Editor** 图标
2. 点击 **New query**（新建查询）

### 步骤3：复制并执行 SQL

#### 3.1 打开文件

在你的电脑打开这个文件：
```
c:\Users\Administrator\Desktop\vet_1\database\vet_exam_questions.sql
```

#### 3.2 复制全部内容

- 按 `Ctrl + A` 全选
- 按 `Ctrl + C` 复制

#### 3.3 粘贴到 Supabase

- 回到 Supabase的 SQL Editor
- 在查询窗口按 `Ctrl + V` 粘贴
- 点击右下角的 **Run** 按钮（或按 `Ctrl + Enter`）

#### 3.4 等待执行完成

应该看到：
```
Success. No rows returned
```

这是正常的！

### 步骤4：验证数据

1. 点击左侧的 **Table Editor**
2. 找到 `vet_exam_questions` 表
3. 应该能看到几条题目数据

---

## 🎉 完成！

### 测试网站

访问：`https://sprightly-lily-cfbac0.netlify.app`

进入考试模块，应该能看到题目了！

---

## ⚠️ 如果想要更多题目

你还有其他 SQL 文件可以导入：

- `disease_questions.sql` - 疾病相关题目  
- `converted_questions.sql` - 更多转换的题目

**导入方法相同**：
1. 打开 SQL 文件
2. 复制全部内容
3. 在 Supabase SQL Editor 粘贴并运行

---

## 💡 提示

- SQL 文件可以重复执行，不会重复插入数据
- 每个文件执行完都会看到 "Success" 消息
- 可以在 Table Editor 查看导入了多少条数据

---

**现在就去 Supabase 执行导入吧！** 🚀
