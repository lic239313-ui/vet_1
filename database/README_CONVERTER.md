# 题库转换工具使用说明

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

或单独安装：
```bash
pip install pandas openpyxl
```

### 2. 准备题目文件

支持以下格式：

#### 📊 Excel/CSV 格式（推荐）

创建包含以下列的表格：

| 题目 | 选项A | 选项B | 选项C | 选项D | 答案 | 解析 | 难度 |
|------|-------|-------|-------|-------|------|------|------|
| 犬的正常体温范围是？ | 37.5-38.5°C | 38.0-39.2°C | 39.5-40.5°C | 36.0-37.5°C | B | 犬的正常体温为... | 1 |

**注意：**
- 列名支持中英文（题目/question、选项A/option_a 等）
- 答案列填写 A/B/C/D
- 难度范围 1-5，可选（默认为1）

#### 📝 文本文件格式

```
1. 犬的正常体温范围是？
A. 37.5-38.5°C
B. 38.0-39.2°C
C. 39.5-40.5°C
D. 36.0-37.5°C
答案：B
解析：犬的正常体温为38.0-39.2°C，幼犬可能稍高...

2. 猫的正常心率范围是？
A. 60-100次/分
B. 100-140次/分
C. 140-220次/分
D. 220-280次/分
答案：C
解析：猫的正常心率为140-220次/分...
```

#### 🗂️ JSON 格式

```json
[
  {
    "question": "犬的正常体温范围是？",
    "options": ["37.5-38.5°C", "38.0-39.2°C", "39.5-40.5°C", "36.0-37.5°C"],
    "correct_answer": 1,
    "explanation": "犬的正常体温为38.0-39.2°C...",
    "difficulty": 1
  }
]
```

### 3. 运行转换

```bash
# 基本用法
python questions_converter.py 你的文件.xlsx

# 指定科目ID
python questions_converter.py 你的文件.csv 科目ID-xxxx

# 指定输出文件名
python questions_converter.py 你的文件.txt 科目ID output.sql
```

### 4. 查看预览

脚本会自动显示前3道题目的预览：

```
📋 预览前 3 道题目：

第 1 题：犬的正常体温范围是？
  A. 37.5-38.5°C  
  B. 38.0-39.2°C ✓
  C. 39.5-40.5°C  
  D. 36.0-37.5°C  
  解析：犬的正常体温为38.0-39.2°C...
  难度：⭐
```

### 5. 导入数据库

将生成的 `.sql` 文件在 Supabase SQL Editor 中执行。

## 📋 完整示例

### 示例 1：从 Excel 转换

```bash
# 1. 准备 Excel 文件（见 questions_template.csv）
# 2. 运行转换
python questions_converter.py my_questions.xlsx

# 3. 查看生成的文件
# imported_questions_20260120_163000.sql

# 4. 在 Supabase 执行该 SQL 文件
```

### 示例 2：从文本文件转换

```bash
# 1. 创建文本文件 my_questions.txt
# 2. 按照标准格式编写题目
# 3. 运行转换
python questions_converter.py my_questions.txt

# 4. 导入生成的 SQL
```

### 示例 3：指定科目和输出

```bash
# 为"外科手术技能"科目转换题目
python questions_converter.py surgery_questions.xlsx 22222222-2222-2222-2222-222222222222 surgery.sql
```

## ⚙️ 高级功能

### 智能列名匹配

脚本会自动识别以下列名变体：
- 题目：`题目`, `question`, `问题`, `q`
- 选项A：`选项A`, `option_a`, `a`, `选项1`
- 答案：`答案`, `answer`, `ans`, `正确答案`
- 解析：`解析`, `explanation`, `exp`, `说明`
- 难度：`难度`, `difficulty`, `diff`

### 多格式答案支持

答案列支持多种写法：
- 字母：`A`, `B`, `C`, `D`
- 数字：`0`, `1`, `2`, `3`
- 中文：`第一个`, `第二个`, `选项A`

### 自动验证

脚本会自动：
- ✅ 验证必需列是否存在
- ✅ 检查每题是否有4个选项
- ✅ 验证难度范围（1-5）
- ✅ 转义SQL特殊字符

## ❓ 常见问题

### Q: 提示缺少 pandas 或 openpyxl？

```bash
pip install pandas openpyxl
```

### Q: Excel 文件无法读取？

- 确保文件未被打开
- 检查文件扩展名（.xlsx, .xls）
- 尝试另存为 CSV 格式

### Q: 文本文件解析失败？

- 检查格式是否严格按照示例
- 确保每题有完整的选项、答案、解析
- 题号使用数字+点号（1. 2. 3.）

### Q: 生成的 SQL 有中文乱码？

- 确保源文件保存为 UTF-8 编码
- 在 Supabase 执行前检查 SQL 文件编码

### Q: 如何获取科目ID？

```sql
-- 在 Supabase SQL Editor 查询现有科目
SELECT id, name FROM training_subjects;

-- 或创建新科目
INSERT INTO training_subjects (name, description, difficulty, icon, cost, experience_reward)
VALUES ('新科目名称', '描述...', 2, '📚', 0, 150)
RETURNING id;
```

## 🎯 最佳实践

1. **小批量测试**：先用少量题目（5-10题）测试转换和导入流程
2. **数据备份**：导入前备份数据库，或使用事务
3. **验证数据**：导入后执行验证查询：
   ```sql
   SELECT COUNT(*) FROM training_questions WHERE subject_id = '你的科目ID';
   ```
4. **格式统一**：建议使用 Excel/CSV，格式最稳定
5. **编码一致**：所有文件使用 UTF-8 编码

## 📞 需要帮助？

如遇到问题：
1. 查看脚本输出的错误信息
2. 检查题目文件格式是否正确
3. 参考 `questions_template.csv` 示例
4. 提供错误截图和文件示例

---

**Happy Converting! 🎉**
