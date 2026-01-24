// 本地题库数据
export interface ExamQuestion {
    id: string;
    question_type: 'single' | 'multiple';
    stem: string;
    options: string[];
    correct_answer: number | number[];
    explanation: string;
    subject: string;
    exam_year?: number;
}

export const examQuestionsData: ExamQuestion[] = [
    // 基础兽医学
    {
        id: 'q1',
        question_type: 'single',
        stem: '猫的正常体温范围是',
        options: ['A. 37.5-38.5℃', 'B. 38.0-39.0℃', 'C. 38.0-39.5℃', 'D. 39.0-40.0℃'],
        correct_answer: 2,
        explanation: '猫的正常体温范围为38.0-39.5℃，略高于犬（37.5-39.0℃）。',
        subject: '基础',
        exam_year: 2022
    },
    {
        id: 'q2',
        question_type: 'single',
        stem: '犬的正常心率范围是',
        options: ['A. 60-80次/分', 'B. 80-120次/分', 'C. 120-160次/分', 'D. 160-200次/分'],
        correct_answer: 1,
        explanation: '犬的正常心率为80-120次/分，小型犬心率较快，大型犬较慢。',
        subject: '基础',
        exam_year: 2023
    },
    {
        id: 'q3',
        question_type: 'single',
        stem: '下列哪种动物属于单胃动物',
        options: ['A. 牛', 'B. 羊', 'C. 犬', 'D. 马'],
        correct_answer: 2,
        explanation: '犬属于单胃动物，而牛、羊属于反刍动物，马属于单胃但消化特殊。',
        subject: '基础',
        exam_year: 2022
    },

    // 预防兽医学
    {
        id: 'q4',
        question_type: 'single',
        stem: '犬瘟热病毒主要侵害的系统是',
        options: ['A. 消化系统', 'B. 呼吸系统和神经系统', 'C. 泌尿系统', 'D. 生殖系统'],
        correct_answer: 1,
        explanation: '犬瘟热病毒主要侵害呼吸系统和神经系统，临床表现为双相热、呼吸道症状和神经症状。',
        subject: '预防',
        exam_year: 2023
    },
    {
        id: 'q5',
        question_type: 'single',
        stem: '犬细小病毒感染的潜伏期一般为',
        options: ['A. 1-3天', 'B. 3-7天', 'C. 7-14天', 'D. 14-21天'],
        correct_answer: 1,
        explanation: '犬细小病毒的潜伏期一般为3-7天，临床症状包括呕吐、腹泻、血便等。',
        subject: '预防',
        exam_year: 2022
    },
    {
        id: 'q6',
        question_type: 'multiple',
        stem: '以下哪些症状是猫泛白细胞减少症的典型表现？（多选）',
        options: ['A. 高热', 'B. 呕吐', 'C. 腹泻', 'D. 白细胞显著减少', 'E. 黄疸'],
        correct_answer: [0, 1, 2, 3],
        explanation: '猫泛白细胞减少症（猫瘟）的典型症状包括高热、呕吐、腹泻和白细胞显著减少。黄疸不是该病的典型症状。',
        subject: '预防',
        exam_year: 2023
    },
    {
        id: 'q7',
        question_type: 'single',
        stem: '狂犬病的主要传播途径是',
        options: ['A. 空气传播', 'B. 血液传播', 'C. 咬伤传播', 'D. 粪便传播'],
        correct_answer: 2,
        explanation: '狂犬病主要通过患病动物咬伤传播，病毒存在于唾液中。',
        subject: '预防',
        exam_year: 2023
    },

    // 临床兽医学
    {
        id: 'q8',
        question_type: 'single',
        stem: '进行犬猫绝育手术前，禁食禁水的时间一般为',
        options: ['A. 禁食4小时，禁水2小时', 'B. 禁食8小时，禁水4小时', 'C. 禁食12小时，禁水6小时', 'D. 禁食24小时，禁水12小时'],
        correct_answer: 1,
        explanation: '为防止麻醉过程中呕吐和误吸，一般建议禁食8小时，禁水4小时。',
        subject: '临床',
        exam_year: 2023
    },
    {
        id: 'q9',
        question_type: 'single',
        stem: '犬髋关节发育不良最常见于哪类犬种',
        options: ['A. 小型犬', 'B. 中型犬', 'C. 大型犬', 'D. 所有犬种发病率相同'],
        correct_answer: 2,
        explanation: '髋关节发育不良最常见于大型犬，如德国牧羊犬、拉布拉多等，与遗传和快速生长有关。',
        subject: '临床',
        exam_year: 2022
    },
    {
        id: 'q10',
        question_type: 'multiple',
        stem: '犬急性肾衰竭的常见临床表现包括（多选）',
        options: ['A. 少尿或无尿', 'B. 呕吐', 'C. 食欲废绝', 'D. 血尿素氮升高', 'E. 低血钾'],
        correct_answer: [0, 1, 2, 3],
        explanation: '急性肾衰竭表现为少尿/无尿、呕吐、食欲废绝、氮质血症(BUN升高)，通常伴随高血钾。',
        subject: '临床',
        exam_year: 2023
    },

    // 综合应用
    {
        id: 'q11',
        question_type: 'single',
        stem: '宠物医院的医疗废物应如何处理',
        options: ['A. 与生活垃圾一起处理', 'B. 分类收集后交由专业机构处理', 'C. 焚烧处理', 'D. 掩埋处理'],
        correct_answer: 1,
        explanation: '医疗废物属于危险废物，必须分类收集并交由有资质的专业机构处理，不能随意处置。',
        subject: '综合',
        exam_year: 2023
    },
    {
        id: 'q12',
        question_type: 'single',
        stem: '执业兽医师的执业范围由谁核定',
        options: ['A. 动物诊疗机构', 'B. 县级以上地方人民政府兽医主管部门', 'C. 省级兽医主管部门', 'D. 农业农村部'],
        correct_answer: 1,
        explanation: '根据《执业兽医管理办法》，执业兽医师的执业范围由县级以上地方人民政府兽医主管部门核定。',
        subject: '综合',
        exam_year: 2022
    },
    {
        id: 'q13',
        question_type: 'multiple',
        stem: '动物诊疗机构应当具备的基本条件包括（多选）',
        options: ['A. 与动物诊疗活动相适应的场所', 'B. 与动物诊疗活动相适应的设备', 'C. 具有兽医师以上专业技术职称的人员', 'D. 完善的管理制度', 'E. 必须是独栋建筑'],
        correct_answer: [0, 1, 2, 3],
        explanation: '动物诊疗机构需要具备适应的场所、设备、专业人员和管理制度，不要求独栋建筑。',
        subject: '综合',
        exam_year: 2023
    },
    {
        id: 'q14',
        question_type: 'single',
        stem: '犬注射狂犬疫苗的首次免疫年龄一般为',
        options: ['A. 1月龄', 'B. 2月龄', 'C. 3月龄', 'D. 6月龄'],
        correct_answer: 2,
        explanation: '犬首次狂犬疫苗免疫一般在3月龄进行，之后每年加强免疫一次。',
        subject: '综合',
        exam_year: 2022
    },
    {
        id: 'q15',
        question_type: 'single',
        stem: '兽药处方药只能凭谁的处方购买',
        options: ['A. 执业兽医师', 'B. 执业助理兽医师', 'C. 乡村兽医', 'D. 以上都可以'],
        correct_answer: 0,
        explanation: '根据《兽药管理条例》，处方药只能凭执业兽医师的处方购买和使用。',
        subject: '综合',
        exam_year: 2023
    }
];

// 随机抽取题目的工具函数
export function getRandomQuestions(count: number, subject?: string): ExamQuestion[] {
    // 先筛选
    let filteredQuestions = examQuestionsData;

    if (subject) {
        filteredQuestions = examQuestionsData.filter(q => q.subject === subject);
    }

    // 打乱数组
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);

    // 返回指定数量
    return shuffled.slice(0, Math.min(count, shuffled.length));
}
