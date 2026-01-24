#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOCX 分析工具 - 查看文件内容和格式
"""

import sys
from docx import Document

def analyze_docx(file_path):
    """分析DOCX文件内容"""
    try:
        doc = Document(file_path)
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        
        print(f"=" * 60)
        print(f"文件: {file_path}")
        print(f"=" * 60)
        print(f"总段落数: {len(paragraphs)}")
        print(f"\n前 50 行内容:\n")
        print("-" * 60)
        
        for i, para in enumerate(paragraphs[:50], 1):
            print(f"{i:3d}. {para}")
        
        print("-" * 60)
        
        if len(paragraphs) > 50:
            print(f"\n... 还有 {len(paragraphs) - 50} 行内容未显示")
        
        # 保存到文本文件
        output_file = file_path.replace('.docx', '_内容.txt')
        with open(output_file, 'w', encoding='utf-8') as f:
            for i, para in enumerate(paragraphs, 1):
                f.write(f"{i}. {para}\n")
        
        print(f"\n✅ 完整内容已保存到: {output_file}")
        
    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        analyze_docx(sys.argv[1])
    else:
        analyze_docx('2022基础1.docx')
