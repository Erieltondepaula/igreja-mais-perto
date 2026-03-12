import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarFabio() {
  try {
    const result = await pool.query(`
      SELECT nome, sexo, data_nascimento 
      FROM membros 
      WHERE nome ILIKE '%fábio%' OR nome ILIKE '%fabio%'
    `);
    
    console.log('=== DADOS DO FÁBIO ===');
    result.rows.forEach(row => {
      console.log(JSON.stringify(row, null, 2));
    });
    
    await pool.end();
  } catch (err) {
    console.error('Erro:', err);
    await pool.end();
  }
}

verificarFabio();
