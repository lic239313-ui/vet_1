# 📋 快速开始：上传 DOCX 题目到数据库

## 🚀 三步完成上传

### 步骤 1: 安装依赖

打开命令行，进入 database 目录：

```bash
cd c:\Users\Administrator\Desktop\vet_1\database
pip install -r requirements.txt
```

### 步骤 2: 准备您的 Word 文档

将您的 `.docx` 文件放到 `database` 文件夹中，文件格式应该类似这样：

```
1. 犬瘟热的典型症状不包括？
A. 双相热
B. 咳嗽
C. 神经症状
D. 关节肿胀
答案：D
解析：犬瘟热的典型症状包括...
科目：兽医传染病学

2. 下一道题目...
```

📌 **格式要求：**
- 题号格式：`1.` 或 `1、`
- 选项格式：`A.` `B.` `C.` `D.`
- 必须包含：`答案：X`
- 可选字段：`解析：xxx`、`科目：xxx`

### 步骤 3: 运行转换命令

```bash
# 转换 docx 为 SQL
python docx_to_sql.py 你的文件.docx

# 或指定科目名称
python docx_to_sql.py 你的文件.docx 兽医内科学
```

✅ 脚本会生成 `docx_converted_questions.sql` 文件

### 步骤 4: 导入到 Supabase

1. 打开 [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. 复制生成的 `.sql` 文件内容
3. 粘贴到 SQL Editor
4. 点击 **Run** 执行
5. ✅ 完成！

---

## 🧪 测试示例

如果您想先测试功能，可以使用我们提供的示例文件：

```bash
# 使用示例文本文件（需要先创建 docx）
python smart_converter.py example_questions.txt

# 查看生成的 SQL
notepad converted_questions.sql
```

---

## 🔧 高级用法

### 批量转换多个文件

**Windows PowerShell:**
```powershell
Get-ChildItem *.docx | ForEach-Object {
    python docx_to_sql.py $_.Name
}
```

### 自定义输出文件名

```bash
python docx_to_sql.py input.docx 兽医外科学 custom_output.sql
```

### 验证导入结果

在 Supabase SQL Editor 中执行：

```sql
-- 查看总题目数
SELECT COUNT(*) FROM vet_exam_questions;

-- 按科目统计
SELECT subject, COUNT(*) as count 
FROM vet_exam_questions 
GROUP BY subject 
ORDER BY count DESC;

-- 查看最新导入的题目
SELECT * FROM vet_exam_questions 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ❓ 常见问题

**Q: 提示"缺少 python-docx 库"？**
```bash
pip install python-docx
```

**Q: 转换失败？**
- 检查文件格式是否正确
- 确保每道题至少有 4 个选项
- 查看 `example_questions.txt` 参考格式

**Q: 如何查看详细日志？**
- 脚本会自动输出解析过程
- 注意查看 ⚠️ 警告信息

**Q: 想要删除错误导入的题目？**
```sql
-- 查看最近导入的题目 ID
SELECT id, stem FROM vet_exam_questions 
ORDER BY created_at DESC LIMIT 20;

-- 删除指定 ID 的题目
DELETE FROM vet_exam_questions WHERE id = 'your-uuid-here';
```

---

## 📚 更多文档

- [DOCX_UPLOAD_GUIDE.md](./DOCX_UPLOAD_GUIDE.md) - 完整上传指南
- [README_CONVERTER.md](./README_CONVERTER.md) - 转换器详细文档
- [database/README.md](./README.md) - 数据库初始化

---

**需要帮助？** 查看控制台输出或联系开发团队。

祝您使用愉快！🎉
