# 数据库初始化指南

## 步骤1：登录Supabase

访问：https://supabase.com 并登录您的账户

## 步骤2：选择项目

确保您已选择正确的项目：
- 项目URL: https://pyavvzsgnusbspcskvpz.supabase.co

## 步骤3：打开SQL编辑器

1. 在左侧菜单找到 **SQL Editor**（SQL编辑器）
2. 点击 **New Query**（新建查询）

## 步骤4：执行schema.sql

1. 打开项目中的 `database/schema.sql` 文件
2. 复制全部内容
3. 粘贴到Supabase SQL编辑器中
4. 点击 **Run**（运行）按钮

**预期结果**：
- 创建了 `case_templates` 表
- 创建了相关索引

## 步骤5：执行seed.sql

1. 打开项目中的 `database/seed.sql` 文件
2. 复制全部内容
3. 粘贴到Supabase SQL编辑器中（可以是新查询或清空之前的）
4. 点击 **Run**（运行）按钮

**预期结果**：
- 插入了8条病例模板记录

## 步骤6：验证数据

1. 在左侧菜单找到 **Table Editor**（表编辑器）
2. 选择 `case_templates` 表
3. 应该看到8条记录：
   - 犬细小病毒肠炎
   - 猫泛白细胞减少症
   - 猫癣
   - 急性胰腺炎
   - 慢性肾脏病
   - 犬瘟热
   - 猫下泌尿道疾病
   - 犬髋关节发育不良

## 常见问题

### Q: SQL执行时报错"relation already exists"
A: 这说明表已经存在，可以跳过schema.sql，直接执行seed.sql

### Q: 如何重置数据？
A: 在SQL编辑器中执行：
```sql
DROP TABLE IF EXISTS case_templates CASCADE;
```
然后重新执行schema.sql和seed.sql

### Q: 如何添加更多病例模板？
A: 使用以下SQL格式插入新记录：
```sql
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',  -- 或 '猫'
  '疾病名称',
  3,     -- 难度1-5
  '{...}'::jsonb,
  '{...}'::jsonb,
  '治疗指南文本',
  '正确诊断'
);
```

## 下一步

数据库初始化完成后，返回应用项目执行：
```bash
npm run dev:all
```

启动前后端服务器并开始测试！
