const db = require('./config/postgresql');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('💾 CRIANDO BACKUP DO BANCO DE DADOS...\n');
    
    await db.connect();
    
    // Buscar todos os membros
    const membros = await db.query('SELECT * FROM membros ORDER BY created_at');
    console.log(`📊 Total de membros a fazer backup: ${membros.length}`);
    
    // Criar pasta de backups se não existir
    const backupDir = path.join(__dirname, 'database', 'Backup_banco');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log('📁 Pasta database/Backup_banco criada');
    }
    
    // Criar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    const fileName = `backup-${timestamp[0]}-${timestamp[1].split('-').slice(0, 3).join('-')}.json`;
    const filePath = path.join(backupDir, fileName);
    
    // Criar objeto de backup
    const backup = {
      timestamp: new Date().toISOString(),
      total_membros: membros.length,
      membros: membros,
      metadata: {
        version: '2.0',
        database: 'PostgreSQL',
        server: 'Dashboard Membros IBVP'
      }
    };
    
    // Salvar backup
    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf8');
    console.log(`✅ Backup salvo: ${fileName}`);
    console.log(`📍 Localização: ${filePath}`);
    
    // Mostrar alguns exemplos do backup
    if (membros.length > 0) {
      console.log('\n👥 Primeiros 5 membros no backup:');
      membros.slice(0, 5).forEach((m, i) => {
        console.log(`   ${i+1}. ${m.nome_completo} (ID: ${m.id})`);
      });
    }
    
    // Limpar backups antigos (manter apenas os 10 mais recentes)
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > 10) {
      console.log(`\n🧹 Removendo backups antigos (mantendo os 10 mais recentes)...`);
      files.slice(10).forEach(f => {
        fs.unlinkSync(f.path);
        console.log(`   - Removido: ${f.name}`);
      });
    }
    
    console.log(`\n✅ BACKUP CONCLUÍDO COM SUCESSO!`);
    console.log(`📦 Backups disponíveis: ${Math.min(files.length, 10)}`);
    
    await db.close();
    process.exit(0);
  } catch(e) {
    console.error('❌ Erro ao criar backup:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
