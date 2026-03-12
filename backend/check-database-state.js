const db = require('./config/postgresql');

(async () => {
  try {
    console.log('🔍 VERIFICANDO ESTADO DO BANCO DE DADOS...\n');
    
    await db.connect();
    
    const result = await db.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Total de membros no banco: ${result[0].total}\n`);
    
    if (result[0].total > 0) {
      const membros = await db.query('SELECT id, nome_completo, avatar_url FROM membros ORDER BY created_at DESC LIMIT 10');
      console.log('👥 Últimos 10 membros cadastrados:');
      membros.forEach(m => {
        console.log(`  - ${m.nome_completo}`);
        console.log(`    ID: ${m.id}`);
        console.log(`    Avatar: ${m.avatar_url || 'sem avatar'}\n`);
      });
    }
    
    await db.close();
    process.exit(0);
  } catch(e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }
})();
