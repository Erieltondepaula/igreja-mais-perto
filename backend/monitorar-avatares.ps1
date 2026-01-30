# Monitor em tempo real da pasta de avatares
# Deixe este script rodando enquanto faz o upload

Write-Host "`n👁️  MONITORANDO PASTA DE AVATARS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Pasta: C:\Users\eriel\Documentos\servidor\public\avatars" -ForegroundColor Gray
Write-Host "Pressione Ctrl+C para parar`n" -ForegroundColor Yellow

$folder = "C:\Users\eriel\Documentos\servidor\public\avatars"
$lastCount = 0

while ($true) {
    Start-Sleep -Seconds 1
    
    $files = Get-ChildItem $folder -ErrorAction SilentlyContinue
    $currentCount = if ($files) { $files.Count } else { 0 }
    
    if ($currentCount -ne $lastCount) {
        Clear-Host
        Write-Host "`n👁️  MONITORANDO PASTA DE AVATARS" -ForegroundColor Cyan
        Write-Host "================================" -ForegroundColor Cyan
        Write-Host "Pasta: $folder" -ForegroundColor Gray
        Write-Host "Última atualização: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
        Write-Host "Pressione Ctrl+C para parar`n" -ForegroundColor Yellow
        
        if ($files) {
            Write-Host "📁 Arquivos encontrados: $currentCount" -ForegroundColor Green
            $files | Sort-Object LastWriteTime -Descending | ForEach-Object {
                $icon = if ($_.Name -like "temp-*") { "⚠️ " } else { "✅" }
                $color = if ($_.Name -like "temp-*") { "Yellow" } else { "Green" }
                Write-Host "$icon $($_.Name) - $([math]::Round($_.Length/1024, 2)) KB - $($_.LastWriteTime.ToString('HH:mm:ss'))" -ForegroundColor $color
            }
        } else {
            Write-Host "📁 Nenhum arquivo na pasta (ainda)" -ForegroundColor Yellow
        }
        
        $lastCount = $currentCount
    }
}
