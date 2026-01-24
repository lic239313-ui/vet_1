/**
 * 前端 API 客户端
 * 
 * 此文件提供前端调用后端 API 的封装函数。
 * 实际的 AI 服务（DeepSeek API）在后端 server/deepseekService.ts 中实现。
 * Supabase 数据库操作在 server/supabaseClient.ts 中实现。
 * 
 * 注意：此文件不直接调用任何 AI API，只是转发请求到后端。
 */

// 后端API基础URL（通过 Vite 代理转发到 :3000）
const API_BASE_URL = '/api';

/**
 * 通用API调用函数
 */
async function callAPI(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '未知错误' }));
      throw new Error(errorData.error || `API请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API调用错误:', error);

    // 提供更友好的错误信息
    if (error.message.includes('Failed to fetch')) {
      throw new Error('无法连接到后端服务器，请确保服务器正在运行 (端口3000)');
    }

    throw error;
  }
}

/**
 * 生成临床病例
 * @param rank 兽医等级
 * @returns 临床病例对象
 */
export const generateClinicalCase = async (rank: string): Promise<any> => {
  console.log(`[前端] 请求生成 ${rank} 级别的病例...`);

  const data = await callAPI('/cases/generate', 'POST', { rank });

  console.log(`[前端] 病例生成成功: ${data.id}`);
  return data;
};

/**
 * 评估诊断和治疗方案
 * @param clinicalCase 病例对象
 * @param diagnosis 学生的诊断
 * @param plan 学生的治疗方案
 * @returns 评估结果
 */
export const evaluateTreatment = async (
  clinicalCase: any,
  diagnosis: string,
  plan: string
): Promise<any> => {
  console.log(`[前端] 提交病例评估...`);

  const data = await callAPI('/cases/evaluate', 'POST', {
    clinicalCase,
    diagnosis,
    plan
  });

  console.log(`[前端] 评估完成，得分: ${data.score}`);
  return data;
};

/**
 * 获取执业兽医考试题目
 * @param count 题目数量
 * @param subject 科目筛选（可选）
 * @returns 题目数组
 */
export const getExamQuestions = async (
  count: number = 10,
  subject?: string
): Promise<any[]> => {
  console.log(`[前端] 请求获取考试题目 (数量:${count}, 科目:${subject})...`);

  const data = await callAPI('/exam/questions', 'POST', { count, subject });

  console.log(`[前端] 获取了 ${data.length} 道题目`);
  return data;
};

/**
 * 提交答案并获取结果
 * @param userId 用户ID
 * @param questionId 题目ID
 * @param userAnswer 用户答案
 * @param timeSpent 用时（秒）
 * @returns 验证结果
 */
export const submitExamAnswer = async (
  userId: string,
  questionId: string,
  userAnswer: number | number[],
  timeSpent: number = 0
): Promise<{
  isCorrect: boolean;
  explanation: string;
  correctAnswer: number | number[];
}> => {
  console.log('[前端] 提交答案...');

  const data = await callAPI('/exam/submit-answer', 'POST', {
    userId,
    questionId,
    userAnswer,
    timeSpent
  });

  console.log(`[前端] 答案${data.isCorrect ? '正确' : '错误'}`);
  return data;
};

/**
 * 生成资格考试题目（用于Profile组件的晋升考核）
 * @param targetRank 目标职称
 * @returns 单个题目
 */
export const generateQualificationExam = async (targetRank: string): Promise<any> => {
  console.log(`[前端] 请求生成 ${targetRank} 资格考试题目...`);

  const data = await callAPI('/quiz/qualification', 'POST', { targetRank });

  console.log('[前端] 题目生成成功');
  return data;
};
