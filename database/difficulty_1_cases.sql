-- ============================================================
-- 难度1 病例模板 - 基础病例
-- 生成日期: 2026-02-02
-- 共 10 个病例
-- ============================================================

-- 1. 犬跳蚤过敏性皮炎
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '跳蚤过敏性皮炎',
  1,
  '{
    "chiefComplaint": "狗一直疯狂咬尾巴根部，把毛都咬秃了，看着很痒。",
    "physicalExam": {
      "visual": "尾根部背侧大面积脱毛，皮肤红肿，有抓痕和结痂（粟粒状皮炎）。",
      "auscultation": "心肺音正常。",
      "palpation": "患处皮肤敏感，体表淋巴结轻度肿大。",
      "olfaction": "皮肤有轻微腥味。"
    },
    "tpr": {
      "temp": 38.6,
      "hr": 110,
      "rr": 28,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "EOS": "嗜酸性粒细胞升高（提示过敏/寄生虫）" },
    "chem": { "结果": "未见异常" },
    "其他检查": "湿纸试验（Wet Paper Test）：梳理下来的黑色颗粒遇水化开呈红色（跳蚤粪便）。"
  }'::jsonb,
  '1. 驱虫：非泼罗尼 (Fipronil) 滴剂外用或 氟雷拉纳 (Fluralaner) 口服，按体重给药。
2. 止痒/抗炎：泼尼松龙 (Prednisolone) 0.5-1 mg/kg PO, SID, 连用3-5天。
3. 环境控制：告知主人必须同时对环境进行除虫清洁。',
  '跳蚤过敏性皮炎 (Flea Allergy Dermatitis, FAD)'
);

-- 2. 犬传染性气管支气管炎（窝咳）
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬传染性气管支气管炎（窝咳）',
  1,
  '{
    "chiefComplaint": "这几天突然开始咳嗽，声音像卡了骨头一样（鹅叫声），特别是激动的时候。",
    "physicalExam": {
      "visual": "精神食欲良好，无鼻涕，偶有干咳。",
      "auscultation": "肺部听诊清晰，无湿罗音，气管听诊音粗糙。",
      "palpation": "轻压气管诱发剧烈咳嗽（气管敏感）。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.8,
      "hr": 90,
      "rr": 20,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "WBC": "正常或轻微升高" },
    "chem": { "结果": "未见异常" },
    "其他检查": "胸部X光：肺野清晰，未见肺炎征象。"
  }'::jsonb,
  '1. 抗生素（防止继发感染）：多西环素 (Doxycycline) 5-10 mg/kg PO, BID, 7-10天。
2. 止咳（若咳嗽严重影响休息）：布托啡诺 (Butorphanol) 0.5 mg/kg PO。
3. 护理：建议带入浴室吸蒸汽，改用胸背带牵引。',
  '犬传染性气管支气管炎 (Infectious Tracheobronchitis / Kennel Cough)'
);

-- 3. 猫细菌性结膜炎
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '细菌性结膜炎',
  1,
  '{
    "chiefComplaint": "左眼睁不开，眼角有很多黄绿色的眼屎。",
    "physicalExam": {
      "visual": "左眼羞明流泪，第三眼睑突出，结膜充血红肿，有粘液脓性分泌物。",
      "auscultation": "正常。",
      "palpation": "触诊眼周无明显疼痛，眼球张力正常。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.4,
      "hr": 160,
      "rr": 24,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "结果": "未见异常" },
    "其他检查": "荧光素钠染色：阴性（排除角膜溃疡）。"
  }'::jsonb,
  '1. 清洁：生理盐水冲洗眼部分泌物。
2. 抗生素眼药：妥布霉素滴眼液 (Tobramycin) 1-2滴/次, QID, 连用5-7天。
3. 佩戴伊丽莎白圈：防止抓挠加重感染。',
  '细菌性结膜炎 (Bacterial Conjunctivitis)'
);

-- 4. 犬急性湿性皮炎（热斑）
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '急性湿性皮炎（热斑）',
  1,
  '{
    "chiefComplaint": "早上还好好的，下班回来发现它脸颊侧面突然秃了一块，红红的湿湿的。",
    "physicalExam": {
      "visual": "面颊部可见一边界清晰的圆形病变，脱毛，皮肤鲜红湿润，有渗出液。",
      "auscultation": "正常。",
      "palpation": "病变处触痛明显，局部皮温升高。",
      "olfaction": "病变处有特异性腥臭味。"
    },
    "tpr": {
      "temp": 39.0,
      "hr": 100,
      "rr": 24,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "结果": "正常" },
    "chem": { "结果": "正常" },
    "其他检查": "皮肤刮片：大量中性粒细胞和细菌（球菌）。"
  }'::jsonb,
  '1. 备皮与清洁：剃除病变周围毛发，使用氯己定溶液清洗消毒。
2. 局部用药：外涂含抗生素和糖皮质激素的软膏（如Panolog），BID。
3. 全身用药（视情况）：头孢氨苄 (Cephalexin) 22 mg/kg PO, BID。',
  '急性湿性皮炎 (Acute Moist Dermatitis / Hot Spot)'
);

-- 5. 犬饮食不当性胃炎
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '饮食不当性胃炎',
  1,
  '{
    "chiefComplaint": "昨晚偷吃了垃圾桶里的剩饭，今天吐了两次，精神还可以。",
    "physicalExam": {
      "visual": "精神尚可，无明显脱水。",
      "auscultation": "肠鸣音活跃。",
      "palpation": "腹部触诊柔软，无明显团块或剧烈疼痛。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.5,
      "hr": 90,
      "rr": 20,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "结果": "正常" },
    "chem": { "结果": "正常（排除胰腺炎、肝肾问题）" },
    "其他检查": "腹部X光：可见胃肠积气，未见致密异物影像。"
  }'::jsonb,
  '1. 禁食禁水：禁食12-24小时，少量多次饮水。
2. 止吐：马罗匹坦 (Maropitant) 2 mg/kg PO, SID。
3. 饮食管理：恢复进食后给予易消化处方粮（i/d），少量多餐。',
  '急性胃炎/饮食不当 (Acute Gastritis / Dietary Indiscretion)'
);

-- 6. 猫复孔绦虫感染
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '复孔绦虫感染',
  1,
  '{
    "chiefComplaint": "最近发现猫屁股上沾着像米粒一样的白色东西，还会动。",
    "physicalExam": {
      "visual": "肛门周围毛发上可见干枯的芝麻样颗粒，直肠检查可见白色扁平节片伸缩。",
      "auscultation": "正常。",
      "palpation": "腹部柔软。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.2,
      "hr": 150,
      "rr": 24,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "EOS": "可能轻度升高" },
    "chem": { "结果": "正常" },
    "其他检查": "粪便漂浮法：可能较难发现虫卵（因绦虫主要排节片）。"
  }'::jsonb,
  '1. 驱虫：吡喹酮 (Praziquantel) 5 mg/kg PO 或 皮下注射，一次即可。
2. 同步驱跳蚤：因为跳蚤是绦虫的中间宿主，必须同时使用非泼罗尼等体外驱虫药。',
  '复孔绦虫感染 (Dipylidium caninum Infection)'
);

-- 7. 猫粉刺（黑下巴）
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫粉刺（黑下巴）',
  1,
  '{
    "chiefComplaint": "下巴黑黑的，像煤渣一样擦不掉，最近有点红肿。",
    "physicalExam": {
      "visual": "下颌处皮肤毛囊有大量黑色粉刺（黑头），部分毛囊发炎红肿，毛发稀疏。",
      "auscultation": "正常。",
      "palpation": "下巴皮肤增厚，触碰有轻微不适。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.3,
      "hr": 140,
      "rr": 26,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "结果": "正常" },
    "chem": { "结果": "正常" },
    "其他检查": "伍德氏灯：阴性（排除猫癣）。"
  }'::jsonb,
  '1. 清洁：使用温水和过氧化苯甲酰洗剂 (Benzoyl Peroxide) 清洗下巴，每日1次。
2. 局部抗生素（若有感染）：莫匹罗星软膏 (Mupirocin) 局部涂抹，BID。
3. 环境改善：建议主人将塑料食盆更换为陶瓷或不锈钢材质。',
  '猫粉刺 (Feline Acne)'
);

-- 8. 犬肛门腺阻塞
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '肛门腺阻塞',
  1,
  '{
    "chiefComplaint": "最近总是在地板上磨屁股（蹭屁股），还会回头咬尾巴根。",
    "physicalExam": {
      "visual": "肛门周围皮肤轻度红肿，未见破溃。",
      "auscultation": "正常。",
      "palpation": "直肠触诊发现4点和8点方向肛门腺囊肿大、坚实，挤压有痛感。",
      "olfaction": "挤出物极度恶臭，呈灰褐色牙膏状。"
    },
    "tpr": {
      "temp": 38.4,
      "hr": 100,
      "rr": 22,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "结果": "正常" },
    "chem": { "结果": "正常" },
    "其他检查": "无。"
  }'::jsonb,
  '1. 手法挤压：人工挤出积聚的肛门腺液。
2. 抗炎（若红肿明显）：红霉素软膏局部涂抹肛周。
3. 饮食建议：增加膳食纤维摄入，帮助自然排出腺液。',
  '肛门腺阻塞 (Anal Sac Impaction)'
);

-- 9. 犬蛔虫感染
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '蛔虫感染',
  1,
  '{
    "chiefComplaint": "小狗肚子很大，吃得多但不长肉，今天吐出来一条像像皮筋一样的虫子。",
    "physicalExam": {
      "visual": "腹围增大（大肚子），肋骨明显（消瘦），被毛粗乱无光泽。",
      "auscultation": "正常。",
      "palpation": "腹部触诊有充盈感。",
      "olfaction": "可能有口臭。"
    },
    "tpr": {
      "temp": 38.2,
      "hr": 120,
      "rr": 28,
      "mm": "稍苍白",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "HCT": "30% (轻度贫血)", "EOS": "显著升高" },
    "chem": { "结果": "正常" },
    "其他检查": "粪便漂浮法：可见大量圆形、厚壳的蛔虫卵。"
  }'::jsonb,
  '1. 驱虫：芬苯达唑 (Fenbendazole) 50 mg/kg PO, SID, 连用3天。
2. 支持疗法：给予高营养幼犬粮。
3. 复诊：2周后重复驱虫一次。',
  '犬弓首蛔虫感染 (Toxocara canis Infection)'
);

-- 10. 猫轻度上呼吸道感染
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '轻度上呼吸道感染',
  1,
  '{
    "chiefComplaint": "这两天一直打喷嚏，流清鼻涕，精神吃喝都还好。",
    "physicalExam": {
      "visual": "双侧鼻孔有浆液性（清亮）鼻液，无眼部症状，口腔无溃疡。",
      "auscultation": "肺音清晰，上呼吸道有轻微喷嚏声。",
      "palpation": "下颌淋巴结轻度反应性肿大。",
      "olfaction": "无特殊。"
    },
    "tpr": {
      "temp": 38.9,
      "hr": 150,
      "rr": 24,
      "mm": "粉红",
      "crt": "<2秒"
    }
  }'::jsonb,
  '{
    "cbc": { "WBC": "正常或轻微升高" },
    "chem": { "结果": "正常" },
    "其他检查": "PCR检测（可选）：通常初诊不进行，疑似杯状/疱疹病毒轻度感染。"
  }'::jsonb,
  '1. 营养支持/补充剂：赖氨酸 (L-Lysine) 500mg PO, BID。
2. 雾化治疗：使用生理盐水雾化，帮助湿润呼吸道，每日1-2次。
3. 观察：若出现脓性鼻涕或食欲下降，再考虑使用抗生素（如多西环素）。',
  '猫上呼吸道感染-轻度 (Feline URI - Mild)'
);

-- ============================================================
-- 查看难度1病例统计
-- ============================================================
-- SELECT disease_name, species FROM case_templates WHERE difficulty = 1;
