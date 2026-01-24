-- 创建病例模板表
CREATE TABLE IF NOT EXISTS case_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  species TEXT NOT NULL CHECK (species IN ('犬', '猫')),
  disease_name TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  typical_symptoms JSONB NOT NULL,
  lab_patterns JSONB,
  treatment_guidelines TEXT NOT NULL,
  correct_diagnosis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_case_templates_difficulty ON case_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_case_templates_species ON case_templates(species);

-- 添加注释
COMMENT ON TABLE case_templates IS '临床病例模板表，用于AI生成病例的基础数据';
COMMENT ON COLUMN case_templates.species IS '动物物种：犬或猫';
COMMENT ON COLUMN case_templates.disease_name IS '疾病名称';
COMMENT ON COLUMN case_templates.difficulty IS '难度等级：1-5，对应不同兽医级别';
COMMENT ON COLUMN case_templates.typical_symptoms IS '典型症状的JSON数据';
COMMENT ON COLUMN case_templates.lab_patterns IS '化验特征模式的JSON数据';
COMMENT ON COLUMN case_templates.treatment_guidelines IS '治疗指南文本';
COMMENT ON COLUMN case_templates.correct_diagnosis IS '正确诊断';
