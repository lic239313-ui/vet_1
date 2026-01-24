-- 执业兽医资格证考试题库表结构
-- 支持单选、多选、共用题干题

-- 1. 题目主表（包含单选题、多选题和共用题干的题干部分）
CREATE TABLE IF NOT EXISTS vet_exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('single', 'multiple', 'shared_stem')),
    
    -- 题干内容
    stem TEXT NOT NULL,
    
    -- 共用题干专用字段
    is_shared_stem BOOLEAN DEFAULT FALSE,
    shared_stem_id UUID REFERENCES vet_exam_questions(id), -- 如果是子题，引用父题干
    
    -- 选项（JSON数组，例如：["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"]）
    options JSONB NOT NULL,
    
    -- 正确答案（单选为数字0-3，多选为数组[0,2,3]）
    correct_answer JSONB NOT NULL,
    
    -- 解析
    explanation TEXT NOT NULL,
    
    -- 科目分类
    subject VARCHAR(50) NOT NULL, -- 如：基础兽医学、预防兽医学、临床兽医学、综合应用
    
    -- 难度等级 1-5
    difficulty INTEGER DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
    
    -- 年份
    exam_year INTEGER,
    
    -- 是否为真题
    is_real_exam BOOLEAN DEFAULT TRUE,
    
    -- 创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. 用户答题记录表
CREATE TABLE IF NOT EXISTS user_exam_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL, -- 可以是localStorage的ID或用户账号
    question_id UUID REFERENCES vet_exam_questions(id),
    
    -- 用户答案
    user_answer JSONB NOT NULL,
    
    -- 是否正确
    is_correct BOOLEAN NOT NULL,
    
    -- 答题时间
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 用时（秒）
    time_spent INTEGER
);

-- 3. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_question_type ON vet_exam_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_subject ON vet_exam_questions(subject);
CREATE INDEX IF NOT EXISTS idx_difficulty ON vet_exam_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_exam_year ON vet_exam_questions(exam_year);
CREATE INDEX IF NOT EXISTS idx_shared_stem_id ON vet_exam_questions(shared_stem_id);
CREATE INDEX IF NOT EXISTS idx_user_records ON user_exam_records(user_id, answered_at);

-- 4. 插入示例数据

-- 示例1：单选题
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year)
VALUES (
    'single',
    '犬瘟热病毒主要侵害的系统是',
    '["A. 消化系统", "B. 呼吸系统和神经系统", "C. 泌尿系统", "D. 生殖系统"]',
    '1',
    '犬瘟热病毒主要侵害呼吸系统和神经系统，临床表现为双相热、呼吸道症状和神经症状。',
    '预防兽医学',
    2,
    2023
);

-- 示例2：多选题
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year)
VALUES (
    'multiple',
    '以下哪些症状是猫泛白细胞减少症的典型表现？（多选）',
    '["A. 高热", "B. 呕吐", "C. 腹泻", "D. 白细胞显著减少", "E. 黄疸"]',
    '[0, 1, 2, 3]',
    '猫泛白细胞减少症（猫瘟）的典型症状包括高热、呕吐、腹泻和白细胞显著减少。黄疸不是该病的典型症状。',
    '预防兽医学',
    3,
    2023
);

-- 示例3：共用题干题 - 题干
INSERT INTO vet_exam_questions (question_type, is_shared_stem, stem, options, correct_answer, explanation, subject, difficulty, exam_year)
VALUES (
    'shared_stem',
    TRUE,
    '某犬，3岁，雄性，未绝育。主诉：食欲废绝3天，精神沉郁，频繁呕吐。体格检查：体温39.8℃，心率120次/分，腹部触诊敏感，可触及香肠样肿块。X光检查显示肠道内有异物阻塞。',
    '[]',
    '0',
    '此为共用题干，无需解析',
    '临床兽医学',
    3,
    2023
);

-- 获取刚插入的题干ID（在实际应用中需要通过程序获取）
-- 这里使用子查询来关联
INSERT INTO vet_exam_questions (question_type, shared_stem_id, stem, options, correct_answer, explanation, subject, difficulty, exam_year)
VALUES (
    'single',
    (SELECT id FROM vet_exam_questions WHERE is_shared_stem = TRUE AND stem LIKE '%肠道内有异物阻塞%' LIMIT 1),
    '根据上述病例，最可能的诊断是',
    '["A. 急性胃炎", "B. 肠道异物", "C. 肠套叠", "D. 急性胰腺炎"]',
    '1',
    '根据触诊发现香肠样肿块和X光显示异物阻塞，诊断为肠道异物最为合理。',
    '临床兽医学',
    3,
    2023
),
(
    'single',
    (SELECT id FROM vet_exam_questions WHERE is_shared_stem = TRUE AND stem LIKE '%肠道内有异物阻塞%' LIMIT 1),
    '针对该病例，最佳的治疗方案是',
    '["A. 保守治疗，给予止吐药", "B. 立即手术取出异物", "C. 催吐处理", "D. 灌肠治疗"]',
    '1',
    '肠道异物阻塞且触及肿块，保守治疗效果差，应立即手术取出异物。',
    '临床兽医学',
    3,
    2023
);

-- 示例4：更多单选题
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year)
VALUES 
(
    'single',
    '猫的正常体温范围是',
    '["A. 37.5-38.5℃", "B. 38.0-39.0℃", "C. 38.0-39.5℃", "D. 39.0-40.0℃"]',
    '2',
    '猫的正常体温范围为38.0-39.5℃，略高于犬（37.5-39.0℃）。',
    '基础兽医学',
    1,
    2022
),
(
    'single',
    '犬细小病毒感染的潜伏期一般为',
    '["A. 1-3天", "B. 3-7天", "C. 7-14天", "D. 14-21天"]',
    '1',
    '犬细小病毒的潜伏期一般为3-7天，临床症状包括呕吐、腹泻、血便等。',
    '预防兽医学',
    2,
    2022
),
(
    'single',
    '进行犬猫绝育手术前，禁食禁水的时间一般为',
    '["A. 禁食4小时，禁水2小时", "B. 禁食8小时，禁水4小时", "C. 禁食12小时，禁水6小时", "D. 禁食24小时，禁水12小时"]',
    '1',
    '为防止麻醉过程中呕吐和误吸，一般建议禁食8小时，禁水4小时。',
    '临床兽医学',
    2,
    2023
);

-- 5. 创建随机获取题目的函数
CREATE OR REPLACE FUNCTION get_random_exam_questions(
    question_count INTEGER DEFAULT 10,
    subject_filter VARCHAR DEFAULT NULL,
    difficulty_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    question_type VARCHAR,
    stem TEXT,
    is_shared_stem BOOLEAN,
    shared_stem_id UUID,
    options JSONB,
    correct_answer JSONB,
    explanation TEXT,
    subject VARCHAR,
    difficulty INTEGER,
    exam_year INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.question_type,
        q.stem,
        q.is_shared_stem,
        q.shared_stem_id,
        q.options,
        q.correct_answer,
        q.explanation,
        q.subject,
        q.difficulty,
        q.exam_year
    FROM vet_exam_questions q
    WHERE 
        (subject_filter IS NULL OR q.subject = subject_filter)
        AND (difficulty_filter IS NULL OR q.difficulty = difficulty_filter)
        AND q.is_real_exam = TRUE
    ORDER BY RANDOM()
    LIMIT question_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE vet_exam_questions IS '执业兽医资格证考试题库';
COMMENT ON TABLE user_exam_records IS '用户答题记录';
