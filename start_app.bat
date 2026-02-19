@echo off
title MindFlow Launcher
color 0A
echo ===================================================
echo    MindFlow - AI Study Assistant Launcher
echo ===================================================
echo.

echo [1/2] Starting Backend Server (Port 3000)...
:: Check if node_modules exists, if not install dependencies
if not exist "server\node_modules" (
    echo    Installing server dependencies...
    cd server && call npm install && cd ..
)
start "MindFlow Backend" /D "server" cmd /k "node index.js"

echo.
echo [2/2] Starting Frontend Client (Port 5173)...
:: Check if node_modules exists, if not install dependencies
if not exist "client\node_modules" (
    echo    Installing client dependencies...
    cd client && call npm install && cd ..
)
start "MindFlow Client" /D "client" cmd /k "npm run dev"

echo.
echo ===================================================
echo    All systems launch! 
echo    Open http://localhost:5173 to start studying.
echo ===================================================
echo.
pause
