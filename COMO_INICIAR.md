# 🚀 COMO INICIAR O SISTEMA DE MEMBROS

## ✅ SISTEMA CONFIGURADO E PRONTO PARA USO!

### 📋 Pré-requisitos já instalados:
- ✅ Node.js e npm
- ✅ Microsoft Access (para banco de dados)
- ✅ Driver ODBC para Access
- ✅ Todas as dependências do projeto

---

## 🎯 INICIALIZAÇÃO RÁPIDA

### Opção 1: Inicialização Manual (Recomendada)

1. **Abra 2 terminais PowerShell na pasta do projeto:**
   ```
   C:\Users\eriel\OneDrive - MSFT\Dashboard_Membros\
   ```

2. **Terminal 1 - Backend (API):**
   ```powershell
   cd backend
   npm run dev
   ```
   ✅ Backend rodará em: http://localhost:5001

3. **Terminal 2 - Frontend (Interface):**
   ```powershell
   npm run dev
   ```
   ✅ Frontend rodará em: http://localhost:8080

### Opção 2: Script Automático (Batch)
```powershell
# Execute o arquivo que já existe:
.\Iniciar.bat
```

---

## 🌐 ACESSOS DO SISTEMA

- **💻 Aplicação Principal:** http://localhost:8080
- **🔧 API Backend:** http://localhost:5001
- **📊 Teste da API:** http://localhost:5001/api/members
- **🗃️ Banco de Dados:** `backend\database\MembrosDB.accdb`

---

## 📥 IMPORTAÇÃO DE DADOS

### Para importar dados do Excel:
```powershell
cd backend
node scripts/excelToAccess.js
```

### Para resetar o banco com dados de exemplo:
```powershell
cd backend
node scripts/setupDatabase.js --sample-data
```

---

## 🔄 COMANDOS ÚTEIS

### Parar os serviços:
- Pressione `Ctrl + C` em cada terminal
- Ou feche os terminais

### Limpar cache (se houver problemas):
```powershell
# No frontend:
Remove-Item -Recurse -Force node_modules\.vite

# No backend:
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

### Verificar se está funcionando:
1. Backend: http://localhost:5001 (deve mostrar "API funcionando!")
2. API: http://localhost:5001/api/members (deve mostrar lista JSON)
3. Frontend: http://localhost:8080 (deve mostrar a aplicação)

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### ❌ Erro "porta em uso":
```powershell
# Matar processos nas portas:
netstat -ano | findstr :5001
netstat -ano | findstr :8080
# Depois: taskkill /PID [número_do_processo] /F
```

### ❌ Erro de banco Access:
- Verifique se o Microsoft Access está instalado
- Execute: `backend/scripts/setupDatabase.js`

### ❌ Erro de dependências:
```powershell
npm install
cd backend
npm install
```

---

## 💡 DICAS

1. **Sempre inicie o Backend ANTES do Frontend**
2. **Mantenha os dois terminais abertos enquanto usar o sistema**
3. **O banco Access é criado automaticamente se não existir**
4. **Dados são salvos em tempo real no arquivo .accdb**
5. **Use Ctrl+C para parar cada serviço suavemente**

---

## 🎯 STATUS ATUAL
- ✅ Sistema totalmente funcional
- ✅ Banco Microsoft Access configurado
- ✅ API backend funcionando (porta 5001)
- ✅ Frontend React funcionando (porta 8080)
- ✅ Importação de Excel configurada
- ✅ Scripts de automação criados

**🎉 TUDO PRONTO PARA USO!**