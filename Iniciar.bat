@echo off
chcp 65001 >nul
title 🚀 Servidor Local - Pasta DIST
color 0A
echo.
echo ==========================================
echo 🚀 SERVIDOR LOCAL - PASTA DIST
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

REM Verificar se a pasta dist existe
if not exist "dist" (
    echo ⚠️  Pasta 'dist' não encontrada!
    echo 🔨 Executando build do projeto...
    call npm run build
    echo.
    if not exist "dist" (
        echo ❌ Erro ao criar pasta dist!
        pause
        exit /b 1
    )
)

echo ✅ Pasta dist encontrada
echo.
echo � Verificando se http-server está instalado...

REM Verificar se http-server está instalado globalmente
where http-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  http-server não encontrado. Instalando globalmente...
    call npm install -g http-server
    echo ✅ http-server instalado!
)

echo.
echo 🌐 Iniciando servidor local na pasta DIST...
echo ⏳ Aguarde...
echo.

REM Matar processos http-server existentes
taskkill /F /IM node.exe /FI "WINDOWTITLE eq SERVIDOR-DIST*" >nul 2>&1

REM Iniciar servidor HTTP na pasta dist
start "SERVIDOR-DIST" cmd /k "cd /d %~dp0dist && title SERVIDOR-DIST && color 03 && echo ============================= && echo 🌐 SERVIDOR RODANDO - PORTA 8080 && echo 📁 Servindo: dist\ && echo ============================= && http-server -p 8080 -o"

echo ⏳ Aguardando servidor inicializar (3 segundos)...
timeout /t 3 /nobreak >nul

echo.
echo ✅ SERVIDOR INICIADO COM SUCESSO!
echo ==========================================
echo 📡 SERVIÇO RODANDO:
echo    🌐 Servidor:     http://localhost:8080
echo    � Pasta:        dist\
echo.
echo 🌐 ACESSO:
echo    💻 Aplicação:    http://localhost:8080
echo.
echo 📝 COMANDOS ÚTEIS:
echo    🔄 Para reiniciar: Execute este arquivo novamente
echo    ❌ Para parar:     Feche a janela SERVIDOR-DIST
echo    � Rebuild dist:   npm run build
echo.
echo 💡 DICA: Mantenha a janela SERVIDOR-DIST aberta!
echo ==========================================
echo.
echo 🎉 SERVIDOR PRONTO PARA USO!
echo Pressione qualquer tecla para fechar esta janela...
pause >nul