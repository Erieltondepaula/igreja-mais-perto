@echo off
title Iniciar pgAdmin
color 0E
cls
echo.
echo ==========================================
echo INICIANDO pgAdmin 4
echo ==========================================
echo.

REM Verificar se pgAdmin esta instalado
set PGADMIN_PATH="C:\Program Files\pgAdmin 4\v8\runtime\pgAdmin4.exe"
if not exist %PGADMIN_PATH% (
    set PGADMIN_PATH="C:\Program Files (x86)\pgAdmin 4\runtime\pgAdmin4.exe"
)

if not exist %PGADMIN_PATH% (
    echo ERRO: pgAdmin nao encontrado!
    echo.
    echo Por favor, instale o pgAdmin 4:
    echo https://www.pgadmin.org/download/
    echo.
    pause
    exit /b 1
)

echo Verificando se pgAdmin ja esta rodando...
tasklist /FI "IMAGENAME eq pgAdmin4.exe" 2>NUL | find /I /N "pgAdmin4.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo pgAdmin ja esta em execucao!
    echo Abrindo navegador em http://localhost:5050...
    timeout /t 2 /nobreak >nul
    start http://localhost:5050/browser/
    echo.
    echo OK: pgAdmin aberto!
    pause
    exit /b 0
)

echo Iniciando pgAdmin 4...
start "" %PGADMIN_PATH%

echo Aguardando pgAdmin inicializar (15 segundos)...
timeout /t 15 /nobreak >nul

echo.
echo ==========================================
echo pgAdmin INICIADO COM SUCESSO!
echo ==========================================
echo.
echo Acesse: http://localhost:5050/browser/
echo.
echo CONFIGURACAO DE CONEXAO:
echo   Host: localhost
echo   Port: 5432
echo   Database: dashboard_membros
echo   Username: postgres
echo   Password: 252088
echo.
echo ==========================================
echo.

set /p BROWSER="Deseja abrir o navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo Abrindo pgAdmin no navegador...
    timeout /t 2 /nobreak >nul
    start http://localhost:5050/browser/
    echo OK: Navegador aberto!
)

echo.
pause
