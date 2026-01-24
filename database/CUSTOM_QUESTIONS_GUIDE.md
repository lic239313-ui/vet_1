# 自定义题库导入指南

## 📚 概述

本指南帮助你将自己的电子资料（PDF、Word、Excel、文本文件等）转换为题库数据并导入到数据库中。

## 🎯 题目数据格式要求

每道题目需要包含以下信息：

```
- 题目内容（question）
- 4个选项（options）：必须是4个选项的数组
- 正确答案索引（correct_answer）：0-3之间的数字（0=A, 1=B, 2=C, 3=D）
- 解析说明（explanation）
- 难度等级（difficulty）：1-5
- 所属科目ID（subject_id）
```

## 📝 方法一：使用 Excel/CSV 整理后转换（推荐）

### 步骤 1：在 Excel 中整理题目

创建一个 Excel 表格，列结构如下：

| 题目 | 选项A | 选项B | 选项C | 选项D | 答案 | 解析 | 难度 |
|------|-------|-------|-------|-------|------|------|------|
| 犬的正常体温范围是？ | 37.5-38.5°C | 38.0-39.2°C | 39.5-40.5°C | 36.0-37.5°C | B | 犬的正常体温为38.0-39.2°C... | 1 |

**注意：**
- "答案"列填写 A/B/C/D
- "难度"列填写 1-5 的数字

### 步骤 2：使用 Python 脚本转换为 SQL

我为你创建了一个转换脚本，将 Excel 转换为 SQL 插入语句。

使用方法：
```bash
# 安装依赖
pip install pandas openpyxl

# 运行转换脚本
python database/convert_excel_to_sql.py your_questions.xlsx
```

脚本会生成 `custom_questions.sql` 文件。

### 步骤 3：导入到数据库

```sql
-- 在 Supabase SQL Editor 中执行生成的文件
```

---

## 📄 方法二：直接编写 SQL 语句

### 模板格式

```sql
-- 1. 先创建科目（如果是新科目）
INSERT INTO training_subjects (id, name, description, difficulty, icon, cost, experience_reward)
VALUES (
  gen_random_uuid(),  -- 自动生成UUID
  '你的科目名称',
  '科目描述...',
  2,  -- 难度1-5
  '📖',  -- emoji图标
  0,  -- 解锁费用
  150  -- 经验奖励
);

-- 2. 插入题目
INSERT INTO training_questions (subject_id, question, options, correct_answer, explanation, difficulty) 
VALUES
('你的科目ID',  -- 替换为实际科目ID
 '题目内容？',
 '["选项A", "选项B", "选项C", "选项D"]',  -- JSON数组格式
 1,  -- 正确答案索引（0-3）
 '详细解析...',
 2  -- 难度1-5
),
('你的科目ID',
 '第二题内容？',
 '["选项A", "选项B", "选项C", "选项D"]',
 0,
 '解析说明...',
 1
);
```

### 注意事项

1. **选项格式**：必须是有效的JSON数组
   - ✅ 正确：`'["选项A", "选项B", "选项C", "选项D"]'`
   - ❌ 错误：`["选项A", "选项B"]`（不是4个选项）
   - ❌ 错误：`'[选项A, 选项B]'`（缺少引号）

2. **答案索引**：
   - A选项 = 0
   - B选项 = 1
   - C选项 = 2
   - D选项 = 3

3. **特殊字符处理**：
   - 单引号需要转义：`''` 或 `\'`
   - 换行符：可以直接在字符串中使用

---

## 🤖 方法三：使用 AI 辅助生成（最快）

### 使用 ChatGPT/Claude/DeepSeek 等工具

**提示词模板：**

```
请帮我将以下题目转换为PostgreSQL的INSERT语句。

要求：
1. 表名：training_questions
2. 科目ID使用：'11111111-1111-1111-1111-111111111111'
3. 每题包含：question, options (JSON数组，4个选项), correct_answer (0-3), explanation, difficulty (1-5)
4. 输出格式参考：

INSERT INTO training_questions (subject_id, question, options, correct_answer, explanation, difficulty) VALUES
('11111111-1111-1111-1111-111111111111', 
 '题目？',
 '["A选项", "B选项", "C选项", "D选项"]',
 1,
 '解析...',
 2);

我的题目如下：
[粘贴你的题目内容]
```

### 示例

**输入资料：**
```
1. 猫的正常呼吸频率是？
A. 10-20次/分
B. 20-30次/分
C. 30-40次/分
D. 40-60次/分
答案：B
解析：猫的正常呼吸频率为20-30次/分...
```

**AI 生成的 SQL：**
```sql
INSERT INTO training_questions (subject_id, question, options, correct_answer, explanation, difficulty) VALUES
('11111111-1111-1111-1111-111111111111',
 '猫的正常呼吸频率是？',
 '["10-20次/分", "20-30次/分", "30-40次/分", "40-60次/分"]',
 1,
 '猫的正常呼吸频率为20-30次/分...',
 1);
```

---

## 🔧 方法四：批量导入工具

### 使用 Supabase 表格编辑器

1. 登录 Supabase Dashboard
2. 进入 "Table Editor"
3. 选择 `training_questions` 表
4. 点击 "Insert" → "Insert row"
5. 手动填写数据

**适合场景：** 少量题目（<10题）

### 使用 CSV 导入（适合大量题目）

1. **准备 CSV 文件**（questions.csv）：
```csv
subject_id,question,options,correct_answer,explanation,difficulty
11111111-1111-1111-1111-111111111111,"题目1?","[""A"",""B"",""C"",""D""]",1,"解析1",1
11111111-1111-1111-1111-111111111111,"题目2?","[""A"",""B"",""C"",""D""]",0,"解析2",2
```

2. **使用 psql 导入**：
```bash
psql -h your-db.supabase.co -U postgres -d postgres \
  -c "\COPY training_questions(subject_id, question, options, correct_answer, explanation, difficulty) FROM 'questions.csv' CSV HEADER"
```

---

## 🎨 创建新科目

如果你要导入的题目属于新科目（如"外科手术技能"），需要先创建科目：

```sql
-- 创建新科目
INSERT INTO training_subjects (name, description, difficulty, icon, cost, experience_reward)
VALUES (
  '外科手术技能',
  '学习常见的外科手术操作技术和注意事项',
  3,
  '🔪',
  500,
  300
)
RETURNING id;  -- 获取生成的科目ID
```

记住返回的 `id`，在插入题目时使用。

---

## ✅ 数据验证检查清单

导入后，请执行以下查询验证：

```sql
-- 1. 检查题目数量
SELECT subject_id, COUNT(*) as question_count 
FROM training_questions 
GROUP BY subject_id;

-- 2. 检查选项格式
SELECT id, question, options 
FROM training_questions 
WHERE jsonb_array_length(options::jsonb) != 4;
-- 应该返回空结果

-- 3. 检查答案索引范围
SELECT id, question, correct_answer 
FROM training_questions 
WHERE correct_answer < 0 OR correct_answer > 3;
-- 应该返回空结果

-- 4. 检查是否有空字段
SELECT id, question 
FROM training_questions 
WHERE question IS NULL OR explanation IS NULL OR options IS NULL;
-- 应该返回空结果
```

---

## 🚀 快速开始示例

假设你有一个 Word 文档包含10道题目：

### 步骤 1：复制题目内容

从 Word 复制题目到文本文件 `my_questions.txt`

### 步骤 2：使用 AI 转换

将内容粘贴给 ChatGPT，使用上面的提示词

### 步骤 3：获取 SQL 语句

复制 AI 生成的 SQL

### 步骤 4：导入数据库

在 Supabase SQL Editor 执行

### 步骤 5：验证

```sql
SELECT * FROM training_questions 
WHERE subject_id = '你的科目ID' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ⚠️ 常见问题

### 问题1：JSON 格式错误

**错误信息：** `invalid input syntax for type json`

**解决方案：**
- 检查双引号是否正确
- 使用在线 JSON 验证器验证格式
- 确保有且只有4个选项

### 问题2：科目ID不存在

**错误信息：** `violates foreign key constraint`

**解决方案：**
- 先查询现有科目：`SELECT * FROM training_subjects;`
- 使用正确的 UUID
- 或创建新科目

### 问题3：中文乱码

**解决方案：**
- 确保文件保存为 UTF-8 编码
- 在 SQL Editor 检查字符集设置

---

## 📞 需要帮助？

如果你在导入过程中遇到问题，可以：

1. 分享你的题目文件格式截图
2. 提供转换后的SQL示例
3. 告知具体错误信息

我会帮你调试并完成导入！

---

## 🎁 福利：Python 转换脚本

我可以为你创建一个自动化脚本，支持：
- Excel (.xlsx) → SQL
- Word (.docx) → SQL
- TXT → SQL
- PDF → SQL (需要OCR)

需要的话告诉我你的资料格式，我会立即编写对应的转换脚本！
