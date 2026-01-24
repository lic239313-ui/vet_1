# DOCX 题库上传指南

本指南将帮助您将 Word 文档（.docx）格式的题目导入到 Supabase 数据库。

---

## 方法一：使用 Python 脚本（推荐）

### 第一步：安装依赖

在项目根目录打开命令行，运行：

```bash
cd database
pip install python-docx
```

### 第二步：准备 DOCX 文件

您的 Word 文档应遵循以下格式：

#### 格式示例 - 普通题目：

```
1. 犬瘟热的典型症状不包括？
A. 发热
B. 咳嗽
C. 呕吐
D. 关节肿胀
答案：D
解析：犬瘟热的典型症状包括发热、咳嗽、呕吐等，但不包括关节肿胀。
科目：兽医内科学

2. 猫泛白细胞减少症的病原体是？
A. 细小病毒
B. 猫瘟病毒
C. 犬瘟病毒
D. 冠状病毒
答案：B
解析：猫泛白细胞减少症由猫瘟病毒（猫细小病毒）引起。
科目：兽医传染病学
```

#### 格式示例 - 共用题干：

```
（1-3题共用题干）
一只3岁的金毛犬，主诉精神沉郁，食欲下降2天。体温39.8℃，心率120次/分，呼吸急促。血常规检查显示白细胞计数升高。X线检查显示肺部有炎症病灶。

1. 该病例最可能的诊断是？
A. 细小病毒感染
B. 犬瘟热
C. 肺炎
D. 胃肠炎
答案：C

2. 以下哪项检查最有助于确诊？
A. 粪便检查
B. 血液生化
C. 细菌培养
D. 病毒检测
答案：C

3. 治疗方案应包括？
A. 抗生素
B. 抗病毒药物
C. 止吐药
D. 驱虫药
答案：A
```

### 第三步：运行转换脚本

```bash
# 基本用法
python docx_to_sql.py 你的文件名.docx

# 指定科目
python docx_to_sql.py 你的文件名.docx 兽医内科学

# 指定输出文件
python docx_to_sql.py 你的文件名.docx 兽医外科学 output.sql
```

脚本会：
- ✅ 自动提取 Word 文档中的文本
- ✅ 智能识别题目、选项、答案
- ✅ 生成 SQL 文件（默认：`docx_converted_questions.sql`）

### 第四步：导入到 Supabase

1. 登录 [Supabase](https://supabase.com)
2. 选择您的项目
3. 打开 **SQL Editor**
4. 创建新查询
5. 复制生成的 `.sql` 文件内容
6. 粘贴并点击 **Run**
7. ✅ 完成！刷新应用即可看到新题目

---

## 方法二：使用网页上传（开发中）

我们正在开发一个更友好的网页上传界面，您可以：
- 直接在浏览器中拖拽上传 .docx 文件
- 实时预览解析结果
- 一键导入数据库

**该功能即将推出！**

---

## 常见问题

### Q1: 转换失败，提示"未能解析出题目"？
**A:** 请检查您的 Word 文档格式：
- 题号必须是 `1.` 或 `1、` 格式
- 选项必须是 `A.` `B.` `C.` `D.` 格式
- 答案必须有 `答案：` 标识

### Q2: 部分题目被跳过？
**A:** 检查以下几点：
- 每道题必须至少有 4 个选项（A、B、C、D）
- 题号格式正确
- 每个选项独占一行

### Q3: 如何批量导入多个文件？
**A:** 可以使用批处理脚本：

**Windows (PowerShell):**
```powershell
Get-ChildItem *.docx | ForEach-Object {
    python docx_to_sql.py $_.Name
}
```

**Mac/Linux:**
```bash
for file in *.docx; do
    python docx_to_sql.py "$file"
done
```

### Q4: 导入后如何验证？
**A:** 在 Supabase 中执行：
```sql
SELECT COUNT(*) FROM vet_exam_questions;
SELECT subject, COUNT(*) FROM vet_exam_questions GROUP BY subject;
```

### Q5: 想要覆盖已有题目？
**A:** 修改生成的 SQL 文件，将最后的：
```sql
ON CONFLICT DO NOTHING;
```
改为：
```sql
ON CONFLICT (id) DO UPDATE SET
  question_type = EXCLUDED.question_type,
  stem = EXCLUDED.stem,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;
```

---

## 支持的题目类型

- ✅ 单选题
- ✅ 共用题干题
- ✅ 带解析的题目
- ✅ 多个科目混合
- 🔄 多选题（开发中）
- 🔄 填空题（开发中）

---

## 数据库结构

题目将被导入到 `vet_exam_questions` 表：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 自动生成 |
| question_type | TEXT | 题目类型 |
| stem | TEXT | 题干内容 |
| options | JSONB | 选项数组 |
| correct_answer | INTEGER | 正确答案索引 (0-3) |
| explanation | TEXT | 解析 |
| subject | TEXT | 科目 |
| difficulty | INTEGER | 难度 (1-5) |
| is_real_exam | BOOLEAN | 是否为真题 |

---

## 示例文件

在 `database/` 目录下提供了示例文件：
- `questions_template_docx_content.txt` - 文本格式示例
- `example_with_answers.txt` - 带答案的示例

您可以参考这些示例准备自己的 Word 文档。

---

## 技术支持

如有问题，请查看：
1. `database/README.md` - 数据库初始化指南
2. `database/README_CONVERTER.md` - 转换器详细文档
3. 或联系开发团队

---

**祝您使用愉快！** 🎉
