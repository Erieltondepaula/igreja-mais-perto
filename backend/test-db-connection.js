const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function testConnection() {
  try {
    const res = await pool.query(`
      SELECT 
        current_database() as database_name,
        (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables
    `);
    
    console.log('✅ Conectado ao banco:', res.rows[0].database_name);
    console.log('📊 Total de tabelas:', res.rows[0].total_tables);
    
    // Listar tabelas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log('\n📋 Tabelas encontradas:');
      tables.rows.forEach(t => console.log('   -', t.table_name));
    } else {
      console.log('\n⚠️ Nenhuma tabela encontrada. Banco precisa ser inicializado.');
    }
    
  } catch (err) {
    if (err.code === '3D000') {
      console.log('❌ Banco "dashboard_membros" não existe!');
      console.log('\n💡 Para criar o banco, execute:');
      console.log('   node setupPostgreSQL.js');
    } else {
      console.log('❌ Erro:', err.message);
    }
  } finally {
    await pool.end();
  }
}

testConnection();
