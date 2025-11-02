@echo off
title Servidor Local - Pasta DIST
color 0A
cls
echo.
echo ==========================================
echo SERVIDOR LOCAL - PASTA DIST
echo ==========================================
echo.
echo Verificando sistema...
echo.

if not exist "package.json" (
    echo ERRO: Execute este arquivo na pasta raiz do projeto!
    pause
    exit /b 1
)

if not exist "dist" (
    echo Pasta dist nao encontrada!
    echo Executando build do projeto...
    call npm run build
    if not exist "dist" (
        echo ERRO: Falha ao criar pasta dist!
        pause
        exit /b 1
    )
)

echo OK: Pasta dist encontrada
echo.

where http-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalando http-server...
    call npm install -g http-server
)

echo.
echo Iniciando servidor na porta 8080...
echo.

taskkill /F /IM node.exe >nul 2>&1

start "SERVIDOR-DIST" cmd /k "cd /d %~dp0dist && title SERVIDOR-DIST && color 03 && http-server -p 8080 -a localhost"

timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo SERVIDOR INICIADO COM SUCESSO!
echo ==========================================
echo.
echo Acesse: http://localhost:8080
echo.
echo Para parar: Feche a janela SERVIDOR-DIST
echo ==========================================
echo.

start http://localhost:8080

pause
