// Verificar situação dos membros em São Geraldo 1
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarSituacao() {
  console.log('\n📊 VERIFICANDO SITUAÇÃO - SÃO GERALDO 1\n');
  console.log('═'.repeat(80));
  
  try {
    // Total geral
    const total = await pool.query(
      "SELECT COUNT(*) as total FROM membros WHERE bairro = 'São Geraldo 1'"
    );
    
    // Por situação
    const porSituacao = await pool.query(`
      SELECT situacao, COUNT(*) as total
      FROM membros
      WHERE bairro = 'São Geraldo 1'
      GROUP BY situacao
      ORDER BY situacao
    `);

    console.log(`Total de membros em São Geraldo 1: ${total.rows[0].total}\n`);
    console.log('Distribuição por situação:\n');
    
    porSituacao.rows.forEach(row => {
      const situacaoLabel = row.situacao === 'ativo' ? '✅ Ativos' : 
                           row.situacao === 'desligado' ? '❌ Desligados' : 
                           `❓ ${row.situacao || 'Sem situação'}`;
      console.log(`  ${situacaoLabel}: ${row.total}`);
    });

    console.log('\n' + '═'.repeat(80));

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

verificarSituacao().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
