const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificar() {
  try {
    const result = await pool.query('SELECT nome_completo, sexo, data_nascimento FROM membros LIMIT 10');
    console.log('📊 Primeiros 10 registros:');
    console.table(result.rows);
    
    const stats = await pool.query(`
      SELECT 
        sexo,
        COUNT(*) as total
      FROM membros
      GROUP BY sexo
      ORDER BY sexo
    `);
    
    console.log('\n📈 Distribuição por sexo:');
    console.table(stats.rows);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificar();
