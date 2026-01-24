# 🔐 最终排查：Row Level Security (RLS) 权限

## 诊断

你的**数据完全正确**：
1. 科目名称完全匹配（`基础兽医学` 等）
2. 题目数量正确（148题）
3. `is_real_exam` 都是 true

**虽然你有数据，但 API 读不到**。这通常是因为 **Supabase 的 RLS (Row Level Security) 开启了，但没有配置允许读取的策略**。

默认情况下，如果开启了 RLS，`anon`（匿名）用户（也就是你的 API）是**看不到任何数据**的。

---

## 🚀 解决方案（二选一）

### 方案 A：关闭 RLS（最简单，推荐用于测试）

1. 登录 Supabase → **Table Editor**
2. 选择 `vet_exam_questions` 表
3. 查看右上角即使是否有 "**RLS**" 标记
4. 如果是绿色的（开启），点击它，然后选择 **Disable RLS**
5. 确认关闭

**关闭后，再次测试你的网站，应该就能看到题目了！**

---

### 方案 B：添加允许读取的策略（更安全）

如果你想保持 RLS 开启，必须添加一条策略：

1. 登录 Supabase → **Authentication** → **Policies**
2. 找到 `vet_exam_questions` 表
3. 点击 **New Policy**
4. 选择 **Get started quickly** -> **Enable read access to everyone**
5. 点击 **Use this template** -> **Save policy**

---

## ⚡ 也可以用 SQL 快速修复

在 SQL Editor 运行：

```sql
-- 允许所有用户（包括匿名）读取题目
ALTER TABLE vet_exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许任何人读取题目" 
ON vet_exam_questions 
FOR SELECT 
TO anon 
USING (true);
```

**或者直接关闭 RLS：**

```sql
ALTER TABLE vet_exam_questions DISABLE ROW LEVEL SECURITY;
```

---

**请尝试关闭 RLS 或添加策略，然后测试网页！** 🚀
