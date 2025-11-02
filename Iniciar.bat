@echo off@echo off

title Servidor Local - Pasta DISTchcp 65001 >nul

color 0Atitle 🚀 Servidor Local - Pasta DIST

clscolor 0A

echo.echo.

echo ==========================================echo ==========================================

echo SERVIDOR LOCAL - PASTA DISTecho 🚀 SERVIDOR LOCAL - PASTA DIST

echo ==========================================echo ==========================================

echo.echo.

echo Verificando sistema...echo 📋 Verificando sistema...



REM Verificar se estamos no diretorio corretoREM Verificar se estamos no diretório correto

if not exist "package.json" (if not exist "package.json" (

    echo ERRO: Execute este arquivo na pasta raiz do projeto!    echo ❌ Execute este arquivo na pasta raiz do projeto!

    echo Navegue para: Dashboard_Membros\    echo 📁 Navegue para: Dashboard_Membros\

    pause    pause

    exit /b 1    exit /b 1

))



REM Verificar se a pasta dist existeREM Verificar se a pasta dist existe

if not exist "dist" (if not exist "dist" (

    echo Pasta 'dist' nao encontrada!    echo ⚠️  Pasta 'dist' não encontrada!

    echo Executando build do projeto...    echo 🔨 Executando build do projeto...

    call npm run build    call npm run build

    echo.    echo.

    if not exist "dist" (    if not exist "dist" (

        echo ERRO: Falha ao criar pasta dist!        echo ❌ Erro ao criar pasta dist!

        pause        pause

        exit /b 1        exit /b 1

    )    )

))



echo OK: Pasta dist encontradaecho ✅ Pasta dist encontrada

echo.echo.

echo Verificando http-server...echo � Verificando se http-server está instalado...



REM Verificar se http-server esta instalado globalmenteREM Verificar se http-server está instalado globalmente

where http-server >nul 2>&1where http-server >nul 2>&1

if %ERRORLEVEL% NEQ 0 (if %ERRORLEVEL% NEQ 0 (

    echo http-server nao encontrado. Instalando...    echo ⚠️  http-server não encontrado. Instalando globalmente...

    call npm install -g http-server    call npm install -g http-server

    echo OK: http-server instalado!    echo ✅ http-server instalado!

))



echo.echo.

echo Iniciando servidor local na pasta DIST...echo 🌐 Iniciando servidor local na pasta DIST...

echo Aguarde...echo ⏳ Aguarde...

echo.echo.



REM Matar processos http-server existentesREM Matar processos http-server existentes

taskkill /F /IM node.exe /FI "WINDOWTITLE eq SERVIDOR-DIST*" >nul 2>&1taskkill /F /IM node.exe /FI "WINDOWTITLE eq SERVIDOR-DIST*" >nul 2>&1



REM Iniciar servidor HTTP na pasta distREM Iniciar servidor HTTP na pasta dist

start "SERVIDOR-DIST" cmd /k "cd /d %~dp0dist && title SERVIDOR-DIST && color 03 && echo ============================= && echo SERVIDOR RODANDO - PORTA 8080 && echo Servindo: dist\ && echo ============================= && http-server -p 8080 -o"start "SERVIDOR-DIST" cmd /k "cd /d %~dp0dist && title SERVIDOR-DIST && color 03 && echo ============================= && echo 🌐 SERVIDOR RODANDO - PORTA 8080 && echo 📁 Servindo: dist\ && echo ============================= && http-server -p 8080 -o"



echo Aguardando servidor inicializar (3 segundos)...echo ⏳ Aguardando servidor inicializar (3 segundos)...

timeout /t 3 /nobreak >nultimeout /t 3 /nobreak >nul



echo.echo.

echo ==========================================echo ✅ SERVIDOR INICIADO COM SUCESSO!

echo SERVIDOR INICIADO COM SUCESSO!echo ==========================================

echo ==========================================echo 📡 SERVIÇO RODANDO:

echo.echo    🌐 Servidor:     http://localhost:8080

echo SERVICO RODANDO:echo    � Pasta:        dist\

echo    Servidor:     http://localhost:8080echo.

echo    Pasta:        dist\echo 🌐 ACESSO:

echo.echo    💻 Aplicação:    http://localhost:8080

echo ACESSO:echo.

echo    Aplicacao:    http://localhost:8080echo 📝 COMANDOS ÚTEIS:

echo.echo    🔄 Para reiniciar: Execute este arquivo novamente

echo COMANDOS UTEIS:echo    ❌ Para parar:     Feche a janela SERVIDOR-DIST

echo    Para reiniciar: Execute este arquivo novamenteecho    � Rebuild dist:   npm run build

echo    Para parar:     Feche a janela SERVIDOR-DISTecho.

echo    Rebuild dist:   npm run buildecho 💡 DICA: Mantenha a janela SERVIDOR-DIST aberta!

echo.echo ==========================================

echo DICA: Mantenha a janela SERVIDOR-DIST aberta!echo.

echo ==========================================echo 🎉 SERVIDOR PRONTO PARA USO!

echo.echo Pressione qualquer tecla para fechar esta janela...

echo SERVIDOR PRONTO PARA USO!pause >nul
echo.
pause
