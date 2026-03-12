# 🚀 Guia de Inicialização do Sistema

## 📋 Arquivos de Inicialização Disponíveis

### 1️⃣ `IniciarTudo.bat` ⭐ RECOMENDADO
**Inicia TODOS os serviços automaticamente**

✅ **O que faz:**
- Verifica e inicia PostgreSQL (se necessário)
- Inicia Backend API (porta 5001)
- Cria build (se não existir) e inicia Frontend (porta 8080)
- Inicia pgAdmin 4 (porta 5050)
- Abre aplicação e pgAdmin no navegador

**Quando usar:** Primeira vez ou quando quiser iniciar tudo de uma vez

```bash
# Duplo clique no arquivo ou execute:
IniciarTudo.bat
```

---

### 2️⃣ `Iniciar.bat`
**Inicia sistema em modo PRODUÇÃO (build)**

✅ **O que faz:**
- Verifica PostgreSQL (alerta se não estiver rodando)
- Inicia Backend API (porta 5001)
- Cria build (se não existir) e serve em http-server (porta 8080)

❌ **Não inicia:**
- PostgreSQL (apenas verifica)
- pgAdmin

**Quando usar:** Quando PostgreSQL já está rodando e você quer versão de produção

```bash
Iniciar.bat
```

---

### 3️⃣ `IniciarSistema.bat`
**Inicia sistema em modo DESENVOLVIMENTO**

✅ **O que faz:**
- Inicia Backend API (porta 5001)
- Inicia Frontend Vite Dev com hot-reload (porta 5173)

❌ **Não inicia:**
- PostgreSQL (avisa para iniciar manualmente)
- pgAdmin
- Build de produção

**Quando usar:** Durante desenvolvimento com hot-reload ativo

```bash
IniciarSistema.bat
```

---

### 4️⃣ `IniciarPgAdmin.bat`
**Inicia apenas o pgAdmin 4**

✅ **O que faz:**
- Verifica se pgAdmin está instalado
- Inicia pgAdmin 4
- Abre no navegador (http://localhost:5050)
- Mostra credenciais de conexão

**Quando usar:** Quando só precisa acessar o banco de dados

```bash
IniciarPgAdmin.bat
```

---

## 🎯 Qual Arquivo Usar?

### Para Iniciar Sistema pela Primeira Vez:
```
👉 IniciarTudo.bat
```

### Para Desenvolvimento (código mudando constantemente):
```
👉 IniciarSistema.bat
```

### Para Testar Versão de Produção:
```
👉 Iniciar.bat
```

### Para Gerenciar Banco de Dados:
```
👉 IniciarPgAdmin.bat
```

---

## 📊 Portas Utilizadas

| Serviço | Porta | URL |
|---------|-------|-----|
| PostgreSQL | 5432 | localhost:5432 |
| Backend API | 5001 | http://localhost:5001 |
| Frontend Dev | 5173 | http://localhost:5173 |
| Frontend Build | 8080 | http://localhost:8080 |
| pgAdmin | 5050 | http://localhost:5050 |

---

## 🔐 Credenciais PostgreSQL

```
Database: dashboard_membros
Host:     localhost
Port:     5432
User:     postgres
Password: 252088
```

---

## 🛠️ Comandos Manuais

### Iniciar PostgreSQL manualmente:
```bash
net start postgresql-x64-17
```

### Parar PostgreSQL:
```bash
net stop postgresql-x64-17
```

### Verificar se PostgreSQL está rodando:
```bash
netstat -ano | findstr ":5432"
```

### Parar todos os processos Node:
```bash
taskkill /F /IM node.exe
```

### Build manual:
```bash
npm run build
```

---

## 📝 Estrutura de Janelas Abertas

Quando você executa **IniciarTudo.bat**, serão abertas:

1. **Janela Principal** (verde) - Controle e status
2. **BACKEND-API-5001** (verde) - Logs do servidor Express
3. **FRONTEND-BUILD-8080** (azul) - Servidor http-server
4. **pgAdmin4** (aplicação GUI)

⚠️ **NÃO FECHE** as janelas BACKEND e FRONTEND se quiser manter o sistema rodando!

---

## ❌ Como Parar o Sistema

### Método 1: Fechar Janelas
Feche as janelas:
- `BACKEND-API-5001`
- `FRONTEND-BUILD-8080` (ou `FRONTEND-Vite-Dev`)

### Método 2: Comando
```bash
taskkill /F /IM node.exe
```

### Parar PostgreSQL (opcional):
```bash
net stop postgresql-x64-17
```

---

## 🐛 Resolução de Problemas

### PostgreSQL não inicia:
```bash
# Verificar serviço
services.msc

# Procurar: postgresql-x64-17
# Status deve ser: "Em execução"
```

### Porta já em uso:
```bash
# Ver o que está usando a porta
netstat -ano | findstr ":5001"
netstat -ano | findstr ":8080"

# Matar processo por PID
taskkill /F /PID <numero_do_pid>
```

### Build não funciona:
```bash
# Limpar e reconstruir
rmdir /s /q dist
npm run build
```

### pgAdmin não encontrado:
Baixe e instale: https://www.pgadmin.org/download/

---

## 📦 Backup e Restauração

### Criar backup do log de build:
```bash
# Já criado automaticamente em:
BUILD_LOG_2025-11-03.md
git-history-backup.txt
package-versions-backup.txt
```

### Restaurar versão anterior:
```bash
git log --oneline           # Ver histórico
git checkout <commit-hash>  # Voltar para commit específico
npm install                 # Reinstalar dependências
npm run build               # Rebuild
```

---

## 🎓 Dicas de Uso

1. **Desenvolvimento:** Use `IniciarSistema.bat` para hot-reload
2. **Produção Local:** Use `Iniciar.bat` para testar build
3. **Primeira Vez:** Use `IniciarTudo.bat` para configurar tudo
4. **Banco de Dados:** Use `IniciarPgAdmin.bat` para gerenciar dados
5. **Performance:** Frontend build (8080) é mais rápido que dev (5173)

---

## 📚 Documentação Adicional

- `BUILD_LOG_2025-11-03.md` - Log completo da última build
- `git-history-backup.txt` - Histórico de commits
- `package-versions-backup.txt` - Versões das dependências

---

**Última atualização:** 03/11/2025  
**Versão:** 1.0.0  
**Commit:** 87b127b
