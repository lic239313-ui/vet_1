-- 插入常见兽医疾病的病例模板

-- 1. 细小病毒肠炎 (CPV) - 难度2
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬细小病毒肠炎',
  2,
  '{
    "chiefComplaint": "呕吐和血便，精神萎靡",
    "physicalExam": {
      "visual": "精神沉郁，脱水征明显，眼窝凹陷",
      "auscultation": "心音较弱，肠音减弱",
      "palpation": "腹部触诊敏感，肠管充气",
      "olfaction": "粪便腥臭味明显，带血腥味"
    },
    "tpr": {
      "temp": 39.8,
      "hr": 150,
      "rr": 40,
      "mm": "苍白",
      "crt": "3秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "低",
      "lymphocytes": "显著降低",
      "hematocrit": "升高（脱水）"
    },
    "imaging": {
      "xray": "肠管扩张，液体潴留"
    }
  }'::jsonb,
  '1. 禁食禁水24-48小时\n2. 静脉输液：乳酸林格氏液，纠正脱水和电解质紊乱\n3. 止吐：马罗匹坦(Cerenia) 1mg/kg SC q24h\n4. 抗生素：头孢菌素类，预防继发感染\n5. 抗病毒血清（争议性）\n6. 营养支持：恢复后渐进式喂食',
  '犬细小病毒肠炎 (Canine Parvovirus Enteritis)'
);

-- 2. 猫瘟(泛白细胞减少症) - 难度2
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫泛白细胞减少症(猫瘟)',
  2,
  '{
    "chiefComplaint": "不吃不喝，呕吐，发热",
    "physicalExam": {
      "visual": "精神极度沉郁，蜷缩，毛发粗乱",
      "auscultation": "心音弱，呼吸浅快",
      "palpation": "腹部紧张，肠管增厚",
      "olfaction": "呕吐物酸臭"
    },
    "tpr": {
      "temp": 40.5,
      "hr": 180,
      "rr": 50,
      "mm": "潮红",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "极低(<1000)",
      "neutrophils": "显著减少",
      "platelets": "正常或略低"
    }
  }'::jsonb,
  '1. 静脉输液：纠正脱水\n2. 广谱抗生素：预防败血症\n3. 止吐药：昂丹司琼或马罗匹坦\n4. 干扰素（猫用重组干扰素）\n5. 营养支持：鼻饲或静脉营养\n6. 严格隔离，消毒环境',
  '猫泛白细胞减少症 (Feline Panleukopenia)'
);

-- 3. 猫癣(真菌感染) - 难度1
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫癣(犬小孢子菌感染)',
  1,
  '{
    "chiefComplaint": "脱毛，皮肤有圆形病灶",
    "physicalExam": {
      "visual": "面部、耳朵周围有圆形脱毛斑，边缘清晰",
      "auscultation": "正常",
      "palpation": "病灶部位皮肤增厚，有鳞屑",
      "olfaction": "轻微霉味",
      "woodsLamp": "病灶区域呈现苹果绿色荧光反应（阳性）"
    },
    "tpr": {
      "temp": 38.5,
      "hr": 160,
      "rr": 30,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "microscope": "真菌孢子和菌丝可见",
    "woodsLamp": "阳性荧光"
  }'::jsonb,
  '1. 局部治疗：抗真菌药膏（咪康唑、克霉唑）\n2. 全身治疗：伊曲康唑 5-10mg/kg PO q24h，持续4-6周\n3. 药浴：硫磺香波或咪康唑香波，每周2次\n4. 环境消毒：次氯酸钠消毒\n5. 隔离治疗，避免传播给其他动物或人',
  '猫癣 (Feline Dermatophytosis - Microsporum canis)'
);

-- 4. 犬胰腺炎 - 难度3
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '急性胰腺炎',
  3,
  '{
    "chiefComplaint": "频繁呕吐，腹痛，不愿活动",
    "physicalExam": {
      "visual": "祈祷姿势（弓背、前肢伸展），精神沉郁",
      "auscultation": "心率增快，肠音减弱",
      "palpation": "腹部前部（胃后区）明显触痛",
      "olfaction": "呕吐物酸臭"
    },
    "tpr": {
      "temp": 39.0,
      "hr": 140,
      "rr": 35,
      "mm": "粉红",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "amylase": "升高",
      "lipase": "显著升高",
      "alt": "轻度升高",
      "glucose": "正常或略低"
    },
    "cPLI": "显著升高（>400 μg/L）",
    "imaging": {
      "usg": "胰腺肿大，周围脂肪回声增强",
      "xray": "右上腹磨玻璃样阴影"
    }
  }'::jsonb,
  '1. 禁食禁水24-48小时\n2. 静脉输液：乳酸林格氏液，维持水电解质平衡\n3. 止痛：布托啡诺 0.2-0.4mg/kg IV q6-8h\n4. 止吐：马罗匹坦 1mg/kg SC q24h\n5. 营养支持：症状缓解后低脂易消化饮食\n6. 抗生素（如有继发感染）',
  '急性胰腺炎 (Acute Pancreatitis)'
);

-- 5. 猫慢性肾病 - 难度3
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '慢性肾脏病(CKD)',
  3,
  '{
    "chiefComplaint": "多饮多尿，食欲下降，消瘦",
    "physicalExam": {
      "visual": "被毛粗糙，体况评分低(BCS 2/5)，脱水",
      "auscultation": "心音正常",
      "palpation": "肾脏变小、不规则、质地硬",
      "olfaction": "口腔尿臭味"
    },
    "tpr": {
      "temp": 38.0,
      "hr": 180,
      "rr": 28,
      "mm": "苍白",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "bun": "显著升高(>40 mg/dL)",
      "creatinine": "显著升高(>2.8 mg/dL)",
      "phosphorus": "升高",
      "potassium": "正常或升高"
    },
    "cbc": {
      "hematocrit": "降低（贫血）"
    },
    "urinalysis": {
      "sg": "低(<1.030)",
      "protein": "阳性"
    },
    "imaging": {
      "usg": "肾脏缩小，皮质回声增强，皮髓质界限模糊"
    }
  }'::jsonb,
  '1. 皮下输液：补充水分，每日或隔日100-150ml\n2. 肾脏处方饮食：低蛋白、低磷\n3. 磷结合剂：碳酸铝或碳酸镧\n4. 降压药（如高血压）：氨氯地平 0.625mg PO q24h\n5. 促红细胞生成素（如贫血严重）\n6. 定期监测肾功能',
  '慢性肾脏病 IRIS 2-3期 (Chronic Kidney Disease)'
);

-- 6. 犬瘟热 - 难度4
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬瘟热',
  4,
  '{
    "chiefComplaint": "眼鼻分泌物，咳嗽，发热，后期出现神经症状",
    "physicalExam": {
      "visual": "双眼粘液脓性分泌物，鼻镜干裂，足垫增厚",
      "auscultation": "肺部湿啰音",
      "palpation": "淋巴结肿大",
      "olfaction": "呼吸道分泌物腥臭"
    },
    "tpr": {
      "temp": 40.0,
      "hr": 160,
      "rr": 45,
      "mm": "潮红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "初期降低，后期升高",
      "lymphocytes": "减少"
    },
    "imaging": {
      "xray": "间质性肺炎表现"
    },
    "cdv_test": "抗原或PCR阳性"
  }'::jsonb,
  '1. 支持疗法：静脉输液，营养支持\n2. 抗生素：控制继发细菌感染（头孢、氟苯尼考）\n3. 止咳化痰：氨溴索、溴己新\n4. 眼鼻护理：清洁分泌物，抗生素眼药水\n5. 控制神经症状：苯巴比妥（如有抽搐）\n6. 干扰素治疗（争议性）\n7. 预后谨慎，隔离治疗',
  '犬瘟热 (Canine Distemper)'
);

-- 7. 猫下泌尿道疾病(FLUTD) - 难度2
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫下泌尿道疾病-尿道堵塞',
  2,
  '{
    "chiefComplaint": "频繁进猫砂盆，无尿或仅滴尿，嚎叫",
    "physicalExam": {
      "visual": "焦虑不安，频繁舔舐外生殖器",
      "auscultation": "心音正常",
      "palpation": "膀胱极度充盈、紧张如网球",
      "olfaction": "尿液气味正常"
    },
    "tpr": {
      "temp": 37.5,
      "hr": 200,
      "rr": 35,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "bun": "升高",
      "creatinine": "升高",
      "potassium": "可能危险性升高(>6 mEq/L)"
    },
    "urinalysis": {
      "crystals": "鸟粪石或草酸钙结晶",
      "rbc": "+++",
      "protein": "++"
    }
  }'::jsonb,
  '1. 紧急导尿：解除堵塞\n2. 留置导尿管24-48小时\n3. 静脉输液：纠正脱水和电解质紊乱（特别是高钾血症）\n4. 止痛：丁丙诺啡 0.01-0.02mg/kg IV q6-8h\n5. 解痉：普鲁卡因酰胺\n6. 泌尿道处方饮食\n7. 预防复发：增加饮水，湿粮为主',
  '猫下泌尿道疾病-尿道堵塞 (Feline Urethral Obstruction)'
);

-- 8. 犬髋关节发育不良 - 难度3
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬髋关节发育不良(CHD)',
  3,
  '{
    "chiefComplaint": "后肢跛行，运动后加重，不愿跳跃",
    "physicalExam": {
      "visual": "行走时臀部摇摆，兔跳步态",
      "auscultation": "正常",
      "palpation": "髋关节活动度受限，Ortolani试验阳性，触诊有摩擦感",
      "olfaction": "正常"
    },
    "tpr": {
      "temp": 38.5,
      "hr": 110,
      "rr": 25,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "imaging": {
      "xray": "髋臼浅，股骨头覆盖不足，Norberg角<105度，关节间隙增宽，骨关节炎改变"
    }
  }'::jsonb,
  '1. 体重管理：控制肥胖，减轻关节负担\n2. 运动控制：避免剧烈运动，适度游泳\n3. 非甾体抗炎药：卡洛芬 2-4mg/kg PO q12-24h\n4. 软骨保护剂：硫酸软骨素、氨基葡萄糖\n5. 物理治疗：水疗、按摩\n6. 手术治疗（严重病例）：股骨头切除、髋关节置换\n7. 长期管理计划',
  '犬髋关节发育不良 (Canine Hip Dysplasia)'
);

COMMIT;

-- 添加说明
COMMENT ON TABLE case_templates IS '已填充8个常见兽医疾病的病例模板数据';
