@echo off
title Sistema Desenvolvimento - Frontend + Backend PostgreSQL
color 0A
cls
echo.
echo ==========================================
echo SISTEMA DESENVOLVIMENTO - DEV MODE
echo ==========================================
echo.
echo Verificando sistema...

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

echo Parando processos node existentes...
taskkill /F /IM node.exe >nul 2>&1
echo OK: Processos anteriores finalizados
echo.

echo Verificando PostgreSQL...
echo IMPORTANTE: Certifique-se que o PostgreSQL esta rodando!
echo.

echo Iniciando Backend PostgreSQL (Porta 5001)...
start "BACKEND-PostgreSQL" cmd /k "cd /d %~dp0backend && title BACKEND-PostgreSQL && color 02 && echo ================================= && echo BACKEND POSTGRESQL - PORTA 5001 && echo ================================= && node server.js"

echo Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo Iniciando Frontend Vite Dev (Porta 5173)...
start "FRONTEND-Vite-Dev" cmd /k "cd /d %~dp0 && title FRONTEND-Vite-Dev && color 03 && echo ================================= && echo FRONTEND VITE DEV - PORTA 5173 && echo ================================= && npm run dev"

echo Aguardando frontend inicializar (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo.
echo SERVICOS RODANDO:
echo    Backend API:     http://localhost:5001
echo    Frontend Dev:    http://localhost:5173
echo    PostgreSQL:      localhost:5432
echo.
echo ACESSOS:
echo    Aplicacao:       http://localhost:5173
echo    API Membros:     http://localhost:5001/api/members
echo    Teste ID:        http://localhost:5001/api/test-id/JOAO/SILVA
echo.
echo COMANDOS UTEIS:
echo    Reiniciar:       Execute este arquivo novamente
echo    Parar:           Feche as janelas BACKEND e FRONTEND
echo    Hot Reload:      Ativado automaticamente no Vite
echo.
echo DICA: Mantenha as 2 janelas abertas!
echo ==========================================
echo.

set /p BROWSER="Deseja abrir o navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo.
    echo Abrindo navegador em http://localhost:5173...
    timeout /t 3 /nobreak >nul
    start http://localhost:5173
    echo OK: Navegador aberto!
)

echo.
echo SISTEMA PRONTO PARA DESENVOLVIMENTO!
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
