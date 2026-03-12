const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088',
});

async function testarConexao() {
  try {
    console.log('🔍 Testando conexão ao PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Conectado!');
    
    console.log('\n🔍 Executando query de versão...');
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('✅ Query executada!');
    console.log('Resultado:', result.rows);
    
    client.release();
    console.log('\n✅ Cliente liberado!');
    
    await pool.end();
    console.log('✅ Pool encerrado!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  }
}

testarConexao();
