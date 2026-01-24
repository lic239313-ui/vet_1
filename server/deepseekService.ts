import fetch from 'node-fetch';
import { getRandomCaseTemplate, CaseTemplate } from './supabaseClient';

// DeepSeek API配置
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const MODEL_ID = 'deepseek-chat';

// 获取API密钥的辅助函数（延迟检查）
function getApiKey(): string {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('缺少DeepSeek API密钥！请在.env文件中设置DEEPSEEK_API_KEY');
  }
  return apiKey;
}

/**
 * 调用DeepSeek API的通用方法（带超时保护）
 */
async function callDeepSeek(
  systemPrompt: string,
  userPrompt: string,
  jsonMode: boolean = true
): Promise<any> {
  const TIMEOUT_MS = 20000; // 20秒超时

  try {
    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    console.log('[DeepSeek] 开始调用API...');
    const startTime = Date.now();

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`  // 使用延迟加载的 API 密钥
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: jsonMode ? { type: 'json_object' } : undefined,
        temperature: 1.3, // 提高温度增加随机性
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.log(`[DeepSeek] API响应完成，用时: ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek] API错误: ${response.status} - ${errorText}`);

      // 检查是否是余额不足或认证错误
      if (response.status === 401) {
        throw new Error('DeepSeek API密钥无效或已过期');
      } else if (response.status === 402 || response.status === 429) {
        throw new Error('DeepSeek API余额不足或请求过于频繁');
      }

      throw new Error(`DeepSeek API错误: ${response.status} - ${errorText}`);
    }

    const data: any = await response.json();
    const content = data.choices[0].message.content;

    if (jsonMode) {
      // 清理可能的markdown代码块
      const cleanJson = content.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanJson);
    }

    return content;
  } catch (error: any) {
    // 处理超时错误
    if (error.name === 'AbortError') {
      console.error(`[DeepSeek] API请求超时（超过${TIMEOUT_MS}ms）`);
      throw new Error(`DeepSeek API请求超时，请稍后重试`);
    }

    console.error('[DeepSeek] 服务错误:', error);
    throw error;
  }
}

/**
 * 生成临床病例（结合数据库模板和AI）
 */
export async function generateClinicalCase(rank: string): Promise<any> {
  // 从数据库获取模板
  const template = await getRandomCaseTemplate(rank);

  let systemPrompt = '';
  let userPrompt = '';

  if (template) {
    // 基于模板生成病例
    systemPrompt = `
你是一位资深兽医教授。
任务：基于提供的疾病模板，生成一个真实的临床病例，用于考核 ${rank} 级别的兽医学生。
语言：简体中文
格式：严格的JSON格式

要求：
1. **创造独特的病例**：每次生成的病例都应该有不同的品种、年龄、体重、主人性格等
2. **体格检查、化验数据必须符合该疾病的典型表现**，但要有个体差异
3. **生成5-8个不同的问诊对话选项**，每次对话都要有变化
4. 确保所有数据真实可信，符合兽医临床标准
5. **避免生成重复或相似的病例**，要有创意和多样性

JSON结构：
{
  "species": "犬" | "猫",
  "breed": "品种名",
  "age": "年龄",
  "sex": "公/母",
  "weightKg": number,
  "ownerPersona": "主人性格(如焦虑型/淡定型/健谈型)",
  "chiefComplaint": "主诉",
  "historySecret": "需要通过问诊才能获取的关键病史",
  "dialogue": [
    { "question": "兽医可以问的问题", "answer": "主人的回答", "topic": "话题类型(如饮食/疫苗/症状持续时间)" }
  ],
  "physicalExam": {
    "visual": "视诊所见",
    "auscultation": "听诊所见",
    "palpation": "触诊所见",
    "olfaction": "嗅诊所见",
    "woodsLamp": "伍德氏灯检查结果(如不适用可写'未进行')"
  },
  "tpr": {
    "temp": number,
    "hr": number,
    "rr": number,
    "mm": "粘膜颜色",
    "crt": "毛细血管再充盈时间",
    "bp": "血压值(如 120)"
  },
  "cbc": [
    { "name": "指标名", "value": "数值", "unit": "单位", "refRange": "参考范围", "flag": "H"|"L"|"N" }
  ],
  "chem": [ ...同上结构... ],
  "bloodGas": [ ...同上结构，仅危重病例需要 ],
  "imaging": {
    "xrayDescription": "X光影像描述",
    "usgDescription": "B超描述(如适用)"
  },
  "difficulty": ${template.difficulty}
}
    `.trim();

    userPrompt = `
疾病模板：${template.disease_name}
物种：${template.species}
难度：${template.difficulty}
典型症状：${JSON.stringify(template.typical_symptoms, null, 2)}

**重要**：请生成一个**全新的、独特的**临床病例。
- 使用不同的品种（从常见品种中随机选择）
- 设置不同的年龄和体重
- 创造独特的主人性格和对话内容
- 让病例数据有合理的个体差异
    `.trim();
  } else {
    // 如果数据库没有模板，完全由AI生成
    console.warn('数据库中没有找到合适的模板，使用AI直接生成');

    systemPrompt = `
你是一位资深兽医教授。
任务：生成一个逼真的兽医临床病例，用于考核 ${rank} 级别的学生。
语言：简体中文
格式：严格的JSON格式

要求：
1. 数据真实，符合生理参考范围
2. 包含完整的体格检查和生命体征
3. 如果病情危重，在bloodGas中生成血气分析数据；否则为空数组
4. 确保逻辑自洽：化验数据必须支持临床症状
5. 生成5-8个问诊对话选项

JSON结构：
{
  "species": "犬" | "猫",
  "breed": "品种名",
  "age": "年龄",
  "sex": "公/母",
  "weightKg": number,
  "ownerPersona": "主人性格",
  "chiefComplaint": "主诉",
  "historySecret": "隐藏病史",
  "dialogue": [
    { "question": "兽医问题", "answer": "主人回答", "topic": "话题" }
  ],
  "physicalExam": {
    "visual": "视诊",
    "auscultation": "听诊",
    "palpation": "触诊",
    "olfaction": "嗅诊",
    "woodsLamp": "伍德氏灯"
  },
  "tpr": {
    "temp": number,
    "hr": number,
    "rr": number,
    "mm": "粘膜",
    "crt": "CRT",
    "bp": "血压"
  },
  "cbc": [ { "name": "", "value": "", "unit": "", "refRange": "", "flag": "" } ],
  "chem": [ ... ],
  "bloodGas": [ ... ],
  "imaging": {
    "xrayDescription": "",
    "usgDescription": ""
  },
  "difficulty": number (1-5)
}
    `.trim();

    userPrompt = `请生成一个 ${rank} 难度的病例。`;
  }

  const data = await callDeepSeek(systemPrompt, userPrompt);
  return { ...data, id: Date.now().toString() };
}

/**
 * 评估诊断和治疗方案
 */
export async function evaluateTreatment(
  clinicalCase: any,
  diagnosis: string,
  plan: string
): Promise<any> {
  const systemPrompt = `
你是兽医资格考试的考官。
任务：评估学生的临床诊断和治疗方案。
语言：简体中文
格式：JSON

病例信息：
患者：${clinicalCase.species}, ${clinicalCase.breed}, ${clinicalCase.weightKg}kg

JSON结构：
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "详细的教学反馈，指出优点和不足",
  "correctDiagnosis": "标准诊断",
  "standardOfCare": "金标准治疗方案"
}
  `.trim();

  const userPrompt = `
学生提交的诊断：${diagnosis}
学生提交的治疗方案：${plan}

请根据病例信息进行评分。重点检查：
1. 诊断准确性
2. 药物剂量是否适合 ${clinicalCase.weightKg}kg 的动物
3. 是否符合诊疗规范
  `.trim();

  return await callDeepSeek(systemPrompt, userPrompt);
}

/**
 * 基于病例生成题目
 */
export async function generateQuizFromCase(caseText: string): Promise<any[]> {
  const systemPrompt = `
你是兽医系教授。
任务：根据病例描述，出3道单项选择题。
语言：简体中文
格式：JSON Array

每道题的JSON结构：
{
  "question": "题目描述",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "correctAnswer": number (0-3),
  "explanation": "答案解析"
}

输出格式：
{ "questions": [ ... ] }
  `.trim();

  const userPrompt = `
病例描述：
${caseText}

请基于此病例生成考察诊断推理、病理识别或药理学的题目。
  `.trim();

  const response = await callDeepSeek(systemPrompt, userPrompt);
  return Array.isArray(response) ? response : (response.questions || []);
}

/**
 * 生成教科书题目
 */
export async function generateTextbookQuiz(): Promise<any[]> {
  const systemPrompt = `
你是兽医系教授。
任务：出5道关于《兽医传染病学》的单选题。
重点：猪、禽、反刍动物常见传染病的流行病学与防控。
语言：简体中文
格式：JSON

输出结构：
{
  "questions": [
    {
      "question": "题目",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": number (0-3),
      "explanation": "解析"
    }
  ]
}
  `.trim();

  const userPrompt = '开始出题。';
  const response = await callDeepSeek(systemPrompt, userPrompt);
  return response.questions || [];
}

/**
 * 生成资格考试题目
 */
export async function generateQualificationExam(targetRank: string): Promise<any> {
  const systemPrompt = `
你是兽医职业资格认证委员会成员。
任务：生成一道高难度的单选题，用于考核候选人是否具备 [${targetRank}] 职称的水平。
语言：简体中文
格式：JSON

JSON结构：
{
  "question": "题目",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": number (0-3),
  "explanation": "解析"
}
  `.trim();

  const userPrompt = `请出一道针对 ${targetRank} 的考核题目。`;
  return await callDeepSeek(systemPrompt, userPrompt);
}
