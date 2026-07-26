@echo off
chcp 65001 >nul
cd /d "E:\repos\website"

echo.
echo 正在推送 NexHub 官网到 GitHub：nexhub-app/website ...
echo.

git push -u origin main

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo 上传成功！
    echo 请等待 1-2 分钟后访问：
    echo https://nexhub-app.github.io/website/
    echo ========================================
) else (
    echo.
    echo ========================================
    echo 上传失败，常见原因：
    echo.
    echo 1. 你没有权限向 "nexhub-app/website" 推送代码
    echo    请确认你是 "nexhub-app" 组织的成员，或仓库所有者。
    echo.
    echo 2. GitHub 已不允许用密码登录
    echo    第一次推送会弹出登录框，请用 Personal Access Token 或点"Sign in with browser"。
    echo    获取 Token：GitHub 头像 ^> Settings ^> Developer settings ^> Personal access tokens ^> Tokens ^(classic^) ^> Generate new token，勾选 repo。
    echo.
    echo 3. 如果你只想用自己的账号发布
    echo    告诉我，我把仓库地址改成 beiluo0z0/website，你再运行这个脚本。
    echo ========================================
)

echo.
pause
