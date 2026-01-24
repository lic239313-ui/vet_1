-- 从disease.txt转换的题目数据
-- 生成时间：2026-01-21

-- 题目 1
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《中华人民共和国动物防疫法》,应当定期开展动物疫病检测的动物是',
    '["A.商品猪", "B.肉鸡", "C.肉牛", "D.奶牛", "E.肉羊"]',
    '3',
    '根据《动物防疫法》，奶牛属重点监测动物（乳用动物），需定期检测疫病。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 2
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '《中华人民共和国动物防疫法》规定，经检疫不合格的动物，动物产品按规定处理后，处理费用的承担主体是',
    '["A.动物疫病预防控制机构", "B.农业农村主管部门", "C.无害化处理场", "D.动物卫生监督机构", "E.货主"]',
    '4',
    '检疫不合格动物/产品的处理费用由货主承担（《动物防疫法》第48条）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 3
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《重大动物疫情应急条例》,重大动物疫情应急工作应当坚持的方针不包括',
    '["A.加强领导", "B.强制免疫", "C.群防群控", "D.果断处置", "E.依靠科学"]',
    '1',
    '重大动物疫情方针为加强领导、密切配合、依靠科学、依法防治、群防群控、果断处置，强制免疫属于日常防控措施。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 4
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '《动物防疫条件审查办法》规定，应当设置兽医室的场所是',
    '["A.动物和动物产品无害化处理场所", "B.动物隔离场所", "C.活禽交易市场", "D.屠宰加工场所", "E.经营动物产品的集贸市场"]',
    '1',
    '《动物防疫条件审查办法》规定隔离场所需设兽医室。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 5
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '《动物检疫管理办法》规定，可以随时申报检疫的情形是',
    '["A.屠宰动物的", "B.急宰动物的", "C.出售动物的", "D.运输动物的", "E.向无规定动物疫病区输入相关易感动物的"]',
    '4',
    '跨疫区调运需随时申报检疫（其他情形通常为产地检疫或指定通道申报）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 6
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《执业兽医和乡村兽医管理办法》。执业兽医在动物诊疗活动中怀疑动物患有口蹄疫时，下述行为不正确的是',
    '["A.采取隔离措施", "B.向农业农村主管部门报告", "C.向动物疫病预防控制机构报告", "D.采取消毒措施", "E.及时治疗"]',
    '4',
    '怀疑口蹄疫时严禁治疗（属一类疫病，需立即上报并采取隔离、扑杀等措施）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 7
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《动物诊疗机构管理办法》,不符合动物诊疗机构设立条件的是',
    '["A.有完善的情报告、消毒、兽药处方等管理制度", "B.动物诊疗场所选址距离备禽养殖场所150米", "C.动物诊疗场所设有独立的出入口", "D.有固定的动物诊疗场所", "E.具有布局合理的诊疗室、隔离室、药房等设施"]',
    '1',
    '规定距离应为200米以上（《动物诊疗机构管理办法》第9条）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 8
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽医处方格式及应用规范》,关于兽医处方书写要求表述不正确的是',
    '["A.兽药数量用阿拉伯数字书写", "B.动物基本信息、临床诊断情况应当填写清晰、完整，并与病历记载一致", "C.兽药剂量用阿拉伯数字书写", "D.可自行编制兽药缩写名或者使用代号", "E.兽用中药自拟方以剂为单位"]',
    '3',
    '兽医处方必须使用通用名，禁止缩写或代号（《兽医处方格式及应用规范》）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 9
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '《病死畜禽和病害畜禽产品无害化处理管理办法》规定，在江河、湖泊、水库等水域发现的死亡畜禽，负责组织收集、处理并溯源的主体是',
    '["A.所在地县级人民政府", "B.所在地县级人民政府农业农村主管部门", "C.所在地乡级人民政府", "D.所在地动物卫生监督机构", "E.所在地动物疫病预防控制机构"]',
    '0',
    '水域死亡畜禽由县级政府组织收集处理（《病死畜禽无害化处理管理办法》）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 10
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '《病死及病害动物无害化处理技术规范》规定，不得采用化制法进行无害化处理的病死动物是',
    '["A.患有口蹄疫的", "B.患有牛海绵状脑病的", "C.患有魏氏梭菌病的", "D.患有小反刍兽疫的", "E.患有蓝舌病的"]',
    '1',
    '疯牛病（BSE）病原耐受化制法，需销毁处理。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 11
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '属于《一、二、三类动物疫病病种名录》所列的一类动物疫病是',
    '["A.病毒性神经坏死病", "B.淡水鱼细菌性败血症", "C.三代虫病", "D.刺激隐核虫病", "E.尼帕病毒性脑炎"]',
    '4',
    '一类疫病包括口蹄疫、非洲猪瘟等，尼帕病毒属人畜共患一类病。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 12
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《人畜共患传染病名录》,不属于人畜共患传染病的是',
    '["A.炭疽", "B.猪瘟", "C.狂犬病", "D.高致病性禽流感", "E.类鼻疽"]',
    '1',
    '猪瘟虽为重要疫病，但不属于人畜共患病。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 13
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽药管理条例》,关于兽药使用的表述不正确的是',
    '["A.禁止使用劣兽药", "B.禁止在饲料和动物饮用水中添加激素类药品", "C.禁止将有休药期规定的兽药用于食用动物", "D.禁止使用假兽药", "E.禁止将人用药品用于动物"]',
    '2',
    '休药期规定针对食用动物，目的是避免药物残留，而非禁止使用，而是规范停药时间。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 14
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽药经营质量管理规范》,兽药经营企业必须建立兽药质量管理档案，其内容不包括',
    '["A.产品质量档案", "B.财务档案", "C.供应商顾量评估档案", "D.培训档案", "E.进货及销售凭证"]',
    '1',
    '质量管理档案包括产品、供应商、培训、凭证等，不含财务记录。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 15
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽用处方药和非处方药管理办法》,兽处方笺应当载明的事项不包括',
    '["A.动物种类", "B.动物品种", "C.诊断结果", "D.畜主姓名", "E.兽药通用名称"]',
    '1',
    '处方笺需载明动物种类、诊断结果、畜主信息等，但动物品种非强制项。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 16
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽用处方药品种目录(第一批》,下列不属于兽用处方药的是',
    '["A.甲苯咪唑溶液(水产用)", "B.阿维菌素注射液", "C.精制敌百虫粉(水产用)", "D.地克珠利预混剂(水产用)", "E.碘硝酚注射液"]',
    '2',
    '敌百虫为非处方驱虫药。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 17
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《兽药标签和说明书管理办法》,下列不属于兽用抗生素产品复方制剂说明书必须注明的内容是',
    '["A.药理作用", "B.半衰期", "C.不良反应", "D.对环境有毒有害的废弃包装的处理措施", "E.用法与用量"]',
    '1',
    '复方制剂说明书需注明药理作用、不良反应、废弃物处理等，半衰期非常规必标项。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 18
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《食品动物中禁止使用的药品及其他化合物清单》,食品动物禁用的药品或其他化合物是',
    '["A.青霉素", "B.氯霉素", "C.磺胺嘧啶", "D.粘杆菌素", "E.多西环素"]',
    '1',
    '氯霉素属于食品动物中禁止使用的药品。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 19
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《食品动物中禁止使用的药品及其他化合物清单》,食品动物禁用的药品或其他化合物不包括',
    '["A.呋喃西林", "B.咖啡因", "C.己二烯雌酚", "D.锥虫胂胺", "E.孔雀石绿"]',
    '1',
    '清单禁用物质包括呋喃类、孔雀石绿等，咖啡因未被列入。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 20
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '根据《食品动物中禁止使用的药品及其他化合物清单》,食品动物禁用的药品或其他化合物不包括',
    '["A.呋喃西林", "B.咖啡因", "C.己二烯雌酚", "D.锥虫胂胺", "E.孔雀石绿"]',
    '0',
    '呋喃西林属于清单内禁用的药品。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 21
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '牛颈神经有几对',
    '["A.5", "B.6", "C.8", "D.13", "E.18"]',
    '1',
    '牛颈部神经为第1-6颈神经（共6对）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 22
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '动物体内最大的消化腺是',
    '["A.十二指肠腺", "B.食管腺", "C.肝", "D.小肠腺", "E.胃腺"]',
    '2',
    '肝脏是动物体内最大消化腺。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 23
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '属于结缔绒毛膜胎盘',
    '["A.牛", "B.猪", "C.马", "D.犬", "E.猫"]',
    '0',
    '牛为结缔绒毛膜胎盘，猪为上皮绒毛膜胎盘。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 24
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '呼吸道黏膜上皮的纤毛运动属于',
    '["A.吞噬", "B.溶解", "C.排除", "D.解毒", "E.杀菌"]',
    '2',
    '纤毛运动通过摆动排除异物。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 25
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '动物细胞中决定皮肤颜色的细胞',
    '["A.朗格汉斯细胞", "B.角质形成细胞", "C.黑素细胞", "D.梅克尔细胞", "E.皮肤干细胞"]',
    '2',
    '黑素细胞合成黑色素，决定皮肤和毛发颜色。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 26
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '骨骼肌光镜下明显可见的',
    '["A.纵纹", "B.横纹", "C.虎斑纹", "D.纹状缘", "E.刷状缘"]',
    '1',
    '骨骼肌光镜下可见明暗相间的横纹。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 27
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '淋巴结浅层皮质中的主要淋巴细胞是',
    '["A.NK细胞", "B.树突细胞", "C.K细胞", "D.B淋巴细胞", "E.T淋巴细胞"]',
    '3',
    '淋巴结浅层皮质主要为B细胞分布区。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 28
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '分泌雄性激素的细胞',
    '["A.睾丸间质细胞", "B.支持细胞", "C.精子", "D.精原细胞", "E.精子细胞"]',
    '0',
    '睾丸间质细胞分泌雄激素。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 29
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '家禽进行气体交换的肺部结构是什么',
    '["A.初级支气管", "B.次级支气管", "C.三级支气管", "D.肺毛细管", "E.小支气管"]',
    '1',
    '家禽气体交换在次级支气管分支构成的微气管内进行。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 30
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '鼻腔呼吸区的黏膜上皮是',
    '["A.单层柱状上皮", "B.单层立方上皮", "C.变移上皮", "D.假复层纤毛柱状上皮", "E.复层柱状上皮"]',
    '3',
    '鼻腔呼吸区黏膜上皮为假复层纤毛柱状上皮。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 31
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '小肠壁的最外层是',
    '["A.肌层", "B.浆膜层", "C.纤维层", "D.黏膜层", "E.黏膜下层"]',
    '1',
    '小肠壁由内向外依次为黏膜层、黏膜下层、肌层、浆膜层。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 32
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '图中机构1是',
    '[]',
    '3',
    '图中机构1代表棘突。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 33
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '图中结构2是',
    '[]',
    '4',
    '图中结构2代表横突。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 34
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '图中结构3是',
    '[]',
    '2',
    '图中结构3代表锥孔。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 35
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '中动脉内膜与中膜的分界线',
    '["A.内皮下层", "B.微丝", "C.中弹性膜", "D.内弹性膜", "E.外弹性膜"]',
    '3',
    '中动脉内膜与中膜的分界线为内弹性膜。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 36
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '食管腺位于',
    '["A.肌层", "B.黏膜下层", "C.外膜", "D.黏膜固有层", "E.黏膜肌层"]',
    '1',
    '食管腺分布于食管的黏膜下层。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 37
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '肾上腺中细胞排列成条束状的区域是',
    '["A.网状带", "B.束状带", "C.多形带", "D.球状带", "E.中间带"]',
    '1',
    '肾上腺皮质束状带细胞排列成条索状，分泌糖皮质激素。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 38
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '下列骨骼中具有髋臼的是',
    '["A.跖骨", "B.跗骨", "C.骨盆骨", "D.髌骨", "E.股骨"]',
    '2',
    '髋臼由髂骨、坐骨和耻骨三者交汇形成，属于骨盆骨结构。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 39
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '机体受到寒冷刺激时会发生',
    '["A.代谢降低", "B.产热波少", "C.竖毛肌舒张", "D.皮肤血管收缩", "E.交感神经抑制"]',
    '3',
    '寒冷时通过交感神经兴奋使皮肤血管收缩，以减少散热。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 40
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '调节躯体运动最基本的反射中枢是',
    '["A.小脑", "B.脊髓", "C.大脑皮层", "D.脑干", "E.基底神经节"]',
    '1',
    '脊髓是完成运动反射最基本、最低级的中枢。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 41
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '与瘤胃内微生物活动无关的是',
    '["A.皱胃容积", "B.瘤胃的厌氧环境", "C.瘤胃的营养环境", "D.瘤胃温度", "E.瘤胃PH值"]',
    '0',
    '瘤胃微生物活动依赖其特定的厌氧环境、营养、温度和pH值，与皱胃容积无关。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 42
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '哺乳动物心脏的起搏点位于',
    '["A.房室结", "B.心房", "C.静脉窦", "D.心室", "E.窦房结"]',
    '4',
    '哺乳动物心脏的正常起搏点是窦房结。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 43
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '介导DG-PKC途径的信号分子是',
    '["A.孕激素", "B.胰岛素", "C.生长激素", "D.胰高血糖素", "E.心钠素"]',
    '1',
    'DG-PKC（二酰甘油-蛋白激酶C）途径主要由胰岛素等信号分子介导。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 44
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '胰岛A细胞分泌什么激素',
    '["A.胰岛素", "B.胰高血糖素", "C.胰多肽", "D.生长抑制素", "E.血管活性肠肽"]',
    '1',
    '胰岛A细胞分泌胰高血糖素，胰岛B细胞分泌胰岛素。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 45
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '溶菌酶主要功能是破坏细菌的什么',
    '["A.膜蛋白", "B.膜脂", "C.细胞壁", "D.鞭毛", "E.荚膜"]',
    '2',
    '溶菌酶能水解细菌细胞壁的肽聚糖，导致细菌裂解。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 46
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '不属于激素的是',
    '["A.肾素", "B.甲状旁腺素", "C.脑肠肽", "D.降钙素", "E.醛固酮"]',
    '2',
    '脑肠肽属于神经肽类，其余选项均为经典激素。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 47
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '抑制乳汁分泌的卵巢的激素是？',
    '["A.醛固酮", "B.皮质素", "C.孕酮", "D.雌激素", "E.催产素"]',
    '3',
    '高浓度的雌激素可以抑制乳汁的分泌。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 48
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '不参与构成肾小球有效滤过压的是',
    '["A.肾小球毛细血管血压", "B.囊内压", "C.囊内液胶体渗透压", "D.血浆胶体渗透压", "E.血浆晶体渗透压"]',
    '4',
    '有效滤过压=毛细血管血压-（囊内压+血浆胶体渗透压），不含晶体渗透压。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 49
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '心室肌细胞的特点是',
    '[]',
    '0',
    '心室肌细胞动作电位具有明显的平台期（2期）。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

-- 题目 50
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    'single',
    '细胞膜动作电位向膜内负压减小的时期',
    '[]',
    '3',
    '细胞膜去极化是指膜内负压向减小方向变化的过程。',
    '基础兽医学',
    3,
    2023,
    TRUE
);

