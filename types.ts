export enum GameView {
  CLINIC = 'CLINIC',
  MANAGEMENT = 'MANAGEMENT',
  ACADEMY = 'ACADEMY',
  PROFILE = 'PROFILE'
}

export enum Rank {
  STUDENT = '兽医学生',
  INTERN = '实习医生',
  RESIDENT = '住院医师',
  SPECIALIST = '专科医师',
  CHIEF = '主任医师'
}

export enum SOAPStage {
  SUBJECTIVE = 'S - 主诉问诊',
  OBJECTIVE = 'O - 检查数据',
  ASSESSMENT = 'A - 鉴别诊断',
  PLAN = 'P - 治疗方案'
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  cost: number;
  incomeMultiplier: number;
  owned: boolean;
  icon: string;
  unlocksParams: string[]; // List of specific data keys this unlocks (e.g., 'cbc', 'xray')
}

export interface LabResultItem {
  name: string;
  value: string | number;
  unit: string;
  refRange: string;
  flag?: 'H' | 'L' | 'N'; // High, Low, Normal
}

export interface DialoguePair {
  question: string; // The question the player can ask
  answer: string;   // The response from the owner (based on persona)
  topic: string;    // e.g. "Diet", "Duration", "Vaccination"
}

export interface ClinicalCase {
  id: string;
  // Signalment
  species: string;
  breed: string;
  age: string;
  sex: string;
  weightKg: number;

  // Subjective (Hidden initially)
  ownerPersona: string; // e.g., "Anxious", "Dismissive"
  chiefComplaint: string;
  historySecret: string; // Info only revealed if asked correctly
  dialogue: DialoguePair[]; // The available dialogue tree

  // Objective (Raw Data)
  physicalExam: {
    visual: string;      // 视诊：精神、姿态、被毛
    auscultation: string;// 听诊：心音、呼吸音
    palpation: string;   // 触诊：腹部、淋巴结、骨骼
    olfaction: string;   // 嗅诊：口臭、体味、排泄物气味
    woodsLamp?: string;  // 伍德氏灯：真菌荧光反应
  };

  tpr: {
    temp: number;
    hr: number;
    rr: number;
    mm: string; // Mucous Membranes
    crt: string; // Capillary Refill Time
    bp?: string; // Blood Pressure (e.g. 120/80)
  };

  // New summary fields (optimized for faster generation)
  cbcSummary?: string;   // 血常规概述，如 "WBC 25.0↑，HCT 35%，PLT正常"
  chemSummary?: string;  // 生化概述，如 "ALT 180↑，BUN/CREA正常"
  xraySummary?: string;  // X光概述

  // Legacy array fields (kept for backward compatibility)
  cbc?: LabResultItem[]; // Complete Blood Count
  chem?: LabResultItem[]; // Biochemistry
  bloodGas?: LabResultItem[]; // Blood Gas Analysis
  imaging?: {
    xrayDescription?: string;
    usgDescription?: string;
  };

  // Assessment Logic
  difficulty: number;

  // Adaptive Diagnosis - Multiple Choice Options (for lower ranks)
  diagnosisOptions?: DiagnosisOption[];  // 4-6 options based on rank
  treatmentOptions?: TreatmentOption[];  // 2-3 options based on rank
  correctDiagnosis?: string;             // The correct diagnosis for evaluation
  correctTreatment?: string;             // The correct treatment for evaluation
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  correctDiagnosis: string;
  standardOfCare: string; // The textbook "Gold Standard" plan
}

export interface CaseHistoryItem {
  id: string;
  timestamp: number;
  caseData: ClinicalCase;
  result: EvaluationResult;
  userDiagnosis: string;
  userPlan: string;
}

// 题目类型枚举
export enum QuestionType {
  SINGLE = 'single',      // 单选题
  MULTIPLE = 'multiple',  // 多选题
  SHARED_STEM = 'shared_stem' // 共用题干
}

// 执业兽医考试题目接口
export interface VetExamQuestion {
  id: string;
  questionType: QuestionType;
  stem: string;
  isSharedStem: boolean;
  sharedStemId?: string;
  options: string[];
  correctAnswer: number | number[]; // 单选为数字，多选为数组
  explanation: string;
  subject: string;
  difficulty: number;
  examYear?: number;
}

// 共用题干题组
export interface SharedStemQuestionGroup {
  stemQuestion: VetExamQuestion; // 题干
  subQuestions: VetExamQuestion[]; // 子题
}

// 保留旧接口用于向后兼容
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ============== Adaptive Diagnosis Types ==============

export interface DiagnosisOption {
  id: string;
  text: string;        // 诊断选项文本
  isCorrect: boolean;  // 是否正确
}

export interface TreatmentOption {
  id: string;
  description: string; // 治疗方案描述
  isCorrect: boolean;
}

// ============== Talent Tree Types ==============

export type TalentBranch = 'clinical' | 'management' | 'academic';

export interface TalentEffect {
  type: 'xp_bonus' | 'money_bonus' | 'rep_bonus' | 'hint' | 'tolerance' | 'unlock' | 'tip_bonus';
  value: number;          // 加成百分比或固定值
  condition?: string;     // 触发条件 (如 'score>=90')
}

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  branch: TalentBranch;
  tier: number;           // 1-5
  cost: number;           // 技能点消耗
  unlocked: boolean;
  prerequisite?: string;  // 前置技能 ID
  effect: TalentEffect;
}

// ============== Milestone Tracking ==============

export interface MilestoneProgress {
  totalCured: number;           // 里程碑: 治愈病例数
  perfectScores: number;        // 满分诊断次数
  curedMilestones: number[];    // 已达成的治愈里程碑 [10, 25, 50, 100]
  perfectMilestones: number[];  // 已达成的满分里程碑 [5, 10, 20]
}

// ============== Game State ==============

export interface GameState {
  money: number;
  reputation: number;
  experience: number;
  rank: Rank;
  energy: number;
  maxEnergy: number;
  inventory: Equipment[];
  totalPatientsTreated: number;
  caseHistory: CaseHistoryItem[];

  // New: Talent System
  skillPoints: number;
  talents: TalentNode[];
  milestones: MilestoneProgress;
}

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'basic_kit',
    name: '基础诊疗包',
    description: '含听诊器、体温计。解锁TPR数据。',
    cost: 0,
    incomeMultiplier: 1.0,
    owned: true,
    icon: '🩺',
    unlocksParams: ['tpr']
  },
  {
    id: 'woods_lamp',
    name: '伍德氏灯',
    description: '检测猫癣（犬小孢子菌）等真菌感染。',
    cost: 500,
    incomeMultiplier: 1.05,
    owned: false,
    icon: '🔦',
    unlocksParams: ['woodsLamp']
  },
  {
    id: 'ophthalmoscope',
    name: '检眼镜套装',
    description: '专业的眼科检查设备，用于观察眼底病变。',
    cost: 800,
    incomeMultiplier: 1.1,
    owned: false,
    icon: '👁️',
    unlocksParams: ['eye_exam']
  },
  {
    id: 'microscope',
    name: '高倍显微镜',
    description: '用于皮肤刮片、耳道分泌物及细胞学检查。',
    cost: 1200,
    incomeMultiplier: 1.15,
    owned: false,
    icon: '🔬',
    unlocksParams: ['microscope']
  },
  {
    id: 'bp_monitor',
    name: '多普勒血压计',
    description: '测量收缩压，评估休克或高血压风险。',
    cost: 1500,
    incomeMultiplier: 1.15,
    owned: false,
    icon: '💓',
    unlocksParams: ['bp']
  },
  {
    id: 'hematology',
    name: '全自动血球仪',
    description: '检测白细胞、红细胞、血小板。判断感染/贫血。',
    cost: 2500,
    incomeMultiplier: 1.25,
    owned: false,
    icon: '🩸',
    unlocksParams: ['cbc']
  },
  {
    id: 'biochem',
    name: '生化分析仪',
    description: '检测肝肾功能、血糖、蛋白离子。',
    cost: 3800,
    incomeMultiplier: 1.35,
    owned: false,
    icon: '🧪',
    unlocksParams: ['chem']
  },
  {
    id: 'dental_unit',
    name: '牙科工作站',
    description: '超声洁牙与抛光，治疗牙周疾病。',
    cost: 5500,
    incomeMultiplier: 1.4,
    owned: false,
    icon: '🦷',
    unlocksParams: ['dental']
  },
  {
    id: 'blood_gas',
    name: '血气分析仪',
    description: '检测 pH、电解质、血氧，用于急救与麻醉监护。',
    cost: 6000,
    incomeMultiplier: 1.45,
    owned: false,
    icon: '📊',
    unlocksParams: ['bloodGas']
  },
  {
    id: 'xray_digital',
    name: 'DR 数字X光机',
    description: '高清晰度骨骼与胸腹影像。',
    cost: 8500,
    incomeMultiplier: 1.5,
    owned: false,
    icon: '🦴',
    unlocksParams: ['xray']
  },
  {
    id: 'usg_doppler',
    name: '多普勒彩超',
    description: '腹腔器官结构与血流评估。',
    cost: 15000,
    incomeMultiplier: 1.8,
    owned: false,
    icon: '🖥️',
    unlocksParams: ['usg']
  },
  {
    id: 'endoscope',
    name: '电子内窥镜',
    description: '用于食道、胃肠异物取出及微创检查。',
    cost: 22000,
    incomeMultiplier: 2.0,
    owned: false,
    icon: '🔦',
    unlocksParams: ['endo']
  },
  {
    id: 'ct_scan',
    name: '兽用 CT',
    description: '顶级影像设备，用于神经学与复杂骨科诊断。',
    cost: 150000,
    incomeMultiplier: 3.0,
    owned: false,
    icon: '☢️',
    unlocksParams: ['ct']
  }
];

export const RANK_THRESHOLDS = {
  [Rank.STUDENT]: 0,
  [Rank.INTERN]: 500,
  [Rank.RESIDENT]: 2000,
  [Rank.SPECIALIST]: 5000,
  [Rank.CHIEF]: 15000,
};

// Skill Point acquisition milestones
export const CURE_MILESTONES = [10, 25, 50, 100];
export const PERFECT_MILESTONES = [5, 10, 20];

export const INITIAL_TALENTS: TalentNode[] = [
  // ============== Clinical Branch ==============
  {
    id: 'clinical_t1_observation',
    name: '敏锐观察',
    description: '检查时自动高亮异常关键词',
    branch: 'clinical',
    tier: 1,
    cost: 1,
    unlocked: false,
    effect: { type: 'hint', value: 1 }
  },
  {
    id: 'clinical_t4_healing',
    name: '妙手回春',
    description: '治疗评分容错 +10%',
    branch: 'clinical',
    tier: 4,
    cost: 3,
    unlocked: false,
    prerequisite: 'clinical_t1_observation',
    effect: { type: 'tolerance', value: 10 }
  },
  {
    id: 'clinical_t5_specialist',
    name: '专科圣手',
    description: '解锁疑难杂症 (XP ×2)',
    branch: 'clinical',
    tier: 5,
    cost: 5,
    unlocked: false,
    prerequisite: 'clinical_t4_healing',
    effect: { type: 'unlock', value: 2 }
  },

  // ============== Management Branch ==============
  {
    id: 'mgmt_t1_affinity',
    name: '亲和力',
    description: '诊断准确率 ≥90% 时获得小费 (+10% 诊费)',
    branch: 'management',
    tier: 1,
    cost: 1,
    unlocked: false,
    effect: { type: 'tip_bonus', value: 10, condition: 'score>=90' }
  },
  {
    id: 'mgmt_t3_negotiation',
    name: '商业谈判',
    description: '设备价格 -10%',
    branch: 'management',
    tier: 3,
    cost: 3,
    unlocked: false,
    prerequisite: 'mgmt_t1_affinity',
    effect: { type: 'money_bonus', value: -10 }
  },
  {
    id: 'mgmt_t4_starDirector',
    name: '明星院长',
    description: '声望获取 +20%',
    branch: 'management',
    tier: 4,
    cost: 3,
    unlocked: false,
    prerequisite: 'mgmt_t3_negotiation',
    effect: { type: 'rep_bonus', value: 20 }
  },
  {
    id: 'mgmt_t5_franchise',
    name: '连锁巨头',
    description: '解锁分院系统',
    branch: 'management',
    tier: 5,
    cost: 5,
    unlocked: false,
    prerequisite: 'mgmt_t4_starDirector',
    effect: { type: 'unlock', value: 1 }
  },

  // ============== Academic Branch ==============
  {
    id: 'academic_t1_scholar',
    name: '学霸',
    description: 'XP 获取 +10%',
    branch: 'academic',
    tier: 1,
    cost: 1,
    unlocked: false,
    effect: { type: 'xp_bonus', value: 10 }
  },
  {
    id: 'academic_t2_research',
    name: '文献检索',
    description: '消耗精力获取疾病类别提示',
    branch: 'academic',
    tier: 2,
    cost: 2,
    unlocked: false,
    prerequisite: 'academic_t1_scholar',
    effect: { type: 'hint', value: 1 }
  },
  {
    id: 'academic_t3_teaching',
    name: '教学相长',
    description: '助手经验 +50%',
    branch: 'academic',
    tier: 3,
    cost: 3,
    unlocked: false,
    prerequisite: 'academic_t2_research',
    effect: { type: 'xp_bonus', value: 50 }
  }
];

export const INITIAL_MILESTONES: MilestoneProgress = {
  totalCured: 0,
  perfectScores: 0,
  curedMilestones: [],
  perfectMilestones: []
};

export const INITIAL_GAME_STATE: GameState = {
  money: 5000,
  reputation: 50,
  experience: 0,
  rank: Rank.STUDENT,
  energy: 100,
  maxEnergy: 100,
  inventory: INITIAL_EQUIPMENT,
  totalPatientsTreated: 0,
  caseHistory: [],
  skillPoints: 0,
  talents: INITIAL_TALENTS,
  milestones: INITIAL_MILESTONES
};

export interface QuizQuestion {
  question: string;       // 题目
  options: string[];      // 选项 A, B, C, D
  correctAnswer: number;  // 正确答案索引
  explanation: string;    // 解析
}