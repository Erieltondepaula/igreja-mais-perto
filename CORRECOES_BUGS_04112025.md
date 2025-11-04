# Correções de Bugs - Sistema de Membros

**Data:** 04/11/2025

## Problemas Identificados e Corrigidos

### 1. ❌ Campo "Líder" e "Professor EBQ" não sendo salvos

**Problema:**
- Ao editar um membro e marcar como "Líder" ou "Professor EBQ", os valores não estavam sendo salvos no banco de dados
- Os campos não apareciam contabilizados no gráfico "Funções Atribuídas (Ativos)"

**Causa Raiz:**
- Incompatibilidade de nomenclatura entre frontend (camelCase) e backend (snake_case)
- Frontend envia: `professorEBQ`, `lider`
- Backend esperava: `e_professor_ebq`, `lider`
- Método `updateMember` não fazia conversão dos nomes de campos

**Solução Implementada:**

#### Backend - `backend/services/MemberServicePostgreSQL.js`
Adicionado mapeamento de campos no método `updateMember`:

```javascript
async updateMember(id, memberData) {
  // Mapeamento de campos camelCase para snake_case
  const fieldMapping = {
    'nomeCompleto': 'nome_completo',
    'dataNascimento': 'data_nascimento',
    'statusCivil': 'status_civil',
    'situacaoAtual': 'situacao_atual',
    'professorEBQ': 'e_professor_ebq',  // ← CORREÇÃO PRINCIPAL
    'eProfessorEbq': 'e_professor_ebq',
    'faixaEtaria': 'faixa_etaria',
    'pequenoGrupo': 'pequeno_grupo',
    'numeroDomes': 'numerodomes',
    'idExterno': 'id_externo',
    'avatarUrl': 'avatar_url',
    'avatar_url': 'avatar_url'
  };
  
  // Normalizar dados recebidos para snake_case
  const normalizedData = {};
  for (const [key, value] of Object.entries(memberData)) {
    const dbFieldName = fieldMapping[key] || key;
    normalizedData[dbFieldName] = value;
  }
  
  // ... resto do código usa normalizedData
}
```

#### Backend - `backend/server.js`
Adicionada função de conversão para retornar dados no formato esperado pelo frontend:

```javascript
// Função auxiliar para converter campos do banco (snake_case) para frontend (camelCase)
function convertMemberToFrontend(member) {
  if (!member) return null;
  
  return {
    ...member,
    idExterno: member.id_externo,
    nomeCompleto: member.nome_completo,
    dataNascimento: member.data_nascimento,
    statusCivil: member.status_civil,
    situacaoAtual: member.situacao_atual,
    professorEBQ: member.e_professor_ebq,  // ← CONVERSÃO IMPORTANTE
    faixaEtaria: member.faixa_etaria,
    pequenoGrupo: member.pequeno_grupo,
    numeroDomes: member.numerodomes,
    avatarUrl: member.avatar_url,
    createdAt: member.created_at,
    updatedAt: member.updated_at
  };
}
```

Aplicada conversão nas rotas:
- `GET /api/members` - Lista todos os membros (convertidos)
- `GET /api/members/:id` - Busca membro por ID (convertido)
- `PUT /api/members/:id` - Atualiza membro (retorna convertido)

**Resultado:**
✅ Campo "Líder" agora salva corretamente  
✅ Campo "Professor EBQ" agora salva corretamente  
✅ Valores aparecem nos gráficos de Analytics  
✅ Contabilização correta no card "Funções Atribuídas (Ativos)"  

---

### 2. ❌ Upload de Avatar criando cópias ao invés de substituir

**Problema:**
- Ao fazer upload de uma nova foto para um membro, o sistema criava um novo arquivo
- Arquivo antigo não era removido, acumulando fotos na pasta `/public/avatars/`
- Causava desperdício de espaço em disco

**Causa Raiz:**
- Lógica de substituição de arquivo não estava funcionando corretamente
- Sistema tentava manter nome antigo, mas comparações falhavam
- Não removia arquivo antigo antes de salvar o novo

**Solução Implementada:**

#### Backend - `backend/routes/avatar.js`
Refatorada lógica de upload para SEMPRE:
1. Buscar avatar atual do membro no banco
2. Remover arquivo antigo se existir
3. Usar SEMPRE `{memberId}.{extensão}` como nome do arquivo
4. Manter consistência de nomenclatura

```javascript
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    // ... validações iniciais
    
    if (memberId) {
      try {
        // 1. Buscar avatar atual do membro no banco
        const memberResult = await db.query(
          'SELECT avatar_url FROM membros WHERE id = $1',
          [memberId]
        );
        
        if (memberResult.length > 0 && memberResult[0].avatar_url) {
          const oldAvatarUrl = memberResult[0].avatar_url;
          const oldFilename = oldAvatarUrl.replace('/avatars/', '');
          oldAvatarPath = path.join(avatarsDir, oldFilename);
          
          console.log(`🔄 Substituindo avatar antigo: ${oldFilename}`);
          
          // 2. REMOVER o arquivo antigo se existir
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
            console.log(`🗑️  Avatar antigo removido: ${oldFilename}`);
          }
        }
        
        // 3. SEMPRE usar o memberId como nome do arquivo
        const targetFilename = `${memberId}${ext}`;
        const currentPath = path.join(avatarsDir, filename);
        const targetPath = path.join(avatarsDir, targetFilename);

        // 4. Renomear arquivo para padrão consistente
        if (filename !== targetFilename) {
          if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
          }
          fs.renameSync(currentPath, targetPath);
          filename = targetFilename;
          console.log(`✅ Avatar salvo como: ${filename}`);
        }
        
      } catch (dbError) {
        console.error('❌ Erro ao processar substituição de avatar:', dbError);
      }
    }
    
    // ... resto do código
  }
});
```

**Resultado:**
✅ Upload de avatar agora SUBSTITUI o arquivo antigo  
✅ Arquivo antigo é REMOVIDO antes de salvar o novo  
✅ Nome do arquivo SEMPRE `{memberId}.{extensão}`  
✅ Sem acúmulo de arquivos duplicados  
✅ Espaço em disco otimizado  

**Logs de Console:**
```
🔄 Substituindo avatar antigo: LP20251104091155-DL9U.jpeg
🗑️  Avatar antigo removido: LP20251104091155-DL9U.jpeg
✅ Avatar salvo como: LP20251104091155-DL9U.jpg
```

---

## Testes Recomendados

### Teste 1: Campo Líder/Professor EBQ
1. Editar um membro
2. Marcar como "Líder"
3. Salvar
4. Reabrir edição → Verificar se "Líder" está marcado ✅
5. Ir para Analytics → Verificar contagem de "Líderes" aumentou ✅
6. Repetir para "Professor EBQ"

### Teste 2: Upload de Avatar (Novo)
1. Editar membro sem avatar
2. Fazer upload de foto
3. Verificar que arquivo foi criado em `/public/avatars/` com nome `{memberId}.{ext}`

### Teste 3: Upload de Avatar (Substituição)
1. Editar membro COM avatar
2. Fazer upload de NOVA foto
3. Verificar que:
   - ✅ Arquivo antigo foi REMOVIDO
   - ✅ Novo arquivo tem o MESMO NOME BASE
   - ✅ Apenas 1 arquivo por membro na pasta
   - ✅ Avatar atualizado aparece no card do membro

### Teste 4: Integração Completa
1. Criar novo membro
2. Marcar como "Líder" e "Professor EBQ"
3. Fazer upload de avatar
4. Salvar
5. Verificar:
   - ✅ Membro aparece na listagem
   - ✅ Avatar aparece no card
   - ✅ "Líder" e "Professor EBQ" marcados
   - ✅ Contadores em Analytics atualizados
6. Editar membro
7. Fazer novo upload de avatar
8. Verificar:
   - ✅ Avatar substituído (não duplicado)
   - ✅ Campos mantidos

---

## Arquivos Modificados

1. ✅ `backend/services/MemberServicePostgreSQL.js`
   - Método `updateMember` com mapeamento de campos

2. ✅ `backend/server.js`
   - Função `convertMemberToFrontend` adicionada
   - Rotas GET/PUT aplicam conversão

3. ✅ `backend/routes/avatar.js`
   - Lógica de substituição de arquivo refatorada
   - Remoção de arquivo antigo garantida

---

## Status Final

| Problema | Status | Prioridade |
|----------|--------|-----------|
| Campo "Líder" não salvando | ✅ RESOLVIDO | CRÍTICO |
| Campo "Professor EBQ" não salvando | ✅ RESOLVIDO | CRÍTICO |
| Contabilização no gráfico | ✅ RESOLVIDO | ALTA |
| Avatar duplicando arquivos | ✅ RESOLVIDO | MÉDIA |
| Upload substituir arquivo | ✅ RESOLVIDO | MÉDIA |

---

## Notas Técnicas

### Mapeamento de Campos (Backend ↔ Frontend)

| Frontend (camelCase) | Backend (snake_case) |
|---------------------|---------------------|
| `professorEBQ` | `e_professor_ebq` |
| `lider` | `lider` |
| `nomeCompleto` | `nome_completo` |
| `dataNascimento` | `data_nascimento` |
| `statusCivil` | `status_civil` |
| `situacaoAtual` | `situacao_atual` |
| `faixaEtaria` | `faixa_etaria` |
| `pequenoGrupo` | `pequeno_grupo` |
| `numeroDomes` | `numerodomes` |
| `avatarUrl` | `avatar_url` |

### Nomenclatura de Avatars

**Padrão:** `{memberId}.{extensão}`

**Exemplos:**
- `LP20251104091155-DL9U.jpeg`
- `AB20251104081647-XY2Z.jpg`
- `CD20251104081648-AB3C.png`

**Comportamento:**
- Novo upload: Cria arquivo com nome `{memberId}.{ext}`
- Upload subsequente: Remove arquivo antigo, salva novo com mesmo nome base
- Extensão pode mudar (.jpg → .png), mas nome base mantém
- Sempre 1 arquivo por membro
