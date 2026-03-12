const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarEstrutura() {
  try {
    console.log('🔍 Verificando estrutura da tabela membros...\n');
    
    // Ver informações da coluna id
    const result = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        column_default, 
        is_nullable,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name = 'id'
    `);
    
    console.log('📋 Coluna ID:');
    console.log(result.rows[0]);
    console.log('');
    
    // Ver todas as colunas
    const allColumns = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'membros'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Todas as colunas:');
    allColumns.rows.forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.column_name} (${col.data_type}) - Default: ${col.column_default || 'NENHUM'} - Nullable: ${col.is_nullable}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarEstrutura();
