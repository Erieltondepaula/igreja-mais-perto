@echo off
title Sistema Completo - Build + Backend + PostgreSQL
color 0A
cls
echo.
echo ==========================================
echo SISTEMA COMPLETO - PRODUCAO
echo ==========================================
echo.
echo Verificando sistema...
echo.

if not exist "package.json" (
    echo ERRO: Execute este arquivo na pasta raiz do projeto!
    pause
    exit /b 1
)

if not exist "backend\server.js" (
    echo ERRO: Arquivo backend\server.js nao encontrado!
    pause
    exit /b 1
)

echo OK: Arquivos do projeto encontrados
echo.

REM Verificar PostgreSQL
echo Verificando se PostgreSQL esta rodando...
netstat -ano | findstr ":5432" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo AVISO: PostgreSQL nao detectado na porta 5432!
    echo Por favor, inicie o PostgreSQL manualmente:
    echo   1. Abra "Servicos" do Windows
    echo   2. Procure por "postgresql-x64-17"
    echo   3. Clique em "Iniciar"
    echo.
    echo OU execute: net start postgresql-x64-17
    echo.
    set /p START_PG="Deseja tentar iniciar PostgreSQL automaticamente? (S/n): "
    if /i not "!START_PG!"=="n" (
        echo Iniciando PostgreSQL...
        net start postgresql-x64-17
        if %ERRORLEVEL% EQU 0 (
            echo OK: PostgreSQL iniciado com sucesso!
        ) else (
            echo ERRO: Falha ao iniciar PostgreSQL automaticamente.
            echo Inicie manualmente e pressione qualquer tecla para continuar...
            pause >nul
        )
    )
) else (
    echo OK: PostgreSQL esta rodando na porta 5432
)
echo.

REM Verificar e criar build se necessario
if not exist "dist" (
    echo Pasta dist nao encontrada!
    echo Executando build do projeto...
    call npm run build
    if not exist "dist" (
        echo ERRO: Falha ao criar pasta dist!
        pause
        exit /b 1
    )
    echo OK: Build concluida com sucesso!
) else (
    echo OK: Pasta dist encontrada
)
echo.

REM Instalar http-server se necessario
where http-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalando http-server...
    call npm install -g http-server
)

echo Parando processos node existentes...
taskkill /F /IM node.exe >nul 2>&1
echo OK: Processos anteriores finalizados
echo.

echo Iniciando Backend PostgreSQL (Porta 5001)...
start "BACKEND-PostgreSQL" cmd /k "cd /d %~dp0backend && title BACKEND-PostgreSQL && color 02 && echo ================================= && echo BACKEND POSTGRESQL - PORTA 5001 && echo ================================= && node server.js"

echo Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo Iniciando Frontend Build (Porta 8080)...
start "FRONTEND-Build" cmd /k "cd /d %~dp0dist && title FRONTEND-Build && color 03 && echo ================================= && echo FRONTEND BUILD - PORTA 8080 && echo ================================= && http-server -p 8080 -a localhost --proxy http://localhost:8080?"

echo Aguardando frontend inicializar (5 segundos)...
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo.
echo SERVICOS RODANDO:
echo    PostgreSQL:      localhost:5432 (dashboard_membros)
echo    Backend API:     http://localhost:5001
echo    Frontend Build:  http://localhost:8080
echo.
echo ACESSOS:
echo    Aplicacao:       http://localhost:8080
echo    API Membros:     http://localhost:5001/api/members
echo    pgAdmin:         http://localhost:5050 (se instalado)
echo.
echo COMANDOS UTEIS:
echo    Reiniciar:       Execute este arquivo novamente
echo    Parar:           Feche as janelas BACKEND e FRONTEND
echo    Ver Logs:        Acompanhe as janelas abertas
echo.
echo DICA: Mantenha as 2 janelas abertas!
echo ==========================================
echo.

set /p BROWSER="Deseja abrir o navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo.
    echo Abrindo navegador em http://localhost:8080...
    timeout /t 3 /nobreak >nul
    start http://localhost:8080
    echo OK: Navegador aberto!
)

echo.
echo SISTEMA PRONTO!
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
