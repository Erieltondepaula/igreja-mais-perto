# Script de verificação de upload de avatar
# Execute este script APÓS fazer o upload da foto do Abner

Write-Host "`n🔍 VERIFICANDO UPLOAD DO AVATAR DO ABNER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar dados no banco
Write-Host "1️⃣ Verificando banco de dados..." -ForegroundColor Yellow
$membro = (Invoke-RestMethod -Uri "http://localhost:5001/api/members" | Where-Object { $_.nome_completo -like "*ABNER*" })[0]

if ($membro) {
    Write-Host "   ✅ Membro encontrado" -ForegroundColor Green
    Write-Host "   ID: $($membro.id)" -ForegroundColor White
    Write-Host "   Nome: $($membro.nome_completo)" -ForegroundColor White
    Write-Host "   Avatar URL: $($membro.avatar_url)" -ForegroundColor White
    
    # 2. Verificar arquivo no servidor
    Write-Host "`n2️⃣ Verificando arquivo no servidor..." -ForegroundColor Yellow
    
    if ($membro.avatar_url) {
        # Extrair nome do arquivo da URL
        $fileName = Split-Path $membro.avatar_url -Leaf
        $filePath = "C:\Users\eriel\Documentos\servidor\public\avatars\$fileName"
        
        if (Test-Path $filePath) {
            $fileInfo = Get-Item $filePath
            Write-Host "   ✅ Arquivo encontrado!" -ForegroundColor Green
            Write-Host "   Caminho: $filePath" -ForegroundColor White
            Write-Host "   Tamanho: $($fileInfo.Length) bytes" -ForegroundColor White
            Write-Host "   Modificado: $($fileInfo.LastWriteTime)" -ForegroundColor White
        } else {
            Write-Host "   ❌ Arquivo NÃO encontrado em: $filePath" -ForegroundColor Red
        }
        
        # 3. Testar URL pública
        Write-Host "`n3️⃣ Testando acesso via URL..." -ForegroundColor Yellow
        $avatarUrl = "http://localhost:5001$($membro.avatar_url)"
        
        try {
            $response = Invoke-WebRequest -Uri $avatarUrl -Method HEAD -UseBasicParsing
            Write-Host "   ✅ Avatar acessível!" -ForegroundColor Green
            Write-Host "   URL: $avatarUrl" -ForegroundColor White
            Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
            Write-Host "   Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor White
        } catch {
            Write-Host "   ❌ Erro ao acessar: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "   ❌ Avatar URL está vazio no banco de dados!" -ForegroundColor Red
    }
    
    # 4. Verificar se nome do arquivo corresponde ao ID
    Write-Host "`n4️⃣ Verificando nomenclatura..." -ForegroundColor Yellow
    if ($membro.avatar_url -like "*$($membro.id)*") {
        Write-Host "   ✅ Nome do arquivo usa ID do membro corretamente!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Nome do arquivo NÃO usa ID do membro!" -ForegroundColor Red
        Write-Host "   Esperado: /avatars/$($membro.id).png (ou .jpg)" -ForegroundColor Yellow
        Write-Host "   Atual: $($membro.avatar_url)" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "   ❌ Membro Abner não encontrado!" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verificação concluída!`n" -ForegroundColor Cyan
