#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能题库转换工具 - 支持共用题干和自动答案识别

支持格式：
1. 共用题干 + 内嵌答案
2. 共用题干 + 单独答案文件
3. 普通题目 + 答案

作者: AI Assistant
版本: 3.0
"""

import re
import json
from pathlib import Path
import sys

def escape_sql_string(text: str) -> str:
    """转义SQL字符串"""
    if not text:
        return ""
    return str(text).replace("'", "''").strip()

def answer_to_index(answer: str) -> int:
    """将A/B/C/D/E/1/2/3/4/5转换为0-4"""
    answer = str(answer).strip().upper()
    # 字母映射
    if answer in ['A', '①', '1', '第一个']:
        return 0
    elif answer in ['B', '②', '2', '第二个']:
        return 1
    elif answer in ['C', '③', '3', '第三个']:
        return 2
    elif answer in ['D', '④', '4', '第四个']:
        return 3
    elif answer in ['E', '⑤', '5', '第五个']:
        return 4
    else:
        print(f"⚠️  无法识别答案'{answer}'，默认使用A")
        return 0

def parse_smart_questions(text: str, answers_text: str = None):
    """
    智能解析题目，支持多种格式
    """
    questions = []
    
    # 1. 优先检测 --- 分隔符
    if '---' in text:
        print("🔍 检测到 '---' 分隔符格式")
        questions = parse_separator_text(text)
    # 2. 检测是否有共用题干
    elif bool(re.search(r'[（\(](\d+)[～~\-\-](\d+)题?共用题干[）\)]', text)):
        print("🔍 检测到共用题干格式")
        questions = parse_case_based_text(text)
    # 3. 普通格式
    else:
        print("🔍 检测到普通题目格式")
        questions = parse_normal_text(text)
    
    # 如果提供了单独的答案文件
    if answers_text and len(questions) > 0:
        print("📋 正在匹配答案...")
        questions = match_answers(questions, answers_text)
    
    return questions

def parse_separator_text(text):
    """解析使用 --- 分隔的题目"""
    questions = []
    blocks = text.split('---')
    
    for block in blocks:
        if not block.strip():
            continue
        
        # 移除可能的题号行 (如 "题号 1.")
        # 有些block可能包含 "题号 1.\n1.问题..."，我们需要保留 "1.问题..."
        # 但 parse_single_question 需要 "1.问题..." 开头
        
        # 预处理block，移除纯题号行
        lines = block.strip().split('\n')
        clean_lines = []
        for line in lines:
            if re.match(r'^题号\s*\d+\.?$', line.strip()):
                continue
            clean_lines.append(line)
        
        clean_block = '\n'.join(clean_lines)
        
        if not clean_block.strip():
            continue

        q = parse_single_question(clean_block)
        if q:
            questions.append(q)
            
    return questions

def parse_case_based_text(text):
    """解析共用题干格式"""
    questions = []
    
    # 分割不同的案例组
    # 匹配：（1～3题共用题干）或（1-3题共用题干）
    case_splits = re.split(r'[（\(](\d+)[～~\-\-](\d+)题?共用题干[）\)]\s*', text)
    
    i = 0
    while i < len(case_splits):
        if i == 0:
            # 第一段可能是普通文本，跳过
            i += 1
            continue
        
        if i + 2 < len(case_splits):
            start_num = case_splits[i]
            end_num = case_splits[i+1]
            content = case_splits[i+2]
            
            print(f"📖 处理题目 {start_num}-{end_num}")
            
            # 提取题干（第一个题号之前的所有内容）
            # 查找第一个形如 "1." 或 "1、" 的位置
            first_q_match = re.search(r'(?:\n|^)(\d+)\s*[\.\。、]', content)
            if first_q_match:
                stem_end = first_q_match.start()
                if stem_end == 0 and content[0].isdigit(): 
                     # 如果第一行就是题目，说明没有题干？或者上面的regex匹配到了开头
                     # 其实共用题干通常在括号后紧接着就是题干，直到遇到第一个小题
                     pass

                # 更健壮的分割：题干是直到第一个题号出现之前的内容
                case_stem = content[:stem_end].strip()
                questions_part = content[stem_end:]
                
                # 分割成单个题目
                q_blocks = re.split(r'(?=\n\d+\s*[\.\。、])', questions_part)
                
                for block in q_blocks:
                    if not block.strip():
                        continue
                    
                    q = parse_single_question(block, case_stem)
                    if q:
                        questions.append(q)
            
            i += 3
        else:
            i += 1
    
    return questions

def parse_normal_text(text):
    """解析普通题目格式"""
    questions = []
    
    # 分割成单个题目
    q_blocks = re.split(r'(?=\n\d+\s*[\.\。、])', text)
    if len(q_blocks) == 1 and q_blocks[0]:
         # 尝试不带换行符的分割
         q_blocks = re.split(r'(?=\d+\s*[\.\。、])', text)

    for block in q_blocks:
        if not block.strip():
            continue
        
        q = parse_single_question(block)
        if q:
            questions.append(q)
    
    return questions

def parse_single_question(block, stem=""):
    """
    解析单个题目块
    """
    lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
    
    if len(lines) < 2:
        return None
    
    # 提取题号和问题
    first_line = lines[0]
    q_match = re.match(r'(\d+)\s*[\.\。、]\s*(.*)', first_line)
    if not q_match:
        # 尝试在第二行找（兼容题号单独一行的情况，虽然上面已经处理了）
        if len(lines) > 1:
             q_match = re.match(r'(\d+)\s*[\.\。、]\s*(.*)', lines[1])
             if q_match:
                 lines = lines[1:] # 调整lines
             else:
                 return None
        else:
            return None
    
    if not q_match:
        return None

    question_num = q_match.group(1)
    question_text = q_match.group(2).strip()
    
    # 合并题干
    if stem:
        full_question = stem + " " + question_text
    else:
        full_question = question_text
    
    # 提取选项
    options = []
    answer = None
    explanation = ""
    subject = None
    
    for line in lines[1:]:
        # 匹配选项 A. B. C. D. E.
        opt_match = re.match(r'([A-Ea-e])[\.\。、]\s*(.*)', line)
        if opt_match:
            options.append(opt_match.group(2).strip())
            continue
        
        # 匹配答案
        ans_match = re.match(r'(?:答案|正确答案|参考答案)[:：]\s*([A-Ea-e\d]+)', line, re.IGNORECASE)
        if ans_match:
            answer = ans_match.group(1)
            continue
        
        # 匹配解析
        exp_match = re.match(r'(?:解析|说明|详解|分析)[:：]\s*(.*)', line, re.IGNORECASE)
        if exp_match:
            explanation = exp_match.group(1).strip()
            continue

        # 匹配科目
        subj_match = re.match(r'(?:科目|分类)[:：]\s*(.*)', line, re.IGNORECASE)
        if subj_match:
            subject = subj_match.group(1).strip()
            continue
    
    # 处理选项数量 - 执业兽医考试通常有5个选项
    if len(options) < 3:
        # print(f"⚠️  题目 {question_num} 选项过少({len(options)})，跳过")
        # 暂时允许少选项，避免误杀
        pass
    
    # 处理答案
    correct_answer = 0
    if answer:
        correct_answer = answer_to_index(answer)
    else:
        print(f"⚠️  题目 {question_num} 未找到答案，默认使用A")
    
    # 处理解析
    if not explanation:
        explanation = "暂无解析"
    
    # 构建结果
    result = {
        'number': question_num,
        'question': full_question,
        'options': options,
        'correct_answer': correct_answer,
        'explanation': explanation,
        'difficulty': 2
    }
    
    if subject:
        result['subject'] = subject
        
    return result
    
def match_answers(questions, answers_text):
    """
    从单独的答案文件匹配答案
    
    答案文件格式：
    1.E
    2.A
    3.E
    或
    1.E 解析xxx
    2.A 解析xxx
    """
    # 提取答案
    answer_pattern = r'(\d+)\s*[\.\。、]\s*([A-Ea-e])\s*(?:[:：]\s*(.*?))?(?=\n\d+[\.\。、]|\Z)'
    matches = re.findall(answer_pattern, answers_text, re.DOTALL)
    
    answer_dict = {}
    for match in matches:
        q_num = match[0]
        answer = match[1]
        explanation = match[2].strip() if match[2] else ""
        
        answer_dict[q_num] = {
            'answer': answer_to_index(answer),
            'explanation': explanation
        }
    
    # 匹配到题目
    matched = 0
    for q in questions:
        q_num = q.get('number', '')
        if q_num in answer_dict:
            q['correct_answer'] = answer_dict[q_num]['answer']
            if answer_dict[q_num]['explanation']:
                q['explanation'] = answer_dict[q_num]['explanation']
            matched += 1
            
    print(f"✅ 成功匹配 {matched}/{len(questions)} 道题目的答案")
    return questions

def generate_sql(questions, subject='综合应用', output_file=None):
    """生成SQL语句 - 用于 vet_exam_questions 表"""
    if not questions:
        print("❌ 没有题目可以转换")
        return ""
    
    # 科目映射 - 将缩写或其他名称映射为标准科目名称
    subject_mapping = {
        '基础': '基础兽医学',
        '预防': '预防兽医学',
        '临床': '临床兽医学',
        '综合': '综合应用',
        '兽医法规': '基础兽医学',  # 法规归入基础
        '兽医内科学': '临床兽医学',
        '兽医外科学': '临床兽医学',
        '兽医传染病学': '预防兽医学',
        '兽医药理学': '基础兽医学',
    }
    
    # 映射科目名称
    mapped_subject = subject_mapping.get(subject, subject)
    
    # 验证科目是否为四个标准科目之一
    valid_subjects = ['基础兽医学', '预防兽医学', '临床兽医学', '综合应用']
    if mapped_subject not in valid_subjects:
        print(f"⚠️  科目 '{subject}' 映射为 '{mapped_subject}'，将使用默认科目'综合应用'")
        mapped_subject = '综合应用'
    else:
        print(f"✅ 科目：{mapped_subject}")
    
    sql_lines = [
        "-- 智能转换生成的执业兽医考试题目SQL",
        f"-- 科目: {mapped_subject}",
        f"-- 题目数量: {len(questions)}",
        "",
        "INSERT INTO vet_exam_questions (question_type, stem, is_shared_stem, options, correct_answer, explanation, subject, difficulty, is_real_exam) VALUES"
    ]
    
    values = []
    for q in questions:
        options_json = json.dumps(q['options'], ensure_ascii=False)
        
        value = f"""('single',
 '{escape_sql_string(q['question'])}',
 false,
 '{options_json}'::jsonb,
 '{q['correct_answer']}'::jsonb,
 '{escape_sql_string(q['explanation'])}',
 '{mapped_subject}',
 {q['difficulty']},
 true)"""
        
        values.append(value)
    
    sql_lines.append(",\n\n".join(values))
    sql_lines.append("\nON CONFLICT DO NOTHING;")
    
    sql_content = '\n'.join(sql_lines)
    
    # 写入文件
    if output_file is None:
        output_file = "converted_questions.sql"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"\n✅ SQL文件已生成: {output_file}")
    print(f"📊 包含 {len(questions)} 道题目")
    print(f"📁 目标表: vet_exam_questions")
    print(f"📚 科目分类: {mapped_subject}")
    
    return sql_content


def main():
    print("""
╔══════════════════════════════════════════════════════════╗
║          智能题库转换工具 v3.0                            ║
║          支持共用题干 + 自动答案识别                       ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    if len(sys.argv) < 2:
        print("📖 用法：")
        print("  python smart_converter.py <题目文件> [答案文件] [科目ID] [输出文件]")
        print("\n📝 示例：")
        print("  python smart_converter.py questions.txt")
        print("  python smart_converter.py questions.txt answers.txt")
        print("  python smart_converter.py questions.txt answers.txt 科目ID output.sql")
        print("\n支持格式：")
        print("  1. 题目和答案在同一文件（自动识别）")
        print("  2. 题目和答案分开（提供两个文件）")
        print("  3. 共用题干格式")
        print("  4. 普通题目格式")
        sys.exit(1)
    
    # 解析参数
    question_file = sys.argv[1]
    answer_file = sys.argv[2] if len(sys.argv) > 2 and Path(sys.argv[2]).exists() else None
    
    # 如果第2个参数不是文件，可能是科目ID
    if len(sys.argv) > 2 and not Path(sys.argv[2]).exists():
        subject_id = sys.argv[2]
        answer_file = None
    else:
        subject_id = sys.argv[3] if len(sys.argv) > 3 else '11111111-1111-1111-1111-111111111111'
    
    output_file = sys.argv[4] if len(sys.argv) > 4 else None
    
    if not Path(question_file).exists():
        print(f"❌ 文件不存在: {question_file}")
        sys.exit(1)
    
    # 读取题目文件
    print(f"📖 正在读取题目文件: {question_file}")
    with open(question_file, 'r', encoding='utf-8') as f:
        question_text = f.read()
    
    # 读取答案文件（如果有）
    answer_text = None
    if answer_file:
        print(f"📖 正在读取答案文件: {answer_file}")
        with open(answer_file, 'r', encoding='utf-8') as f:
            answer_text = f.read()
    
    # 解析题目
    print("\n🔍 正在智能解析题目...")
    questions = parse_smart_questions(question_text, answer_text)
    
    if not questions:
        print("❌ 未能解析出题目，请检查文件格式")
        sys.exit(1)
    
    # 预览
    print(f"\n📋 预览前 3 道题目：")
    print("=" * 80)
    for i, q in enumerate(questions[:3], 1):
        print(f"\n题目 {i}：{q['question'][:60]}...")
        for j, opt in enumerate(q['options']):
            marker = "✓" if j == q['correct_answer'] else " "
            print(f"  {chr(65+j)}. {opt[:40]}... {marker}")
        print(f"  答案：{chr(65+q['correct_answer'])}")
        print(f"  解析：{q['explanation'][:50]}...")
        print("-" * 80)
    
    # 生成SQL
    print("\n" + "=" * 80)
    generate_sql(questions, subject_id, output_file)
    print("\n✨ 完成！可以直接在 Supabase SQL Editor 中执行")

if __name__ == '__main__':
    main()
