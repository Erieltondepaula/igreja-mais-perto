const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '252088',
  database: 'dashboard_membros'
});

async function checkAvatars() {
  try {
    const result = await pool.query(`
      SELECT id, nome, avatar_url 
      FROM membros 
      WHERE avatar_url IS NOT NULL AND avatar_url != '' 
      LIMIT 5
    `);
    
    console.log('📋 Avatars no banco de dados:');
    console.log('');
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`Nome: ${row.nome}`);
      console.log(`avatar_url: "${row.avatar_url}"`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pool.end();
  }
}

checkAvatars();
