# 📚 Documentação Completa do Sistema - Dashboard de Membros IBVP

**Data:** 03 de Novembro de 2025  
**Versão:** 1.0.0 - Sistema 100% Funcional  
**Status:** ✅ PRODUÇÃO

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Funcionalidades](#funcionalidades)
4. [Arquitetura do Sistema](#arquitetura-do-sistema)
5. [Sistema de IDs Personalizados](#sistema-de-ids-personalizados)
6. [Sistema de Importação UPSERT](#sistema-de-importação-upsert)
7. [Como Iniciar o Sistema](#como-iniciar-o-sistema)
8. [Endpoints da API](#endpoints-da-api)
9. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
10. [Correções Implementadas](#correções-implementadas)

---

## 🎯 Visão Geral

Sistema completo de gestão de membros da igreja IBVP (Igreja Batista Vida Plena), desenvolvido com tecnologias modernas para gerenciar cadastro, importação via Excel, estatísticas, calendário de aniversários e muito mais.

### Características Principais

- ✅ **Importação Inteligente de Excel** com sistema UPSERT (Update/Insert)
- ✅ **IDs Personalizados** gerados automaticamente (formato: AA20251103HHMMSS-XXXX)
- ✅ **Calendário de Aniversários** com cores por gênero
- ✅ **Filtros Avançados** (status, gênero, bairro, faixa etária)
- ✅ **Dashboard Estatístico** completo
- ✅ **Backup Automático** de dados
- ✅ **Sistema de Logs** detalhado

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite 5.4.19** (build tool)
- **Tailwind CSS** para estilização
- **Shadcn/UI** componentes
- **XLSX** para manipulação de Excel
- **Lucide React** ícones

### Backend
- **Node.js 18** 
- **Express** framework
- **PostgreSQL 17.0** banco de dados
- **Winston** para logs
- **Multer** para upload de arquivos
- **CORS** para segurança

### Build de Produção
- **http-server** para servir aplicação
- **Gzip compression** habilitado
- **SPA routing** configurado

---

## 🚀 Funcionalidades

### 1. Gestão de Membros
- Cadastro completo de membros
- Edição individual
- Visualização de perfil
- Sistema de avatares
- Histórico de alterações

### 2. Importação de Excel
- **Upload via interface web**
- **Análise prévia** dos dados
- **Sistema UPSERT**: 
  - Detecta membros existentes (por nome + data nascimento)
  - **Atualiza** apenas campos alterados
  - **Insere** novos membros com ID gerado
- **Validação completa** de dados
- **Anti-duplicação** automática
- **Feedback detalhado**: "X novos, Y atualizados"

### 3. Dashboard Estatístico
- Total de membros (Ativos/Desligados)
- Distribuição por gênero
- Faixas etárias (Infância, Crianças, Adolescentes, Jovens, Adultos, Idosos)
- Batizados vs Não Batizados
- Membros vs Congregados
- Gráficos interativos

### 4. Calendário de Aniversários
- Visualização mensal
- **Cores por gênero**:
  - 🔵 Azul: Homens
  - 🩷 Rosa: Mulheres
  - 🟡 Âmbar: Eventos especiais
- Lista de aniversariantes do mês
- Alertas de aniversários próximos

### 5. Filtros Avançados
- **Status**: Ativo / Desligado
- **Gênero**: Masculino / Feminino
- **Ambos os Sexos**: Homens e Mulheres
- **Bairros**: Todos os bairros cadastrados
- **Idade**: Faixas personalizadas
- **Tipo de Membro**: Batizado, Membro, Líder, Professor EBQ
- **Data de Aniversário**: Busca por período

---

## 🏗️ Arquitetura do Sistema

```
Dashboard_Membros/
├── backend/                    # Servidor Node.js
│   ├── server.js              # Entrada principal
│   ├── config/
│   │   ├── postgresql.js      # Conexão PostgreSQL
│   │   └── logger.js          # Sistema de logs
│   ├── services/
│   │   └── MemberServicePostgreSQL.js  # Lógica de negócio
│   ├── routes/
│   │   ├── avatar.js          # Upload de avatares
│   │   └── importacao.js      # Importação Excel
│   ├── log/                   # Logs do sistema
│   │   ├── app.log           # Log de aplicação
│   │   ├── error.log         # Log de erros
│   │   └── archive/          # Logs arquivados
│   └── uploads/              # Arquivos temporários
│
├── src/                       # Código React
│   ├── components/           # Componentes reutilizáveis
│   │   ├── dashboard/        # Componentes do dashboard
│   │   │   ├── Calendar.tsx  # Calendário de aniversários
│   │   │   ├── MemberFilters.tsx  # Filtros
│   │   │   └── Statistics.tsx     # Estatísticas
│   │   └── ImportacaoInterativa.tsx  # Importação Excel
│   ├── contexts/
│   │   ├── AppContext.tsx          # Estado global
│   │   └── PostgreSQLContext.tsx   # Conexão PostgreSQL
│   ├── utils/
│   │   ├── excelUtils.ts     # Manipulação Excel
│   │   └── memberUtils.ts    # Utilitários de membros
│   ├── types/
│   │   └── member.ts         # Tipagem TypeScript
│   └── pages/                # Páginas da aplicação
│
├── dist/                     # Build de produção
├── public/                   # Arquivos estáticos
│   └── avatars/             # Fotos dos membros
├── Excel Membros/           # Planilhas de importação
└── database/                # Scripts SQL
```

---

## 🆔 Sistema de IDs Personalizados

### Formato
```
AA20251103140522-KH8T
││ │      │    │  └─── Hash aleatório (4 caracteres)
││ │      │    └────── Segundos (SS)
││ │      └─────────── Minutos (MM)
││ └────────────────── Hora (HH) + Dia (DD) + Mês (MM)
│└──────────────────── Ano (YYYY)
└───────────────────── Iniciais do nome (2 letras)
```

### Geração
- **Função PostgreSQL**: `gerar_id_compacto(nome_completo)`
- **Processo**:
  1. Extrai iniciais do nome (primeira letra de cada palavra)
  2. Adiciona timestamp completo (ano, mês, dia, hora, minuto, segundo)
  3. Gera hash aleatório de 4 caracteres
  4. Garante unicidade no banco de dados

### Vantagens
- ✅ IDs únicos e legíveis
- ✅ Contém informação temporal
- ✅ Identifica a pessoa pelas iniciais
- ✅ Impossível duplicação

---

## 🔄 Sistema de Importação UPSERT

### Fluxo de Importação

```
1. UPLOAD EXCEL
   ↓
2. ANÁLISE DOS DADOS
   - Validação de colunas obrigatórias
   - Verificação de formatos
   - Contagem de registros
   ↓
3. COMPARAÇÃO COM BANCO
   Para cada membro:
   - Busca por nome_completo + data_nascimento
   - Se EXISTE → marcado para UPDATE
   - Se NÃO EXISTE → marcado para INSERT
   ↓
4. PROCESSAMENTO
   UPDATE:
   - Mantém ID original
   - Atualiza apenas campos modificados
   - Atualiza campo updated_at
   
   INSERT:
   - Gera novo ID personalizado
   - Insere registro completo
   - Define created_at e updated_at
   ↓
5. RESULTADO
   - X sucessos (Y novos, Z atualizados)
   - W erros
   - K duplicatas evitadas
```

### Campos Atualizáveis
- Nome, Sobrenome, Nome Completo
- Data de Nascimento, Idade, Mês
- Telefone, Sexo, Observações
- **Situação Atual** (Ativo/Desligado)
- Status Civil, Cônjuge, Parentesco
- Endereço (Rua, Número, Bairro, Cidade, Estado, CEP)
- Batizado, Membro, Líder, Professor EBQ
- Faixa Etária, Pequeno Grupo, Grupo, Número do Omes

### Critério de Duplicação
- **Chave Única**: `LOWER(nome_completo) + data_nascimento`
- Garante que não há duplicatas mesmo com diferenças de capitalização

---

## ▶️ Como Iniciar o Sistema

### Opção 1: Iniciar Tudo (Recomendado)
```bash
# Duplo clique em:
IniciarTudo.bat

# Ou via terminal:
.\IniciarTudo.bat
```

**O que inicia:**
- PostgreSQL (se não estiver rodando)
- Backend API (porta 5001)
- Frontend Build (porta 8080)
- pgAdmin 4 (porta 5050) - opcional

### Opção 2: Iniciar Desenvolvimento
```bash
.\IniciarSistema.bat
```

**O que inicia:**
- Backend (porta 5001)
- Frontend em modo dev (porta 5173)

### Opção 3: Apenas Build
```bash
.\Iniciar.bat
```

**O que inicia:**
- Backend (porta 5001)
- Frontend build (porta 8080)

### Opção 4: Manual

**Backend:**
```bash
cd backend
node server.js
```

**Frontend (desenvolvimento):**
```bash
npm run dev
```

**Frontend (produção):**
```bash
npm run build
npx http-server dist -p 8080 --proxy http://localhost:8080?
```

---

## 🌐 Endpoints da API

### Membros

#### `GET /api/members`
Retorna todos os membros

**Resposta:**
```json
[
  {
    "id": "AA20251103140522-KH8T",
    "nome_completo": "ABNER ABADIS LIMA",
    "data_nascimento": "2022-01-02",
    "idade": 3,
    "sexo": "M",
    "situacao_atual": "Ativo",
    ...
  }
]
```

#### `GET /api/members/:id`
Retorna um membro específico

#### `POST /api/members`
Cria novo membro

**Body:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "nome_completo": "João Silva",
  "data_nascimento": "1990-01-15",
  "sexo": "M",
  "situacao_atual": "Ativo",
  ...
}
```

#### `PUT /api/members/:id`
Atualiza membro existente

#### `DELETE /api/members/:id`
Remove membro

#### `POST /api/members/batch`
Importação em massa com UPSERT

**Body:**
```json
{
  "members": [...],
  "replaceAll": false
}
```

**Parâmetros:**
- `members`: Array de membros
- `replaceAll`: 
  - `true` = Limpa banco e insere tudo
  - `false` = Faz UPSERT (UPDATE ou INSERT)

**Resposta:**
```json
{
  "success": 144,
  "inserted": 10,
  "updated": 134,
  "errors": 0,
  "duplicates": 0,
  "examples": ["AA20251103...", "JS20251103..."]
}
```

### Estatísticas

#### `GET /api/statistics`
Retorna estatísticas gerais

### Upload

#### `POST /api/upload/avatar/:id`
Upload de avatar do membro

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `membros`

```sql
CREATE TABLE membros (
    id VARCHAR(30) PRIMARY KEY NOT NULL,
    id_externo VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100),
    nome_completo VARCHAR(200) NOT NULL,
    data_nascimento DATE,
    idade INTEGER,
    mes VARCHAR(20),
    telefone VARCHAR(20),
    sexo CHAR(1),
    observacoes TEXT,
    status_civil VARCHAR(50),
    conjuge VARCHAR(200),
    parentesco VARCHAR(200),
    rua VARCHAR(200),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    batizado BOOLEAN DEFAULT FALSE,
    membro BOOLEAN DEFAULT FALSE,
    situacao_atual VARCHAR(50),
    lider BOOLEAN DEFAULT FALSE,
    e_professor_ebq BOOLEAN DEFAULT FALSE,
    faixa_etaria VARCHAR(50),
    pequeno_grupo BOOLEAN DEFAULT FALSE,
    grupo VARCHAR(100),
    numerodomes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    avatar_url VARCHAR(500)
);
```

### Função: `gerar_id_compacto`

```sql
CREATE OR REPLACE FUNCTION gerar_id_compacto(nome_completo_param VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    iniciais VARCHAR(2);
    timestamp_str VARCHAR(14);
    random_suffix VARCHAR(4);
    novo_id VARCHAR(30);
    id_existe BOOLEAN;
BEGIN
    -- Extrai iniciais (primeira letra de cada palavra)
    SELECT STRING_AGG(SUBSTRING(palavra FROM 1 FOR 1), '')
    INTO iniciais
    FROM (
        SELECT UNNEST(STRING_TO_ARRAY(UPPER(nome_completo_param), ' ')) AS palavra
    ) subquery
    LIMIT 2;

    LOOP
        -- Gera timestamp no formato YYYYMMDDHHMMSS
        timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
        
        -- Gera sufixo aleatório de 4 caracteres
        random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        
        -- Monta o ID final
        novo_id := iniciais || timestamp_str || '-' || random_suffix;
        
        -- Verifica se ID já existe
        SELECT EXISTS(SELECT 1 FROM membros WHERE id = novo_id) INTO id_existe;
        
        -- Se não existe, retorna
        IF NOT id_existe THEN
            RETURN novo_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Índices

```sql
CREATE INDEX idx_membros_nome_completo ON membros(nome_completo);
CREATE INDEX idx_membros_data_nascimento ON membros(data_nascimento);
CREATE INDEX idx_membros_situacao_atual ON membros(situacao_atual);
CREATE INDEX idx_membros_sexo ON membros(sexo);
CREATE INDEX idx_membros_bairro ON membros(bairro);
```

---

## 🔧 Correções Implementadas

### 1. Calendário de Aniversários - Cores por Gênero
**Problema:** Todos os pontos ficavam rosa independente do gênero  
**Solução:** 
- Implementado rastreamento separado de `hasMale` e `hasFemale`
- Azul para masculino, rosa para feminino, âmbar para eventos

**Arquivo:** `src/components/dashboard/Calendar.tsx`

### 2. Filtro Padrão - Membros Ativos
**Problema:** Filtro mostrava todos por padrão  
**Solução:** 
- Filtro padrão mostra apenas membros ativos
- Usuário pode alterar para "Todos" se desejar

**Arquivo:** `src/utils/memberUtils.ts`

### 3. Importação - Campo `situacao_atual`
**Problema:** Campo `situacao_atual` chegava como `undefined` no backend  
**Solução:**
- Adicionado campo `situacao_atual` no mapeamento do frontend
- Corrigida ordem de prioridade no backend: `situacao_atual` antes de `situacaoAtual`
- Adicionado no objeto de retorno do `excelUtils.ts`

**Arquivos:** 
- `src/utils/excelUtils.ts` (linha 160)
- `backend/server.js` (linha 204)

### 4. Sistema UPSERT
**Problema:** Reimportar a mesma planilha criava duplicatas ou dava erro  
**Solução:**
- Implementado sistema de UPSERT completo
- Verifica existência por `nome_completo + data_nascimento`
- Se existe: UPDATE mantendo ID original
- Se não existe: INSERT com ID novo gerado
- Logs detalhados: "X novos, Y atualizados"

**Arquivo:** `backend/services/MemberServicePostgreSQL.js` (linhas 285-460)

### 5. IDs Personalizados
**Problema:** IDs sequenciais não eram únicos e legíveis  
**Solução:**
- Função PostgreSQL `gerar_id_compacto()`
- Formato: Iniciais + Timestamp + Hash
- Garantia de unicidade
- IDs legíveis e informativos

**Arquivo:** `backend/database/init/` (função SQL)

---

## 📊 Métricas da Build

**Última Build:** 03/11/2025  
**Tempo de Build:** 24.07 segundos  
**Módulos Transformados:** 3786  
**Tamanho Total:** 2,676.17 kB (gzip: 794.66 kB)

**Arquivos:**
- `index.html`: 0.41 kB (0.28 kB gzipped)
- `index-65pu91Lf.css`: 73.91 kB (12.94 kB gzipped)
- `purify.es-CQJ0hv7W.js`: 21.82 kB (8.54 kB gzipped)
- `index.es-CYHNy6xk.js`: 150.42 kB (51.21 kB gzipped)
- `html2canvas.esm-CBrSDip1.js`: 201.42 kB (47.70 kB gzipped)
- `index-C31NgU6R.js`: 2,228.19 kB (673.99 kB gzipped)

---

## ✅ Checklist de Funcionalidades

### Core
- [x] Cadastro de membros
- [x] Edição de membros
- [x] Exclusão de membros
- [x] Busca e filtros
- [x] Dashboard estatístico

### Importação
- [x] Upload de Excel
- [x] Validação de dados
- [x] Sistema UPSERT (UPDATE/INSERT)
- [x] Anti-duplicação
- [x] Feedback detalhado
- [x] Campo situacao_atual funcionando

### IDs
- [x] Geração automática
- [x] Formato personalizado
- [x] Garantia de unicidade
- [x] Iniciais + Timestamp + Hash

### Calendário
- [x] Visualização mensal
- [x] Cores por gênero (azul/rosa)
- [x] Lista de aniversariantes
- [x] Eventos especiais

### Filtros
- [x] Por status (Ativo/Desligado)
- [x] Por gênero
- [x] Por bairro
- [x] Por faixa etária
- [x] Por tipo de membro
- [x] Padrão em "Ativos"

### Build
- [x] Build de produção otimizada
- [x] Gzip compression
- [x] SPA routing
- [x] Assets otimizados

---

## 🎯 Próximas Melhorias Sugeridas

1. **Code-splitting** para reduzir tamanho dos chunks
2. **PWA** (Progressive Web App) para uso offline
3. **Notificações** de aniversários por email/SMS
4. **Relatórios** em PDF
5. **Gráficos** mais interativos
6. **Backup automático** agendado
7. **Autenticação** de usuários
8. **Permissões** por nível de acesso

---

## 📞 Suporte

**Desenvolvido para:** Igreja Batista Vida Plena (IBVP)  
**Data de Conclusão:** 03 de Novembro de 2025  
**Status:** ✅ Sistema 100% Funcional

---

**🎉 Sistema pronto para produção!**
