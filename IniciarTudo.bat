@echo off
title Sistema Completo - PostgreSQL + Backend + Frontend + pgAdmin
color 0A
cls
echo.
echo ==========================================
echo SISTEMA COMPLETO - TODOS OS SERVICOS
echo ==========================================
echo.
echo Este script vai iniciar:
echo   1. PostgreSQL (se nao estiver rodando)
echo   2. Backup Automatico do Banco
echo   3. Backend API (Porta 5001)
echo   4. Frontend Build (Porta 8080)
echo   5. pgAdmin 4 (Porta 5050)
echo.
echo ==========================================
echo.

set /p CONFIRM="Deseja continuar? (S/n): "
if /i "%CONFIRM%"=="n" (
    echo Operacao cancelada.
    pause
    exit /b 0
)

echo.
echo [1/4] Verificando PostgreSQL...
echo ==========================================
netstat -ano | findstr ":5432" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL nao detectado. Tentando iniciar...
    net start postgresql-x64-17
    if %ERRORLEVEL% EQU 0 (
        echo OK: PostgreSQL iniciado!
    ) else (
        echo AVISO: Nao foi possivel iniciar PostgreSQL automaticamente.
        echo Inicie manualmente: net start postgresql-x64-17
        set /p CONTINUE="Continuar mesmo assim? (S/n): "
        if /i "!CONTINUE!"=="n" exit /b 1
    )
) else (
    echo OK: PostgreSQL ja esta rodando
)

echo.
echo [2/4] Criando Backup Automatico...
echo ==========================================
if exist "backend\backup-database.js" (
    echo Criando backup do banco de dados...
    cd backend
    node backup-database.js
    cd ..
    echo OK: Backup criado em backend\database\Backup_banco
) else (
    echo AVISO: Script de backup nao encontrado
)

echo.
echo [3/4] Iniciando Backend API...
echo ==========================================
if not exist "backend\server.js" (
    echo ERRO: backend\server.js nao encontrado!
    pause
    exit /b 1
)

taskkill /F /IM node.exe >nul 2>&1
echo Processos node anteriores finalizados

start "BACKEND-API" cmd /k "cd /d %~dp0backend && title BACKEND-API-5001 && color 02 && echo ================================= && echo BACKEND API - PORTA 5001 && echo ================================= && node server.js"

echo Aguardando backend inicializar...
timeout /t 8 /nobreak >nul
echo OK: Backend iniciado

echo.
echo [4/4] Iniciando Frontend Build...
echo ==========================================

REM Sempre rebuildar para garantir codigo atualizado
echo Verificando se build precisa ser recriada...
if exist "dist" (
    echo Removendo build antiga...
    rmdir /s /q dist
)

echo Criando nova build com codigo atualizado...
call npm run build
if not exist "dist" (
    echo ERRO: Falha ao criar build!
    pause
    exit /b 1
)
echo OK: Build criada com sucesso!

where http-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalando http-server...
    call npm install -g http-server
)

start "FRONTEND-BUILD" cmd /k "cd /d %~dp0dist && title FRONTEND-BUILD-8080 && color 03 && echo ================================= && echo FRONTEND BUILD - PORTA 8080 && echo ================================= && http-server -p 8080 -a localhost -P http://localhost:8080?"

echo Aguardando frontend inicializar...
timeout /t 5 /nobreak >nul
echo OK: Frontend iniciado

echo.
echo [5/5] Iniciando pgAdmin 4...
echo ==========================================

REM Procurar pgAdmin
set PGADMIN_PATH="C:\Program Files\pgAdmin 4\v8\runtime\pgAdmin4.exe"
if not exist %PGADMIN_PATH% (
    set PGADMIN_PATH="C:\Program Files (x86)\pgAdmin 4\runtime\pgAdmin4.exe"
)

if not exist %PGADMIN_PATH% (
    echo AVISO: pgAdmin nao encontrado
    echo Voce pode instalar em: https://www.pgadmin.org/download/
    echo.
    echo Sistema continuara sem pgAdmin...
) else (
    tasklist /FI "IMAGENAME eq pgAdmin4.exe" 2>NUL | find /I /N "pgAdmin4.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo pgAdmin ja esta em execucao
    ) else (
        echo Iniciando pgAdmin...
        start "" %PGADMIN_PATH%
        echo Aguardando pgAdmin inicializar...
        timeout /t 10 /nobreak >nul
        echo OK: pgAdmin iniciado
    )
)

echo.
echo ==========================================
echo TODOS OS SERVICOS INICIADOS!
echo ==========================================
echo.
echo STATUS DOS SERVICOS:
echo   [OK] PostgreSQL       localhost:5432
echo   [OK] Backend API      http://localhost:5001
echo   [OK] Frontend Build   http://localhost:8080
echo   [??] pgAdmin 4        http://localhost:5050
echo.
echo ACESSOS PRINCIPAIS:
echo   Aplicacao:            http://localhost:8080
echo   API Membros:          http://localhost:5001/api/members
echo   Banco de Dados:       pgAdmin em http://localhost:5050
echo.
echo CREDENCIAIS POSTGRES:
echo   Database: dashboard_membros
echo   User:     postgres
echo   Password: 252088
echo   Port:     5432
echo.
echo COMANDOS UTEIS:
echo   Parar Tudo:     Feche as janelas abertas
echo   Reiniciar:      Execute este arquivo novamente
echo   Ver Logs:       Acompanhe as janelas BACKEND e FRONTEND
echo.
echo ==========================================
echo.

set /p OPEN_ALL="Deseja abrir aplicacao e pgAdmin no navegador? (S/n): "
if /i not "%OPEN_ALL%"=="n" (
    echo.
    echo Abrindo navegador da aplicacao...
    timeout /t 2 /nobreak >nul
    start http://localhost:8080
    echo OK: Navegador da aplicacao aberto!
)

echo.
echo ==========================================
echo SISTEMA PRONTO PARA USO!
echo ==========================================
echo.
echo Pressione qualquer tecla para fechar esta janela...
echo (As janelas de servico continuarao rodando)
echo.
pause >nul
