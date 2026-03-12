# 🔐 Sistema de Backup Automático - Guia Rápido

## 📌 REGRA DE OURO
**🚨 SEMPRE faça backup antes de qualquer teste ou modificação no banco!**

Consulte: `REGRAS_BACKUP_CRITICAS.md` para detalhes completos.

---

## 🎯 Comandos Principais

### Criar Backup Manual
```bash
cd backend
node backup-database.js
```
**Quando usar**: Antes de qualquer teste, modificação ou importação

### Listar Backups Disponíveis
```bash
cd backend
node list-backups.js
```
**Quando usar**: Para ver todos os backups e escolher qual restaurar

### Restaurar Último Backup
```bash
cd backend
node restore-database.js
```
**Quando usar**: Após teste ou se algo der errado

### Restaurar Backup Específico
```bash
cd backend
node restore-database.js backup-2025-11-04-09-00-00.json
```
**Quando usar**: Para restaurar um backup específico

---

## ✅ Fluxo de Trabalho Seguro

```
1. 💾 BACKUP
   cd backend
   node backup-database.js

2. ✏️ MODIFICAR/TESTAR
   (fazer suas alterações)

3. ✅ VERIFICAR
   node check-database-state.js

4. 🔄 RESTAURAR (se necessário)
   node restore-database.js
```

---

## 🧪 Testes Automáticos

Os scripts de teste agora fazem backup automaticamente:

```bash
cd backend
node test-intelligent-import.js  # Faz backup automático antes de testar
```

---

## 📁 Localização dos Backups

- **Pasta**: `backend/database/Backup_banco/`
- **Formato**: `backup-YYYY-MM-DD-HH-mm-ss.json`
- **Retenção**: Últimos 10 backups (mais antigos são removidos automaticamente)
- **Backup Automático**: Criado automaticamente ao iniciar o sistema com `IniciarTudo.bat`

---

## 🆘 Em Caso de Emergência

Se você perdeu dados ou algo deu errado:

1. **PARE** - Não execute mais nada
2. **RESTAURE** - `node restore-database.js`
3. **VERIFIQUE** - `node check-database-state.js`
4. **CONFIRME** - Certifique-se que os dados voltaram

---

## 📊 Scripts Úteis

| Script | Descrição |
|--------|-----------|
| `backup-database.js` | Cria backup completo do banco |
| `restore-database.js` | Restaura backup mais recente ou específico |
| `list-backups.js` | Lista todos os backups disponíveis |
| `check-database-state.js` | Verifica estado atual do banco |
| `clear-database.js` | Limpa o banco (⚠️ use com cuidado) |

---

## 💡 Dicas

- ✅ Faça backup antes de importar planilhas grandes
- ✅ Faça backup antes de testes de desenvolvimento
- ✅ Mantenha backups importantes em outro local
- ✅ Verifique regularmente se os backups estão funcionando
- ❌ Nunca delete a pasta `database-backups` manualmente

---

**Criado**: 04/11/2025  
**Versão**: 1.0  
**Status**: ✅ Ativo
