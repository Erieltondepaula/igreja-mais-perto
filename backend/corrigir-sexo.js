const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function corrigirSexo() {
  try {
    await pool.query("UPDATE membros SET sexo = 'M' WHERE LOWER(TRIM(sexo)) = 'masculino'");
    await pool.query("UPDATE membros SET sexo = 'F' WHERE LOWER(TRIM(sexo)) = 'feminino'");
    console.log('Correção aplicada com sucesso!');
  } catch (error) {
    console.error('Erro ao corrigir sexo:', error.message);
  } finally {
    await pool.end();
  }
}

corrigirSexo();
