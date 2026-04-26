@echo off
echo ========================================
echo Deploying Aura to Firebase
echo ========================================
echo.

echo Step 1: Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo Step 2: Deploying to Firebase...
call firebase deploy

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Visit your app at: https://your-project-id.web.app
echo.
pause
