// Script para verificar estrutura da tabela church_settings
// Local: backend/check-church-settings.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: 'postgres',
  port: 5432,
});

async function checkChurchSettings() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando estrutura da tabela church_settings...');
    
    // Verificar colunas
    const columnsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'church_settings'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Colunas da tabela:');
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''})`);
    });
    
    // Verificar dados
    const dataResult = await client.query('SELECT * FROM church_settings');
    console.log(`\n📊 Registros encontrados: ${dataResult.rows.length}`);
    
    if (dataResult.rows.length > 0) {
      console.log('\n📝 Dados atuais:');
      console.log(dataResult.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkChurchSettings()
  .then(() => {
    console.log('\n✅ Verificação concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
