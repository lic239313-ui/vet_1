#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
深度分析disease.txt文件结构
"""
import re

with open('disease.txt', 'r', encoding='utf-8') as f:
    content = f.read()

sections = content.split('---')
print(f"总分隔段落数: {len(sections)}")

valid_questions = 0
for idx, section in enumerate(sections):
    section = section.strip()
    if not section:
        continue
    
    has_stem = bool(re.search(r'^\d+\.', section, re.MULTILINE))
    has_subject = '科目' in section
    has_answer = '答案' in section
    
    if has_stem and has_subject and has_answer:
        valid_questions += 1
    elif idx < 10 or idx > len(sections) - 10:  # 打印前后10个段落的信息
        print(f"\n段落 {idx+1}:")
        print(f"  有题干: {has_stem}")
        print(f"  有科目: {has_subject}")
        print(f"  有答案: {has_answer}")
        lines = section.split('\n')[:5]
        print(f"  前5行: {lines}")

print(f"\n有效题目数: {valid_questions}")
