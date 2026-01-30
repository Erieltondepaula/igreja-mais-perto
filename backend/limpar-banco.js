const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function limparBanco() {
  try {
    console.log('🗑️  Limpando banco de dados...\n');
    
    // Contar registros antes
    const before = await pool.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Registros antes: ${before.rows[0].total}`);
    
    // Limpar tabela
    await pool.query('DELETE FROM membros');
    console.log('✅ Tabela "membros" limpa com sucesso!');
    
    // Contar registros depois
    const after = await pool.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Registros depois: ${after.rows[0].total}`);
    
    console.log('\n🎉 Banco de dados limpo e pronto para importação!\n');
    
  } catch (err) {
    console.error('❌ Erro ao limpar banco:', err.message);
  } finally {
    await pool.end();
  }
}

limparBanco();
