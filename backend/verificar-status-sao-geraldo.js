// Verificar status dos membros em São Geraldo 1
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarStatus() {
  console.log('\n📊 VERIFICANDO STATUS - SÃO GERALDO 1\n');
  console.log('═'.repeat(80));
  
  try {
    // Total geral
    const total = await pool.query(
      "SELECT COUNT(*) as total FROM membros WHERE bairro = 'São Geraldo 1'"
    );
    
    // Por status
    const porStatus = await pool.query(`
      SELECT status, COUNT(*) as total
      FROM membros
      WHERE bairro = 'São Geraldo 1'
      GROUP BY status
      ORDER BY status
    `);

    console.log(`Total de membros em São Geraldo 1: ${total.rows[0].total}\n`);
    console.log('Distribuição por status:\n');
    
    porStatus.rows.forEach(row => {
      const statusLabel = row.status === 'ativo' ? '✅ Ativos' : 
                         row.status === 'desligado' ? '❌ Desligados' : 
                         `❓ ${row.status}`;
      console.log(`  ${statusLabel}: ${row.total}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 O total de 19 inclui TODOS os membros (ativos + desligados)\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

verificarStatus().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
