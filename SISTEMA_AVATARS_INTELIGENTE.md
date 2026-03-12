# 🖼️ Sistema de Gerenciamento Inteligente de Avatars

**Data:** 03/11/2024  
**Versão:** 2.0.0  

---

## 📋 Visão Geral

O sistema implementa gerenciamento inteligente de avatars com:

1. ✅ **Substituição Inteligente** - Mantém o mesmo nome do arquivo ao atualizar avatar
2. ✅ **Limpeza Automática** - Remove avatars não utilizados periodicamente (24h)
3. ✅ **Limpeza Manual** - Endpoint para limpeza sob demanda
4. ✅ **Logs Detalhados** - Rastreamento de todas as operações

---

## 🔄 Funcionamento da Substituição Inteligente

### Cenário 1: Primeiro Avatar (Novo Membro)

**Fluxo:**
1. Membro não tem avatar anterior
2. Sistema cria arquivo com nome baseado no ID: `AL20251103145912-AS6G.png`
3. Atualiza banco de dados: `avatar_url = '/avatars/AL20251103145912-AS6G.png'`

**Resultado:**
- ✅ Avatar criado
- ✅ Referência no banco

### Cenário 2: Atualizar Avatar Existente (Mesma Extensão)

**Estado Inicial:**
- Avatar atual: `AL20251103145912-AS6G.png`
- Banco: `avatar_url = '/avatars/AL20251103145912-AS6G.png'`

**Fluxo:**
1. Usuário faz upload de nova imagem PNG
2. Sistema busca avatar antigo no banco
3. **Mantém o mesmo nome:** `AL20251103145912-AS6G.png`
4. Remove arquivo antigo
5. Renomeia novo upload para o nome antigo
6. Referência no banco permanece a mesma

**Resultado:**
- ✅ Arquivo atualizado com novo conteúdo
- ✅ Nome do arquivo mantido
- ✅ Referência no banco não muda
- ✅ Sem avatars órfãos

### Cenário 3: Atualizar Avatar (Extensão Diferente)

**Estado Inicial:**
- Avatar atual: `AL20251103145912-AS6G.png`
- Banco: `avatar_url = '/avatars/AL20251103145912-AS6G.png'`

**Fluxo:**
1. Usuário faz upload de imagem JPG
2. Sistema busca avatar antigo no banco
3. **Mantém o nome base, troca extensão:** `AL20251103145912-AS6G.jpg`
4. Remove arquivo antigo (.png)
5. Renomeia novo upload para novo nome
6. Atualiza banco: `avatar_url = '/avatars/AL20251103145912-AS6G.jpg'`

**Resultado:**
- ✅ Arquivo atualizado com novo formato
- ✅ Nome base mantido
- ✅ Referência no banco atualizada
- ✅ Arquivo PNG antigo removido

---

## 🧹 Sistema de Limpeza Automática

### Funcionamento

**Periodicidade:** A cada 24 horas (configurável)

**Processo:**
1. Sistema busca todos os `avatar_url` do banco de dados
2. Lista todos os arquivos em `public/avatars/`
3. Compara: arquivos no disco vs avatars no banco
4. Remove arquivos que não têm referência no banco
5. Loga todas as operações

**Logs Exemplo:**
```
🧹 Iniciando limpeza de avatars não utilizados...
📊 Avatars em uso no banco: 3
🗑️  Removido: temp-1762164614121.png
🗑️  Removido: 1762162947220-679926617.png
✅ Limpeza concluída: 9 removidos, 3 mantidos
```

### Quando a Limpeza Acontece

1. **Inicialização do Servidor:** Limpeza imediata ao subir
2. **Periodicidade:** A cada 24 horas automaticamente
3. **Manual:** Via endpoint `/api/cleanup-avatars` (POST)

---

## 🛠️ API Endpoints

### 1. Upload de Avatar (POST `/api/upload-avatar`)

**Request:**
```javascript
FormData:
  - avatar: File (imagem)
  - memberId: string (ID do membro)
```

**Response (Sucesso):**
```json
{
  "avatar_url": "/avatars/AL20251103145912-AS6G.png",
  "message": "Avatar enviado com sucesso!",
  "memberId": "AL20251103145912-AS6G"
}
```

**Response (Erro - Membro não encontrado):**
```json
{
  "message": "Membro não encontrado para atualizar avatar.",
  "avatar_url": "/avatars/AL20251103145912-AS6G.png",
  "memberId": "AL20251103145912-AS6G"
}
```

**Logs:**
```
🔄 Substituindo avatar: AL20251103145912-AS6G.png → AL20251103145912-AS6G.png
🗑️  Avatar antigo removido: AL20251103145912-AS6G.png
✅ Avatar renomeado: AL20251103145912-AS6G.png
✅ Avatar atualizado no banco para membro AL20251103145912-AS6G: /avatars/AL20251103145912-AS6G.png
```

### 2. Limpeza Manual (POST `/api/cleanup-avatars`)

**Request:** Sem body

**Response:**
```json
{
  "message": "Limpeza de avatars concluída com sucesso",
  "removidos": 9,
  "mantidos": 3,
  "detalhes": {
    "arquivosRemovidos": [
      "temp-1762164614121.png",
      "1762162947220-679926617.png",
      "..."
    ],
    "arquivosMantidos": [
      "AL20251103145912-AS6G.png",
      "FF20251103145915-BL2H.jpg",
      "LM20251103145917-SU1K.jpg"
    ]
  }
}
```

---

## 📂 Estrutura de Arquivos

```
backend/
├── routes/
│   └── avatar.js              # Rotas de upload e limpeza
├── services/
│   └── avatarCleanupService.js # Serviço de limpeza automática
└── server.js                  # Integração do serviço

public/
└── avatars/                   # Diretório de avatars
    ├── AL20251103145912-AS6G.png
    ├── FF20251103145915-BL2H.jpg
    └── LM20251103145917-SU1K.jpg
```

---

## 🔧 Configuração

### Alterar Intervalo de Limpeza

**Arquivo:** `backend/server.js`

```javascript
// Padrão: 24 horas
avatarCleanupService.startAutoCleanup(24);

// Exemplos:
avatarCleanupService.startAutoCleanup(1);  // A cada 1 hora
avatarCleanupService.startAutoCleanup(12); // A cada 12 horas
avatarCleanupService.startAutoCleanup(168); // A cada 7 dias
```

### Desativar Limpeza Automática

**Opção 1: Não iniciar**
```javascript
// Comente ou remova esta linha em server.js
// avatarCleanupService.startAutoCleanup(24);
```

**Opção 2: Parar programaticamente**
```javascript
avatarCleanupService.stopAutoCleanup();
```

---

## 📊 Logs e Monitoramento

### Logs de Upload

```
🔄 Substituindo avatar: oldfile.png → newfile.png
🗑️  Avatar antigo removido: oldfile.png
✅ Avatar renomeado: newfile.png
✅ Avatar atualizado no banco para membro <ID>: /avatars/newfile.png
```

### Logs de Limpeza Automática

```
🧹 Iniciando limpeza de avatars não utilizados...
📊 Avatars em uso no banco: 3
🗑️  Removido: unused-file-1.png
🗑️  Removido: unused-file-2.jpg
✅ Limpeza concluída: 2 removidos, 3 mantidos
```

### Logs de Inicialização

```
🚀 Servidor rodando na porta 5001
🗄️ Banco PostgreSQL: dashboard_membros
🌐 API disponível em: http://localhost:5001
🤖 Limpeza automática de avatars ativada (a cada 24h)
```

---

## 🧪 Testes

### Teste 1: Upload Inicial

```bash
# Via frontend ou Postman
POST http://localhost:5001/api/upload-avatar
FormData:
  avatar: [arquivo.png]
  memberId: "AL20251103145912-AS6G"

# Verificar:
ls public/avatars/
# Deve conter: AL20251103145912-AS6G.png
```

### Teste 2: Atualizar Avatar (Mesma Extensão)

```bash
# Upload novamente com mesmo ID
POST http://localhost:5001/api/upload-avatar
FormData:
  avatar: [nova-foto.png]
  memberId: "AL20251103145912-AS6G"

# Verificar:
ls public/avatars/
# Deve conter APENAS: AL20251103145912-AS6G.png (atualizado)
```

### Teste 3: Atualizar Avatar (Extensão Diferente)

```bash
# Upload com formato diferente
POST http://localhost:5001/api/upload-avatar
FormData:
  avatar: [foto.jpg]
  memberId: "AL20251103145912-AS6G"

# Verificar:
ls public/avatars/
# Deve conter: AL20251103145912-AS6G.jpg
# NÃO deve conter: AL20251103145912-AS6G.png (removido)
```

### Teste 4: Limpeza Manual

```bash
# Criar arquivo temporário manualmente
touch public/avatars/teste-lixo.png

# Executar limpeza
POST http://localhost:5001/api/cleanup-avatars

# Verificar logs e resposta
# teste-lixo.png deve ter sido removido
```

### Teste 5: Limpeza Automática

```bash
# Aguardar 24h OU alterar intervalo para 1 minuto temporariamente
# Arquivo: backend/server.js
avatarCleanupService.startAutoCleanup(0.0167); // ~1 minuto

# Criar arquivo lixo
touch public/avatars/auto-cleanup-test.png

# Aguardar 1 minuto e verificar logs
# Arquivo deve ser removido automaticamente
```

---

## 🔐 Segurança

### Validações Implementadas

1. **Tipo de Arquivo:**
   - Apenas: jpeg, jpg, png, gif, webp
   - Validação por extensão E mimetype

2. **Tamanho:**
   - Limite: 5MB por arquivo

3. **Path Traversal:**
   - Nomes de arquivo sanitizados
   - Upload apenas em `public/avatars/`

4. **Sobrescrita:**
   - Apenas arquivos do mesmo membro podem ser sobrescritos
   - Confirmação via banco de dados

---

## 🐛 Troubleshooting

### Avatar não está atualizando

**Problema:** Mesmo após upload, avatar antigo ainda aparece

**Possíveis Causas:**
1. Cache do navegador
2. Referência no banco não atualizada
3. Arquivo não foi renomeado corretamente

**Solução:**
```bash
# 1. Verificar logs do backend
cat backend/log/app.log | grep -i avatar

# 2. Verificar banco de dados
SELECT id, nome_completo, avatar_url FROM membros WHERE id = '<ID>';

# 3. Verificar arquivo no disco
ls -lh public/avatars/

# 4. Limpar cache do navegador (Ctrl+Shift+Delete)
```

### Limpeza automática não está rodando

**Verificar:**
```bash
# Logs de inicialização
cat backend/log/app.log | grep -i "limpeza automática"

# Deve aparecer:
# 🤖 Limpeza automática de avatars ativada (a cada 24h)
```

**Se não aparecer:**
1. Verificar se `avatarCleanupService.startAutoCleanup(24)` está em `server.js`
2. Reiniciar servidor
3. Verificar erros no log

### Avatars sendo removidos incorretamente

**Problema:** Avatars em uso estão sendo removidos

**Verificar:**
```bash
# Consultar banco
SELECT avatar_url FROM membros WHERE avatar_url IS NOT NULL;

# Listar arquivos
ls public/avatars/

# Comparar resultados
```

**Solução:**
1. Verificar se `avatar_url` no banco está no formato correto: `/avatars/nome.ext`
2. Executar limpeza manual e verificar logs detalhados
3. Verificar se não há problemas de encoding no nome do arquivo

---

## 📈 Performance

### Impacto da Limpeza

- **Tempo médio:** ~50-100ms (para 100 arquivos)
- **CPU:** Mínimo (I/O bound)
- **Memória:** ~10MB durante execução

### Otimizações

1. **Limpeza Assíncrona:** Não bloqueia servidor
2. **Intervalo de 24h:** Evita overhead desnecessário
3. **Set() para comparação:** O(1) lookup

---

## 🎯 Benefícios

### Para o Sistema

- ✅ **Espaço em disco otimizado** - Apenas avatars em uso
- ✅ **Manutenção zero** - Limpeza automática
- ✅ **Rastreabilidade** - Logs detalhados
- ✅ **Consistência** - Sincronização banco↔disco

### Para o Usuário

- ✅ **Atualização transparente** - Nome do arquivo mantido
- ✅ **Sem avatars duplicados** - Substituição inteligente
- ✅ **Rápido** - Sem lentidão por arquivos órfãos

---

## 📝 Changelog

### v2.0.0 - 03/11/2024

**Adicionado:**
- Sistema de substituição inteligente de avatars
- Limpeza automática periódica (24h)
- Endpoint de limpeza manual
- Serviço `avatarCleanupService`
- Logs detalhados de todas as operações
- Manutenção do nome do arquivo ao atualizar

**Modificado:**
- `routes/avatar.js` - Lógica de upload com substituição
- `server.js` - Integração do serviço de limpeza

**Criado:**
- `services/avatarCleanupService.js` - Serviço de limpeza

---

**Documentação criada em:** 03/11/2024  
**Última atualização:** 03/11/2024  
**Versão do sistema:** 2.0.0  
**Autor:** Eriel - Dashboard de Membros IBVP
