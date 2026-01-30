# Script para automatizar commit e push para o repositório principal
# Salve como sync-to-main.ps1 e execute no PowerShell

# Adiciona todas as alterações
 git add .

# Cria commit automático com data/hora
$commitMsg = "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m "$commitMsg"

# Envia para o repositório principal
 git push origin main

Write-Host "Sincronização concluída com o repositório principal!"
