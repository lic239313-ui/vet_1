import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 在 Netlify Functions 环境中，环境变量直接从 process.env 读取
// 在本地开发环境中，Vite 或 server.ts 会预先加载 .env.local
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase配置未设置，将使用纯AI模式生成病例和题目');
    console.warn('   如需使用数据库模板，请在Netlify环境变量中配置SUPABASE_URL和SUPABASE_ANON_KEY');
    console.warn(`   当前 SUPABASE_URL: ${supabaseUrl ? '已设置' : '未设置'}`);
    console.warn(`   当前 SUPABASE_ANON_KEY: ${supabaseKey ? '已设置' : '未设置'}`);
} else {
    // 创建Supabase客户端
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase客户端初始化成功');
}

// 导出客户端（可能为 null）
export const supabase = supabaseClient;

/**
 * 病例模板数据接口
 */
export interface CaseTemplate {
    id: string;
    species: string;
    disease_name: string;
    difficulty: number;
    typical_symptoms: {
        chiefComplaint: string;
        physicalExam: any;
        tpr: any;
        labFindings?: any;
    };
    lab_patterns?: any;
    treatment_guidelines: string;
    correct_diagnosis: string;
}

/**
 * 从数据库获取随机病例模板
 * @param rank 兽医等级
 * @returns 病例模板
 */
export async function getRandomCaseTemplate(rank: string): Promise<CaseTemplate | null> {
    // 如果没有配置Supabase，返回null，使用纯AI生成
    if (!supabase) {
        console.log('[数据库] Supabase未配置，跳过模板查询，将使用纯AI生成');
        return null;
    }

    try {
        // 根据等级映射难度
        let difficulty = 1;
        if (rank.includes('实习')) difficulty = 2;
        else if (rank.includes('住院')) difficulty = 3;
        else if (rank.includes('专科')) difficulty = 4;
        else if (rank.includes('主任')) difficulty = 5;

        // 从数据库获取符合难度的模板，使用DISTINCT去重
        const { data, error } = await supabase
            .from('case_templates')
            .select('*')
            .lte('difficulty', difficulty)
            .gte('difficulty', Math.max(1, difficulty - 1)); // 获取当前难度及前一难度的病例

        if (error) {
            console.error('Supabase查询错误:', error);
            return null;
        }

        if (!data || data.length === 0) {
            console.warn(`没有找到难度${difficulty}的病例模板`);
            return null;
        }

        // 按disease_name去重，每个疾病只保留一个模板
        const uniqueTemplates = Array.from(
            new Map(data.map(item => [item.disease_name, item])).values()
        );

        console.log(`[数据库] 找到 ${data.length} 条记录，去重后 ${uniqueTemplates.length} 个不同疾病`);

        // 使用时间戳作为种子增加随机性
        const seed = Date.now() % uniqueTemplates.length;
        const randomIndex = (seed + Math.floor(Math.random() * uniqueTemplates.length)) % uniqueTemplates.length;

        const selected = uniqueTemplates[randomIndex] as CaseTemplate;
        console.log(`[数据库] 选择了疾病: ${selected.disease_name}`);

        return selected;
    } catch (error) {
        console.error('获取病例模板失败:', error);
        return null;
    }
}

/**
 * 执业兽医考试题目接口
 */
export interface VetExamQuestionDB {
    id: string;
    question_type: string;
    stem: string;
    is_shared_stem: boolean;
    shared_stem_id?: string;
    options: string[];
    correct_answer: number | number[];
    explanation: string;
    subject: string;
    difficulty: number;
    exam_year?: number;
}

/**
 * 随机获取考试题目
 * @param count 题目数量
 * @param subject 科目筛选（可选）
 * @returns 题目列表
 */
export async function getRandomExamQuestions(
    count: number = 10,
    subject?: string
): Promise<VetExamQuestionDB[]> {
    if (!supabase) {
        console.warn('[数据库] Supabase未配置，无法获取考试题目');
        return [];
    }

    try {
        console.log(`[调试] 开始查询题目: 数量=${count}, 科目=${subject || '全部'}`);

        let query = supabase
            .from('vet_exam_questions')
            .select('*')
            .eq('is_real_exam', true);

        // 添加科目筛选
        if (subject) {
            console.log(`[调试] 应用科目筛选: ${subject}`);
            query = query.eq('subject', subject);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase查询错误:', error);
            throw new Error(`查询题目失败: ${error.message}`);
        }

        console.log(`[调试] 查询结果: 找到 ${data?.length || 0} 条数据`);

        if (!data || data.length === 0) {
            console.warn(`[调试] 没有找到符合条件的题目 (科目:${subject})`);

            // 调试：尝试查询所有数据，看看表里到底有没有
            if (subject) {
                const { count: allCount } = await supabase
                    .from('vet_exam_questions')
                    .select('*', { count: 'exact', head: true });
                console.log(`[调试] 表中总记录数: ${allCount}`);
            }

            return [];
        }

        // 随机打乱并返回指定数量
        const shuffled = data.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        console.log(`[数据库] 获取了 ${selected.length} 道题目`);
        return selected as VetExamQuestionDB[];
    } catch (error) {
        console.error('获取考试题目失败:', error);
        throw error;
    }
}

/**
 * 获取共用题干题组
 * @returns 共用题干题组列表
 */
export async function getSharedStemQuestionGroups(): Promise<{
    stem: VetExamQuestionDB;
    subQuestions: VetExamQuestionDB[];
}[]> {
    if (!supabase) {
        console.warn('[数据库] Supabase未配置，无法获取共用题干题组');
        return [];
    }

    try {
        // 先获取所有题干
        const { data: stemData, error: stemError } = await supabase
            .from('vet_exam_questions')
            .select('*')
            .eq('is_shared_stem', true);

        if (stemError) {
            console.error('查询题干错误:', stemError);
            throw new Error(`查询题干失败: ${stemError.message}`);
        }

        if (!stemData || stemData.length === 0) {
            return [];
        }

        // 为每个题干获取子题
        const groups = await Promise.all(
            stemData.map(async (stem) => {
                const { data: subData, error: subError } = await supabase
                    .from('vet_exam_questions')
                    .select('*')
                    .eq('shared_stem_id', stem.id);

                if (subError) {
                    console.error(`查询题干 ${stem.id} 的子题错误:`, subError);
                    return { stem, subQuestions: [] };
                }

                return {
                    stem: stem as VetExamQuestionDB,
                    subQuestions: (subData || []) as VetExamQuestionDB[]
                };
            })
        );

        console.log(`[数据库] 获取了 ${groups.length} 个共用题干题组`);
        return groups;
    } catch (error) {
        console.error('获取共用题干题组失败:', error);
        throw error;
    }
}

/**
 * 根据ID获取单个题目
 * @param questionId 题目ID
 * @returns 题目对象
 */
export async function getQuestionById(questionId: string): Promise<VetExamQuestionDB | null> {
    if (!supabase) {
        console.warn('[数据库] Supabase未配置，无法获取题目');
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('vet_exam_questions')
            .select('*')
            .eq('id', questionId)
            .single();

        if (error) {
            console.error('查询题目错误:', error);
            return null;
        }

        return data as VetExamQuestionDB;
    } catch (error) {
        console.error('获取题目失败:', error);
        return null;
    }
}

/**
 * 记录用户答题
 * @param userId 用户ID
 * @param questionId 题目ID
 * @param userAnswer 用户答案
 * @param isCorrect 是否正确
 * @param timeSpent 用时（秒）
 */
export async function recordUserAnswer(
    userId: string,
    questionId: string,
    userAnswer: number | number[],
    isCorrect: boolean,
    timeSpent: number
): Promise<void> {
    if (!supabase) {
        console.warn('[数据库] Supabase未配置，无法记录答题');
        return;
    }

    try {
        const { error } = await supabase
            .from('user_exam_records')
            .insert({
                user_id: userId,
                question_id: questionId,
                user_answer: userAnswer,
                is_correct: isCorrect,
                time_spent: timeSpent
            });

        if (error) {
            console.error('记录答题错误:', error);
            throw new Error(`记录答题失败: ${error.message}`);
        }

        console.log(`[数据库] 记录了用户 ${userId} 的答题`);
    } catch (error) {
        console.error('记录用户答题失败:', error);
        throw error;
    }
}


