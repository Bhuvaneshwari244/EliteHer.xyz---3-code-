@echo off
echo ========================================
echo Pushing Aura to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
)

REM Add remote
echo Adding/updating remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Bhuvaneshwari244/Aura.git

REM Add all files
echo Adding all files...
git add .

REM Commit
echo Committing changes...
git commit -m "Configure for single Vercel deployment - ready to deploy"

REM Push to main branch
echo Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo Done! Code pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import your repository: Bhuvaneshwari244/Aura
echo 3. Deploy with default settings
echo.
echo See DEPLOY_TO_VERCEL.md for detailed instructions
echo.
pause
