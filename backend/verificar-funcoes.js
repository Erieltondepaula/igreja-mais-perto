const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarFuncoes() {
  try {
    console.log('🔍 Procurando funções que geram ID...\n');
    
    const result = await pool.query(`
      SELECT 
        routine_name,
        routine_type,
        routine_definition
      FROM information_schema.routines 
      WHERE routine_schema = 'public'
      AND routine_name LIKE '%member%'
      OR routine_name LIKE '%id%'
      ORDER BY routine_name
    `);
    
    console.log(`📋 Funções encontradas: ${result.rows.length}\n`);
    result.rows.forEach((func, idx) => {
      console.log(`${idx + 1}. ${func.routine_name} (${func.routine_type})`);
      console.log(`   Definição: ${func.routine_definition ? func.routine_definition.substring(0, 200) + '...' : 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarFuncoes();
