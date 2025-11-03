const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarColunas() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 COLUNAS NO POSTGRESQL (dashboard_membros.membros):\n');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? '- OBRIGATÓRIO' : ''}`);
    });
    
    console.log(`\n✅ Total de colunas: ${result.rows.length}\n`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarColunas();
