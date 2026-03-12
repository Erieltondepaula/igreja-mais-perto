const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'membros' 
  ORDER BY ordinal_position
`, (err, res) => {
  if(err) {
    console.log('Erro:', err.message);
  } else {
    console.log('📋 Colunas da tabela membros:');
    res.rows.forEach(r => console.log(`   - ${r.column_name} (${r.data_type})`));
  }
  pool.end();
});
