#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将disease.txt转换为符合vet_exam_questions.sql格式的SQL INSERT语句
改进版：不依赖"题号"标记，直接解析所有包含题干的段落
"""

import re
import json

def parse_disease_txt(file_path):
    """解析disease.txt文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 按分隔符拆分题目
    questions_raw = content.split('---')
    
    questions = []
    question_counter = 0
    skipped_count = 0
    
    for idx, q_raw in enumerate(questions_raw):
        q_raw = q_raw.strip()
        if not q_raw:
            continue
        
        lines = [line.strip() for line in q_raw.split('\n') if line.strip()]
        
        if len(lines) < 3:  # 至少需要题干、科目、答案
            continue
        
        question = {}
        options = []
        
        # 解析每一行
        for i, line in enumerate(lines):
            # 题号（忽略，不是必需的）
            if line.startswith('题号'):
                continue
            
            # 题干（带编号的那一行：1. 或 1.xxx）
            # 注意：题干必须以数字+点开头
            elif re.match(r'^\d+\.', line) and 'stem' not in question:
                question['stem'] = re.sub(r'^\d+\.', '', line).strip()
            
            # 选项（包括各种格式：A.、 A.、A、等）
            elif re.match(r'^\s*[A-E][\.\s]', line):
                # 统一格式化选项
                option = re.sub(r'^\s*([A-E])[\.\s]+', r'\1.', line).strip()
                options.append(option)
            
            # 科目
            elif line.startswith('科目：') or line.startswith('科目:'):
                question['subject'] = re.sub(r'^科目[：:]\s*', '', line).strip()
            
            # 答案
            elif line.startswith('答案：') or line.startswith('答案:'):
                answer_str = re.sub(r'^答案[：:]\s*', '', line).strip()
                question['answer_str'] = answer_str
            
            # 解析
            elif line.startswith('解析：') or line.startswith('解析:'):
                question['explanation'] = re.sub(r'^解析[：:]\s*', '', line).strip()
        
        # 检查是否有必需字段
        has_required = 'stem' in question and 'subject' in question and 'answer_str' in question
        
        if not has_required:
            skipped_count += 1
            missing = []
            if 'stem' not in question:
                missing.append('题干')
            if 'subject' not in question:
                missing.append('科目')
            if 'answer_str' not in question:
                missing.append('答案')
            # print(f"跳过段落 {idx+1}: 缺少 {', '.join(missing)}")
            continue
        
        question['options'] = options
        question_counter += 1
        
        # 判断题目类型
        answer_str = question['answer_str']
        # 处理多种多选答案格式：ABC、A,B,C、A，B，C等
        if ',' in answer_str or '，' in answer_str or (len(answer_str) > 1 and answer_str.replace(' ', '').isalpha()):
            question['question_type'] = 'multiple'
            # 多选题：将答案字母转换为索引数组
            # 移除所有空格和标点
            answer_clean = re.sub(r'[,，\s]+', '', answer_str)
            answer_letters = list(answer_clean)
            question['correct_answer'] = json.dumps([ord(letter) - ord('A') for letter in answer_letters if letter.isalpha() and 'A' <= letter <= 'E'])
        else:
            question['question_type'] = 'single'
            # 单选题：将答案字母转换为索引
            if answer_str and answer_str[0].isalpha():
                question['correct_answer'] = str(ord(answer_str[0]) - ord('A'))
            else:
                # 如果答案不是字母，跳过这道题
                print(f"警告: 跳过题目 {question_counter} - 答案格式无效: {answer_str}")
                question_counter -= 1
                skipped_count += 1
                continue
        
        # 设置默认值
        if 'explanation' not in question:
            question['explanation'] = '暂无解析'
        
        questions.append(question)
    
    print(f"跳过的段落数: {skipped_count}")
    return questions

def generate_sql(questions, output_file):
    """生成SQL INSERT语句"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- 从disease.txt转换的题目数据\n")
        f.write("-- 生成时间：2026-01-21\n\n")
        
        for i, q in enumerate(questions, 1):
            # 转换选项为JSON数组格式
            options_json = json.dumps(q['options'], ensure_ascii=False)
            
            # 转义单引号
            stem = q['stem'].replace("'", "''")
            explanation = q['explanation'].replace("'", "''")
            subject = q['subject'].replace("'", "''")
            
            sql = f"""-- 题目 {i}
INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject, difficulty, exam_year, is_real_exam)
VALUES (
    '{q['question_type']}',
    '{stem}',
    '{options_json}',
    '{q['correct_answer']}',
    '{explanation}',
    '{subject}',
    3,
    2023,
    TRUE
);

"""
            f.write(sql)
    
    print(f"成功生成 {len(questions)} 道题目的SQL语句")
    print(f"输出文件：{output_file}")

def main():
    input_file = 'disease.txt'
    output_file = 'disease_questions.sql'
    
    print(f"正在解析 {input_file}...")
    questions = parse_disease_txt(input_file)
    print(f"共解析到 {len(questions)} 道题目")
    
    print(f"\n正在生成SQL语句...")
    generate_sql(questions, output_file)
    
    print("\n转换完成！")
    
    # 显示统计信息
    single_count = sum(1 for q in questions if q['question_type'] == 'single')
    multiple_count = sum(1 for q in questions if q['question_type'] == 'multiple')
    
    # 统计科目分布
    subjects = {}
    for q in questions:
        subject = q['subject']
        subjects[subject] = subjects.get(subject, 0) + 1
    
    print(f"\n统计信息：")
    print(f"  单选题：{single_count}")
    print(f"  多选题：{multiple_count}")
    print(f"  总计：{len(questions)}")
    print(f"\n科目分布：")
    for subject, count in subjects.items():
        print(f"  {subject}: {count}")

if __name__ == '__main__':
    main()
