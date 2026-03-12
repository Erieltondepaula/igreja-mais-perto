# 📋 Guia de Importação de Membros

## ✅ Preparação Concluída

### 1. Banco de Dados Limpo
- ✅ **PostgreSQL zerado** - 0 registros na tabela `membros`
- ✅ **Pronto para importação**

### 2. Template Criado
- ✅ **Arquivo**: `template-importacao-membros.xlsx`
- ✅ **Local**: Pasta raiz do projeto
- ✅ **Contém**: 3 exemplos de membros

---

## 📝 Como Usar o Template

### Colunas Disponíveis

#### ⚠️ OBRIGATÓRIAS:
1. **Nome** - Nome do membro (ex: "João Silva")
2. **Data de Nascimento** - Formato: DD/MM/YYYY (ex: "15/03/1985")
3. **Sexo** - Use "Masculino" ou "Feminino"

#### 📌 OPCIONAIS:
4. **Telefone** - (11) 98765-4321
5. **Bairro** - Nome do bairro
6. **Situação Atual** - "ativo" ou "desligado"
7. **Batizado?** - "Sim" ou "Não"
8. **Membro** - "Sim" ou "Não"
9. **É Líder?** - "Sim" ou "Não"
10. **É Professor EBQ?** - "Sim" ou "Não"

---

## 🚀 Como Importar

### Passo 1: Preencher o Template
1. Abra `template-importacao-membros.xlsx`
2. Preencha com seus dados
3. Salve o arquivo

### Passo 2: Importar no Sistema
1. Acesse o Dashboard
2. Localize o card **"Importar e Exportar Dados"**
3. Clique em **"Importar Planilha (Substitui Tudo)"**
4. Selecione seu arquivo XLSX
5. Aguarde a confirmação

### Passo 3: Verificar
1. Clique em **"Atualizar Lista"** no card de membros
2. Verifique se os dados foram importados corretamente

---

## 🔄 O que Acontece na Importação

1. **Limpa o banco** - Remove todos os registros antigos
2. **Valida os dados** - Verifica colunas obrigatórias
3. **Remove duplicatas** - Baseado em Nome + Data de Nascimento
4. **Gera IDs automáticos** - Formato: AA20253010104302
5. **Calcula campos** - Idade, mês, faixa etária
6. **Salva no PostgreSQL** - Persiste no banco de dados
7. **Atualiza interface** - Recarrega a lista automaticamente

---

## ⚙️ Sistema de Anti-Duplicação

O sistema **ignora automaticamente** registros duplicados usando:
- Nome (case-insensitive)
- Data de Nascimento

Se você importar o mesmo membro duas vezes, apenas o primeiro será salvo.

---

## 📊 Formatos Aceitos

### Datas:
✅ DD/MM/YYYY → 15/03/1985  
✅ YYYY-MM-DD → 1985-03-15  
❌ MM/DD/YYYY → ❌ (formato americano não aceito)

### Sexo:
✅ "Masculino" ou "masc" ou "M"  
✅ "Feminino" ou "fem" ou "F"

### Sim/Não:
✅ "Sim", "S", "Yes", "Y", "1"  
✅ "Não", "N", "No", "0" (ou vazio)

---

## 🛠️ Comandos Úteis (Para Desenvolvedores)

### Limpar banco manualmente:
```bash
node backend/limpar-banco.js
```

### Recriar template:
```bash
node criar-template-xlsx.cjs
```

---

## 📌 Notas Importantes

1. **Sempre faça backup** antes de importar dados novos
2. A importação **SUBSTITUI TODOS** os dados existentes
3. IDs antigos **NÃO são preservados** - novos IDs são gerados
4. Avatares/fotos **NÃO são importados** via planilha
5. Campos calculados (idade, faixa etária) são **gerados automaticamente**

---

## 🎯 Exemplo de Registro Válido

| Nome | Data de Nascimento | Sexo | Telefone | Bairro | Situação Atual | Batizado? | Membro | É Líder? | É Professor EBQ? |
|------|-------------------|------|----------|--------|---------------|-----------|--------|----------|------------------|
| João Silva | 15/03/1985 | Masculino | (11) 98765-4321 | Centro | ativo | Sim | Sim | Sim | Não |

---

## ✅ Tudo Pronto!

Seu sistema está configurado para importação. Use o template e teste! 🚀
