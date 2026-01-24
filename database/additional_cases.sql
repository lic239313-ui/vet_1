-- 补充更多病例模板 - 增加病例多样性
-- 执行前请确保已有case_templates表

-- ============ 难度1：基础病例 ============

-- 9. 犬外耳炎 - 难度1
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬外耳炎',
  1,
  '{
    "chiefComplaint": "频繁甩头，抓挠耳朵",
    "physicalExam": {
      "visual": "耳道红肿，有黄褐色分泌物",
      "auscultation": "心肺正常",
      "palpation": "触摸耳根有疼痛反应",
      "olfaction": "耳道有酵母菌特有的发酵味"
    },
    "tpr": {
      "temp": 38.5,
      "hr": 100,
      "rr": 25,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "microscope": "耳道分泌物镜检可见马拉色菌"
  }'::jsonb,
  '1. 清洁耳道：使用耳道清洁液\n2. 抗真菌药：米糠唑耳药水，每日2次\n3. 口服抗组胺药：如有过敏\n4. 避免洗澡进水\n5. 定期清洁，预防复发',
  '犬外耳炎（马拉色菌感染）'
);

-- 10. 猫上呼吸道感染 - 难度1
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫上呼吸道感染',
  1,
  '{
    "chiefComplaint": "打喷嚏，流鼻涕，眼睛有分泌物",
    "physicalExam": {
      "visual": "双眼结膜充血，鼻孔有粘液性分泌物",
      "auscultation": "呼吸音粗糙，无明显啰音",
      "palpation": "淋巴结轻度肿大",
      "olfaction": "鼻腔分泌物略带腥味"
    },
    "tpr": {
      "temp": 39.5,
      "hr": 170,
      "rr": 35,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "正常或略高"
    }
  }'::jsonb,
  '1. 对症治疗：保持鼻腔湿润，蒸汽雾化\n2. 抗生素：预防继发感染，如多西环素\n3. 营养支持：鼓励进食，补充赖氨酸\n4. 眼药水：抗生素眼药水\n5. 隔离其他猫咪\n6. 清洁眼鼻分泌物',
  '猫上呼吸道感染综合征（猫鼻支）'
);

-- 11. 犬疫苗反应 - 难度1
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬疫苗接种反应',
  1,
  '{
    "chiefComplaint": "疫苗接种后精神沉郁，注射部位肿胀",
    "physicalExam": {
      "visual": "注射部位有乒乓球大小肿块",
      "auscultation": "心肺正常",
      "palpation": "肿块较硬，有轻微热感，触压敏感",
      "olfaction": "无异常"
    },
    "tpr": {
      "temp": 38.8,
      "hr": 110,
      "rr": 28,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "note": "临床诊断，通常不需要化验"
  }'::jsonb,
  '1. 冷敷：接种后24小时内冷敷消肿\n2. 热敷：24小时后改为热敷促进吸收\n3. 抗组胺药：氯雷他定，缓解过敏反应\n4. 观察：严重反应需糖皮质激素\n5. 记录：标注疫苗批次，下次注意\n6. 预后良好，1-2周自行消退',
  '疫苗接种局部反应'
);

-- 12. 猫消化不良 - 难度1
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫急性胃肠炎（饮食性）',
  1,
  '{
    "chiefComplaint": "呕吐，软便，食欲下降",
    "physicalExam": {
      "visual": "精神尚可，轻度脱水",
      "auscultation": "肠鸣音亢进",
      "palpation": "腹部触诊无明显疼痛",
      "olfaction": "粪便酸臭"
    },
    "tpr": {
      "temp": 38.8,
      "hr": 160,
      "rr": 30,
      "mm": "粉红",
      "crt": "1.5秒"
    }
  }'::jsonb,
  '{
    "note": "轻症不需要化验"
  }'::jsonb,
  '1. 禁食12-24小时，可少量饮水\n2. 益生菌：调节肠道菌群\n3. 止吐药：马罗匹坦 1mg/kg SC（如呕吐频繁）\n4. 渐进式恢复饮食：从易消化食物开始\n5. 观察粪便性状\n6. 预后良好',
  '急性胃肠炎（饮食不当）'
);

-- ============ 难度2：中等病例 ============

-- 13. 犬钩端螺旋体病 - 难度2
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬钩端螺旋体病',
  2,
  '{
    "chiefComplaint": "发热，黄疸，尿液深黄色",
    "physicalExam": {
      "visual": "可视黏膜黄染，精神沉郁",
      "auscultation": "心音正常",
      "palpation": "肝脾肿大，肾区触痛",
      "olfaction": "尿液浓缩味重"
    },
    "tpr": {
      "temp": 40.0,
      "hr": 140,
      "rr": 35,
      "mm": "黄染",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "升高",
      "platelets": "降低"
    },
    "chem": {
      "bilirubin": "升高",
      "alt": "升高",
      "bun": "升高",
      "creatinine": "升高"
    }
  }'::jsonb,
  '1. 抗生素：青霉素或多西环素14天\n2. 支持治疗：静脉输液，纠正电解质\n3. 护肝药：S-腺苷蛋氨酸\n4. 监测肾功能\n5. 隔离治疗（人兽共患病）\n6. 疫苗预防',
  '犬钩端螺旋体病 (Leptospirosis)'
);

-- 14. 猫甲状腺功能亢进 - 难度2
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫甲状腺功能亢进',
  2,
  '{
    "chiefComplaint": "食欲亢进但体重下降，活动增多",
    "physicalExam": {
      "visual": "消瘦，被毛粗糙，眼球突出感",
      "auscultation": "心率快，可能有心杂音",
      "palpation": "颈部可触及肿大的甲状腺",
      "olfaction": "无特殊"
    },
    "tpr": {
      "temp": 39.0,
      "hr": 220,
      "rr": 35,
      "mm": "粉红",
      "crt": "1秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "t4": "显著升高（>6 μg/dL）",
      "alt": "轻度升高"
    }
  }'::jsonb,
  '1. 抗甲状腺药物：甲巯咪唑 2.5-5mg PO q12h\n2. 监测甲状腺激素水平（2-4周后复查）\n3. 营养支持：高热量饮食\n4. 治疗继发性心脏病（如有）\n5. 长期用药监测\n6. 替代方案：放射性碘治疗、手术切除',
  '猫甲状腺功能亢进症'
);

-- 15. 犬传染性肝炎 - 难度2  
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬传染性肝炎',
  2,
  '{
    "chiefComplaint": "发热，呕吐，腹痛，眼睛浑浊",
    "physicalExam": {
      "visual": "角膜水肿（蓝眼），黄疸",
      "auscultation": "心音正常",
      "palpation": "腹部触诊疼痛，肝区敏感",
      "olfaction": "无特殊"
    },
    "tpr": {
      "temp": 40.5,
      "hr": 150,
      "rr": 38,
      "mm": "黄染",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "wbc": "降低",
      "lymphocytes": "减少"
    },
    "chem": {
      "alt": "显著升高",
      "bilirubin": "升高"
    }
  }'::jsonb,
  '1. 支持疗法：静脉输液，营养支持\n2. 护肝药：S-腺苷蛋氨酸，水飞蓟素\n3. 抗生素：预防继发感染\n4. 对症治疗：止吐、止痛\n5. 角膜水肿护理：人工泪液\n6. 疫苗预防（CAV-2）',
  '犬传染性肝炎 (Canine Infectious Hepatitis)'
);

-- ============ 难度3：进阶病例 ============

-- 16. 犬糖尿病酮症酸中毒 - 难度3
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬糖尿病酮症酸中毒',
  3,
  '{
    "chiefComplaint": "多饮多尿，呕吐，精神极度沉郁",
    "physicalExam": {
      "visual": "严重脱水，眼球凹陷",
      "auscultation": "心率快，呼吸深快（Kussmaul呼吸）",
      "palpation": "腹部紧张",
      "olfaction": "呼气有烂苹果味（丙酮味）"
    },
    "tpr": {
      "temp": 37.5,
      "hr": 160,
      "rr": 45,
      "mm": "干燥",
      "crt": "3秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "glucose": "显著升高(>250 mg/dL)",
      "potassium": "降低",
      "phosphorus": "降低"
    },
    "bloodGas": {
      "ph": "降低(<7.35)",
      "bicarbonate": "降低"
    },
    "urinalysis": {
      "glucose": "4+",
      "ketones": "强阳性"
    }
  }'::jsonb,
  '1. 紧急输液：生理盐水，快速纠正脱水\n2. 胰岛素：小剂量持续静脉输注\n3. 电解质补充：钾、磷\n4. 纠正酸中毒：碳酸氢钠（pH<7.0时）\n5. 监测血糖、电解质（每2-4小时）\n6. 治疗诱因：感染、胰腺炎等\n7. 转为皮下胰岛素维持',
  '糖尿病酮症酸中毒 (DKA)'
);

-- 17. 猫肥厚性心肌病 - 难度3
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫肥厚性心肌病',
  3,
  '{
    "chiefComplaint": "呼吸困难，运动不耐受",
    "physicalExam": {
      "visual": "张口呼吸，焦虑不安",
      "auscultation": "心率快，奔马律，可能有心杂音",
      "palpation": "正常",
      "olfaction": "无特殊"
    },
    "tpr": {
      "temp": 38.0,
      "hr": 240,
      "rr": 50,
      "mm": "苍白/发绀",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "xray": "心影增大，肺水肿",
    "usg": "左心室壁增厚(>6mm)，左房扩张",
    "ntProBNP": "显著升高"
  }'::jsonb,
  '1. 利尿剂：呋塞米 1-2mg/kg IV/IM q8-12h\n2. β受体阻滞剂：阿替洛尔 6.25-12.5mg PO q12-24h\n3. ACE抑制剂：贝那普利 0.25-0.5mg/kg PO q24h\n4. 抗血栓：氯吡格雷 18.75mg PO q24h\n5. 氧疗、减少应激\n6. 长期监测和管理',
  '猫肥厚性心肌病 (HCM)'
);

-- ============ 难度4-5：高级病例 ============

-- 18. 犬艾迪生病 - 难度4
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬艾迪生病（肾上腺皮质功能减退）',
  4,
  '{
    "chiefComplaint": "间歇性呕吐腹泻，虚弱，厌食",
    "physicalExam": {
      "visual": "精神极度沉郁，脱水，消瘦",
      "auscultation": "心率慢，心音弱",
      "palpation": "腹部无明显异常",
      "olfaction": "无特殊"
    },
    "tpr": {
      "temp": 37.0,
      "hr": 60,
      "rr": 25,
      "mm": "苍白",
      "crt": "3秒"
    }
  }'::jsonb,
  '{
    "chem": {
      "sodium": "显著降低(<140 mEq/L)",
      "potassium": "显著升高(>5.5 mEq/L)",
      "na_k_ratio": "<27",
      "glucose": "低血糖"
    },
    "acth_stimulation": "皮质醇无反应"
  }'::jsonb,
  '1. 紧急输液：生理盐水快速输注\n2. 糖皮质激素：地塞米松 0.5-2mg/kg IV\n3. 纠正高钾血症：葡萄糖+胰岛素\n4. 长期替代治疗：氟氢可的松、泼尼松\n5. 定期监测电解质\n6. 终身治疗',
  '犬艾迪生病（肾上腺皮质功能减退症）'
);

-- 19. 猫淋巴瘤 - 难度4
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '猫',
  '猫淋巴瘤',
  4,
  '{
    "chiefComplaint": "体重下降，食欲不振，可能呕吐或腹泻",
    "physicalExam": {
      "visual": "消瘦，黏膜苍白",
      "auscultation": "正常或呼吸音粗糙",
      "palpation": "肠系膜淋巴结肿大，可能有腹部肿块",
      "olfaction": "无特殊"
    },
    "tpr": {
      "temp": 38.5,
      "hr": 180,
      "rr": 32,
      "mm": "苍白",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "lymphocytes": "异常淋巴细胞",
      "hematocrit": "降低"
    },
    "imaging": {
      "xray": "纵隔肿块或腹部肿块",
      "usg": "肠壁增厚，淋巴结肿大"
    },
    "cytology": "淋巴母细胞"
  }'::jsonb,
  '1. 化疗方案：COP方案（环磷酰胺、长春新碱、泼尼松）\n2. 支持治疗：营养支持、止吐\n3. 监测血常规、肝肾功能\n4. 对症治疗：输血（如贫血）\n5. 定期复查\n6. 预后谨慎，中位生存期6-12个月',
  '猫淋巴瘤 (Feline Lymphoma)'
);

-- 20. 犬免疫介导性溶血性贫血 - 难度5
INSERT INTO case_templates (species, disease_name, difficulty, typical_symptoms, lab_patterns, treatment_guidelines, correct_diagnosis)
VALUES (
  '犬',
  '犬免疫介导性溶血性贫血(IMHA)',
  5,
  '{
    "chiefComplaint": "虚弱，黏膜苍白或黄染，深色尿液",
    "physicalExam": {
      "visual": "黏膜苍白/黄染，精神极度沉郁",
      "auscultation": "心率快，可能有心杂音",
      "palpation": "脾脏可能肿大",
      "olfaction": "尿液深红褐色"
    },
    "tpr": {
      "temp": 39.5,
      "hr": 180,
      "rr": 40,
      "mm": "苍白/黄染",
      "crt": "2秒"
    }
  }'::jsonb,
  '{
    "cbc": {
      "hematocrit": "严重降低(<20%)",
      "reticulocytes": "升高",
      "spherocytes": "可见球形红细胞"
    },
    "coombs_test": "阳性",
    "chem": {
      "bilirubin": "升高"
    },
    "urinalysis": {
      "hemoglobinuria": "阳性"
    }
  }'::jsonb,
  '1. 免疫抑制：泼尼松 2mg/kg PO q12h\n2. 第二线免疫抑制：硫唑嘌呤或环孢素\n3. 输血：如PCV<15%\n4. 抗血栓：氯吡格雷或低分子肝素\n5. 支持治疗：静脉输液\n6. 监测血常规（每日）\n7. 逐渐减量免疫抑制剂\n8. 预后谨慎，需长期管理',
  '免疫介导性溶血性贫血 (IMHA)'
);

COMMIT;

-- 查看所有病例分布
SELECT 
  difficulty,
  COUNT(*) as count,
  string_agg(disease_name, ', ' ORDER BY disease_name) as diseases
FROM case_templates
GROUP BY difficulty
ORDER BY difficulty;
