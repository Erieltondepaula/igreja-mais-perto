# Pasta de Backups Automáticos

Esta pasta armazena os backups automáticos do banco de dados.

- Backups são criados automaticamente ao iniciar o sistema com `IniciarTudo.bat`
- Formato: `backup-YYYY-MM-DD-HH-mm-ss.json`
- Mantém os 10 backups mais recentes
- Backups mais antigos são removidos automaticamente

⚠️ **Importante**: Os arquivos de backup (*.json) não são versionados no Git por segurança.
