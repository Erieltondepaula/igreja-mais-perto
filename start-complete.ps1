# Script de Inicialização Completa do Sistema de Membros
# Versão com Inicialização Automática do Access
# Execute: .\start-complete.ps1

Write-Host "🚀 SISTEMA DE MEMBROS - INICIALIZAÇÃO COMPLETA" -ForegroundColor Green
Write-Host "=" * 55 -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "backend\server.js")) {
    Write-Host "❌ Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    Write-Host "📁 Navegue para: Dashboard_Membros\" -ForegroundColor Yellow
    exit 1
}

# Função para verificar se uma porta está em uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

Write-Host "🔍 Verificando sistema..." -ForegroundColor Cyan

# 1. VERIFICAÇÃO E REPARO DO ACCESS
Write-Host "1️⃣ Verificando Microsoft Access..." -ForegroundColor Yellow
try {
    $healthCheck = Start-Process powershell -ArgumentList "-Command", "cd '$PWD\backend'; node scripts\healthCheck.js quick" -Wait -PassThru -NoNewWindow
    
    if ($healthCheck.ExitCode -eq 0) {
        Write-Host "   ✅ Microsoft Access funcionando corretamente!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Problemas detectados, tentando reparar..." -ForegroundColor Yellow
        $repair = Start-Process powershell -ArgumentList "-Command", "cd '$PWD\backend'; node scripts\healthCheck.js repair" -Wait -PassThru -NoNewWindow
        
        if ($repair.ExitCode -eq 0) {
            Write-Host "   ✅ Sistema reparado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Falha no reparo automático. Verifique manualmente." -ForegroundColor Red
            Write-Host "   💡 Execute: cd backend; node scripts\initializeAccess.js" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠️ Erro na verificação, continuando..." -ForegroundColor Yellow
}

Write-Host ""

# 2. INICIALIZAR BACKEND
Write-Host "2️⃣ Iniciando Backend com Access..." -ForegroundColor Yellow

if (Test-Port 5001) {
    Write-Host "   ⚠️ Backend já está rodando na porta 5001" -ForegroundColor Yellow
} else {
    Write-Host "   🔧 Iniciando servidor backend..." -ForegroundColor Cyan
    
    # Iniciar backend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
        cd '$PWD\backend'
        Write-Host '🔧 BACKEND - Sistema de Membros com Access' -ForegroundColor Green
        Write-Host '=' * 45 -ForegroundColor Green
        npm run dev
"@
    
    # Aguardar backend inicializar
    Write-Host "   ⏳ Aguardando backend inicializar..." -ForegroundColor Gray
    $timeout = 45
    $count = 0
    while (-not (Test-Port 5001) -and $count -lt $timeout) {
        Start-Sleep -Seconds 1
        $count++
        if ($count % 5 -eq 0) {
            Write-Host "." -NoNewline -ForegroundColor Gray
        }
    }
    Write-Host ""
    
    if (Test-Port 5001) {
        Write-Host "   ✅ Backend iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Timeout ao iniciar backend (${timeout}s)" -ForegroundColor Red
        Write-Host "   💡 Verifique o terminal do backend para erros" -ForegroundColor Yellow
    }
}

Write-Host ""

# 3. INICIALIZAR FRONTEND
Write-Host "3️⃣ Iniciando Frontend React..." -ForegroundColor Yellow

if (Test-Port 8080) {
    Write-Host "   ⚠️ Frontend já está rodando na porta 8080" -ForegroundColor Yellow
} else {
    Write-Host "   🎨 Iniciando interface..." -ForegroundColor Cyan
    
    # Limpar cache se necessário
    if (Test-Path "node_modules\.vite") {
        Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    }
    
    # Iniciar frontend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
        cd '$PWD'
        Write-Host '🎨 FRONTEND - Interface do Sistema' -ForegroundColor Blue
        Write-Host '=' * 40 -ForegroundColor Blue
        npm run dev
"@
    
    # Aguardar frontend inicializar
    Write-Host "   ⏳ Aguardando frontend inicializar..." -ForegroundColor Gray
    Start-Sleep -Seconds 8
    
    if (Test-Port 8080) {
        Write-Host "   ✅ Frontend iniciado!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Frontend pode estar iniciando..." -ForegroundColor Yellow
    }
}

Write-Host ""

# 4. VERIFICAÇÃO FINAL
Write-Host "4️⃣ Verificação final do sistema..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$backendOk = Test-Port 5001
$frontendOk = Test-Port 8080

Write-Host "=" * 55 -ForegroundColor Green
if ($backendOk -and $frontendOk) {
    Write-Host "🎉 SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
} elseif ($backendOk) {
    Write-Host "⚠️ BACKEND OK - Frontend ainda carregando..." -ForegroundColor Yellow
} else {
    Write-Host "❌ PROBLEMAS DETECTADOS - Verifique os terminais" -ForegroundColor Red
}
Write-Host "=" * 55 -ForegroundColor Green

Write-Host ""
Write-Host "📡 SERVIÇOS DISPONÍVEIS:" -ForegroundColor Cyan
Write-Host "   🔧 Backend API:" -NoNewline -ForegroundColor White
if ($backendOk) {
    Write-Host " http://localhost:5001 ✅" -ForegroundColor Green
} else {
    Write-Host " http://localhost:5001 ❌" -ForegroundColor Red
}

Write-Host "   🎨 Frontend:   " -NoNewline -ForegroundColor White
if ($frontendOk) {
    Write-Host " http://localhost:8080 ✅" -ForegroundColor Green
} else {
    Write-Host " http://localhost:8080 ⏳" -ForegroundColor Yellow
}

Write-Host "   🗃️ Banco Access: backend\database\MembrosDB.accdb" -ForegroundColor White

Write-Host ""
Write-Host "🌐 LINKS RÁPIDOS:" -ForegroundColor Cyan
Write-Host "   💻 Aplicação:    http://localhost:8080" -ForegroundColor Yellow
Write-Host "   📊 API Test:     http://localhost:5001/api/members" -ForegroundColor Yellow
Write-Host "   ❤️ Health Check: cd backend; node scripts\healthCheck.js" -ForegroundColor Gray

Write-Host ""
Write-Host "📝 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "   🔍 Verificar sistema:   cd backend; node scripts\healthCheck.js" -ForegroundColor Gray
Write-Host "   🔧 Reparar Access:      cd backend; node scripts\healthCheck.js repair" -ForegroundColor Gray
Write-Host "   📥 Importar Excel:      cd backend; node scripts\excelToAccess.js" -ForegroundColor Gray
Write-Host "   🔄 Resetar banco:       cd backend; node scripts\setupDatabase.js" -ForegroundColor Gray

Write-Host ""

# Perguntar se deve abrir navegador
$openBrowser = $true
if ($frontendOk) {
    $response = Read-Host "Deseja abrir o sistema no navegador? (Y/n)"
    $openBrowser = ($response -ne "n" -and $response -ne "N")
}

if ($openBrowser -and $frontendOk) {
    Write-Host "🌐 Abrindo navegador..." -ForegroundColor Green
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:8080"
} elseif ($openBrowser) {
    Write-Host "⏳ Aguarde o frontend carregar e acesse: http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 DICA: Mantenha os terminais abertos enquanto usar o sistema!" -ForegroundColor Yellow
Write-Host "🔄 Para reiniciar: .\start-complete.ps1" -ForegroundColor Cyan