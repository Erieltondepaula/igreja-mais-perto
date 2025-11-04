# ⚠️ REGRAS CRÍTICAS DE BACKUP - LEIA ANTES DE QUALQUER TESTE

## 🚨 REGRA FUNDAMENTAL

**SEMPRE FAÇA BACKUP ANTES DE QUALQUER TESTE OU MODIFICAÇÃO NO BANCO DE DADOS!**

## 📋 PROCEDIMENTO OBRIGATÓRIO

### Antes de qualquer teste:
1. ✅ Executar `node backup-database.js` 
2. ✅ Confirmar que backup foi criado
3. ✅ Executar o teste
4. ✅ Restaurar com `node restore-database.js` após o teste

### Nunca:
- ❌ Fazer testes sem backup
- ❌ Limpar banco sem backup
- ❌ Modificar dados de produção diretamente
- ❌ Executar scripts destrutivos sem confirmação

## 📁 Sistema de Backup

### Localização dos Backups:
- Pasta: `backend/database/Backup_banco/`
- Formato: `backup-YYYY-MM-DD-HH-mm-ss.json`
- Mantidos: Últimos 10 backups
- **Automático**: Backup criado automaticamente ao iniciar com `IniciarTudo.bat`

### Informações no Backup:
```json
{
  "timestamp": "2025-11-04T09:00:00.000Z",
  "total_membros": 147,
  "membros": [...],
  "metadata": {
    "version": "2.0",
    "database": "PostgreSQL"
  }
}
```

## 🔧 Scripts Disponíveis

### 1. Criar Backup
```bash
node backend/backup-database.js
```

### 2. Restaurar Backup (último)
```bash
node backend/restore-database.js
```

### 3. Restaurar Backup Específico
```bash
node backend/restore-database.js backup-2025-11-04-09-00-00.json
```

### 4. Listar Backups
```bash
node backend/list-backups.js
```

## ⚠️ ATENÇÃO ESPECIAL

### Dados do Usuário Atual:
- **Planilha Original**: `Excel Membros\Cadastro de Membros IBVP.xlsx`
- **Total de Membros**: 147 pessoas
- **Primeiros Membros**: ABNER ABADIS LIMA, ADASSA VALENTINA CRUZ DE SOUSA, ADELIDIA DE AZEVEDO CRUZ
- **Última Modificação**: 04/11/2025

### Comportamento dos Testes:
- ✅ Testes devem usar dados fictícios temporários
- ✅ Testes devem limpar dados de teste automaticamente
- ✅ Testes NUNCA devem tocar em dados reais sem backup
- ✅ Sempre mostrar status do backup antes de continuar

## 📊 Checklist Antes de Teste

```
[ ] Backup criado? → node backup-database.js
[ ] Backup confirmado? → Verificar arquivo em database-backups/
[ ] Teste não destrutivo? → Usar dados temporários com prefixo "TESTE_"
[ ] Limpeza automática? → Script remove dados de teste no final
[ ] Dados reais preservados? → Verificar após teste
```

## 🔄 Fluxo de Trabalho Seguro

```
1. BACKUP
   ↓
2. TESTE/MODIFICAÇÃO
   ↓
3. VERIFICAÇÃO
   ↓
4. RESTAURAR (se necessário)
   ↓
5. CONFIRMAR INTEGRIDADE
```

## 🆘 Recuperação de Emergência

Se algo der errado:

1. **Pare imediatamente** qualquer operação
2. **NÃO execute** mais comandos no banco
3. **Execute**: `node backend/restore-database.js`
4. **Verifique**: `node backend/check-database-state.js`
5. **Confirme** que os dados foram restaurados

## 📝 Histórico de Incidentes

### 2025-11-04 09:00
- **Problema**: Usuário reportou que banco tinha apenas 3 membros (não eram seus dados)
- **Causa**: Testes anteriores não fizeram backup
- **Solução**: Banco foi limpo, usuário vai importar manualmente
- **Lição**: SEMPRE fazer backup antes de qualquer teste

## 🎯 Compromisso

**Este arquivo DEVE ser consultado antes de:**
- Executar qualquer script de teste
- Modificar dados no banco
- Executar operações de limpeza
- Testar novas funcionalidades

---

**Criado em**: 04/11/2025  
**Última Atualização**: 04/11/2025  
**Status**: 🔴 CRÍTICO - SEMPRE CONSULTAR
