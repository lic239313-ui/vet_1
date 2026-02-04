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
  const TIMEOUT_MS = 15000; // 15秒超时（优化后的精简prompt）

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
你是兽医教授。基于疾病模板生成临床病例JSON，用于${rank}级别考核。
语言：中文。格式：JSON。**极简输出**。

**精简要求**：
1. 生成独特病例（不同品种、年龄、体重）
2. dialogue只需2个关键问诊
3. physicalExam每项最多15字
4. cbcSummary和chemSummary用一句话概括关键异常

JSON结构：
{
  "species": "犬"|"猫",
  "breed": "品种",
  "age": "年龄",
  "sex": "公/母",
  "weightKg": number,
  "ownerPersona": "性格",
  "chiefComplaint": "主诉",
  "historySecret": "病史",
  "dialogue": [{"question":"问题","answer":"回答","topic":"话题"}],
  "physicalExam": {"visual":"","auscultation":"","palpation":"","olfaction":""},
  "tpr": {"temp":number,"hr":number,"rr":number,"mm":"","crt":""},
  "cbcSummary": "WBC 25.0↑，HCT 35%，PLT正常",
  "chemSummary": "ALT 180↑，BUN/CREA正常",
  "xraySummary": "X光所见概述",
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
你是兽医教授。生成临床病例JSON，用于${rank}级别考核。
语言：中文。格式：JSON。**极简输出**。

**精简要求**：
1. 数据真实，符合生理范围
2. dialogue只需2个关键问诊
3. physicalExam每项最多15字
4. cbcSummary和chemSummary用一句话概括

JSON结构：
{
  "species": "犬"|"猫",
  "breed": "品种",
  "age": "年龄",
  "sex": "公/母",
  "weightKg": number,
  "ownerPersona": "性格",
  "chiefComplaint": "主诉",
  "historySecret": "病史",
  "dialogue": [{"question":"问题","answer":"回答","topic":"话题"}],
  "physicalExam": {"visual":"","auscultation":"","palpation":"","olfaction":""},
  "tpr": {"temp":number,"hr":number,"rr":number,"mm":"","crt":""},
  "cbcSummary": "WBC↑，HCT正常",
  "chemSummary": "ALT↑，肾功能正常",
  "xraySummary": "X光所见",
  "difficulty": number
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
