#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOCX 转 SQL 工具 - 改进版
专门处理带"题号"和"---"分隔符的格式
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
        self.question_type = 'single'
        self.stem = ''
        self.options = []
        self.correct_answer = None
        self.explanation = ''
        self.subject = ''


class ImprovedDOCXConverter:
    """改进的DOCX转换器"""
    
    VALID_SUBJECTS = ['基础兽医学', '预防兽医学', '临床兽医学', '综合应用']
    
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
    
    def read_docx(self, file_path: str) -> List[str]:
        """读取DOCX文件，返回段落列表"""
        try:
            doc = Document(file_path)
            return [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        except Exception as e:
            raise Exception(f"读取DOCX文件失败: {str(e)}")
    
    def normalize_subject(self, subject: str) -> str:
        """标准化科目名称"""
        subject = subject.strip()
        if subject in self.VALID_SUBJECTS:
            return subject
        if subject in self.SUBJECT_MAPPING:
            return self.SUBJECT_MAPPING[subject]
        for key, value in self.SUBJECT_MAPPING.items():
            if key in subject:
                return value
        return '临床兽医学'
    
    def parse_paragraphs(self, paragraphs: List[str], default_subject: str = '临床兽医学') -> List[Question]:
        """解析段落列表"""
        self.questions = []
        self.errors = []
        
        # 按 "---" 或 "题号" 分隔题目块
        question_blocks = []
        current_block = []
        
        for para in paragraphs:
            # 检测题目开始标记
            if para == '---' or re.match(r'^题号\s*\d+', para):
                if current_block:
                    question_blocks.append(current_block)
                    current_block = []
                if para != '---':  # "题号"行也加入新块
                    current_block.append(para)
            else:
                current_block.append(para)
        
        # 添加最后一个块
        if current_block:
            question_blocks.append(current_block)
        
        # 解析每个题目块
        for idx, block in enumerate(question_blocks, 1):
            if not block:
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
    
    def _parse_question_block(self, block: List[str], default_subject: str) -> Optional[Question]:
        """解析单个题目块"""
        question = Question()
        
        stem_lines = []
        options = []
        answer = None
        explanation = None
        subject = default_subject
        
        i = 0
        while i < len(block):
            line = block[i]
            
            # 跳过"题号"行
            if re.match(r'^题号\s*\d+', line):
                i += 1
                continue
            
            # 检测科目
            if re.match(r'^科目[：:]\s*.+', line):
                subject = re.sub(r'^科目[：:]\s*', '', line)
                i += 1
                continue
            
            # 检测答案
            if re.match(r'^答案[：:]\s*.+', line):
                answer = re.sub(r'^答案[：:]\s*', '', line)
                i += 1
                continue
            
            # 检测解析
            if re.match(r'^解析[：:]\s*.+', line):
                explanation = re.sub(r'^解析[：:]\s*', '', line)
                # 收集多行解析
                while i + 1 < len(block):
                    next_line = block[i + 1]
                    if (not re.match(r'^[A-E]\.', next_line) and 
                        not re.match(r'^(科目|答案|题号)', next_line)):
                        i += 1
                        explanation += ' ' + next_line
                    else:
                        break
                i += 1
                continue
            
            # 检测选项 (A. B. C. D. E.)
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
        
        # 检查必填字段
        if not question.stem:
            raise ValueError("缺少题干")
        if not options:
            raise ValueError("缺少选项")
        if not answer:
            raise ValueError("缺少答案")
        
        # 解析答案
        answer_indices, question_type = self._parse_answer(answer, len(options))
        question.question_type = question_type
        question.correct_answer = answer_indices
        
        return question
    
    def _parse_answer(self, answer_text: str, options_count: int) -> Tuple[List[int], str]:
        """解析答案"""
        answer_text = answer_text.strip().upper()
        letters = re.findall(r'[A-E]', answer_text)
        
        if not letters:
            raise ValueError(f"无法识别答案: {answer_text}")
        
        indices = [ord(letter) - ord('A') for letter in letters]
        
        if any(idx >= options_count for idx in indices):
            raise ValueError(f"答案索引超出选项范围: {letters}")
        
        question_type = 'multiple' if len(indices) > 1 else 'single'
        return indices, question_type
    
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
        
        if output_file:
            try:
                Path(output_file).write_text(sql_content, encoding='utf-8')
            except Exception as e:
                raise Exception(f"保存SQL文件失败: {str(e)}")
        
        return sql_content
    
    def _generate_insert_statement(self, question: Question) -> str:
        """生成INSERT语句"""
        def escape_sql(text):
            if text is None:
                return ''
            return text.replace("'", "''")
        
        options_json = json.dumps(question.options, ensure_ascii=False)
        
        if question.question_type == 'single':
            answer_json = str(question.correct_answer[0])
        else:
            answer_json = json.dumps(question.correct_answer)
        
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


class ImprovedGUI:
    """改进的图形界面"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("DOCX 转 SQL 工具 (改进版) - 兽医考试题库")
        self.root.geometry("900x700")
        
        self.converter = ImprovedDOCXConverter()
        self.input_file = None
        self.output_file = None
        
        self._create_widgets()
    
    def _create_widgets(self):
        """创建界面组件"""
        # 标题
        title_frame = ttk.Frame(self.root, padding="10")
        title_frame.pack(fill=tk.X)
        
        ttk.Label(title_frame, text="DOCX 转 SQL 工具 (改进版)", 
                  font=('Arial', 16, 'bold')).pack()
        ttk.Label(title_frame, text="支持带'题号'和'---'分隔符的格式", 
                  font=('Arial', 10), foreground='blue').pack()
        
        # 文件选择
        file_frame = ttk.LabelFrame(self.root, text="文件选择", padding="10")
        file_frame.pack(fill=tk.X, padx=10, pady=5)
        
        input_row = ttk.Frame(file_frame)
        input_row.pack(fill=tk.X, pady=5)
        ttk.Label(input_row, text="输入文件:", width=10).pack(side=tk.LEFT)
        self.input_entry = ttk.Entry(input_row, width=50)
        self.input_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(input_row, text="浏览...", command=self.browse_input).pack(side=tk.LEFT)
        
        output_row = ttk.Frame(file_frame)
        output_row.pack(fill=tk.X, pady=5)
        ttk.Label(output_row, text="输出文件:", width=10).pack(side=tk.LEFT)
        self.output_entry = ttk.Entry(output_row, width=50)
        self.output_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(output_row, text="浏览...", command=self.browse_output).pack(side=tk.LEFT)
        
        # 设置
        settings_frame = ttk.LabelFrame(self.root, text="设置", padding="10")
        settings_frame.pack(fill=tk.X, padx=10, pady=5)
        
        subject_row = ttk.Frame(settings_frame)
        subject_row.pack(fill=tk.X, pady=5)
        ttk.Label(subject_row, text="默认科目:", width=10).pack(side=tk.LEFT)
        self.subject_var = tk.StringVar(value='基础兽医学')
        subject_combo = ttk.Combobox(subject_row, textvariable=self.subject_var,
                                     values=ImprovedDOCXConverter.VALID_SUBJECTS, width=20)
        subject_combo.pack(side=tk.LEFT, padx=5)
        
        # 按钮
        button_frame = ttk.Frame(self.root, padding="10")
        button_frame.pack(fill=tk.X)
        
        ttk.Button(button_frame, text="开始转换", command=self.convert,
                  style='Accent.TButton').pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="分析文件", command=self.analyze).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="清空", command=self.clear).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="退出", command=self.root.quit).pack(side=tk.RIGHT, padx=5)
        
        # 预览
        preview_frame = ttk.LabelFrame(self.root, text="预览 / 分析结果", padding="10")
        preview_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        self.preview_text = scrolledtext.ScrolledText(preview_frame, wrap=tk.WORD,
                                                      font=('Consolas', 9))
        self.preview_text.pack(fill=tk.BOTH, expand=True)
        
        # 状态栏
        self.status_var = tk.StringVar(value="就绪 - 改进版工具")
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
    
    def analyze(self):
        """分析文件格式"""
        if not self.input_file:
            messagebox.showerror("错误", "请先选择输入文件")
            return
        
        try:
            self.status_var.set("正在分析文件...")
            self.root.update()
            
            paragraphs = self.converter.read_docx(self.input_file)
            
            # 显示分析结果
            result = f"文件分析结果\n"
            result += f"=" * 60 + "\n"
            result += f"文件: {Path(self.input_file).name}\n"
            result += f"总段落数: {len(paragraphs)}\n\n"
            result += f"前 50 行内容:\n"
            result += f"-" * 60 + "\n"
            
            for i, para in enumerate(paragraphs[:50], 1):
                result += f"{i:3d}. {para}\n"
            
            if len(paragraphs) > 50:
                result += f"-" * 60 + "\n"
                result += f"... 还有 {len(paragraphs) - 50} 行未显示\n"
            
            self.preview_text.delete('1.0', tk.END)
            self.preview_text.insert('1.0', result)
            
            self.status_var.set(f"分析完成 - 共 {len(paragraphs)} 段落")
            
        except Exception as e:
            messagebox.showerror("错误", f"分析失败:\n{str(e)}")
            self.status_var.set("分析失败")
    
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
            
            paragraphs = self.converter.read_docx(self.input_file)
            
            self.status_var.set("正在解析题目...")
            self.root.update()
            
            questions = self.converter.parse_paragraphs(paragraphs, self.subject_var.get())
            
            if not questions and not self.converter.errors:
                messagebox.showwarning("警告", "未找到任何题目")
                self.status_var.set("就绪")
                return
            
            self.status_var.set("正在生成SQL...")
            self.root.update()
            
            sql_content = self.converter.generate_sql(self.output_file)
            
            # 显示预览(只显示前10道题)
            preview_lines = sql_content.split('\n')
            if len(preview_lines) > 100:
                preview = '\n'.join(preview_lines[:100]) + f"\n\n... 还有 {len(preview_lines) - 100} 行未显示"
            else:
                preview = sql_content
            
            self.preview_text.delete('1.0', tk.END)
            self.preview_text.insert('1.0', preview)
            
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
        """清空"""
        self.input_entry.delete(0, tk.END)
        self.output_entry.delete(0, tk.END)
        self.preview_text.delete('1.0', tk.END)
        self.input_file = None
        self.output_file = None
        self.status_var.set("就绪 - 改进版工具")


def main():
    """主函数"""
    root = tk.Tk()
    app = ImprovedGUI(root)
    root.mainloop()


if __name__ == '__main__':
    main()
