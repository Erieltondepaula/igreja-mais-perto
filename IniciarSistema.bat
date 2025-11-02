<<<<<<< HEAD
@echo off
chcp 65001 >nul
title 🚀 Sistema de Membros - PostgreSQL
color 0A
cls

echo.
echo ==========================================
echo 🚀 SISTEMA DE MEMBROS - POSTGRESQL
echo ==========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Execute este arquivo na pasta raiz do projeto!
    echo 📁 Navegue para: Dashboard_Membros\
    pause
    exit /b 1
)

if not exist "backend\server.js" (
    echo ❌ Arquivo backend\server.js não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivos do projeto encontrados
echo.

REM Parar processos existentes
echo 🔄 Parando processos node existentes...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Processos anteriores finalizados

echo.
echo 🐘 Verificando PostgreSQL...
echo ⚠️  Certifique-se que o PostgreSQL está rodando!
echo.

echo 🔧 Iniciando Backend (API PostgreSQL)...
start "Backend - PostgreSQL API" cmd /k "cd /d %~dp0backend && title Backend - PostgreSQL API && echo ================================= && echo 🔧 BACKEND POSTGRESQL - PORTA 5001 && echo ================================= && echo. && echo 🐘 Conectando ao PostgreSQL... && node server.js"

echo ⏳ Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo 🎨 Iniciando Frontend (Vite)...
start "Frontend - Vite React" cmd /k "cd /d %~dp0 && title Frontend - Vite React && echo ================================= && echo 🎨 FRONTEND VITE - PORTA 3000 && echo ================================= && echo. && echo 🚀 Iniciando Vite... && npm run dev"

echo ⏳ Aguardando frontend inicializar (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo 📡 SERVIÇOS RODANDO:
echo    🔧 Backend API:  http://localhost:5001
echo    🎨 Frontend:     http://localhost:3000
echo    🐘 PostgreSQL:   localhost:5432 (dashboard_membros)
echo.
echo 🌐 ACESSOS PRINCIPAIS:
echo    💻 Aplicação:    http://localhost:3000
echo    📊 API Membros:  http://localhost:5001/api/members
echo    🆔 Teste ID:     http://localhost:5001/api/test-id/JOAO/SILVA
echo.
echo 📋 DADOS IMPORTADOS:
echo    👥 98 membros do Excel IBVP
echo    🆔 IDs personalizados: AA20251030175450
echo.
echo 📝 COMANDOS ÚTEIS:
echo    🔄 Reiniciar:     Execute este arquivo novamente
echo    ❌ Parar:         Feche as janelas do Backend e Frontend
echo    📥 Reimportar:    cd backend ^&^& node scripts\importPostgreSQL.js
echo    🔍 Ver Dados:     Abra pgAdmin 4 ^&^& conecte ao dashboard_membros
echo.
echo 💡 DICA: Mantenha as 2 janelas abertas (Backend + Frontend)!
echo ==========================================
echo.

set /p BROWSER="🌐 Deseja abrir o sistema no navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo.
    echo 🌐 Abrindo navegador em http://localhost:3000...
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
    echo ✅ Navegador aberto!
)

echo.
echo 🎉 SISTEMA PRONTO PARA USO!
echo.
echo ⚠️  IMPORTANTE: NÃO feche esta janela enquanto usar o sistema
echo 📱 Para acessar: http://localhost:3000
echo.
echo Pressione qualquer tecla para minimizar esta janela...
pause >nul

REM Minimizar janela mas manter aberta
=======
@echo off
chcp 65001 >nul
title 🚀 Sistema de Membros - PostgreSQL
color 0A
cls

echo.
echo ==========================================
echo 🚀 SISTEMA DE MEMBROS - POSTGRESQL
echo ==========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Execute este arquivo na pasta raiz do projeto!
    echo 📁 Navegue para: Dashboard_Membros\
    pause
    exit /b 1
)

if not exist "backend\server.js" (
    echo ❌ Arquivo backend\server.js não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivos do projeto encontrados
echo.

REM Parar processos existentes
echo 🔄 Parando processos node existentes...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Processos anteriores finalizados

echo.
echo 🐘 Verificando PostgreSQL...
echo ⚠️  Certifique-se que o PostgreSQL está rodando!
echo.

echo 🔧 Iniciando Backend (API PostgreSQL)...
start "Backend - PostgreSQL API" cmd /k "cd /d %~dp0backend && title Backend - PostgreSQL API && echo ================================= && echo 🔧 BACKEND POSTGRESQL - PORTA 5001 && echo ================================= && echo. && echo 🐘 Conectando ao PostgreSQL... && node server.js"

echo ⏳ Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo 🎨 Iniciando Frontend (Vite)...
start "Frontend - Vite React" cmd /k "cd /d %~dp0 && title Frontend - Vite React && echo ================================= && echo 🎨 FRONTEND VITE - PORTA 3000 && echo ================================= && echo. && echo 🚀 Iniciando Vite... && npm run dev"

echo ⏳ Aguardando frontend inicializar (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo 📡 SERVIÇOS RODANDO:
echo    🔧 Backend API:  http://localhost:5001
echo    🎨 Frontend:     http://localhost:3000
echo    🐘 PostgreSQL:   localhost:5432 (dashboard_membros)
echo.
echo 🌐 ACESSOS PRINCIPAIS:
echo    💻 Aplicação:    http://localhost:3000
echo    📊 API Membros:  http://localhost:5001/api/members
echo    🆔 Teste ID:     http://localhost:5001/api/test-id/JOAO/SILVA
echo.
echo 📋 DADOS IMPORTADOS:
echo    👥 98 membros do Excel IBVP
echo    🆔 IDs personalizados: AA20251030175450
echo.
echo 📝 COMANDOS ÚTEIS:
echo    🔄 Reiniciar:     Execute este arquivo novamente
echo    ❌ Parar:         Feche as janelas do Backend e Frontend
echo    📥 Reimportar:    cd backend ^&^& node scripts\importPostgreSQL.js
echo    🔍 Ver Dados:     Abra pgAdmin 4 ^&^& conecte ao dashboard_membros
echo.
echo 💡 DICA: Mantenha as 2 janelas abertas (Backend + Frontend)!
echo ==========================================
echo.

set /p BROWSER="🌐 Deseja abrir o sistema no navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo.
    echo 🌐 Abrindo navegador em http://localhost:3000...
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
    echo ✅ Navegador aberto!
)

echo.
echo 🎉 SISTEMA PRONTO PARA USO!
echo.
echo ⚠️  IMPORTANTE: NÃO feche esta janela enquanto usar o sistema
echo 📱 Para acessar: http://localhost:3000
echo.
echo Pressione qualquer tecla para minimizar esta janela...
pause >nul

REM Minimizar janela mas manter aberta
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
powershell -window minimized -command ""