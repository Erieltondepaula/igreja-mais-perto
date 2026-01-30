# ⚠️ IMPORTANTE: Preview Lovable vs. Execução Local

## 🌐 Por que o Preview do Lovable não funciona com PostgreSQL?

O **preview do Lovable** (https://id-preview--111fcfe8-f0ac-4f21-9b1f-ec586795e55f.lovable.app) é hospedado em **servidores na nuvem** e **não consegue se conectar** ao seu backend local (`http://localhost:5001`).

```
┌─────────────────────────────────────┐
│  Preview Lovable (na nuvem)         │
│  https://lovable.app                │
│                                     │
│  ❌ Não consegue acessar             │
│     http://localhost:5001           │
└─────────────────────────────────────┘
              ↕️ BLOQUEADO
┌─────────────────────────────────────┐
│  Seu Computador (local)             │
│  http://localhost:5001 (Backend)    │
│  PostgreSQL na porta 5432           │
└─────────────────────────────────────┘
```

**Por isso você vê o erro:** `Failed to fetch`

---

## ✅ Solução: Execute o Sistema Localmente

Para testar a importação e conexão com PostgreSQL, você **DEVE executar o sistema localmente**:

### Opção 1: Usar o arquivo .bat (Mais fácil!)
```bash
# Duplo clique em:
IniciarSistema.bat
```

### Opção 2: Manualmente
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

Depois acesse: **http://localhost:8080** (ou http://localhost:5173)

---

## 📊 Como Funciona Localmente

```
┌─────────────────────────────────────┐
│  Navegador Local                    │
│  http://localhost:8080              │
│                                     │
│  ✅ Frontend React + Vite            │
└─────────────────────────────────────┘
              ↕️ OK
┌─────────────────────────────────────┐
│  Backend Local                      │
│  http://localhost:5001              │
│                                     │
│  ✅ Node.js + Express                │
└─────────────────────────────────────┘
              ↕️ OK
┌─────────────────────────────────────┐
│  PostgreSQL Local                   │
│  localhost:5432                     │
│                                     │
│  ✅ Banco de dados                   │
└─────────────────────────────────────┘
```

---

## 🧪 Teste Completo

### 1. Inicie o Sistema
```bash
# Execute o .bat ou inicie manualmente
IniciarSistema.bat
```

### 2. Verifique os Logs do Backend
Você deve ver:
```
✅ Conectado ao PostgreSQL com sucesso!
🏥 Status do banco: healthy
🚀 Servidor rodando na porta 5001
🐘 Banco PostgreSQL: dashboard_membros
🆔 IDs personalizados: formato AA20253010104302
```

### 3. Abra o Navegador
```
http://localhost:8080
```

### 4. Teste a Importação
1. Clique em **"Importar Planilha (Substitui Tudo)"**
2. Selecione: `membros-convertido-2025-11-03.xlsx`
3. Aguarde a mensagem de sucesso

### 5. Verifique os Logs
No terminal do backend você verá:
```
➡️ [LOG] Recebida requisição de importação em massa
➡️ [LOG] Recebidos 150 membros. Substituir todos: true
🎯 [LOG] IDs personalizados serão gerados automaticamente
✅ [LOG] Importação concluída:
   - 150 sucessos com IDs personalizados
   - 0 erros
🆔 [EXEMPLOS] IDs gerados: AB20251103142530, JO20251103142531
```

---

## 🔧 Alternativa: Deploy do Backend na Nuvem

Se você quiser usar o preview do Lovable, precisará fazer deploy do backend em algum serviço na nuvem:

### Opções de Deploy:
1. **Render.com** (Grátis)
2. **Railway.app** (Grátis)
3. **Heroku** (Pago)
4. **DigitalOcean** (Pago)

Depois, atualize a URL em `src/contexts/PostgreSQLContext.tsx`:
```typescript
// Mudar de:
const API_BASE_URL = 'http://localhost:5001/api';

// Para:
const API_BASE_URL = 'https://seu-backend.onrender.com/api';
```

---

## 📋 Resumo

| Ambiente | Frontend | Backend | PostgreSQL | Funciona? |
|----------|----------|---------|------------|-----------|
| **Preview Lovable** | ✅ Nuvem | ❌ Local | ❌ Local | ❌ Não |
| **Localhost (Recomendado)** | ✅ Local | ✅ Local | ✅ Local | ✅ Sim |
| **Deploy Completo** | ✅ Nuvem | ✅ Nuvem | ✅ Nuvem | ✅ Sim |

---

## 💡 Recomendação

**Para desenvolvimento e teste:**
- ✅ Use `IniciarSistema.bat` e acesse `http://localhost:8080`

**Para produção:**
- ✅ Faça deploy do backend + PostgreSQL na nuvem
- ✅ Atualize a URL da API no código

---

## 🎯 Próximos Passos

1. ✅ Execute `IniciarSistema.bat`
2. ✅ Acesse `http://localhost:8080`
3. ✅ Teste a importação do arquivo Excel
4. ✅ Verifique os dados no PostgreSQL
5. ✅ Teste edição e atualização de membros

**Consulte:** `TESTE_IMPORTACAO_POSTGRESQL.md` para guia completo de teste.
