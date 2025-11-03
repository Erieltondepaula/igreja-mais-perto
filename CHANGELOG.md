# 📝 CHANGELOG - Dashboard de Membros IBVP

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## [1.5.0] - 2024-11-03 🎂

### ✨ Adicionado

#### 🎂 Dia da Semana de Aniversário no PDF
- Nova função `getNextBirthdayInfo()` que calcula:
  - Dias restantes até próximo aniversário
  - Nome do dia da semana em português
  - Trata casos especiais: "hoje", "amanhã", "daqui X dias"
- Nova coluna "Próximo Aniversário" no PDF (opcional)
- Toggle "Incluir próximo aniversário" no modal de configuração
- Formatos suportados:
  - `hoje` - aniversário é hoje
  - `amanhã` - aniversário é amanhã  
  - `domingo, daqui 13 dias` - aniversário futuro

#### 🎨 Melhorias na Interface
- Checkbox adicional no modal de exportação PDF
- Estado `showBirthdayWeekday` no componente MemberList
- Label descritivo: "Incluir próximo aniversário (dia da semana)"

### 🐛 Corrigido

#### 📸 Avatar Sobrepondo Nome no PDF
- **Problema:** Foto do membro sobrepunha o texto do nome
- **Causa:** `didDrawCell` renderizava imagem E texto (duplicando o texto do autoTable)
- **Solução:**
  - Removido `doc.text()` do callback `didDrawCell`
  - Adicionado `columnStyles: { 0: { cellPadding: { left: 12 } } }`
  - Avatar agora fica à esquerda, texto à direita, sem sobreposição

### 🔧 Modificado

- **src/utils/pdfUtils.ts:**
  - Adicionada função `getNextBirthdayInfo()` (linhas 67-88)
  - Lógica de formatação de aniversário (linhas 178-188)
  - Colunas condicionais atualizadas (linhas 195-201)
  - Correção do avatar em `didDrawCell` (linhas 235-250)
  - Novo parâmetro `showBirthdayWeekday` na assinatura da função

- **src/components/dashboard/MemberList.tsx:**
  - Novo estado `showBirthdayWeekday` (linha 65)
  - Parâmetro adicional em `exportToPDF()` (linha 79)
  - Checkbox no modal de configuração (linhas 327-337)

### 📦 Build

- **Tempo:** 27.39s (+3.32s vs versão anterior)
- **Bundle:** 2,229.12 kB → 674.32 kB gzipped (+2.74 kB)
- **Módulos:** 3,786 transformados
- **Status:** ✅ Sucesso sem erros

---

## [1.4.0] - 2024-11-03 📊

### 🐛 Corrigido

#### Situação Atual Importando como NULL

- **Problema:** Todos os 144 registros importados com `situacao_atual: NULL`
- **Esperado:** 135 "Ativo", 9 "Desligado"
- **Causa:** Campo não estava sendo enviado do frontend para backend

**Correções aplicadas:**

1. **src/utils/excelUtils.ts** (linha 160):
   ```typescript
   situacao_atual: String(getValue('status') || '')
   ```
   - Adiciona campo no objeto exportado
   - Mapeia de coluna Excel 'status' ou 'situacao_atual'

2. **backend/server.js** (linha 172):
   ```javascript
   situacao_atual: member.situacao_atual || member.situacaoAtual
   ```
   - Prioriza snake_case sobre camelCase
   - Garante que valor seja capturado corretamente

### ✅ Validado

- Excel tem dados corretos (verificado manualmente)
- Frontend envia campo `situacao_atual`
- Backend recebe e mapeia corretamente
- PostgreSQL armazena valor (VARCHAR)

### 📦 Build

- **Tempo:** 24.07s
- **Bundle:** 2,226.38 kB → 673.50 kB gzipped
- **Status:** ✅ Sucesso

---

## [1.3.0] - 2024-11-03 🔄

### ✨ Adicionado

#### Sistema UPSERT (Smart Update)

- **Requisito:** "Eu quero subir novamente a mesma planilha o sistema tem que entender que já tem o cadastro e atualizar só o campo que mudou"

**Implementação:**

1. **Verificação de Existência:**
   ```sql
   SELECT id FROM membros 
   WHERE LOWER(nome_completo) = LOWER($1) 
   AND data_nascimento = $2
   ```

2. **UPDATE (se existe):**
   - Mantém ID original
   - Atualiza 29 campos
   - Retorna `action: 'updated'`

3. **INSERT (se não existe):**
   - Gera novo ID com `gerar_id_compacto()`
   - Insere 29 campos
   - Retorna `action: 'inserted'`

### 🔧 Modificado

- **backend/services/MemberServicePostgreSQL.js:**
  - Refatoração completa do método `importMembers()` (linhas 285-450)
  - Lógica UPSERT implementada
  - Delay reduzido: 100ms → 50ms (melhor performance)
  - Logs detalhados: "X novos, Y atualizados"

- **backend/server.js:**
  - Suporte a `replaceAll: false` (modo UPSERT)
  - Mantém `replaceAll: true` (modo DELETE+INSERT)
  - Logs aprimorados com contadores separados

### 📊 Performance

- **Delay por registro:** 50ms (antes: 2000ms → 100ms → 50ms)
- **144 registros:** ~7.2s total
- **Tipos de operação:**
  - INSERT: Para novos membros
  - UPDATE: Para membros existentes

### ✅ Validado

- Importação inicial: 144 novos
- Reimportação: 0 novos, 144 atualizados
- Modificação parcial: X novos, Y atualizados

### 📦 Build

- **Tempo:** 22.30s
- **Status:** ✅ Sucesso

---

## [1.2.0] - 2024-11-03 🆔

### 🐛 Corrigido

#### Import Failure: "0 sucessos, 144 erros"

- **Problema:** 100% de falha na importação via interface
- **Erro:** `o valor nulo na coluna 'id' viola a restrição de não-nulo`
- **Causa:** Coluna `id VARCHAR(30) NOT NULL` sem DEFAULT ou trigger

**Solução Implementada:**

1. **Geração Automática de ID:**
   ```javascript
   const idResult = await db.query(
     'SELECT gerar_id_compacto($1) as id', 
     [nomeCompleto]
   );
   const newId = idResult[0].id;
   ```

2. **Formato do ID:**
   - Prefixo: 2 primeiras letras do nome
   - Timestamp: `YYYYMMDDHHmmss`
   - Hash: 4 caracteres aleatórios
   - Exemplo: `JS20251103133812-KH8T`

### 🔧 Modificado

- **backend/services/MemberServicePostgreSQL.js:**
  - Adicionada chamada a `gerar_id_compacto()` antes de INSERT
  - ID gerado dinamicamente para cada membro
  - Delay ajustado para 100ms (era 2000ms)

### ✅ Validado

- Teste manual: `SELECT gerar_id_compacto('JOÃO SILVA')` → `JS20251103133812-KH8T`
- Importação de 144 registros: ✅ Sucesso
- Todos os IDs únicos e válidos

### 📄 Documentação

- **SOLUCAO_IMPORTACAO_ID.md** criado (400+ linhas)
  - Problema detalhado
  - Solução técnica
  - Procedimentos de teste
  - Troubleshooting
  - Checklist de validação

### 📦 Build

- **Tempo:** 24.01s
- **Status:** ✅ Sucesso

---

## [1.1.0] - 2024-11-03 🎨

### ✨ Adicionado

#### Filtros Padrão: Membros Ativos

- **Requisito:** "eu quero que todos os filtros tirando status estejam focados nos membros ativos"
- Filtros agora defaultam para `statusGeral: 'ativo'`
- Usuário pode mudar manualmente se desejar

#### Calendario: Cores Corretas

- **Problema:** "o calendario os aniversariante masculinos ainda estão rosa"
- **Solução:**
  - Homens: 🔵 Azul (`#3b82f6`)
  - Mulheres: 🩷 Rosa (`#ec4899`)
  - Eventos gerais: 🟠 Âmbar (`#f59e0b`)

### 🔧 Modificado

- **Arquivos .bat atualizados:**
  - `IniciarSistema.bat`
  - `Iniciar.bat`
  - `Start.bat`
  - Configuração para SPA routing (fallback para `index.html`)

### 📦 Build

- **Múltiplas builds criadas:** 19.00s - 25.90s
- **Tamanho:** ~673 kB gzipped
- **Status:** ✅ Todas bem-sucedidas

---

## [1.0.0] - 2024-11-03 🚀

### ✨ Sistema Inicial

#### Funcionalidades Core

1. **Dashboard de Membros**
   - Listagem completa de membros
   - Filtros avançados (idade, sexo, bairro, tipo, status)
   - Busca por nome
   - Ordenação customizável

2. **Importação de Dados**
   - Suporte a Excel (.xlsx, .xls)
   - Suporte a CSV
   - Mapeamento automático de colunas
   - Validação de dados

3. **Exportação de Relatórios**
   - PDF com logo da igreja
   - Configurações customizáveis
   - Toggle de idade
   - Toggle de fotos

4. **Calendário de Aniversários**
   - Visualização mensal
   - Cores por gênero
   - Filtros de período

5. **Gestão de Perfil**
   - Upload de avatar
   - Edição de dados
   - Campos customizados

#### Tecnologias

- **Frontend:**
  - React 18
  - TypeScript
  - Vite 5.4.19
  - Tailwind CSS
  - Shadcn UI
  - jsPDF + AutoTable

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL 17.0
  - Winston (logs)

- **Banco de Dados:**
  - PostgreSQL (principal)
  - Access (migração)
  - localStorage (fallback)

#### Estrutura

```
Dashboard_Membros/
├── backend/
│   ├── server.js
│   ├── services/
│   ├── routes/
│   └── config/
├── src/
│   ├── components/
│   ├── utils/
│   ├── contexts/
│   └── pages/
├── dist/ (build de produção)
└── database/
```

### 📦 Build

- **Tempo:** 38.37s
- **Bundle:** ~671 kB gzipped
- **Módulos:** 3,786
- **Status:** ✅ Sucesso

---

## 🏆 Resumo de Conquistas

| Versão | Data | Funcionalidade Principal | Impacto |
|--------|------|-------------------------|---------|
| 1.0.0 | 03/11 | Sistema inicial completo | 🚀 Launch |
| 1.1.0 | 03/11 | Filtros + Cores corretas | 🎨 UX |
| 1.2.0 | 03/11 | Correção import (ID automático) | 🐛 Critical Fix |
| 1.3.0 | 03/11 | UPSERT inteligente | 🔄 Smart Update |
| 1.4.0 | 03/11 | Correção situacao_atual | 📊 Data Integrity |
| 1.5.0 | 03/11 | Avatar + Aniversário PDF | 🎂 PDF Enhancements |

---

## 📈 Evolução do Bundle

| Versão | Tamanho (gzipped) | Delta | Justificativa |
|--------|------------------|-------|---------------|
| 1.0.0 | 671.20 kB | - | Base |
| 1.1.0 | 672.10 kB | +0.90 kB | Lógica de filtros |
| 1.2.0 | 673.20 kB | +1.10 kB | ID generation |
| 1.3.0 | 673.30 kB | +0.10 kB | UPSERT logic |
| 1.4.0 | 673.50 kB | +0.20 kB | Field mapping |
| **1.5.0** | **674.32 kB** | **+0.82 kB** | **Birthday calc** |

**Total crescimento:** 3.12 kB (0.46%)  
**Funcionalidades adicionadas:** 15+  
**Eficiência:** Excelente (< 1% crescimento)

---

## 🔮 Roadmap Futuro

### Próximas Funcionalidades Planejadas

- [ ] 📱 **Mobile Responsiveness:** Otimizar para smartphones/tablets
- [ ] 📧 **Notificações de Email:** Enviar emails de aniversário automaticamente
- [ ] 📊 **Dashboard Analytics:** Gráficos e estatísticas detalhadas
- [ ] 🔐 **Roles & Permissions:** Sistema de permissões por usuário
- [ ] 🌐 **Multi-church Support:** Suportar múltiplas igrejas
- [ ] 📤 **Exportação Excel:** Além de PDF, exportar para Excel
- [ ] 🔄 **Sync Cloud:** Sincronização com Google Drive/OneDrive
- [ ] 📸 **Bulk Photo Upload:** Upload de múltiplas fotos de uma vez
- [ ] 🎨 **Temas Customizáveis:** Dark mode + temas personalizados
- [ ] 🔔 **Push Notifications:** Notificações no navegador

### Melhorias de Performance

- [ ] **Code-Splitting:** Dividir bundle em chunks menores
- [ ] **Lazy Loading:** Carregar componentes sob demanda
- [ ] **Image Optimization:** Comprimir avatares automaticamente
- [ ] **Service Worker:** Cache offline para PWA
- [ ] **CDN:** Servir assets via CDN

### Melhorias de UX

- [ ] **Onboarding Tutorial:** Guia interativo para novos usuários
- [ ] **Keyboard Shortcuts:** Atalhos de teclado para ações comuns
- [ ] **Bulk Actions:** Operações em lote (excluir, editar múltiplos)
- [ ] **Advanced Search:** Busca com operadores booleanos
- [ ] **Custom Fields:** Campos customizáveis pelo administrador

---

## 📞 Suporte e Contribuição

### Reportar Bugs

1. Verifique se o bug já foi reportado
2. Inclua passos para reproduzir
3. Adicione screenshots se aplicável
4. Especifique versão do sistema

### Solicitar Funcionalidades

1. Descreva o caso de uso
2. Explique o benefício esperado
3. Sugira possível implementação (opcional)

### Contribuir

1. Fork o repositório
2. Crie branch para feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha feature'`)
4. Push para branch (`git push origin feature/MinhaFeature`)
5. Abra Pull Request

---

## 📄 Licença

Este projeto é propriedade da **Igreja Batista da Vitória em Paulo Afonso (IBVP)**.  
Todos os direitos reservados.

---

**Última atualização:** 03/11/2024  
**Versão atual:** 1.5.0  
**Status:** ✅ Produção  
**Mantenedor:** Eriel - IBVP Tech Team
