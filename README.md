<<<<<<< HEAD
<<<<<<< HEAD
# 🐘 DASHBOARD DE MEMBROS - POSTGRESQL

Sistema moderno de gerenciamento de membros com **PostgreSQL** e **IDs personalizados**.

## ✨ **Características Principais:**

- 🆔 **IDs Personalizados**: Formato `AA20253010104302` (FirstLetter + SecondLetter + YYYYMMDDHHMMSS)
- 🐘 **PostgreSQL**: Banco moderno, rápido e confiável
- 🚫 **Anti-duplicação**: Sistema inteligente evita cadastros duplicados
- 📊 **Importação Excel**: Converte Excel em PostgreSQL automaticamente
- ⚡ **Performance**: Consultas otimizadas e transações ACID

## 🚀 **Requisitos:**

- Node.js 18+
- PostgreSQL 12+
- React + TypeScript (frontend)

## 📦 **Instalação:**

### 1. **Configurar PostgreSQL:**
```bash
# Opção 1: PostgreSQL via Docker
docker-compose up -d

# Opção 2: PostgreSQL local
# Baixe: https://www.postgresql.org/download/
# Configure: usuário postgres, senha conforme .env
```

### 2. **Instalar dependências:**
```bash
# Backend
cd backend
npm install

# Frontend  
cd ..
npm install
```

### 3. **Configurar banco:**
```bash
cd backend
npm run setup-postgres
```

### 4. **Testar sistema:**
```bash
# Teste completo
npm run test-system

# Simular importação Excel
npm run simulate-import
```

## 🎯 **Como usar:**

### **Iniciar aplicação:**
```bash
# Backend (PostgreSQL)
cd backend
npm run dev

# Frontend (React)
cd ..
npm run dev
```

### **Importar dados do Excel:**
1. Acesse: http://localhost:8080
2. Clique em "Importar Planilha (Substitui Tudo)"
3. Selecione seu arquivo Excel
4. ✅ Sistema gera IDs personalizados automaticamente!

## 🆔 **Sistema de IDs Personalizados:**

### **Formato: AA20253010104302**
- **AA**: Primera letra do nome + Primera letra do sobrenome
- **20253010104302**: Timestamp YYYYMMDDHHMMSS

### **Exemplo:**
- **"ABNER ABADIS LIMA"** → **AA20253010104302**
- **"MARIA SILVA SANTOS"** → **MS20253010104305**

### **Vantagens:**
- ✅ **Único**: Impossível duplicar
- ✅ **Humano**: Fácil de identificar pela pessoa  
- ✅ **Temporal**: Ordem cronológica automática
- ✅ **Compacto**: 16 caracteres apenas

## 🔧 **Configurações (.env):**

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard_membros
DB_USER=membros_user
DB_PASSWORD=membros_password_2025

# Servidor
PORT=5001
NODE_ENV=development
```

## 📊 **API Endpoints:**

```bash
# Listar membros
GET /api/members

# Criar membro (ID gerado automaticamente)
POST /api/members

# Importação em massa com anti-duplicação
POST /api/members/batch

# Testar geração de ID
GET /api/test-id/NOME/SOBRENOME

# Estatísticas
GET /api/statistics
```

## 🧪 **Scripts disponíveis:**

```bash
# Backend
npm run setup-postgres     # Configurar PostgreSQL
npm run test-system        # Teste completo do sistema  
npm run simulate-import    # Simular importação Excel
npm start                  # Produção
npm run dev               # Desenvolvimento

# Frontend
npm run dev               # Desenvolvimento  
npm run build            # Build produção
npm run preview          # Preview build
```

## 🎉 **Migração do Access:**

O sistema foi **completamente migrado** do Microsoft Access para PostgreSQL:

### **Antes (Access):**
- ❌ Limitações ODBC
- ❌ IDs AUTOINCREMENT fixos
- ❌ Problemas de concorrência
- ❌ Sem transações robustas

### **Agora (PostgreSQL):**
- ✅ **IDs personalizados** AA20253010104302
- ✅ **Performance superior**
- ✅ **Transações ACID**
- ✅ **Sem limitações ODBC**
- ✅ **Escalabilidade completa**

## 🆘 **Troubleshooting:**

### **PostgreSQL não conecta:**
```bash
# Verificar se está rodando
sudo systemctl status postgresql  # Linux
# OU
services.msc → PostgreSQL          # Windows

# Testar conexão manual
psql -h localhost -U postgres
```

### **Erro ao importar Excel:**
```bash
# Verificar se backend está rodando
curl http://localhost:5001/api/members

# Testar geração de ID
curl http://localhost:5001/api/test-id/TESTE/USUARIO
```

### **Frontend não carrega dados:**
```bash
# Verificar logs do browser (F12)
# Confirmar URL da API no PostgreSQLContext.tsx
```

## 📞 **Suporte:**

- 📖 **Documentação**: Este README
- 🧪 **Testes**: `npm run test-system`
- 📊 **Status**: http://localhost:5001/api/statistics
- 🆔 **ID Teste**: http://localhost:5001/api/test-id/SEU_NOME/SEU_SOBRENOME

---

## 🎯 **Resultado Final:**

Sistema **100% funcional** com:
- ✅ PostgreSQL configurado
- ✅ IDs personalizados **AA20253010104302**  
- ✅ Importação Excel → PostgreSQL
- ✅ Sistema anti-duplicação
- ✅ Interface React otimizada
- ✅ **Zero dependência do Access**

=======
# 🐘 DASHBOARD DE MEMBROS - POSTGRESQL

Sistema moderno de gerenciamento de membros com **PostgreSQL** e **IDs personalizados**.

## ✨ **Características Principais:**

- 🆔 **IDs Personalizados**: Formato `AA20253010104302` (FirstLetter + SecondLetter + YYYYMMDDHHMMSS)
- 🐘 **PostgreSQL**: Banco moderno, rápido e confiável
- 🚫 **Anti-duplicação**: Sistema inteligente evita cadastros duplicados
- 📊 **Importação Excel**: Converte Excel em PostgreSQL automaticamente
- ⚡ **Performance**: Consultas otimizadas e transações ACID

## 🚀 **Requisitos:**

- Node.js 18+
- PostgreSQL 12+
- React + TypeScript (frontend)

## 📦 **Instalação:**

### 1. **Configurar PostgreSQL:**
```bash
# Opção 1: PostgreSQL via Docker
docker-compose up -d

# Opção 2: PostgreSQL local
# Baixe: https://www.postgresql.org/download/
# Configure: usuário postgres, senha conforme .env
```

### 2. **Instalar dependências:**
```bash
# Backend
cd backend
npm install

# Frontend  
cd ..
npm install
```

### 3. **Configurar banco:**
```bash
cd backend
npm run setup-postgres
```

### 4. **Testar sistema:**
```bash
# Teste completo
npm run test-system

# Simular importação Excel
npm run simulate-import
```

## 🎯 **Como usar:**

### **Iniciar aplicação:**
```bash
# Backend (PostgreSQL)
cd backend
npm run dev

# Frontend (React)
cd ..
npm run dev
```

### **Importar dados do Excel:**
1. Acesse: http://localhost:8080
2. Clique em "Importar Planilha (Substitui Tudo)"
3. Selecione seu arquivo Excel
4. ✅ Sistema gera IDs personalizados automaticamente!

## 🆔 **Sistema de IDs Personalizados:**

### **Formato: AA20253010104302**
- **AA**: Primera letra do nome + Primera letra do sobrenome
- **20253010104302**: Timestamp YYYYMMDDHHMMSS

### **Exemplo:**
- **"ABNER ABADIS LIMA"** → **AA20253010104302**
- **"MARIA SILVA SANTOS"** → **MS20253010104305**

### **Vantagens:**
- ✅ **Único**: Impossível duplicar
- ✅ **Humano**: Fácil de identificar pela pessoa  
- ✅ **Temporal**: Ordem cronológica automática
- ✅ **Compacto**: 16 caracteres apenas

## 🔧 **Configurações (.env):**

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard_membros
DB_USER=membros_user
DB_PASSWORD=membros_password_2025

# Servidor
PORT=5001
NODE_ENV=development
```

## 📊 **API Endpoints:**

```bash
# Listar membros
GET /api/members

# Criar membro (ID gerado automaticamente)
POST /api/members

# Importação em massa com anti-duplicação
POST /api/members/batch

# Testar geração de ID
GET /api/test-id/NOME/SOBRENOME

# Estatísticas
GET /api/statistics
```

## 🧪 **Scripts disponíveis:**

```bash
# Backend
npm run setup-postgres     # Configurar PostgreSQL
npm run test-system        # Teste completo do sistema  
npm run simulate-import    # Simular importação Excel
npm start                  # Produção
npm run dev               # Desenvolvimento

# Frontend
npm run dev               # Desenvolvimento  
npm run build            # Build produção
npm run preview          # Preview build
```

## 🎉 **Migração do Access:**

O sistema foi **completamente migrado** do Microsoft Access para PostgreSQL:

### **Antes (Access):**
- ❌ Limitações ODBC
- ❌ IDs AUTOINCREMENT fixos
- ❌ Problemas de concorrência
- ❌ Sem transações robustas

### **Agora (PostgreSQL):**
- ✅ **IDs personalizados** AA20253010104302
- ✅ **Performance superior**
- ✅ **Transações ACID**
- ✅ **Sem limitações ODBC**
- ✅ **Escalabilidade completa**

## 🆘 **Troubleshooting:**

### **PostgreSQL não conecta:**
```bash
# Verificar se está rodando
sudo systemctl status postgresql  # Linux
# OU
services.msc → PostgreSQL          # Windows

# Testar conexão manual
psql -h localhost -U postgres
```

### **Erro ao importar Excel:**
```bash
# Verificar se backend está rodando
curl http://localhost:5001/api/members

# Testar geração de ID
curl http://localhost:5001/api/test-id/TESTE/USUARIO
```

### **Frontend não carrega dados:**
```bash
# Verificar logs do browser (F12)
# Confirmar URL da API no PostgreSQLContext.tsx
```

## 📞 **Suporte:**

- 📖 **Documentação**: Este README
- 🧪 **Testes**: `npm run test-system`
- 📊 **Status**: http://localhost:5001/api/statistics
- 🆔 **ID Teste**: http://localhost:5001/api/test-id/SEU_NOME/SEU_SOBRENOME

---

## 🎯 **Resultado Final:**

Sistema **100% funcional** com:
- ✅ PostgreSQL configurado
- ✅ IDs personalizados **AA20253010104302**  
- ✅ Importação Excel → PostgreSQL
- ✅ Sistema anti-duplicação
- ✅ Interface React otimizada
- ✅ **Zero dependência do Access**

>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
**Pronto para produção!** 🚀
=======
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/111fcfe8-f0ac-4f21-9b1f-ec586795e55f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/111fcfe8-f0ac-4f21-9b1f-ec586795e55f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/111fcfe8-f0ac-4f21-9b1f-ec586795e55f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
>>>>>>> 895191cddc6a766a08518c3bb9ce1dd6a15874c2
