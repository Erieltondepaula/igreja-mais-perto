// Script para testar a query da API church-settings
// Local: backend/test-church-settings-query.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: 'postgres',
  port: 5432,
});

async function testQuery() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testando query da API...');
    
    const result = await client.query('SELECT * FROM church_settings LIMIT 1');
    
    console.log('\n✅ Query executada com sucesso!');
    console.log('📊 Resultado:');
    console.log(JSON.stringify(result.rows[0], null, 2));
    
    if (result.rows.length === 0) {
      console.log('\n⚠️  Nenhum registro encontrado');
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao executar query:');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testQuery()
  .then(() => {
    console.log('\n✅ Teste concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
