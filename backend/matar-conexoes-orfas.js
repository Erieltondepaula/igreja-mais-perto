const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088',
});

async function matarConexoesOrfas() {
  try {
    console.log('🔍 Buscando conexões órfãs...');
    
    // Buscar conexões ativas exceto a atual
    const result = await pool.query(`
      SELECT pid, datname, usename, application_name, state, query_start
      FROM pg_stat_activity
      WHERE datname = 'dashboard_membros'
        AND pid != pg_backend_pid()
        AND state IN ('idle', 'idle in transaction')
      ORDER BY query_start;
    `);
    
    console.log(`\n📊 Encontradas ${result.rows.length} conexões:`);
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. PID: ${row.pid}, Estado: ${row.state}, App: ${row.application_name}`);
    });
    
    if (result.rows.length > 0) {
      console.log('\n🔨 Matando conexões órfãs...');
      for (const row of result.rows) {
        try {
          await pool.query(`SELECT pg_terminate_backend(${row.pid})`);
          console.log(`✅ Conexão ${row.pid} terminada`);
        } catch (error) {
          console.error(`❌ Erro ao matar ${row.pid}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Limpeza concluída!');
    await pool.end();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

matarConexoesOrfas();
