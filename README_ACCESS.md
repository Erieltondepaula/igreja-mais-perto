# 🗃️ Dashboard de Membros com Microsoft Access

Sistema de gestão de membros utilizando **React + TypeScript** no frontend e **Node.js + Microsoft Access** no backend.

## 📋 **Pré-requisitos**

### Software Necessário:
- **Node.js** (versão 16 ou superior)
- **Microsoft Access** (ou Access Runtime gratuito)
- **Microsoft Access Database Engine** (ODBC Driver)

### Verificar Instalação do Access:
```powershell
# Verificar se o Access está instalado
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office" | findstr Access
```

### Instalar Access Runtime (Gratuito):
Se você não tem o Access completo, baixe o **Access Runtime** gratuito:
- [Microsoft Access Runtime 2019](https://www.microsoft.com/en-us/download/details.aspx?id=58494)
- [Microsoft Access Database Engine 2019](https://www.microsoft.com/en-us/download/details.aspx?id=54920)

## 🚀 **Instalação**

### 1. **Configurar Backend**

```powershell
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar o banco de dados Access
npm run setup-db --sample-data

# Iniciar servidor de desenvolvimento
npm run dev
```

### 2. **Configurar Frontend**

```powershell
# Voltar para a raiz do projeto
cd ..

# Instalar dependências do frontend
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📁 **Estrutura do Banco Access**

O sistema cria automaticamente as seguintes tabelas:

### **Tabela Principal: Membros**
- `ID` - Chave primária (AutoIncrement)
- `Nome` - Nome do membro (obrigatório)
- `DataNascimento` - Data de nascimento (obrigatório)
- `Sexo` - M ou F (obrigatório)
- `Telefone` - Telefone de contato
- `Email` - Email do membro
- `Endereco`, `Rua`, `Numero`, `Bairro`, `Cidade`, `Estado`, `CEP` - Dados de endereço
- `Status` - 'ativo' ou 'desligado'
- `Batizado`, `Membro`, `Lider`, `ProfessorEBQ` - Flags booleanas
- `Observacoes` - Campo de texto livre
- `DataCriacao`, `DataAtualizacao` - Timestamps automáticos

### **Tabelas Auxiliares:**
- **Grupos** - Pequenos grupos e ministérios
- **Eventos** - Calendar and events
- **HistoricoAlteracoes** - Auditoria de mudanças

## 📊 **Importação de Dados do Excel**

### **Formato da Planilha Excel:**
Sua planilha deve conter as seguintes colunas (mínimo obrigatório):

| Nome | Data de Nascimento | Sexo | Status | Batizado | Membro | É Líder? | É Professor EBQ? |
|------|-------------------|------|--------|----------|---------|----------|------------------|
| João Silva | 15/05/1990 | M | ativo | Sim | Sim | Não | Sim |
| Maria Santos | 22/08/1985 | F | ativo | Sim | Sim | Sim | Não |

### **Comandos de Importação:**

```powershell
# Importar todos os arquivos Excel da pasta "Excel Membros"
node scripts/excelToAccess.js

# Limpar tabela e reimportar (CUIDADO: apaga todos os dados)
node scripts/excelToAccess.js --clear
```

### **Localização dos Arquivos:**
- Coloque seus arquivos `.xlsx` ou `.xls` na pasta: `Excel Membros/`
- Os logs de erro ficam em: `backend/logs/import.log`

## 🔧 **Configuração Avançada**

### **String de Conexão ODBC:**
O sistema usa a seguinte string de conexão (em `backend/config/database.js`):
```javascript
const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ACCESS_DB_PATH};`;
```

### **Localização do Banco:**
- Arquivo Access: `backend/database/MembrosDB.accdb`
- Você pode mover para outro local e ajustar o caminho em `database.js`

## 📡 **API Endpoints**

### **Membros:**
- `GET /api/members` - Listar todos os membros
- `GET /api/members/:id` - Buscar membro por ID
- `POST /api/members` - Criar novo membro
- `PUT /api/members/:id` - Atualizar membro
- `DELETE /api/members/:id` - Deletar membro
- `POST /api/members/batch` - Importação em massa

### **Estatísticas:**
- `GET /api/statistics` - Estatísticas gerais do sistema

## 🔍 **Solução de Problemas**

### **Erro: "Microsoft Access Driver not found"**
```powershell
# Instalar Microsoft Access Database Engine
# Baixar de: https://www.microsoft.com/en-us/download/details.aspx?id=54920

# Verificar drivers ODBC instalados
odbcad32.exe
```

### **Erro: "Database file not found"**
```powershell
# Recriar o banco de dados
cd backend
npm run setup-db --force
```

### **Erro: "Permission denied"**
- Verifique se o arquivo `.accdb` não está aberto no Access
- Execute o PowerShell como Administrador
- Verifique permissões da pasta `backend/database/`

### **Problemas de Importação:**
```powershell
# Verificar logs de erro
type backend\logs\import.log

# Testar conexão com o banco
node -e "require('./backend/config/database').connect().then(() => console.log('OK')).catch(console.error)"
```

## 📈 **Recursos e Benefícios**

### **✅ Vantagens do Access:**
- **Integração Nativa com Excel** - Importação/exportação direta
- **Interface Visual** - Crie relatórios e formulários no Access
- **Relacionamentos Robustos** - Integridade referencial
- **Backup Simples** - Um único arquivo `.accdb`
- **Sem Servidor** - Não precisa instalar SQL Server ou MySQL
- **Familiar** - Muitos usuários já conhecem Access/Excel

### **🚀 Funcionalidades do Dashboard:**
- **Dashboard Interativo** - Gráficos e estatísticas em tempo real
- **Filtros Avançados** - Busca por múltiplos critérios
- **Exportação Flexível** - Excel, PDF, relatórios customizados
- **Calendário** - Controle de aniversários e eventos
- **Responsivo** - Funciona em desktop, tablet e mobile

## 🔮 **Próximos Passos Sugeridos**

1. **Autenticação** - Sistema de login e permissões
2. **Backup Automático** - Sincronização na nuvem
3. **Módulo de Comunicação** - SMS/WhatsApp/Email
4. **App Mobile** - Versão para Android/iOS
5. **Relatórios Avançados** - Business Intelligence
6. **Integração com APIs** - WhatsApp, Correios, etc.

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique os logs em `backend/logs/`
2. Consulte a documentação do Access/ODBC
3. Teste a conexão separadamente
4. Verifique as permissões de arquivo

---

**💡 Dica:** Mantenha backups regulares do arquivo `.accdb` em um local seguro!