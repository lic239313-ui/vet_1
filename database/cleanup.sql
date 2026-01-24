-- 快速删除重复病例数据
-- 保留每个疾病的第一条记录，删除其他重复记录

-- 使用CTE和窗口函数删除重复（适用于UUID主键）
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY disease_name ORDER BY id::text) as row_num
  FROM case_templates
)
DELETE FROM case_templates
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- 执行后查看结果
SELECT 
  difficulty,
  COUNT(*) as 病例数,
  string_agg(disease_name, ', ' ORDER BY disease_name) as 疾病列表
FROM case_templates
GROUP BY difficulty
ORDER BY difficulty;
