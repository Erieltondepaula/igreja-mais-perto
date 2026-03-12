<<<<<<< HEAD
# Script de Verificação e Instalação Automática
# Dashboard de Membros com Microsoft Access
# Executa: .\install-dependencies.ps1

Write-Host "🚀 Verificação e Instalação Automática - Dashboard de Membros" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Função para verificar se um comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Função para executar comandos com tratamento de erro
function Invoke-SafeCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host "▶️ $Description..." -ForegroundColor Yellow
    try {
        Invoke-Expression $Command
        Write-Host "✅ $Description - Concluído!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erro em: $Description" -ForegroundColor Red
        Write-Host "   Detalhes: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Verificar privilégios administrativos
function Test-AdminPrivileges {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

Write-Host "🔍 FASE 1: VERIFICAÇÃO DO SISTEMA" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Verificar Node.js
Write-Host "🟦 Verificando Node.js..." -NoNewline
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host " ✅ Instalado ($nodeVersion)" -ForegroundColor Green
    
    # Verificar se é versão 16+
    $versionNumber = [int]($nodeVersion -replace "v(\d+).*", '$1')
    if ($versionNumber -lt 16) {
        Write-Host "⚠️ Versão muito antiga. Recomendamos Node.js 16+" -ForegroundColor Yellow
    }
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
    Write-Host "📥 Instalando Node.js..." -ForegroundColor Yellow
    
    # Tentar instalar via Chocolatey ou Winget
    if (Test-Command "choco") {
        Invoke-SafeCommand "choco install nodejs -y" "Instalação Node.js via Chocolatey"
    } elseif (Test-Command "winget") {
        Invoke-SafeCommand "winget install OpenJS.NodeJS" "Instalação Node.js via Winget"
    } else {
        Write-Host "❌ Por favor, instale Node.js manualmente de: https://nodejs.org/" -ForegroundColor Red
        Write-Host "   Ou instale Chocolatey: Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" -ForegroundColor Yellow
        exit 1
    }
}

# 2. Verificar NPM
Write-Host "🟦 Verificando NPM..." -NoNewline
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host " ✅ Instalado ($npmVersion)" -ForegroundColor Green
} else {
    Write-Host " ❌ NPM não encontrado (deveria vir com Node.js)" -ForegroundColor Red
    exit 1
}

# 3. Verificar Git
Write-Host "🟦 Verificando Git..." -NoNewline
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host " ✅ Instalado ($gitVersion)" -ForegroundColor Green
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
    Write-Host "📥 Instalando Git..." -ForegroundColor Yellow
    
    if (Test-Command "choco") {
        Invoke-SafeCommand "choco install git -y" "Instalação Git via Chocolatey"
    } elseif (Test-Command "winget") {
        Invoke-SafeCommand "winget install Git.Git" "Instalação Git via Winget"
    }
}

Write-Host ""
Write-Host "🔍 FASE 2: VERIFICAÇÃO DO MICROSOFT ACCESS" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# 4. Verificar Microsoft Access
Write-Host "🟦 Verificando Microsoft Access..." -NoNewline
$accessInstalled = $false

try {
    # Verificar registro do Access
    $accessReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Office\*\Access\InstallRoot" -ErrorAction SilentlyContinue
    if ($accessReg) {
        Write-Host " ✅ Microsoft Access encontrado!" -ForegroundColor Green
        $accessInstalled = $true
    }
} catch { }

if (-not $accessInstalled) {
    # Verificar Access Runtime
    Write-Host " 🔍 Verificando Access Runtime..." -NoNewline
    try {
        $runtimeReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Office\*\Common\InstallRoot" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*OFFICE*" }
        if ($runtimeReg) {
            Write-Host " ✅ Access Runtime encontrado!" -ForegroundColor Green
            $accessInstalled = $true
        }
    } catch { }
}

if (-not $accessInstalled) {
    Write-Host " ❌ Microsoft Access não encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 OPÇÕES DE INSTALAÇÃO:" -ForegroundColor Yellow
    Write-Host "1. Microsoft Access (Pago) - Parte do Office 365"
    Write-Host "2. Access Runtime (GRATUITO) - Recomendado para este projeto"
    Write-Host ""
    Write-Host "🔗 Links para download:" -ForegroundColor Cyan
    Write-Host "   Access Runtime 2019: https://www.microsoft.com/en-us/download/details.aspx?id=58494"
    Write-Host "   Access Database Engine: https://www.microsoft.com/en-us/download/details.aspx?id=54920"
    Write-Host ""
    
    $response = Read-Host "Deseja tentar download automático do Access Runtime? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "📥 Baixando Access Runtime..." -ForegroundColor Yellow
        
        $downloadUrl = "https://download.microsoft.com/download/3/5/C/35C84C36-661A-44E6-9324-8786B8DBE231/accessruntime_4288-1001_x64_en-us.exe"
        $downloadPath = "$env:TEMP\AccessRuntime2019.exe"
        
        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
            Write-Host "✅ Download concluído!" -ForegroundColor Green
            Write-Host "▶️ Iniciando instalação..." -ForegroundColor Yellow
            Start-Process -FilePath $downloadPath -ArgumentList "/quiet" -Wait
            Write-Host "✅ Access Runtime instalado!" -ForegroundColor Green
            $accessInstalled = $true
        } catch {
            Write-Host "❌ Erro no download. Instale manualmente." -ForegroundColor Red
        }
    }
}

# 5. Verificar Driver ODBC
Write-Host "🟦 Verificando Driver ODBC para Access..." -NoNewline
try {
    $odbcDrivers = Get-OdbcDriver | Where-Object { $_.Name -like "*Access*" -or $_.Name -like "*Microsoft Access Driver*" }
    if ($odbcDrivers) {
        Write-Host " ✅ Driver ODBC encontrado!" -ForegroundColor Green
        foreach ($driver in $odbcDrivers) {
            Write-Host "   - $($driver.Name)" -ForegroundColor Gray
        }
    } else {
        Write-Host " ❌ Driver ODBC não encontrado" -ForegroundColor Red
        Write-Host "💡 Instale o Microsoft Access Database Engine" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠️ Não foi possível verificar drivers ODBC" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 FASE 3: INSTALAÇÃO DAS DEPENDÊNCIAS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 6. Instalar dependências do Backend
Write-Host "📦 Instalando dependências do Backend..."
Set-Location "backend"

if (Test-Path "package.json") {
    Invoke-SafeCommand "npm install" "Instalação das dependências do backend"
} else {
    Write-Host "❌ Arquivo package.json não encontrado no backend" -ForegroundColor Red
    exit 1
}

# 7. Instalar dependências do Frontend  
Write-Host "📦 Instalando dependências do Frontend..."
Set-Location ".."

if (Test-Path "package.json") {
    Invoke-SafeCommand "npm install" "Instalação das dependências do frontend"
} else {
    Write-Host "❌ Arquivo package.json não encontrado no frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 FASE 4: CONFIGURAÇÃO DO BANCO ACCESS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# 8. Configurar banco Access
Write-Host "🗃️ Configurando banco de dados Access..."
Set-Location "backend"

if (Test-Path "scripts\setupDatabase.js") {
    $setupResult = Invoke-SafeCommand "node scripts\setupDatabase.js --sample-data" "Configuração do banco Access"
    if ($setupResult) {
        Write-Host "✅ Banco Access configurado com dados de exemplo!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Script de setup não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 FASE 5: TESTES FINAIS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# 9. Testar conexão com banco
Write-Host "🔌 Testando conexão com o banco..."
if (Test-Path "config\database.js") {
    $testScript = @"
const db = require('./config/database');
db.connect()
  .then(() => {
    console.log('✅ Conexão com Access funcionando!');
    return db.query('SELECT COUNT(*) as total FROM Membros');
  })
  .then((result) => {
    console.log('📊 Membros no banco:', result[0].total);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  });
"@
    
    $testScript | Out-File -FilePath "test-connection.js" -Encoding UTF8
    
    try {
        node test-connection.js
        Remove-Item "test-connection.js" -Force
    } catch {
        Write-Host "❌ Erro ao testar conexão com banco" -ForegroundColor Red
        Remove-Item "test-connection.js" -Force -ErrorAction SilentlyContinue
    }
}

Set-Location ".."

Write-Host ""
Write-Host "🎉 INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMO:" -ForegroundColor Cyan
Write-Host "✅ Node.js e NPM instalados"
Write-Host "✅ Dependências do projeto instaladas"
if ($accessInstalled) {
    Write-Host "✅ Microsoft Access configurado"
} else {
    Write-Host "⚠️ Microsoft Access precisa ser instalado manualmente"
}
Write-Host "✅ Banco de dados Access criado"
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Para iniciar o BACKEND:" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "2. Para iniciar o FRONTEND (em outro terminal):" -ForegroundColor Yellow
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Para importar dados do Excel:" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   node scripts\excelToAccess.js"
Write-Host ""
Write-Host "📖 Documentação completa: README_ACCESS.md" -ForegroundColor Cyan
Write-Host ""

# Perguntar se deve iniciar automaticamente
$startNow = Read-Host "Deseja iniciar o sistema agora? (y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host "🚀 Iniciando sistema..." -ForegroundColor Green
    
    # Iniciar backend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
    
    # Aguardar um pouco e iniciar frontend
    Start-Sleep -Seconds 3
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    
    Write-Host "✅ Sistema iniciado em terminais separados!" -ForegroundColor Green
}

Write-Host ""
=======
# Script de Verificação e Instalação Automática
# Dashboard de Membros com Microsoft Access
# Executa: .\install-dependencies.ps1

Write-Host "🚀 Verificação e Instalação Automática - Dashboard de Membros" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Função para verificar se um comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Função para executar comandos com tratamento de erro
function Invoke-SafeCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host "▶️ $Description..." -ForegroundColor Yellow
    try {
        Invoke-Expression $Command
        Write-Host "✅ $Description - Concluído!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erro em: $Description" -ForegroundColor Red
        Write-Host "   Detalhes: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Verificar privilégios administrativos
function Test-AdminPrivileges {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

Write-Host "🔍 FASE 1: VERIFICAÇÃO DO SISTEMA" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Verificar Node.js
Write-Host "🟦 Verificando Node.js..." -NoNewline
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host " ✅ Instalado ($nodeVersion)" -ForegroundColor Green
    
    # Verificar se é versão 16+
    $versionNumber = [int]($nodeVersion -replace "v(\d+).*", '$1')
    if ($versionNumber -lt 16) {
        Write-Host "⚠️ Versão muito antiga. Recomendamos Node.js 16+" -ForegroundColor Yellow
    }
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
    Write-Host "📥 Instalando Node.js..." -ForegroundColor Yellow
    
    # Tentar instalar via Chocolatey ou Winget
    if (Test-Command "choco") {
        Invoke-SafeCommand "choco install nodejs -y" "Instalação Node.js via Chocolatey"
    } elseif (Test-Command "winget") {
        Invoke-SafeCommand "winget install OpenJS.NodeJS" "Instalação Node.js via Winget"
    } else {
        Write-Host "❌ Por favor, instale Node.js manualmente de: https://nodejs.org/" -ForegroundColor Red
        Write-Host "   Ou instale Chocolatey: Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" -ForegroundColor Yellow
        exit 1
    }
}

# 2. Verificar NPM
Write-Host "🟦 Verificando NPM..." -NoNewline
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host " ✅ Instalado ($npmVersion)" -ForegroundColor Green
} else {
    Write-Host " ❌ NPM não encontrado (deveria vir com Node.js)" -ForegroundColor Red
    exit 1
}

# 3. Verificar Git
Write-Host "🟦 Verificando Git..." -NoNewline
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host " ✅ Instalado ($gitVersion)" -ForegroundColor Green
} else {
    Write-Host " ❌ Não instalado" -ForegroundColor Red
    Write-Host "📥 Instalando Git..." -ForegroundColor Yellow
    
    if (Test-Command "choco") {
        Invoke-SafeCommand "choco install git -y" "Instalação Git via Chocolatey"
    } elseif (Test-Command "winget") {
        Invoke-SafeCommand "winget install Git.Git" "Instalação Git via Winget"
    }
}

Write-Host ""
Write-Host "🔍 FASE 2: VERIFICAÇÃO DO MICROSOFT ACCESS" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# 4. Verificar Microsoft Access
Write-Host "🟦 Verificando Microsoft Access..." -NoNewline
$accessInstalled = $false

try {
    # Verificar registro do Access
    $accessReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Office\*\Access\InstallRoot" -ErrorAction SilentlyContinue
    if ($accessReg) {
        Write-Host " ✅ Microsoft Access encontrado!" -ForegroundColor Green
        $accessInstalled = $true
    }
} catch { }

if (-not $accessInstalled) {
    # Verificar Access Runtime
    Write-Host " 🔍 Verificando Access Runtime..." -NoNewline
    try {
        $runtimeReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Office\*\Common\InstallRoot" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*OFFICE*" }
        if ($runtimeReg) {
            Write-Host " ✅ Access Runtime encontrado!" -ForegroundColor Green
            $accessInstalled = $true
        }
    } catch { }
}

if (-not $accessInstalled) {
    Write-Host " ❌ Microsoft Access não encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 OPÇÕES DE INSTALAÇÃO:" -ForegroundColor Yellow
    Write-Host "1. Microsoft Access (Pago) - Parte do Office 365"
    Write-Host "2. Access Runtime (GRATUITO) - Recomendado para este projeto"
    Write-Host ""
    Write-Host "🔗 Links para download:" -ForegroundColor Cyan
    Write-Host "   Access Runtime 2019: https://www.microsoft.com/en-us/download/details.aspx?id=58494"
    Write-Host "   Access Database Engine: https://www.microsoft.com/en-us/download/details.aspx?id=54920"
    Write-Host ""
    
    $response = Read-Host "Deseja tentar download automático do Access Runtime? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "📥 Baixando Access Runtime..." -ForegroundColor Yellow
        
        $downloadUrl = "https://download.microsoft.com/download/3/5/C/35C84C36-661A-44E6-9324-8786B8DBE231/accessruntime_4288-1001_x64_en-us.exe"
        $downloadPath = "$env:TEMP\AccessRuntime2019.exe"
        
        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
            Write-Host "✅ Download concluído!" -ForegroundColor Green
            Write-Host "▶️ Iniciando instalação..." -ForegroundColor Yellow
            Start-Process -FilePath $downloadPath -ArgumentList "/quiet" -Wait
            Write-Host "✅ Access Runtime instalado!" -ForegroundColor Green
            $accessInstalled = $true
        } catch {
            Write-Host "❌ Erro no download. Instale manualmente." -ForegroundColor Red
        }
    }
}

# 5. Verificar Driver ODBC
Write-Host "🟦 Verificando Driver ODBC para Access..." -NoNewline
try {
    $odbcDrivers = Get-OdbcDriver | Where-Object { $_.Name -like "*Access*" -or $_.Name -like "*Microsoft Access Driver*" }
    if ($odbcDrivers) {
        Write-Host " ✅ Driver ODBC encontrado!" -ForegroundColor Green
        foreach ($driver in $odbcDrivers) {
            Write-Host "   - $($driver.Name)" -ForegroundColor Gray
        }
    } else {
        Write-Host " ❌ Driver ODBC não encontrado" -ForegroundColor Red
        Write-Host "💡 Instale o Microsoft Access Database Engine" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠️ Não foi possível verificar drivers ODBC" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 FASE 3: INSTALAÇÃO DAS DEPENDÊNCIAS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 6. Instalar dependências do Backend
Write-Host "📦 Instalando dependências do Backend..."
Set-Location "backend"

if (Test-Path "package.json") {
    Invoke-SafeCommand "npm install" "Instalação das dependências do backend"
} else {
    Write-Host "❌ Arquivo package.json não encontrado no backend" -ForegroundColor Red
    exit 1
}

# 7. Instalar dependências do Frontend  
Write-Host "📦 Instalando dependências do Frontend..."
Set-Location ".."

if (Test-Path "package.json") {
    Invoke-SafeCommand "npm install" "Instalação das dependências do frontend"
} else {
    Write-Host "❌ Arquivo package.json não encontrado no frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 FASE 4: CONFIGURAÇÃO DO BANCO ACCESS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# 8. Configurar banco Access
Write-Host "🗃️ Configurando banco de dados Access..."
Set-Location "backend"

if (Test-Path "scripts\setupDatabase.js") {
    $setupResult = Invoke-SafeCommand "node scripts\setupDatabase.js --sample-data" "Configuração do banco Access"
    if ($setupResult) {
        Write-Host "✅ Banco Access configurado com dados de exemplo!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Script de setup não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 FASE 5: TESTES FINAIS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# 9. Testar conexão com banco
Write-Host "🔌 Testando conexão com o banco..."
if (Test-Path "config\database.js") {
    $testScript = @"
const db = require('./config/database');
db.connect()
  .then(() => {
    console.log('✅ Conexão com Access funcionando!');
    return db.query('SELECT COUNT(*) as total FROM Membros');
  })
  .then((result) => {
    console.log('📊 Membros no banco:', result[0].total);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  });
"@
    
    $testScript | Out-File -FilePath "test-connection.js" -Encoding UTF8
    
    try {
        node test-connection.js
        Remove-Item "test-connection.js" -Force
    } catch {
        Write-Host "❌ Erro ao testar conexão com banco" -ForegroundColor Red
        Remove-Item "test-connection.js" -Force -ErrorAction SilentlyContinue
    }
}

Set-Location ".."

Write-Host ""
Write-Host "🎉 INSTALAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMO:" -ForegroundColor Cyan
Write-Host "✅ Node.js e NPM instalados"
Write-Host "✅ Dependências do projeto instaladas"
if ($accessInstalled) {
    Write-Host "✅ Microsoft Access configurado"
} else {
    Write-Host "⚠️ Microsoft Access precisa ser instalado manualmente"
}
Write-Host "✅ Banco de dados Access criado"
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Para iniciar o BACKEND:" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "2. Para iniciar o FRONTEND (em outro terminal):" -ForegroundColor Yellow
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Para importar dados do Excel:" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   node scripts\excelToAccess.js"
Write-Host ""
Write-Host "📖 Documentação completa: README_ACCESS.md" -ForegroundColor Cyan
Write-Host ""

# Perguntar se deve iniciar automaticamente
$startNow = Read-Host "Deseja iniciar o sistema agora? (y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host "🚀 Iniciando sistema..." -ForegroundColor Green
    
    # Iniciar backend em novo terminal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
    
    # Aguardar um pouco e iniciar frontend
    Start-Sleep -Seconds 3
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    
    Write-Host "✅ Sistema iniciado em terminais separados!" -ForegroundColor Green
}

Write-Host ""
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
Write-Host "💡 DICA: Mantenha este script para futuras instalações!" -ForegroundColor Yellow