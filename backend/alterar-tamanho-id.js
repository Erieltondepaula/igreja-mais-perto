const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function alterarTamanhoID() {
  try {
    console.log('🔧 Alterando tamanho do campo id de VARCHAR(20) para VARCHAR(30)...\n');
    
    await pool.query(`
      ALTER TABLE membros 
      ALTER COLUMN id TYPE VARCHAR(30);
    `);
    
    console.log('✅ Campo id alterado com sucesso para VARCHAR(30)!\n');
    
    // Verificar alteração
    const result = await pool.query(`
      SELECT character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'membros' AND column_name = 'id'
    `);
    
    console.log(`📏 Novo tamanho: VARCHAR(${result.rows[0].character_maximum_length})\n`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

alterarTamanhoID();
