@echo off
echo ========================================
echo     智能兽医大亨 - 网站更新脚本
echo ========================================
echo.

echo [1/2] 正在构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ 构建失败！请检查错误信息。
    pause
    exit /b 1
)

echo.
echo ✅ 构建成功！
echo.

echo [2/2] 正在部署到 Netlify...
call netlify deploy --prod
if %errorlevel% neq 0 (
    echo.
    echo ❌ 部署失败！请检查错误信息。
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 更新成功！网站已更新！
echo ========================================
echo.
echo 网站地址: https://sprightly-lily-cfbac0.netlify.app
echo.
pause
