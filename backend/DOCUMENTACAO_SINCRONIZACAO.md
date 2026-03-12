# 🔄 SISTEMA DE SINCRONIZAÇÃO COM id_externo

## 📋 RESUMO EXECUTIVO

Este sistema implementa importação de dados do Excel para PostgreSQL usando **`id_externo`** como **CHAVE DE SINCRONIZAÇÃO**, garantindo:

1. ✅ **Zero duplicidade** (id_externo é UNIQUE)
2. ✅ **Rastreabilidade** (cada registro do banco tem link com o Id do Excel)
3. ✅ **Confirmação de atualizações** (popup antes de modificar dados existentes)
4. ✅ **Códigos únicos** para novos registros

---

## 🗄️ 1. ESTRUTURA DO BANCO DE DADOS

### Tabela: `membros`

| Campo | Tipo | Restrição | Função |
|-------|------|-----------|--------|
| **`id`** | VARCHAR(20) | PRIMARY KEY | Chave primária interna (gerada pela app) |
| **`id_externo`** | VARCHAR(50) | **UNIQUE** | **🔑 CHAVE DE SINCRONIZAÇÃO** - Armazena o "Id" do Excel (Coluna B) |
| `nome_completo` | VARCHAR(200) | - | Nome completo (usado para comparação) |
| ... | ... | ... | Outros campos |

### ⚡ Índices Críticos

```sql
-- Índice para otimizar consultas de sincronização
CREATE INDEX idx_membros_id_externo ON membros (id_externo);

-- Constraint UNIQUE para evitar duplicidade
ALTER TABLE membros ADD CONSTRAINT membros_id_externo_unique UNIQUE (id_externo);
```

---

## 🔧 2. GERAÇÃO DE CÓDIGO DE REFERÊNCIA

### Formato

```
[INICIAIS]-[TIMESTAMP]-[SUFIXO]
```

### Exemplos Reais

| Nome Excel | Código Gerado |
|-----------|---------------|
| ABNER ABADIS LIMA | `AL-20251102160109-LFLD` |
| ADASSA VALENTINA CRUZ DE SOUSA | `AS-20251102160109-CEV3` |
| MARIA | `MA-20251102160109-FPE9` |

### Componentes

- **INICIAIS**: Primeira letra do primeiro nome + primeira letra do último nome
- **TIMESTAMP**: AAAAMMDDHHMMSS (garante unicidade temporal)
- **SUFIXO**: 4 caracteres aleatórios alfanuméricos

### 📝 Função JavaScript

```javascript
const { gerar_codigo_referencia } = require('./utils/gerar_codigo_referencia');

const codigo = gerar_codigo_referencia('ABNER ABADIS LIMA');
// Retorna: 'AL-20251102143055-K4Z9'
```

---

## 🔄 3. LÓGICA DE IMPORTAÇÃO (FLUXO)

### Para cada linha do Excel:

```
┌─────────────────────────────────────────────────────┐
│  1. Ler Id da Coluna B do Excel                     │
│     id_excel = "1"                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2. CONSULTA CRÍTICA (Chave de Sincronização)       │
│     SELECT * FROM membros                           │
│     WHERE id_externo = '1'                          │
└─────────────────────────────────────────────────────┘
                        ↓
         ┌──────────────┴──────────────┐
         ↓                             ↓
    ┌─────────┐                  ┌──────────┐
    │ NÃO     │                  │ JÁ       │
    │ EXISTE  │                  │ EXISTE   │
    └─────────┘                  └──────────┘
         ↓                             ↓
    ┌─────────────────────┐      ┌──────────────────────┐
    │ CASO 1: INSERT      │      │ CASO 2: COMPARAR     │
    │ ─────────────────   │      │ ──────────────────── │
    │ • Gerar ID PK       │      │ • Nome_Excel ==      │
    │ • Gerar Código Ref  │      │   Nome_DB?           │
    │ • Salvar id_externo │      │                      │
    │ • INSERT automático │      │ ┌───────┬────────┐   │
    └─────────────────────┘      │ │  SIM  │  NÃO   │   │
                                 │ │   ↓   │   ↓    │   │
                                 │ │ Skip  │ POPUP  │   │
                                 │ └───────┴────────┘   │
                                 └──────────────────────┘
                                           ↓
                               ┌──────────────────────┐
                               │ POPUP DE CONFIRMAÇÃO │
                               │ ──────────────────── │
                               │ Id: 1                │
                               │ Nome Banco: João     │
                               │ Nome Excel: José     │
                               │                      │
                               │ Atualizar? [S/N]     │
                               └──────────────────────┘
                                    ↓           ↓
                              ┌─────────┐  ┌────────┐
                              │   SIM   │  │  NÃO   │
                              └─────────┘  └────────┘
                                    ↓           ↓
                              ┌─────────┐  ┌────────┐
                              │ UPDATE  │  │  SKIP  │
                              └─────────┘  └────────┘
```

---

## 💻 4. CÓDIGO PRINCIPAL (Node.js)

### Consulta de Verificação

```javascript
// PONTO CRÍTICO: Consulta usando id_externo como chave
const checkQuery = 'SELECT * FROM membros WHERE id_externo = $1';
const checkResult = await pool.query(checkQuery, [id_excel]);

if (checkResult.rows.length === 0) {
    // CASO 1: NÃO EXISTE → INSERT
} else {
    // CASO 2: JÁ EXISTE → COMPARAR
}
```

### INSERT (Novos Registros)

```javascript
// Gerar IDs
const id_pk = `MBR-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
const codigo_ref = gerar_codigo_referencia(nome_excel);

// Salvar com id_externo preenchido
await pool.query(`
    INSERT INTO membros (id, id_externo, nome_completo, ...)
    VALUES ($1, $2, $3, ...)
`, [id_pk, id_excel, nome_excel, ...]);
```

### UPDATE (Registros Existentes)

```javascript
// Comparar dados
if (nome_excel !== nome_db) {
    // POPUP: Confirmar atualização
    const resposta = await perguntarUsuario('Atualizar? (S/N): ');
    
    if (resposta === 'S') {
        await pool.query(`
            UPDATE membros 
            SET nome_completo = $1, updated_at = NOW()
            WHERE id_externo = $2
        `, [nome_excel, id_excel]);
    }
}
```

---

## 📊 5. EXECUÇÃO E RESULTADOS

### Como Executar

```bash
cd backend
node importar-com-sincronizacao.js
```

### Exemplo de Saída

```
🔄 INICIANDO IMPORTAÇÃO COM SINCRONIZAÇÃO
═══════════════════════════════════════════════════════════
📊 Total de registros no Excel: 144

[1/144] Processando Id: 1 - Nome: ABNER ABADIS LIMA
   ✨ NOVO REGISTRO - Criando...
   ✅ CRIADO com sucesso!
   📝 ID Externo: 1
   🆔 ID Interno: MBR-1730567869234-K4Z9
   📋 Código Ref: AL-20251102160109-LFLD

[2/144] Processando Id: 1 - Nome: JOSÉ ABADIS LIMA
   📌 REGISTRO JÁ EXISTE no banco
   🔍 Comparando dados...
   
   ⚠️  CONFLITO DETECTADO!
   ═══════════════════════════════════
   📊 ID Externo (Excel): 1
   📝 Nome no Banco:      ABNER ABADIS LIMA
   📄 Nome no Excel:      JOSÉ ABADIS LIMA
   ═══════════════════════════════════
   
   ❓ Deseja ATUALIZAR o registro existente? (S/N): S
   ✅ ATUALIZADO com sucesso!

═══════════════════════════════════════════════════════════
📊 RELATÓRIO FINAL DA IMPORTAÇÃO
═══════════════════════════════════════════════════════════
✅ Criados:     120 novos registros
🔄 Atualizados: 15 registros
⏭️  Ignorados:   9 registros
❌ Erros:       0 registros
📈 Total:       144 registros processados
═══════════════════════════════════════════════════════════
```

---

## 🎯 6. PONTOS CRÍTICOS

### ✅ O que SEMPRE acontece

1. **Consulta por `id_externo`** em TODA importação
2. **UNIQUE constraint** impede duplicidade
3. **Popup de confirmação** antes de UPDATE

### ⚠️ O que NUNCA acontece

1. ❌ Duplicar registros com mesmo `id_externo`
2. ❌ UPDATE sem confirmação do usuário
3. ❌ Gerar `codigo_referencia` em UPDATE (só em INSERT)

### 🔑 Chave do Sucesso

```sql
-- Esta query é executada para CADA linha do Excel
SELECT * FROM membros WHERE id_externo = ?
```

**O `id_externo` É A PONTE entre o sistema legado (Excel) e o novo sistema (PostgreSQL)**

---

## 📚 7. ARQUIVOS CRIADOS

| Arquivo | Função |
|---------|--------|
| `sql/adjust_membros_table_for_sync.sql` | DDL para ajustar tabela (UNIQUE, índices) |
| `utils/gerar_codigo_referencia.js` | Função de geração de código |
| `importar-com-sincronizacao.js` | Script principal de importação |
| `show-database-structure.js` | Verificação da estrutura |

---

## 🚀 8. PRÓXIMOS PASSOS

1. ✅ Executar `sql/adjust_membros_table_for_sync.sql` no PostgreSQL
2. ✅ Testar `gerar_codigo_referencia.js`
3. ✅ Executar `importar-com-sincronizacao.js`
4. ⏭️ Criar UI web com mesma lógica (React/Vue)
5. ⏭️ Adicionar logs de auditoria

---

**Criado em:** 02/11/2025  
**Autor:** Sistema de Importação com Sincronização  
**Versão:** 1.0
