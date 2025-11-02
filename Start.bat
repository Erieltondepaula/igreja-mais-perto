@echo off
chcp 65001 >nul
title 🚀 Iniciar Sistema Completo
color 0A

echo.
echo ========================================
echo 🚀 INICIANDO SISTEMA DE MEMBROS
echo ========================================
echo.

REM Parar processos existentes
taskkill /F /IM node.exe >nul 2>&1

echo 🔧 1. Iniciando Backend...
cd backend
start "BACKEND" cmd /k "node server.js"
cd ..

echo ⏳ Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo 🎨 2. Iniciando Frontend...
start "FRONTEND" cmd /k "npm run dev"

echo ⏳ Aguardando 8 segundos...
timeout /t 8 /nobreak >nul

echo.
echo ✅ SISTEMA INICIADO!
echo 🔧 Backend:  http://localhost:5001
echo 🎨 Frontend: http://localhost:3000
echo.

set /p OPEN="Abrir navegador? (S/n): "
if /i not "%OPEN%"=="n" start http://localhost:3000

echo.
echo 💡 Mantenha as janelas Backend e Frontend abertas!
pause