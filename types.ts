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
  cbc?: LabResultItem[]; // Complete Blood Count
  chem?: LabResultItem[]; // Biochemistry
  bloodGas?: LabResultItem[]; // Blood Gas Analysis
  imaging?: {
    xrayDescription?: string;
    usgDescription?: string;
  };

  // Assessment Logic
  difficulty: number;
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

export const INITIAL_GAME_STATE: GameState = {
  money: 5000, // Higher starting money for equipment
  reputation: 50,
  experience: 0,
  rank: Rank.STUDENT,
  energy: 100,
  maxEnergy: 100,
  inventory: INITIAL_EQUIPMENT,
  totalPatientsTreated: 0,
  caseHistory: []
};

export interface QuizQuestion {
  question: string;       // 题目
  options: string[];      // 选项 A, B, C, D
  correctAnswer: number;  // 正确答案索引
  explanation: string;    // 解析
}