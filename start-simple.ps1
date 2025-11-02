# Script simples para iniciar o sistema
Write-Host "🚀 Iniciando Sistema de Membros..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "backend\server.js")) {
    Write-Host "❌ Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "⏳ Aguardando 5 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "✅ SISTEMA INICIADO!" -ForegroundColor Green
Write-Host "📡 Backend:  http://localhost:5001" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abrir no navegador? (Y/n): " -NoNewline -ForegroundColor Yellow
$response = Read-Host
if ($response -ne "n") {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
}