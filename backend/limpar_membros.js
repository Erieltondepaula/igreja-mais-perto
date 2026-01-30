// SCRIPT PARA LIMPAR TODOS OS REGISTROS DA TABELA MEMBROS
const { Client } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function limparTabelaMembros() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    await client.query('DELETE FROM membros');
    console.log('🗑️ Todos os registros da tabela membros foram removidos!');
    // Verificar se está vazio
    const total = await client.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Total de registros após limpeza: ${total.rows[0].total}`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
limparTabelaMembros();