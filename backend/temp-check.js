const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432
});

async function checkDuplicates() {
  try {
    const result = await pool.query(`
      SELECT id, fotografia
      FROM membros 
      WHERE id IN ('AL20251104091147-WM7I', 'EM20251104091149-JP3O')
      ORDER BY id
    `);
    
    console.log('\n AVATARES NO BANCO:\n');
    result.rows.forEach(row => {
      console.log(`  backend\check-avatar-duplicates.js{row.id}: backend\check-avatar-duplicates.js{row.fotografia || 'SEM FOTO'}`);
    });
    console.log('');
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkDuplicates();
