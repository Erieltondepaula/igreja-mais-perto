# 🧪 GUIA DE TESTE - IMPORTAÇÃO POSTGRESQL

## ✅ Sistema Configurado Para PostgreSQL

O frontend agora está conectado ao backend PostgreSQL através do contexto `PostgreSQLContext`.

---

## 🚀 Passo 1: Iniciar o Backend PostgreSQL

1. **Abra um terminal** na pasta raiz do projeto
2. **Execute:**
   ```bash
   cd backend
   node server.js
   ```
3. **Verifique se aparece:**
   ```
   ✅ Conectado ao PostgreSQL com sucesso!
   🏥 Status do banco: healthy
   🚀 Servidor rodando na porta 5001
   🐘 Banco PostgreSQL: dashboard_membros
   🆔 IDs personalizados: formato AA20253010104302
   ```

**💡 IMPORTANTE:** Mantenha essa janela do terminal aberta!

---

## 🎨 Passo 2: Iniciar o Frontend

1. **Abra OUTRO terminal** na pasta raiz do projeto
2. **Execute:**
   ```bash
   npm run dev
   ```
3. **Verifique se abre:** `http://localhost:8080` ou `http://localhost:5173`

**Ou simplesmente execute o arquivo `IniciarSistema.bat`** que inicia tudo automaticamente!

---

## 📤 Passo 3: Testar Importação

### No navegador (http://localhost:8080):

1. **Clique no botão:** "Importar Planilha (Substitui Tudo)"
2. **Selecione o arquivo:** `membros-convertido-2025-11-03.xlsx` que você enviou
3. **Aguarde o processamento**

### O que acontece:

```
Frontend (React)
    ↓ Lê o arquivo Excel
    ↓ Converte para formato JSON
    ↓ Envia POST http://localhost:5001/api/members/batch
    ↓
Backend (Node.js + Express)
    ↓ Recebe os dados
    ↓ Remove duplicatas (mesmo nome + data nascimento)
    ↓ Gera IDs personalizados automaticamente (AA20253010104302)
    ↓ Salva no PostgreSQL
    ↓ Retorna sucesso
    ↓
Frontend
    ↓ Recarrega dados do banco
    ✅ Exibe toast de sucesso
```

---

## 🔍 Passo 4: Verificar Logs do Backend

No terminal do backend você verá:

```
➡️ [LOG] Recebida requisição de importação em massa
➡️ [LOG] Recebidos 150 membros. Substituir todos: true
🎯 [LOG] IDs personalizados serão gerados automaticamente (formato: AA20253010104302)
🗑️ [LOG] Limpando tabela de membros...
✅ [LOG] Tabela limpa com sucesso!
📊 [LOG] 150 membros únicos serão processados
✅ [LOG] Importação concluída:
   - 150 sucessos com IDs personalizados
   - 0 erros
   - 0 duplicatas evitadas
🆔 [EXEMPLOS] IDs gerados: AB20251103142530, JO20251103142531, MA20251103142532
```

---

## 🧪 Passo 5: Testar API Diretamente (Opcional)

### Teste 1: Buscar todos os membros
```bash
curl http://localhost:5001/api/members
```

### Teste 2: Buscar estatísticas
```bash
curl http://localhost:5001/api/statistics
```

### Teste 3: Gerar ID de teste
```bash
curl http://localhost:5001/api/test-id/JOAO/SILVA
```
**Resposta esperada:**
```json
{
  "nome": "JOAO",
  "sobrenome": "SILVA",
  "id_gerado": "JO20251103142530",
  "formato": "AA20253010104302"
}
```

---

## ✅ Funcionalidades Disponíveis

### 1. **Importar e Substituir** ✅
- Limpa todos os dados antigos
- Importa novos membros do Excel
- Remove duplicatas automaticamente
- Gera IDs personalizados (formato: AA20253010104302)

### 2. **Atualizar Membro** ✅
- Edite qualquer membro na lista
- As alterações são salvas no PostgreSQL
- IDs personalizados são preservados

### 3. **Recarregar Dados** ✅
- Clique no botão "Atualizar" (🔄)
- Busca dados atualizados do PostgreSQL

### 4. **Filtros e Pesquisa** ✅
- Todos os filtros funcionam com dados do banco
- Pesquisa em tempo real

---

## 🐘 Estrutura do Banco PostgreSQL

### Tabela: `membros`
- **id**: VARCHAR(16) - ID personalizado (AA20253010104302)
- **nome**: VARCHAR(255)
- **nome_completo**: TEXT
- **data_nascimento**: DATE
- **sexo**: CHAR(1)
- **telefone**: VARCHAR(20)
- **email**: VARCHAR(255)
- **endereco**: TEXT
- **bairro**: VARCHAR(100)
- **batizado**: BOOLEAN
- **membro**: BOOLEAN
- **lider**: BOOLEAN
- **professor_ebq**: BOOLEAN
- ... e mais 20+ campos

### Função: `generate_member_id()`
Gera IDs automaticamente no formato:
- **Posições 1-2**: Iniciais do primeiro nome (AA)
- **Posições 3-6**: Ano (2025)
- **Posições 7-8**: Mês (11)
- **Posições 9-10**: Dia (03)
- **Posições 11-16**: Timestamp único (142530)

**Exemplo:** `AB20251103142530` = Abner nascido em 03/11/2025

---

## 🔧 Solução de Problemas

### ❌ Erro: "Failed to fetch"
**Causa:** Backend não está rodando  
**Solução:** Execute `cd backend && node server.js`

### ❌ Erro: "Connection refused"
**Causa:** PostgreSQL não está rodando  
**Solução:** Inicie o serviço PostgreSQL (Windows Services ou `pg_ctl start`)

### ❌ Erro: "Table 'membros' does not exist"
**Causa:** Banco não foi inicializado  
**Solução:** Execute `node backend/scripts/setupPostgreSQL.js`

### ❌ Frontend não atualiza após importação
**Causa:** Contexto antigo em cache  
**Solução:** Recarregue a página (F5) ou limpe o cache do navegador

---

## 📊 Verificar Dados no PostgreSQL

### Usando linha de comando:
```bash
psql -U postgres -d dashboard_membros
```

### Consultas úteis:
```sql
-- Ver total de membros
SELECT COUNT(*) FROM membros;

-- Ver últimos 5 membros inseridos
SELECT id, nome, nome_completo, data_nascimento 
FROM membros 
ORDER BY created_at DESC 
LIMIT 5;

-- Ver IDs gerados
SELECT id, nome FROM membros LIMIT 10;
```

---

## 🎉 Pronto!

Seu sistema está 100% funcional com PostgreSQL!

**Próximos passos sugeridos:**
1. ✅ Testar importação de diferentes planilhas
2. ✅ Verificar geração de IDs únicos
3. ✅ Testar edição de membros
4. ✅ Exportar relatórios em PDF/Excel
5. ✅ Backup do banco de dados

**💡 Dica:** Use `IniciarSistema.bat` para iniciar tudo automaticamente!
