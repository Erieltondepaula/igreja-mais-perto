# Script para criar atalho do IniciarTudo.bat com ícone personalizado
# Local: criar-atalho-com-icone.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Criando atalho com icone personalizado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$batPath = Join-Path $scriptPath "IniciarTudo.bat"
$iconPath = Join-Path $scriptPath "public\3.png"
$shortcutPath = Join-Path $scriptPath "Iniciar Sistema.lnk"

# Verificar se os arquivos existem
if (-not (Test-Path $batPath)) {
    Write-Host "ERRO: IniciarTudo.bat não encontrado!" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Test-Path $iconPath)) {
    Write-Host "ERRO: 3.png não encontrado em public\!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Arquivos encontrados:" -ForegroundColor Green
Write-Host "  BAT:   $batPath" -ForegroundColor Gray
Write-Host "  ICONE: $iconPath" -ForegroundColor Gray
Write-Host ""

# Criar atalho
Write-Host "Criando atalho..." -ForegroundColor Yellow
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = $batPath
$Shortcut.WorkingDirectory = $scriptPath
$Shortcut.Description = "Iniciar Sistema Completo - PostgreSQL + Backend + Frontend"
$Shortcut.IconLocation = $iconPath + ",0"
$Shortcut.Save()

Write-Host "OK: Atalho criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Localizacao: $shortcutPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora você pode:" -ForegroundColor Yellow
Write-Host "  1. Usar o atalho 'Iniciar Sistema.lnk' para iniciar o sistema" -ForegroundColor Gray
Write-Host "  2. Arrastar o atalho para a Área de Trabalho" -ForegroundColor Gray
Write-Host "  3. Fixar na Barra de Tarefas (clique direito no atalho)" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

pause
