<<<<<<< HEAD
@echo off
chcp 65001 >nul
title 🚀 Sistema de Membros - PostgreSQL
color 0A
echo.
echo ==========================================
echo 🚀 SISTEMA DE MEMBROS - POSTGRESQL
echo ==========================================
echo.
echo 📋 Verificando sistema...

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
echo � Verificando PostgreSQL...
echo ⚠️  Certifique-se que o PostgreSQL está rodando!
echo.
echo �🔧 Iniciando Backend (API PostgreSQL)...

REM Matar processos node existentes
taskkill /F /IM node.exe >nul 2>&1

REM Iniciar backend
echo 🔧 Iniciando Backend...
start "BACKEND-PostgreSQL" cmd /k "cd /d %~dp0backend && title BACKEND-PostgreSQL && color 02 && echo ============================= && echo 🔧 BACKEND RODANDO - PORTA 5001 && echo ============================= && node server.js"

echo ⏳ Aguardando backend (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo 🎨 Iniciando Frontend...

REM Iniciar frontend
start "FRONTEND-Vite" cmd /k "cd /d %~dp0 && title FRONTEND-Vite && color 03 && echo ============================= && echo 🎨 FRONTEND RODANDO - PORTA 3000 && echo ============================= && npm run dev"

echo ⏳ Aguardando frontend inicializar (3 segundos)...
timeout /t 3 /nobreak >nul

echo.
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo 📡 SERVIÇOS RODANDO:
echo    🔧 Backend API:  http://localhost:5001
echo    🎨 Frontend:     http://localhost:3000 (Vite)
echo    🐘 PostgreSQL:   localhost:5432 (dashboard_membros)
echo.
echo 🌐 ACESSOS:
echo    💻 Aplicação:    http://localhost:3000
echo    📊 API Status:   http://localhost:5001/api/members
echo    🆔 Teste ID:     http://localhost:5001/api/test-id/JOAO/SILVA
echo.
echo 📝 COMANDOS ÚTEIS:
echo    🔄 Para reiniciar: Execute este arquivo novamente
echo    ❌ Para parar:     Feche as janelas do terminal
echo    📥 Importar Excel: cd backend ^&^& node scripts\importPostgreSQL.js
echo    🔍 Ver pgAdmin:   Abra pgAdmin 4 e conecte ao dashboard_membros
echo.
echo 💡 DICA: Mantenha as janelas abertas enquanto usar o sistema!
echo ==========================================
echo.

REM Perguntar se quer abrir o navegador
set /p BROWSER="Deseja abrir o sistema no navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo 🌐 Abrindo navegador no Vite...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    echo ✅ Navegador aberto!
)

echo.
echo 🎉 SISTEMA PRONTO PARA USO!
echo Pressione qualquer tecla para fechar esta janela...
=======
@echo off
chcp 65001 >nul
title 🚀 Sistema de Membros - PostgreSQL
color 0A
echo.
echo ==========================================
echo 🚀 SISTEMA DE MEMBROS - POSTGRESQL
echo ==========================================
echo.
echo 📋 Verificando sistema...

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
echo � Verificando PostgreSQL...
echo ⚠️  Certifique-se que o PostgreSQL está rodando!
echo.
echo �🔧 Iniciando Backend (API PostgreSQL)...

REM Matar processos node existentes
taskkill /F /IM node.exe >nul 2>&1

REM Iniciar backend
echo 🔧 Iniciando Backend...
start "BACKEND-PostgreSQL" cmd /k "cd /d %~dp0backend && title BACKEND-PostgreSQL && color 02 && echo ============================= && echo 🔧 BACKEND RODANDO - PORTA 5001 && echo ============================= && node server.js"

echo ⏳ Aguardando backend (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo 🎨 Iniciando Frontend...

REM Iniciar frontend
start "FRONTEND-Vite" cmd /k "cd /d %~dp0 && title FRONTEND-Vite && color 03 && echo ============================= && echo 🎨 FRONTEND RODANDO - PORTA 3000 && echo ============================= && npm run dev"

echo ⏳ Aguardando frontend inicializar (3 segundos)...
timeout /t 3 /nobreak >nul

echo.
echo ✅ SISTEMA INICIADO COM SUCESSO!
echo ==========================================
echo 📡 SERVIÇOS RODANDO:
echo    🔧 Backend API:  http://localhost:5001
echo    🎨 Frontend:     http://localhost:3000 (Vite)
echo    🐘 PostgreSQL:   localhost:5432 (dashboard_membros)
echo.
echo 🌐 ACESSOS:
echo    💻 Aplicação:    http://localhost:3000
echo    📊 API Status:   http://localhost:5001/api/members
echo    🆔 Teste ID:     http://localhost:5001/api/test-id/JOAO/SILVA
echo.
echo 📝 COMANDOS ÚTEIS:
echo    🔄 Para reiniciar: Execute este arquivo novamente
echo    ❌ Para parar:     Feche as janelas do terminal
echo    📥 Importar Excel: cd backend ^&^& node scripts\importPostgreSQL.js
echo    🔍 Ver pgAdmin:   Abra pgAdmin 4 e conecte ao dashboard_membros
echo.
echo 💡 DICA: Mantenha as janelas abertas enquanto usar o sistema!
echo ==========================================
echo.

REM Perguntar se quer abrir o navegador
set /p BROWSER="Deseja abrir o sistema no navegador? (S/n): "
if /i not "%BROWSER%"=="n" (
    echo 🌐 Abrindo navegador no Vite...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    echo ✅ Navegador aberto!
)

echo.
echo 🎉 SISTEMA PRONTO PARA USO!
echo Pressione qualquer tecla para fechar esta janela...
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
pause >nul