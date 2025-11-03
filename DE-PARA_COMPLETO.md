# 📊 Mapeamento Completo: Arquivo Original ↔ Banco de Dados

## ✅ DE-PARA COMPLETO

Este documento mostra como cada coluna do arquivo original é mapeada para o banco de dados PostgreSQL.

---

## � MAPEAMENTO DE COLUNAS

Total de colunas: **30** (incluindo id_externo e sobrenome)

| # | Arquivo Original (XLSX) | Banco de Dados (PostgreSQL) | Tipo | Observações |
|---|------------------------|----------------------------|------|-------------|
| 1 | `Carimbo de data/hora` | ❌ Não importado | - | Informação descartada |
| 2 | `Id` | `id` | VARCHAR(20) | Se vazio, será gerado automaticamente (ex: AA20253010104302) |
| 3 | `id_externo` | `id_externo` | VARCHAR | ID do sistema antigo (opcional) |
| 4 | `nome` | `nome` | VARCHAR(100) | ⚠️ OBRIGATÓRIO |
| 5 | `sobrenome` | `sobrenome` | VARCHAR(100) | ⚠️ OBRIGATÓRIO (usado para gerar ID) |
| 6 | `Nome Completo` | `nome_completo` | VARCHAR | Recomendado preencher |
| 7 | `data_nascimento` | `data_nascimento` | DATE | ⚠️ OBRIGATÓRIO - Formato: DD/MM/YYYY ou YYYY-MM-DD |
| 7 | `data_nascimento` | `data_nascimento` | DATE | ⚠️ OBRIGATÓRIO - Formato: DD/MM/YYYY ou YYYY-MM-DD |
| 8 | `idade` | `idade` | INTEGER | ✨ Calculado automaticamente |
| 9 | `mes` | `mes` | VARCHAR | ✨ Extraído da data de nascimento |
| 10 | `telefone` | `telefone` | VARCHAR(20) | Opcional |
| 11 | `sexo` | `sexo` | VARCHAR(10) | ⚠️ OBRIGATÓRIO - "Masculino" ou "Feminino" |
| 12 | `observacoes` | `observacoes` | TEXT | Opcional |
| 13 | `status_civil` | `status_civil` | VARCHAR | Ex: "Casado(a)", "Solteiro(a)" |
| 14 | `nome_conjuge ` | `conjuge` | VARCHAR | Nome do cônjuge |
| 15 | `parentesco ` | `parentesco` | VARCHAR | Relação familiar |
| 16 | `rua` | `rua` | VARCHAR | Endereço - rua |
| 17 | `numero` | `numero` | VARCHAR | Endereço - número |
| 18 | `bairro` | `bairro` | VARCHAR | Endereço - bairro |
| 19 | `cidade` | `cidade` | VARCHAR | Endereço - cidade |
| 20 | `estado` | `estado` | VARCHAR | Endereço - UF (ex: ES) |
| 21 | `cep` | `cep` | VARCHAR(10) | Endereço - CEP |
| 22 | `batizado` | `batizado` | BOOLEAN | "Sim" = true, "Não" = false |
| 23 | `membro` | `membro` | BOOLEAN | "Sim" = true, "Não" = false |
| 24 | `situacao_atual` | `situacao_atual` | VARCHAR | "Ativo" ou "Desligado" |
| 25 | `e_lider` | `lider` | BOOLEAN | "Sim" = true, "Não" = false |
| 26 | `e_professor_ebq\n` | `e_professor_ebq` | BOOLEAN | "Sim" = true, "Não" = false |
| 27 | `faixa_etaria ` | `faixa_etaria` | VARCHAR | ✨ Calculado automaticamente |
| 28 | `Está em um pequeno grupo ?` | `pequeno_grupo` | BOOLEAN | "Sim" = true, "Não" = false |
| 29 | `grupo` | `grupo` | VARCHAR | Nome do grupo |
| 30 | `numerodomes` | `numerodomes` | INTEGER | Número do mês |

---

## 🔄 CONVERSÕES AUTOMÁTICAS

### Valores Booleanos (Sim/Não):
- ✅ **Aceito como "Sim"**: "Sim", "S", "Yes", "Y", "1", "true"
- ❌ **Aceito como "Não"**: "Não", "N", "No", "0", "false", (vazio)

### Sexo:
- 🔵 **Masculino**: "Masculino", "masc", "M"
- 🔴 **Feminino**: "Feminino", "fem", "F"

### Situação Atual:
- ✅ **Ativo**: "Ativo", "Active", "Sim", "S"
- ❌ **Desligado**: Qualquer outro valor

### Data de Nascimento:
- ✅ **Formato 1**: DD/MM/YYYY (ex: 15/03/1985)
- ✅ **Formato 2**: YYYY-MM-DD (ex: 1985-03-15)
- ✅ **Formato Excel**: Número serial do Excel (convertido automaticamente)

---

## ✨ CAMPOS CALCULADOS AUTOMATICAMENTE

Estes campos **NÃO precisam** ser preenchidos no Excel, pois são calculados pelo sistema:

1. **`idade`** - Calculado a partir de `data_nascimento`
2. **`mes`** - Extraído de `data_nascimento` (ex: "janeiro", "fevereiro", etc.)
3. **`faixa_etaria`** - Calculado pela idade:
   - 0 a 6 anos: Infância
   - 7 a 12 anos: Pré-Adolescência
   - 13 a 17 anos: Adolescência
   - 18 a 25 anos: Juventude
   - 26 a 40 anos: Jovem Adulto
   - 41 a 60 anos: Adulto
   - 61+ anos: Melhor Idade

4. **`id`** - Gerado automaticamente no formato: **AA20253010104302**
   - AA = Primeira letra do nome + primeira letra do sobrenome
   - 20253010104302 = Timestamp (YYYYMMDDHHMMSS)

---

## ⚠️ VALIDAÇÕES E REGRAS

### Colunas Obrigatórias:
1. ✅ **nome** - Não pode estar vazio
2. ✅ **sobrenome** - Usado para gerar o ID personalizado
3. ✅ **data_nascimento** - Deve ser uma data válida
4. ✅ **sexo** - Deve ser "Masculino" ou "Feminino"

### Anti-Duplicação:
O sistema **ignora automaticamente** registros duplicados baseado em:
- `nome` (case-insensitive) + `data_nascimento`

Se houver 2 linhas com o mesmo nome e mesma data de nascimento, apenas a **primeira** será importada.

---

## 📁 ESTRUTURA DO ARQUIVO DE EXEMPLO

O arquivo **`exemplo-importacao.xlsx`** contém:
- ✅ **Todas as 27 colunas** mapeadas corretamente
- ✅ **3 exemplos** de membros preenchidos
- ✅ **Nomes de colunas exatos** do arquivo original
- ✅ **Formatação correta** para importação

---

## 🎯 COMO USAR

### Opção 1: Usar o Arquivo Original
Se você já tem o arquivo **"Cadastro de Membros IBVP.xlsx"**:
1. ✅ Pode importar diretamente
2. ✅ Todas as colunas serão reconhecidas
3. ✅ Dados serão convertidos automaticamente

### Opção 2: Usar o Template de Exemplo
Se vai criar dados novos:
1. ✅ Use **"exemplo-importacao.xlsx"**
2. ✅ Preencha seguindo os exemplos
3. ✅ Mantenha os nomes das colunas

---

## 🔍 VERIFICAÇÃO APÓS IMPORTAÇÃO

Após importar, o sistema:
1. ✅ Remove duplicatas
2. ✅ Valida datas
3. ✅ Converte Sim/Não para true/false
4. ✅ Calcula idade e faixa etária
5. ✅ Gera IDs personalizados
6. ✅ Salva no PostgreSQL
7. ✅ Retorna estatísticas:
   - Total recebido
   - Total processado
   - Sucessos
   - Erros
   - Duplicatas evitadas

---

## 📝 EXEMPLO DE IMPORTAÇÃO BEM-SUCEDIDA

```
✅ Importação concluída:
   - 142 sucessos com IDs personalizados
   - 0 erros
   - 2 duplicatas evitadas
🆔 IDs gerados: JO20253010104302, MA20253010104305, PE20253010104308
```

---

## 🛠️ TROUBLESHOOTING

### ❌ Erro: "Data de Nascimento inválida"
**Solução**: Use formato DD/MM/YYYY (ex: 15/03/1985)

### ❌ Erro: "Colunas obrigatórias não encontradas"
**Solução**: Verifique se tem as colunas: `nome`, `data_nascimento`, `sexo`

### ❌ Nenhum dado foi importado
**Solução**: Verifique se a planilha tem dados além do cabeçalho

### ❌ Menos registros do que esperado
**Solução**: Provavelmente há duplicatas (nome + data nascimento iguais)

---

## ✅ COMPATIBILIDADE 100%

Este sistema garante:
- ✅ **100% compatível** com o arquivo original "Cadastro de Membros IBVP.xlsx"
- ✅ **Todas as 30 colunas** mapeadas (29 são importadas, 1 descartada)
- ✅ **Nenhuma informação perdida** (exceto "Carimbo de data/hora")
- ✅ **Campos calculados** gerados automaticamente
- ✅ **Anti-duplicação** inteligente
- ✅ **IDs personalizados** únicos

### 📁 Arquivo Atualizado:
- ✅ **exemplo-importacao-COMPLETO.xlsx** - Template com TODAS as 30 colunas do banco
