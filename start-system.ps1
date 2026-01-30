<<<<<<< HEAD
# Script para iniciar o Sistema de Membros
# Execute: .\start-system.ps1

Write-Host "🚀 INICIANDO SISTEMA DE MEMBROS" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
$currentDir = Get-Location
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
    }
    catch {
        return $false
    }
}

Write-Host "🔍 Verificando sistema..." -ForegroundColor Cyan

# Verificar se o backend já está rodando
if (Test-Port 5001) {
    Write-Host "⚠️ Backend já está rodando na porta 5001" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Iniciando Backend..." -ForegroundColor Yellow
    # Iniciar backend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 Iniciando Backend API...' -ForegroundColor Green; npm run dev"
    
    # Aguardar backend inicializar
    Write-Host "⏳ Aguardando backend inicializar..." -ForegroundColor Gray
    $timeout = 30
    $count = 0
    while (-not (Test-Port 5001) -and $count -lt $timeout) {
        Start-Sleep -Seconds 1
        $count++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    Write-Host ""
    
    if (Test-Port 5001) {
        Write-Host "✅ Backend iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Timeout ao iniciar backend" -ForegroundColor Red
        exit 1
    }
}

# Verificar se o frontend já está rodando
if (Test-Port 5173) {
    Write-Host "⚠️ Frontend já está rodando na porta 5173" -ForegroundColor Yellow
} else {
    Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
    # Iniciar frontend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎨 Iniciando Frontend React...' -ForegroundColor Green; npm run dev"
    
    # Aguardar frontend inicializar
    Write-Host "⏳ Aguardando frontend inicializar..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "🎉 SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 SERVIÇOS RODANDO:" -ForegroundColor Cyan
Write-Host "   🔧 Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "   🎨 Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host "   🗃️ Banco:       backend\database\MembrosDB.accdb" -ForegroundColor White
Write-Host ""
Write-Host "🌐 ACESSOS RÁPIDOS:" -ForegroundColor Cyan
Write-Host "   💻 Aplicação:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "   📊 API Status:  http://localhost:5001/api/members" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "   📥 Importar Excel:  cd backend; node scripts\excelToAccess.js" -ForegroundColor Gray
Write-Host "   🔄 Resetar Banco:   cd backend; node scripts\setupDatabase.js --sample-data" -ForegroundColor Gray
Write-Host "   ❌ Parar Tudo:      Feche os terminais ou Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Tentar abrir o navegador automaticamente
$response = Read-Host "Deseja abrir o sistema no navegador? (Y/n)"
if ($response -ne "n" -and $response -ne "N") {
    Start-Process "http://localhost:5173"
    Write-Host "🌐 Navegador aberto!" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 DICA: Mantenha este script para iniciar o sistema sempre!" -ForegroundColor Yellow
=======
# Script para iniciar o Sistema de Membros
# Execute: .\start-system.ps1

Write-Host "🚀 INICIANDO SISTEMA DE MEMBROS" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
$currentDir = Get-Location
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
    }
    catch {
        return $false
    }
}

Write-Host "🔍 Verificando sistema..." -ForegroundColor Cyan

# Verificar se o backend já está rodando
if (Test-Port 5001) {
    Write-Host "⚠️ Backend já está rodando na porta 5001" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Iniciando Backend..." -ForegroundColor Yellow
    # Iniciar backend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 Iniciando Backend API...' -ForegroundColor Green; npm run dev"
    
    # Aguardar backend inicializar
    Write-Host "⏳ Aguardando backend inicializar..." -ForegroundColor Gray
    $timeout = 30
    $count = 0
    while (-not (Test-Port 5001) -and $count -lt $timeout) {
        Start-Sleep -Seconds 1
        $count++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    Write-Host ""
    
    if (Test-Port 5001) {
        Write-Host "✅ Backend iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Timeout ao iniciar backend" -ForegroundColor Red
        exit 1
    }
}

# Verificar se o frontend já está rodando
if (Test-Port 5173) {
    Write-Host "⚠️ Frontend já está rodando na porta 5173" -ForegroundColor Yellow
} else {
    Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
    # Iniciar frontend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎨 Iniciando Frontend React...' -ForegroundColor Green; npm run dev"
    
    # Aguardar frontend inicializar
    Write-Host "⏳ Aguardando frontend inicializar..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "🎉 SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 SERVIÇOS RODANDO:" -ForegroundColor Cyan
Write-Host "   🔧 Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "   🎨 Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host "   🗃️ Banco:       backend\database\MembrosDB.accdb" -ForegroundColor White
Write-Host ""
Write-Host "🌐 ACESSOS RÁPIDOS:" -ForegroundColor Cyan
Write-Host "   💻 Aplicação:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "   📊 API Status:  http://localhost:5001/api/members" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "   📥 Importar Excel:  cd backend; node scripts\excelToAccess.js" -ForegroundColor Gray
Write-Host "   🔄 Resetar Banco:   cd backend; node scripts\setupDatabase.js --sample-data" -ForegroundColor Gray
Write-Host "   ❌ Parar Tudo:      Feche os terminais ou Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Tentar abrir o navegador automaticamente
$response = Read-Host "Deseja abrir o sistema no navegador? (Y/n)"
if ($response -ne "n" -and $response -ne "N") {
    Start-Process "http://localhost:5173"
    Write-Host "🌐 Navegador aberto!" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 DICA: Mantenha este script para iniciar o sistema sempre!" -ForegroundColor Yellow
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
Write-Host "🔄 Para reiniciar: .\start-system.ps1" -ForegroundColor Yellow