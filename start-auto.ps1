<<<<<<< HEAD
# Script de Inicializacao Completa - Sistema de Membros
# Execute: .\start-auto.ps1

Write-Host "SISTEMA DE MEMBROS - INICIALIZACAO COMPLETA" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretorio correto
if (-not (Test-Path "backend\server.js")) {
    Write-Host "ERRO: Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    Write-Host "Navegue para: Dashboard_Membros\" -ForegroundColor Yellow
    exit 1
}

# Funcao para verificar porta
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

Write-Host "1. Verificando Microsoft Access..." -ForegroundColor Yellow
try {
    $healthResult = & node "backend\scripts\healthCheck.js" quick
    Write-Host "   Access verificado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "   Tentando reparar Access..." -ForegroundColor Yellow
    & node "backend\scripts\healthCheck.js" repair
}

Write-Host ""
Write-Host "2. Iniciando Backend..." -ForegroundColor Yellow

if (Test-Port 5001) {
    Write-Host "   Backend ja esta rodando na porta 5001" -ForegroundColor Yellow
} else {
    Write-Host "   Iniciando servidor backend..." -ForegroundColor Cyan
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'BACKEND - Sistema de Membros' -ForegroundColor Green; npm run dev"
    
    Write-Host "   Aguardando backend inicializar..." -ForegroundColor Gray
    $timeout = 30
    $count = 0
    while (-not (Test-Port 5001) -and $count -lt $timeout) {
        Start-Sleep -Seconds 1
        $count++
        if ($count % 5 -eq 0) { Write-Host "." -NoNewline -ForegroundColor Gray }
    }
    Write-Host ""
    
    if (Test-Port 5001) {
        Write-Host "   Backend iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   TIMEOUT ao iniciar backend" -ForegroundColor Red
        Write-Host "   Verifique o terminal do backend para erros" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "3. Iniciando Frontend..." -ForegroundColor Yellow

if (Test-Port 8080) {
    Write-Host "   Frontend ja esta rodando na porta 8080" -ForegroundColor Yellow
} else {
    Write-Host "   Iniciando interface React..." -ForegroundColor Cyan
    
    # Limpar cache se necessario
    if (Test-Path "node_modules\.vite") {
        Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'FRONTEND - Interface do Sistema' -ForegroundColor Blue; npm run dev"
    
    Write-Host "   Aguardando frontend inicializar..." -ForegroundColor Gray
    Start-Sleep -Seconds 8
}

Write-Host ""
Write-Host "4. Verificacao final..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$backendOk = Test-Port 5001
$frontendOk = Test-Port 8080

Write-Host "=============================================" -ForegroundColor Green
if ($backendOk -and $frontendOk) {
    Write-Host "SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
} elseif ($backendOk) {
    Write-Host "BACKEND OK - Frontend ainda carregando..." -ForegroundColor Yellow
} else {
    Write-Host "PROBLEMAS DETECTADOS - Verifique os terminais" -ForegroundColor Red
}
Write-Host "=============================================" -ForegroundColor Green

Write-Host ""
Write-Host "SERVICOS DISPONIVEIS:" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:8080" -ForegroundColor White
Write-Host "  Banco:       backend\database\MembrosDB.accdb" -ForegroundColor White

Write-Host ""
Write-Host "LINKS RAPIDOS:" -ForegroundColor Cyan
Write-Host "  Aplicacao:   http://localhost:8080" -ForegroundColor Yellow
Write-Host "  API Test:    http://localhost:5001/api/members" -ForegroundColor Yellow

Write-Host ""
Write-Host "COMANDOS UTEIS:" -ForegroundColor Cyan
Write-Host "  Verificar:   cd backend; npm run health-check" -ForegroundColor Gray
Write-Host "  Reparar:     cd backend; npm run health-repair" -ForegroundColor Gray
Write-Host "  Importar:    cd backend; npm run import-excel" -ForegroundColor Gray

Write-Host ""

# Perguntar se deve abrir navegador
if ($frontendOk) {
    $response = Read-Host "Deseja abrir o sistema no navegador? (Y/n)"
    if ($response -ne "n" -and $response -ne "N") {
        Write-Host "Abrindo navegador..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:8080"
    }
} else {
    Write-Host "Aguarde o frontend carregar e acesse: http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
=======
# Script de Inicializacao Completa - Sistema de Membros
# Execute: .\start-auto.ps1

Write-Host "SISTEMA DE MEMBROS - INICIALIZACAO COMPLETA" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretorio correto
if (-not (Test-Path "backend\server.js")) {
    Write-Host "ERRO: Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    Write-Host "Navegue para: Dashboard_Membros\" -ForegroundColor Yellow
    exit 1
}

# Funcao para verificar porta
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

Write-Host "1. Verificando Microsoft Access..." -ForegroundColor Yellow
try {
    $healthResult = & node "backend\scripts\healthCheck.js" quick
    Write-Host "   Access verificado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "   Tentando reparar Access..." -ForegroundColor Yellow
    & node "backend\scripts\healthCheck.js" repair
}

Write-Host ""
Write-Host "2. Iniciando Backend..." -ForegroundColor Yellow

if (Test-Port 5001) {
    Write-Host "   Backend ja esta rodando na porta 5001" -ForegroundColor Yellow
} else {
    Write-Host "   Iniciando servidor backend..." -ForegroundColor Cyan
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'BACKEND - Sistema de Membros' -ForegroundColor Green; npm run dev"
    
    Write-Host "   Aguardando backend inicializar..." -ForegroundColor Gray
    $timeout = 30
    $count = 0
    while (-not (Test-Port 5001) -and $count -lt $timeout) {
        Start-Sleep -Seconds 1
        $count++
        if ($count % 5 -eq 0) { Write-Host "." -NoNewline -ForegroundColor Gray }
    }
    Write-Host ""
    
    if (Test-Port 5001) {
        Write-Host "   Backend iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   TIMEOUT ao iniciar backend" -ForegroundColor Red
        Write-Host "   Verifique o terminal do backend para erros" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "3. Iniciando Frontend..." -ForegroundColor Yellow

if (Test-Port 8080) {
    Write-Host "   Frontend ja esta rodando na porta 8080" -ForegroundColor Yellow
} else {
    Write-Host "   Iniciando interface React..." -ForegroundColor Cyan
    
    # Limpar cache se necessario
    if (Test-Path "node_modules\.vite") {
        Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'FRONTEND - Interface do Sistema' -ForegroundColor Blue; npm run dev"
    
    Write-Host "   Aguardando frontend inicializar..." -ForegroundColor Gray
    Start-Sleep -Seconds 8
}

Write-Host ""
Write-Host "4. Verificacao final..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$backendOk = Test-Port 5001
$frontendOk = Test-Port 8080

Write-Host "=============================================" -ForegroundColor Green
if ($backendOk -and $frontendOk) {
    Write-Host "SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
} elseif ($backendOk) {
    Write-Host "BACKEND OK - Frontend ainda carregando..." -ForegroundColor Yellow
} else {
    Write-Host "PROBLEMAS DETECTADOS - Verifique os terminais" -ForegroundColor Red
}
Write-Host "=============================================" -ForegroundColor Green

Write-Host ""
Write-Host "SERVICOS DISPONIVEIS:" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:8080" -ForegroundColor White
Write-Host "  Banco:       backend\database\MembrosDB.accdb" -ForegroundColor White

Write-Host ""
Write-Host "LINKS RAPIDOS:" -ForegroundColor Cyan
Write-Host "  Aplicacao:   http://localhost:8080" -ForegroundColor Yellow
Write-Host "  API Test:    http://localhost:5001/api/members" -ForegroundColor Yellow

Write-Host ""
Write-Host "COMANDOS UTEIS:" -ForegroundColor Cyan
Write-Host "  Verificar:   cd backend; npm run health-check" -ForegroundColor Gray
Write-Host "  Reparar:     cd backend; npm run health-repair" -ForegroundColor Gray
Write-Host "  Importar:    cd backend; npm run import-excel" -ForegroundColor Gray

Write-Host ""

# Perguntar se deve abrir navegador
if ($frontendOk) {
    $response = Read-Host "Deseja abrir o sistema no navegador? (Y/n)"
    if ($response -ne "n" -and $response -ne "N") {
        Write-Host "Abrindo navegador..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:8080"
    }
} else {
    Write-Host "Aguarde o frontend carregar e acesse: http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
Write-Host "DICA: Mantenha os terminais abertos enquanto usar o sistema!" -ForegroundColor Yellow