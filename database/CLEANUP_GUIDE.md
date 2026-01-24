# 快速删除重复数据指南

## 🚀 一键清理脚本

我已更新 `database/cleanup.sql`，只需2步即可清理重复数据。

---

## 📝 操作步骤

### 1. 登录Supabase
访问：https://supabase.com

### 2. 打开SQL编辑器
左侧菜单 → **SQL Editor** → **New Query**

### 3. 复制并执行清理脚本
```sql
-- 删除重复数据，保留每个疾病的第一条记录
DELETE FROM case_templates
WHERE id NOT IN (
  SELECT MIN(id)
  FROM case_templates
  GROUP BY disease_name
);
```

### 4. 点击 **Run** 执行

✅ 完成！重复数据已被删除。

---

## 📊 验证结果

执行后，运行以下查询查看清理效果：

```sql
-- 查看每个难度级别的病例数
SELECT 
  difficulty,
  COUNT(*) as 病例数,
  string_agg(disease_name, ', ' ORDER BY disease_name) as 疾病列表
FROM case_templates
GROUP BY difficulty
ORDER BY difficulty;
```

---

## 🔍 清理前后对比

### 清理前（可能）
- 总记录数：16-24条（有重复）
- 唯一疾病：8个

### 清理后
- 总记录数：8条（仅原始数据）
- 唯一疾病：8个

---

## ⚠️ 安全提示

该脚本会：
- ✅ 保留每个疾病名称的**第一条**记录（ID最小的）
- ✅ 删除该疾病的其他所有重复记录
- ✅ 不影响数据完整性

---

## 🔄 清理后下一步

1. **导入新病例**：执行 `additional_cases.sql` 添加12个新病例
2. **验证数据**：确认表中有20条记录
3. **测试应用**：刷新前端测试病例多样性

---

## 🆘 如果出错

### 撤销删除（如果刚删除）
Supabase支持时间旅行，可以恢复：
1. 进入 **Database** → **Backups**
2. 选择删除前的时间点
3. 恢复数据

### 重新导入所有数据
```sql
-- 1. 清空表
TRUNCATE TABLE case_templates;

-- 2. 重新执行
-- database/seed.sql (8个基础病例)
-- database/additional_cases.sql (12个新病例)
```

---

## 💡 防止未来重复

在表上添加唯一约束（可选）：

```sql
-- 确保disease_name唯一
ALTER TABLE case_templates
ADD CONSTRAINT unique_disease_name UNIQUE (disease_name);
```

这样以后如果尝试插入重复疾病名，会自动报错而不是创建重复数据。
