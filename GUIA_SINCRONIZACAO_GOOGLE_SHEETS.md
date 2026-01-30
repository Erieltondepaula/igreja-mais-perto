# ⚡ Sistema de Sincronização em Tempo Real com Google Sheets

## 🎯 Visão Geral

Este sistema permite que o Dashboard de Membros sincronize **automaticamente** com uma planilha do Google Sheets. Toda vez que alguém editar a planilha, o sistema detecta e atualiza o banco de dados **em tempo real** via webhooks!

---

## ✨ Recursos Implementados

- ✅ **Sincronização em Tempo Real** - Webhooks automáticos
- ✅ **Sincronização Manual** - Botão "Sincronizar Agora"
- ✅ **Teste de Conexão** - Verifica se a planilha está acessível
- ✅ **Parser CSV Inteligente** - Lida com vírgulas e aspas
- ✅ **Mapeamento Flexível** - Suporta vários formatos de coluna
- ✅ **Logs Detalhados** - Rastreamento completo de operações
- ✅ **Interface Visual** - Card no dashboard com status

---

## 📋 Guia de Instalação Completo

### Parte 1: Preparar a Planilha do Google Sheets

#### 1.1. Publicar a Planilha como Web

1. Abra sua planilha no Google Sheets
2. Vá em **Arquivo → Compartilhar → Publicar na Web**
3. Escolha:
   - **Guia**: Selecione a aba específica ou "Documento inteiro"
   - **Formato**: Escolha **"Valores separados por vírgula (.csv)"**
4. Clique em **"Publicar"**
5. Copie a URL gerada (similar a esta):
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vRd.../pub?gid=2093457985&single=true&output=csv
   ```

#### 1.2. Configurar o URL no Sistema

Edite o arquivo: `backend/services/GoogleSheetsSync.js`

```javascript
constructor() {
  // Cole sua URL aqui
  this.sheetUrl = 'https://docs.google.com/spreadsheets/d/e/SUA-URL-AQUI/pub?output=csv';
}
```

---

### Parte 2: Instalar o Google Apps Script (Webhook)

#### 2.1. Abrir Editor de Scripts

1. Na sua planilha, vá em: **Extensões → Apps Script**
2. Será aberto o editor de código

#### 2.2. Colar o Código

1. Delete qualquer código existente
2. Copie todo o conteúdo do arquivo: `GoogleAppsScript-Webhook.js`
3. Cole no editor do Apps Script
4. **IMPORTANTE**: Altere a URL do webhook:

```javascript
// 🔧 CONFIGURE ESTA URL
const WEBHOOK_URL = 'http://localhost:3000/api/webhook/google-sheets';
```

**Para Produção**, use seu domínio:
```javascript
const WEBHOOK_URL = 'https://seu-dominio.com/api/webhook/google-sheets';
```

#### 2.3. Configurar Triggers (Gatilhos)

1. No Apps Script, clique no ícone de **relógio ⏰** (Triggers/Gatilhos)
2. Clique em **"+ Adicionar gatilho"**
3. Configure o **Primeiro Trigger**:
   - Função: `onEdit`
   - Origem do evento: `Da planilha`
   - Tipo de evento: `Ao editar`
   - Clique em **"Salvar"**
4. Configure o **Segundo Trigger**:
   - Função: `onChange`
   - Origem do evento: `Da planilha`
   - Tipo de evento: `Ao alterar`
   - Clique em **"Salvar"**

#### 2.4. Autorizar Permissões

1. Na primeira vez, o Google pedirá autorização
2. Clique em **"Revisar permissões"**
3. Escolha sua conta do Google
4. Clique em **"Avançado"** → **"Ir para... (não seguro)"**
5. Clique em **"Permitir"**

---

### Parte 3: Configurar ngrok (para Localhost)

Se você está testando **localmente** (localhost), o Google Sheets não consegue acessar diretamente. Você precisa usar o **ngrok**:

#### 3.1. Instalar ngrok

```powershell
# Windows (com Chocolatey)
choco install ngrok

# Ou baixe de: https://ngrok.com/download
```

#### 3.2. Iniciar ngrok

```powershell
# No terminal, execute:
ngrok http 3000
```

Você verá algo assim:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### 3.3. Usar URL do ngrok

Copie a URL `https://abc123.ngrok.io` e configure no Apps Script:

```javascript
const WEBHOOK_URL = 'https://abc123.ngrok.io/api/webhook/google-sheets';
```

⚠️ **Importante**: A URL do ngrok muda toda vez que você reinicia. Para desenvolvimento, considere usar ngrok pago ou configurar um domínio fixo.

---

### Parte 4: Adicionar Componente ao Dashboard

#### 4.1. Importar Componente

Edite o arquivo onde você quer mostrar o card de sincronização (ex: `src/pages/HomePage.tsx` ou similar):

```tsx
import { GoogleSheetsSync } from '@/components/dashboard/GoogleSheetsSync';

// Dentro do seu componente/página:
<GoogleSheetsSync />
```

#### 4.2. Exemplo de Layout

```tsx
export const HomePage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Outros cards do dashboard */}
      <StatsCards members={members} />
      <ImportExport members={members} />
      
      {/* Novo card de sincronização */}
      <GoogleSheetsSync />
      
      {/* Resto do conteúdo */}
    </div>
  );
};
```

---

## 🚀 Como Usar

### Sincronização Automática (Webhook)

1. Edite qualquer célula da planilha
2. O Google Apps Script detecta a mudança
3. Envia webhook para o sistema
4. Sistema sincroniza automaticamente
5. ✅ Banco de dados atualizado!

### Sincronização Manual

1. Acesse o dashboard
2. Localize o card **"Sincronização Google Sheets"**
3. Clique em **"Sincronizar Agora"**
4. Aguarde a confirmação
5. ✅ Dados atualizados!

### Testar Conexão

1. No card de sincronização, clique em **"Testar Conexão"**
2. O sistema verifica se consegue acessar a planilha
3. Mostra quantos registros foram encontrados
4. ✅ Não importa, apenas testa!

---

## 🔧 Estrutura de Arquivos

```
Dashboard_Membros/
├── backend/
│   ├── services/
│   │   └── GoogleSheetsSync.js      ← Serviço de sincronização
│   ├── routes/
│   │   └── googleSheetsSync.js      ← Rotas da API
│   └── server.js                     ← Registrar rotas
├── src/
│   └── components/
│       └── dashboard/
│           └── GoogleSheetsSync.tsx  ← Componente React
└── GoogleAppsScript-Webhook.js       ← Script para planilha
```

---

## 📡 Endpoints da API

### POST `/api/webhook/google-sheets`
Recebe notificações em tempo real do Google Sheets

**Body:**
```json
{
  "action": "edit",
  "sheetName": "Membros",
  "timestamp": "2025-12-29T10:30:00Z"
}
```

### POST `/api/sync/google-sheets`
Sincronização manual sob demanda

**Response:**
```json
{
  "sucesso": true,
  "total_processados": 150,
  "importados": 150,
  "timestamp": "2025-12-29T10:30:00Z"
}
```

### GET `/api/sync/google-sheets/test`
Testa conexão sem importar

**Response:**
```json
{
  "sucesso": true,
  "conexao_ok": true,
  "total_registros": 150,
  "preview": [...]
}
```

### GET `/api/sync/google-sheets/status`
Informações sobre última sincronização

---

## 🗺️ Mapeamento de Colunas

O sistema suporta múltiplos nomes de colunas:

| Campo no Banco | Nomes Aceitos na Planilha |
|----------------|---------------------------|
| Nome           | "Nome", "Nome Completo", "nome" |
| Data Nascimento| "Data de Nascimento", "data_nascimento" |
| Telefone       | "Telefone", "telefone", "Celular" |
| Sexo           | "Sexo", "sexo", "Gênero" |
| Bairro         | "Bairro", "bairro" |
| Batizado       | "Batizado", "batizado", "Batizado?" |
| Membro         | "Membro", "membro", "É Membro?" |
| Líder          | "Líder", "lider", "É Líder?" |

**Valores Booleanos**: "Sim", "Não", "True", "False", "1", "0"

---

## 🧪 Testando o Sistema

### 1. Teste de Conexão
```powershell
# No terminal:
curl -X GET http://localhost:3000/api/sync/google-sheets/test
```

### 2. Teste de Sincronização Manual
```powershell
curl -X POST http://localhost:3000/api/sync/google-sheets
```

### 3. Teste de Webhook
Na planilha: **Sincronização → 🧪 Testar Webhook**

---

## 🐛 Solução de Problemas

### ❌ "Falha ao conectar com Google Sheets"

**Causas:**
- URL da planilha incorreta
- Planilha não está publicada
- Planilha está privada

**Solução:**
1. Verifique se a planilha está publicada
2. Teste a URL diretamente no navegador
3. Certifique-se que o formato é CSV

### ❌ "Webhook não está funcionando"

**Causas:**
- Triggers não configurados
- URL do webhook incorreta
- ngrok não está rodando (localhost)

**Solução:**
1. Verifique os triggers no Apps Script
2. Confira a URL no código
3. Se localhost, confirme que ngrok está ativo
4. Teste com: **Sincronização → 🧪 Testar Webhook**

### ❌ "Nenhum membro válido encontrado"

**Causas:**
- Planilha vazia
- Cabeçalhos incorretos
- Formato de dados inválido

**Solução:**
1. Certifique-se que a primeira linha tem cabeçalhos
2. Use nomes de colunas compatíveis (veja mapeamento)
3. Teste com "Testar Conexão" para ver o preview

---

## 📊 Logs e Monitoramento

### Logs do Backend
```powershell
# Logs são salvos em:
backend/log/app.log
backend/log/error.log
```

### Logs do Google Apps Script
1. No Apps Script, clique em **"Execuções"**
2. Veja o histórico de execuções dos triggers
3. Clique em uma execução para ver logs detalhados

---

## 🔐 Segurança

### Recomendações:

1. **Produção**: Use HTTPS sempre
2. **Autenticação**: Considere adicionar token de autenticação no webhook
3. **Rate Limiting**: Limite requisições para evitar abuso
4. **Logs**: Monitore tentativas de acesso suspeitas

### Adicionar Autenticação (Opcional):

**Apps Script:**
```javascript
const WEBHOOK_TOKEN = 'seu-token-secreto-aqui';

function enviarWebhook(dados) {
  const options = {
    'headers': {
      'Authorization': 'Bearer ' + WEBHOOK_TOKEN
    },
    // ... resto do código
  };
}
```

**Backend:**
```javascript
router.post('/webhook/google-sheets', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  
  // ... resto do código
});
```

---

## 🎉 Pronto!

Seu sistema agora está configurado para sincronização em tempo real com Google Sheets!

### Próximos Passos:

1. ✅ Teste a sincronização manual
2. ✅ Edite a planilha e veja a mágica acontecer
3. ✅ Monitore os logs para garantir que está funcionando
4. 🚀 Coloque em produção!

---

## 💡 Melhorias Futuras

- [ ] Sincronização incremental (apenas mudanças)
- [ ] Tabela de histórico de sincronizações
- [ ] Notificações em tempo real via WebSocket
- [ ] Mapeamento de colunas configurável via interface
- [ ] Suporte para múltiplas planilhas
- [ ] Backup automático antes de sincronizar
- [ ] Agendamento de sincronizações (cron)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend
2. Verifique as execuções do Apps Script
3. Teste a URL da planilha manualmente
4. Use a função "Testar Webhook" no menu da planilha
5. Consulte este guia novamente

---

**Criado em**: 29 de Dezembro de 2025  
**Versão**: 1.0  
**Status**: ✅ Funcional e Testado
