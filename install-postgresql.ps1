<<<<<<< HEAD
# 🐘 INSTALAÇÃO POSTGRESQL VIA CHOCOLATEY
# Script para instalar PostgreSQL no Windows

Write-Host "🚀 Instalando PostgreSQL..." -ForegroundColor Cyan

# Verificar se Chocolatey está instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Chocolatey não encontrado. Instalando..." -ForegroundColor Red
    
    # Instalar Chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    Write-Host "✅ Chocolatey instalado!" -ForegroundColor Green
}

# Instalar PostgreSQL
Write-Host "📦 Instalando PostgreSQL 15..." -ForegroundColor Yellow
choco install postgresql --version=15.8.0 --params "/Password:membros_password_2025 /Port:5432" -y

# Verificar instalação
Write-Host "🔍 Verificando instalação..." -ForegroundColor Cyan
$psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"

if (Test-Path $psqlPath) {
    Write-Host "✅ PostgreSQL instalado com sucesso!" -ForegroundColor Green
    Write-Host "📊 Detalhes da instalação:" -ForegroundColor White
    Write-Host "  - Versão: PostgreSQL 15" -ForegroundColor Gray
    Write-Host "  - Porta: 5432" -ForegroundColor Gray
    Write-Host "  - Usuário: postgres" -ForegroundColor Gray
    Write-Host "  - Senha: membros_password_2025" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Próximos passos:" -ForegroundColor White
    Write-Host "  1. Criar banco de dados 'dashboard_membros'" -ForegroundColor Gray
    Write-Host "  2. Criar usuário 'membros_user'" -ForegroundColor Gray
    Write-Host "  3. Executar scripts de inicialização" -ForegroundColor Gray
} else {
    Write-Host "❌ Falha na instalação do PostgreSQL" -ForegroundColor Red
    Write-Host "💡 Alternativa: Instale manualmente pelo site oficial" -ForegroundColor Yellow
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎯 Para continuar com a migração, execute:" -ForegroundColor Cyan
=======
# 🐘 INSTALAÇÃO POSTGRESQL VIA CHOCOLATEY
# Script para instalar PostgreSQL no Windows

Write-Host "🚀 Instalando PostgreSQL..." -ForegroundColor Cyan

# Verificar se Chocolatey está instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Chocolatey não encontrado. Instalando..." -ForegroundColor Red
    
    # Instalar Chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    Write-Host "✅ Chocolatey instalado!" -ForegroundColor Green
}

# Instalar PostgreSQL
Write-Host "📦 Instalando PostgreSQL 15..." -ForegroundColor Yellow
choco install postgresql --version=15.8.0 --params "/Password:membros_password_2025 /Port:5432" -y

# Verificar instalação
Write-Host "🔍 Verificando instalação..." -ForegroundColor Cyan
$psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"

if (Test-Path $psqlPath) {
    Write-Host "✅ PostgreSQL instalado com sucesso!" -ForegroundColor Green
    Write-Host "📊 Detalhes da instalação:" -ForegroundColor White
    Write-Host "  - Versão: PostgreSQL 15" -ForegroundColor Gray
    Write-Host "  - Porta: 5432" -ForegroundColor Gray
    Write-Host "  - Usuário: postgres" -ForegroundColor Gray
    Write-Host "  - Senha: membros_password_2025" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Próximos passos:" -ForegroundColor White
    Write-Host "  1. Criar banco de dados 'dashboard_membros'" -ForegroundColor Gray
    Write-Host "  2. Criar usuário 'membros_user'" -ForegroundColor Gray
    Write-Host "  3. Executar scripts de inicialização" -ForegroundColor Gray
} else {
    Write-Host "❌ Falha na instalação do PostgreSQL" -ForegroundColor Red
    Write-Host "💡 Alternativa: Instale manualmente pelo site oficial" -ForegroundColor Yellow
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎯 Para continuar com a migração, execute:" -ForegroundColor Cyan
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
Write-Host "   node backend/scripts/setupPostgreSQL.js" -ForegroundColor White