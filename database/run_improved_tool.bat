@echo off
chcp 65001 >nul
echo ================================
echo  DOCX 转 SQL 工具 (改进版)
echo  支持带题号格式的文档
echo ================================
echo.

REM 检查 Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python
    pause
    exit /b 1
)

echo [√] 检测到 Python

REM 检查依赖
echo.
echo [*] 正在检查依赖库...
python -c "import docx" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] 缺少 python-docx 库，正在安装...
    pip install python-docx
)

echo [√] 依赖库已安装

REM 运行改进版工具
echo.
echo [*] 正在启动改进版工具...
echo.
python docx_to_sql_improved.py

if %errorlevel% neq 0 (
    echo.
    echo [错误] 工具运行出错
    pause
)
