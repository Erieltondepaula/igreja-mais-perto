// Corrigir "São CristóVãO" para "São Cristóvão"
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function corrigir() {
  try {
    const result = await pool.query(
      "UPDATE membros SET bairro = 'São Cristóvão' WHERE bairro = 'São CristóVãO'"
    );
    console.log(`✅ Corrigido: São CristóVãO → São Cristóvão (${result.rowCount} registro)`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

corrigir();
