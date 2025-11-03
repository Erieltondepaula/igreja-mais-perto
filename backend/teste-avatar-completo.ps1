# Script de teste completo do sistema de avatares

Write-Host "`n🧪 TESTE COMPLETO DO SISTEMA DE AVATARES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar banco de dados
Write-Host "1️⃣ Verificando banco de dados..." -ForegroundColor Yellow
try {
    $membro = (Invoke-RestMethod -Uri "http://localhost:5001/api/members" | Where-Object { $_.nome_completo -like "*ABNER*" })[0]
    
    if ($membro) {
        Write-Host "   ✅ Membro: $($membro.nome_completo)" -ForegroundColor Green
        Write-Host "   ID: $($membro.id)" -ForegroundColor White
        Write-Host "   Avatar URL no banco: $($membro.avatar_url)" -ForegroundColor White
        
        if ($membro.avatar_url) {
            $usingId = $membro.avatar_url -like "*$($membro.id)*"
            if ($usingId) {
                Write-Host "   ✅ Avatar usa ID do membro!" -ForegroundColor Green
            } else {
                Write-Host "   ⚠️  Avatar NÃO usa ID do membro" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ❌ Sem avatar no banco" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   ❌ Erro ao acessar banco" -ForegroundColor Red
}

# 2. Verificar arquivo físico
Write-Host "`n2️⃣ Verificando arquivo no servidor..." -ForegroundColor Yellow
$possiveisCaminhos = @(
    "C:\Users\eriel\Documentos\public\avatars\AA20251102192929-4865.png",
    "C:\Users\eriel\Documentos\servidor\public\avatars\AA20251102192929-4865.png",
    "C:\Users\eriel\OneDrive - MSFT\Dashboard_Membros\public\avatars\AA20251102192929-4865.png"
)

$encontrado = $false
foreach ($caminho in $possiveisCaminhos) {
    if (Test-Path $caminho) {
        $file = Get-Item $caminho
        Write-Host "   ✅ Arquivo encontrado!" -ForegroundColor Green
        Write-Host "   Local: $caminho" -ForegroundColor White
        Write-Host "   Tamanho: $([math]::Round($file.Length/1024, 2)) KB" -ForegroundColor White
        Write-Host "   Modificado: $($file.LastWriteTime)" -ForegroundColor White
        $encontrado = $true
        break
    }
}

if (!$encontrado) {
    Write-Host "   ⚠️  Arquivo não encontrado nas pastas verificadas" -ForegroundColor Yellow
}

# 3. Testar URL HTTP
Write-Host "`n3️⃣ Testando acesso HTTP..." -ForegroundColor Yellow
try {
    $url = "http://localhost:5001/avatars/AA20251102192929-4865.png"
    $response = Invoke-WebRequest -Uri $url -Method HEAD -ErrorAction Stop
    Write-Host "   ✅ URL acessível: $url" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "   Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor White
} catch {
    Write-Host "   ❌ Erro ao acessar: $url" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

# 4. Resumo
Write-Host "`n📊 RESUMO:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$checkDB = $membro.avatar_url -ne $null -and $membro.avatar_url -ne ""
$checkFile = $encontrado
$checkHTTP = $response.StatusCode -eq 200

if ($checkDB -and $checkFile -and $checkHTTP) {
    Write-Host "`n✅ SISTEMA FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
    Write-Host "   - Banco de dados: ✅" -ForegroundColor Green
    Write-Host "   - Arquivo físico: ✅" -ForegroundColor Green
    Write-Host "   - HTTP acessível: ✅" -ForegroundColor Green
    Write-Host "`n🎯 O avatar DEVE aparecer no dashboard!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  SISTEMA COM PROBLEMAS:" -ForegroundColor Yellow
    Write-Host "   - Banco de dados: $(if($checkDB){'✅'}else{'❌'})" -ForegroundColor $(if($checkDB){'Green'}else{'Red'})
    Write-Host "   - Arquivo físico: $(if($checkFile){'✅'}else{'❌'})" -ForegroundColor $(if($checkFile){'Green'}else{'Red'})
    Write-Host "   - HTTP acessível: $(if($checkHTTP){'✅'}else{'❌'})" -ForegroundColor $(if($checkHTTP){'Green'}else{'Red'})
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
