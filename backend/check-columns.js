const db = require('./config/postgresql');

(async () => {
  try {
    await db.connect();
    
    // Listar colunas
    const columns = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Colunas da tabela membros:');
    columns.forEach(c => console.log(`  - ${c.column_name}`));
    
    // Verificar alguns registros
    const sample = await db.query('SELECT * FROM membros LIMIT 3');
    console.log('\n📊 Primeiros 3 registros:');
    console.table(sample);
    
    await db.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
})();
