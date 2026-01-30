<<<<<<< HEAD
# Script para parar todos os serviços do Sistema de Membros
# Execute: .\stop-system.ps1

Write-Host "⛔ PARANDO SISTEMA DE MEMBROS" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Red
Write-Host ""

# Parar processos Node.js (backend e frontend)
Write-Host "🔍 Procurando processos Node.js..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "📋 Encontrados $($nodeProcesses.Count) processos Node.js" -ForegroundColor Gray
    
    foreach ($process in $nodeProcesses) {
        try {
            $process.Kill()
            Write-Host "✅ Processo Node.js (PID: $($process.Id)) encerrado" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Não foi possível encerrar processo PID: $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ℹ️ Nenhum processo Node.js encontrado" -ForegroundColor Gray
}

# Parar processos PowerShell dos terminais do sistema
Write-Host ""
Write-Host "🔍 Procurando terminais do sistema..." -ForegroundColor Yellow

$powershellProcesses = Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "*backend*" -or 
    $_.MainWindowTitle -like "*npm*" -or
    $_.MainWindowTitle -like "*vite*"
}

if ($powershellProcesses) {
    Write-Host "📋 Encontrados $($powershellProcesses.Count) terminais relacionados" -ForegroundColor Gray
    
    foreach ($process in $powershellProcesses) {
        try {
            $process.Kill()
            Write-Host "✅ Terminal (PID: $($process.Id)) encerrado" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Não foi possível encerrar terminal PID: $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ℹ️ Nenhum terminal relacionado encontrado" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ SISTEMA PARADO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Para reiniciar o sistema:" -ForegroundColor Cyan
Write-Host "   .\start-system.ps1" -ForegroundColor White
=======
# Script para parar todos os serviços do Sistema de Membros
# Execute: .\stop-system.ps1

Write-Host "⛔ PARANDO SISTEMA DE MEMBROS" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Red
Write-Host ""

# Parar processos Node.js (backend e frontend)
Write-Host "🔍 Procurando processos Node.js..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "📋 Encontrados $($nodeProcesses.Count) processos Node.js" -ForegroundColor Gray
    
    foreach ($process in $nodeProcesses) {
        try {
            $process.Kill()
            Write-Host "✅ Processo Node.js (PID: $($process.Id)) encerrado" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Não foi possível encerrar processo PID: $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ℹ️ Nenhum processo Node.js encontrado" -ForegroundColor Gray
}

# Parar processos PowerShell dos terminais do sistema
Write-Host ""
Write-Host "🔍 Procurando terminais do sistema..." -ForegroundColor Yellow

$powershellProcesses = Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "*backend*" -or 
    $_.MainWindowTitle -like "*npm*" -or
    $_.MainWindowTitle -like "*vite*"
}

if ($powershellProcesses) {
    Write-Host "📋 Encontrados $($powershellProcesses.Count) terminais relacionados" -ForegroundColor Gray
    
    foreach ($process in $powershellProcesses) {
        try {
            $process.Kill()
            Write-Host "✅ Terminal (PID: $($process.Id)) encerrado" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Não foi possível encerrar terminal PID: $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ℹ️ Nenhum terminal relacionado encontrado" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ SISTEMA PARADO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Para reiniciar o sistema:" -ForegroundColor Cyan
Write-Host "   .\start-system.ps1" -ForegroundColor White
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
Write-Host ""