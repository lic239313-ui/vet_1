#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOCX 转 SQL 工具 - 图形界面版本
将兽医考试题目 DOCX 文件转换为符合 vet_exam_questions.sql 格式的 SQL 语句
"""

import tkinter as tk
from tkinter import filedialog, messagebox, ttk, scrolledtext
import json
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import sys

try:
    from docx import Document
except ImportError:
    print("需要安装 python-docx 库")
    print("请运行: pip install python-docx")
    sys.exit(1)


class Question:
    """题目数据类"""
    def __init__(self):
        self.question_type = 'single'  # single, multiple, shared_stem
        self.stem = ''
        self.options = []
        self.correct_answer = None
        self.explanation = ''
        self.subject = ''
        self.is_shared_stem = False
        self.shared_stem_content = ''


class DOCXToSQLConverter:
    """DOCX转SQL转换器"""
    
    # 标准科目名称
    VALID_SUBJECTS = ['基础兽医学', '预防兽医学', '临床兽医学', '综合应用']
    
    # 科目映射（支持更多输入格式）
    SUBJECT_MAPPING = {
        '基础': '基础兽医学',
        '基础兽医': '基础兽医学',
        '预防': '预防兽医学',
        '预防兽医': '预防兽医学',
        '临床': '临床兽医学',
        '临床兽医': '临床兽医学',
        '综合': '综合应用',
    }
    
    def __init__(self):
        self.questions: List[Question] = []
        self.errors: List[str] = []
        self.current_shared_stem = None
        
    def read_docx(self, file_path: str) -> str:
        """读取DOCX文件内容"""
        try:
            doc = Document(file_path)
            text = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text.append(paragraph.text.strip())
            return '\n'.join(text)
        except Exception as e:
            raise Exception(f"读取DOCX文件失败: {str(e)}")
    
    def normalize_subject(self, subject: str) -> str:
        """标准化科目名称"""
        subject = subject.strip()
        
        # 直接匹配
        if subject in self.VALID_SUBJECTS:
            return subject
        
        # 映射匹配
        if subject in self.SUBJECT_MAPPING:
            return self.SUBJECT_MAPPING[subject]
        
        # 模糊匹配
        for key, value in self.SUBJECT_MAPPING.items():
            if key in subject:
                return value
        
        # 默认返回临床兽医学
        return '临床兽医学'
    
    def parse_answer(self, answer_text: str, options_count: int) -> Tuple[List[int], str]:
        """
        解析答案
        返回: (答案索引列表, 题目类型)
        """
        answer_text = answer_text.strip().upper()
        
        # 移除常见的前缀
        answer_text = re.sub(r'^(答案|正确答案)[：:]\s*', '', answer_text)
        
        # 提取字母
        letters = re.findall(r'[A-Z]', answer_text)
        
        if not letters:
            raise ValueError(f"无法识别答案: {answer_text}")
        
        # 转换为索引
        indices = [ord(letter) - ord('A') for letter in letters]
        
        # 验证索引范围
        if any(idx >= options_count for idx in indices):
            raise ValueError(f"答案索引超出选项范围: {letters}")
        
        # 判断题目类型
        question_type = 'multiple' if len(indices) > 1 else 'single'
        
        return indices, question_type
    
    def parse_text(self, text: str, default_subject: str = '临床兽医学') -> List[Question]:
        """解析文本内容"""
        self.questions = []
        self.errors = []
        
        # 按题目分割（支持多种格式）
        question_blocks = re.split(r'\n\s*(?:题目\s*\d+|第?\s*\d+\s*[题、.]|\d+\s*[、.])\s*[：:]?\s*\n', text)
        
        # 如果没有明确的题号分割，尝试其他方式
        if len(question_blocks) <= 1:
            question_blocks = re.split(r'\n{2,}', text)
        
        for idx, block in enumerate(question_blocks, 1):
            if not block.strip():
                continue
            
            try:
                question = self._parse_question_block(block, default_subject)
                if question:
                    self.questions.append(question)
            except Exception as e:
                error_msg = f"题目 {idx} 解析失败: {str(e)}"
                self.errors.append(error_msg)
                print(f"⚠️  {error_msg}")
        
        return self.questions
    
    def _parse_question_block(self, block: str, default_subject: str) -> Optional[Question]:
        """解析单个题目块"""
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        
        if not lines:
            return None
        
        question = Question()
        
        # 提取各部分
        stem_lines = []
        options = []
        answer = None
        explanation = None
        subject = default_subject
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # 检测答案行
            if re.match(r'^(答案|正确答案)[：:]\s*.+', line):
                answer = re.sub(r'^(答案|正确答案)[：:]\s*', '', line)
                i += 1
                continue
            
            # 检测解析行
            if re.match(r'^(解析|答案解析|解释|说明)[：:]\s*.+', line):
                explanation = re.sub(r'^(解析|答案解析|解释|说明)[：:]\s*', '', line)
                # 可能有多行解析
                while i + 1 < len(lines) and not re.match(r'^[A-Z]\.', lines[i + 1]) and not re.match(r'^(科目|答案)', lines[i + 1]):
                    i += 1
                    explanation += ' ' + lines[i]
                i += 1
                continue
            
            # 检测科目行
            if re.match(r'^科目[：:]\s*.+', line):
                subject = re.sub(r'^科目[：:]\s*', '', line)
                i += 1
                continue
            
            # 检测选项行
            if re.match(r'^[A-E]\.', line):
                options.append(line)
                i += 1
                continue
            
            # 其他行作为题干
            stem_lines.append(line)
            i += 1
        
        # 组装题目
        question.stem = ' '.join(stem_lines).strip()
        question.options = options
        question.subject = self.normalize_subject(subject)
        question.explanation = explanation.strip() if explanation else '暂无解析'
        
        # 检测必填字段
        if not question.stem:
            raise ValueError("缺少题干")
        
        if not options:
            raise ValueError("缺少选项")
        
        if not answer:
            raise ValueError("缺少答案")
        
        # 解析答案
        answer_indices, question_type = self.parse_answer(answer, len(options))
        question.question_type = question_type
        question.correct_answer = answer_indices
        
        return question
    
    def generate_sql(self, output_file: str = None) -> str:
        """生成SQL语句"""
        if not self.questions:
            return "-- 没有可生成的题目\n"
        
        sql_lines = []
        sql_lines.append("-- 兽医考试题目导入")
        sql_lines.append(f"-- 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        sql_lines.append(f"-- 题目数量: {len(self.questions)}")
        sql_lines.append("")
        
        for idx, question in enumerate(self.questions, 1):
            sql_lines.append(f"-- 题目 {idx}: {question.question_type}")
            sql_lines.append(self._generate_insert_statement(question))
            sql_lines.append("")
        
        sql_content = '\n'.join(sql_lines)
        
        # 保存到文件
        if output_file:
            try:
                Path(output_file).write_text(sql_content, encoding='utf-8')
            except Exception as e:
                raise Exception(f"保存SQL文件失败: {str(e)}")
        
        return sql_content
    
    def _generate_insert_statement(self, question: Question) -> str:
        """生成单个INSERT语句"""
        # 转义字符串
        def escape_sql(text):
            if text is None:
                return ''
            return text.replace("'", "''")
        
        # 生成选项JSON
        options_json = json.dumps(question.options, ensure_ascii=False)
        
        # 生成答案JSON
        if question.question_type == 'single':
            answer_json = str(question.correct_answer[0])
        else:
            answer_json = json.dumps(question.correct_answer)
        
        # 生成INSERT语句
        sql = f"""INSERT INTO vet_exam_questions (question_type, stem, options, correct_answer, explanation, subject)
VALUES (
    '{question.question_type}',
    '{escape_sql(question.stem)}',
    '{options_json}',
    '{answer_json}',
    '{escape_sql(question.explanation)}',
    '{question.subject}'
);"""
        
        return sql


class DOCXToSQLGUI:
    """图形界面"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("DOCX 转 SQL 工具 - 兽医考试题库")
        self.root.geometry("900x700")
        
        self.converter = DOCXToSQLConverter()
        self.input_file = None
        self.output_file = None
        
        self._create_widgets()
    
    def _create_widgets(self):
        """创建界面组件"""
        # 标题
        title_frame = ttk.Frame(self.root, padding="10")
        title_frame.pack(fill=tk.X)
        
        ttk.Label(title_frame, text="DOCX 转 SQL 工具", font=('Arial', 16, 'bold')).pack()
        ttk.Label(title_frame, text="将兽医考试题目DOCX文件转换为SQL格式", font=('Arial', 10)).pack()
        
        # 文件选择区域
        file_frame = ttk.LabelFrame(self.root, text="文件选择", padding="10")
        file_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # 输入文件
        input_row = ttk.Frame(file_frame)
        input_row.pack(fill=tk.X, pady=5)
        ttk.Label(input_row, text="输入文件:", width=10).pack(side=tk.LEFT)
        self.input_entry = ttk.Entry(input_row, width=50)
        self.input_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(input_row, text="浏览...", command=self.browse_input).pack(side=tk.LEFT)
        
        # 输出文件
        output_row = ttk.Frame(file_frame)
        output_row.pack(fill=tk.X, pady=5)
        ttk.Label(output_row, text="输出文件:", width=10).pack(side=tk.LEFT)
        self.output_entry = ttk.Entry(output_row, width=50)
        self.output_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(output_row, text="浏览...", command=self.browse_output).pack(side=tk.LEFT)
        
        # 设置区域
        settings_frame = ttk.LabelFrame(self.root, text="设置", padding="10")
        settings_frame.pack(fill=tk.X, padx=10, pady=5)
        
        subject_row = ttk.Frame(settings_frame)
        subject_row.pack(fill=tk.X, pady=5)
        ttk.Label(subject_row, text="默认科目:", width=10).pack(side=tk.LEFT)
        self.subject_var = tk.StringVar(value='临床兽医学')
        subject_combo = ttk.Combobox(subject_row, textvariable=self.subject_var, 
                                     values=DOCXToSQLConverter.VALID_SUBJECTS, width=20)
        subject_combo.pack(side=tk.LEFT, padx=5)
        
        # 操作按钮
        button_frame = ttk.Frame(self.root, padding="10")
        button_frame.pack(fill=tk.X)
        
        ttk.Button(button_frame, text="开始转换", command=self.convert, 
                  style='Accent.TButton').pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="清空", command=self.clear).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="退出", command=self.root.quit).pack(side=tk.RIGHT, padx=5)
        
        # 预览区域
        preview_frame = ttk.LabelFrame(self.root, text="SQL 预览", padding="10")
        preview_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        self.preview_text = scrolledtext.ScrolledText(preview_frame, wrap=tk.WORD, 
                                                      font=('Consolas', 9))
        self.preview_text.pack(fill=tk.BOTH, expand=True)
        
        # 状态栏
        self.status_var = tk.StringVar(value="就绪")
        status_bar = ttk.Label(self.root, textvariable=self.status_var, relief=tk.SUNKEN)
        status_bar.pack(fill=tk.X, side=tk.BOTTOM)
    
    def browse_input(self):
        """浏览输入文件"""
        filename = filedialog.askopenfilename(
            title="选择 DOCX 文件",
            filetypes=[("Word文档", "*.docx"), ("所有文件", "*.*")]
        )
        if filename:
            self.input_file = filename
            self.input_entry.delete(0, tk.END)
            self.input_entry.insert(0, filename)
            
            # 自动设置输出文件名
            if not self.output_file:
                output = str(Path(filename).with_suffix('.sql'))
                self.output_file = output
                self.output_entry.delete(0, tk.END)
                self.output_entry.insert(0, output)
    
    def browse_output(self):
        """浏览输出文件"""
        filename = filedialog.asksaveasfilename(
            title="保存 SQL 文件",
            defaultextension=".sql",
            filetypes=[("SQL文件", "*.sql"), ("所有文件", "*.*")]
        )
        if filename:
            self.output_file = filename
            self.output_entry.delete(0, tk.END)
            self.output_entry.insert(0, filename)
    
    def convert(self):
        """执行转换"""
        if not self.input_file:
            messagebox.showerror("错误", "请选择输入文件")
            return
        
        if not self.output_file:
            messagebox.showerror("错误", "请指定输出文件")
            return
        
        try:
            self.status_var.set("正在读取文件...")
            self.root.update()
            
            # 读取DOCX
            text = self.converter.read_docx(self.input_file)
            
            self.status_var.set("正在解析题目...")
            self.root.update()
            
            # 解析题目
            questions = self.converter.parse_text(text, self.subject_var.get())
            
            if not questions and not self.converter.errors:
                messagebox.showwarning("警告", "未找到任何题目")
                self.status_var.set("就绪")
                return
            
            self.status_var.set("正在生成SQL...")
            self.root.update()
            
            # 生成SQL
            sql_content = self.converter.generate_sql(self.output_file)
            
            # 显示预览
            self.preview_text.delete('1.0', tk.END)
            self.preview_text.insert('1.0', sql_content)
            
            # 显示结果
            success_count = len(questions)
            error_count = len(self.converter.errors)
            
            result_msg = f"转换完成!\n\n"
            result_msg += f"✅ 成功: {success_count} 道题目\n"
            if error_count > 0:
                result_msg += f"⚠️  失败: {error_count} 道题目\n\n"
                result_msg += "失败详情:\n" + "\n".join(self.converter.errors[:5])
                if error_count > 5:
                    result_msg += f"\n... 还有 {error_count - 5} 个错误"
            
            messagebox.showinfo("转换完成", result_msg)
            self.status_var.set(f"完成 - 生成 {success_count} 道题目")
            
        except Exception as e:
            messagebox.showerror("错误", f"转换失败:\n{str(e)}")
            self.status_var.set("转换失败")
    
    def clear(self):
        """清空界面"""
        self.input_entry.delete(0, tk.END)
        self.output_entry.delete(0, tk.END)
        self.preview_text.delete('1.0', tk.END)
        self.input_file = None
        self.output_file = None
        self.status_var.set("就绪")


def main():
    """主函数"""
    root = tk.Tk()
    app = DOCXToSQLGUI(root)
    root.mainloop()


if __name__ == '__main__':
    main()
