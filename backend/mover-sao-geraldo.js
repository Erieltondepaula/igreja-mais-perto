// Mover membros de "São Geraldo" para "São Geraldo 1"
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function moverParaSaoGeraldo1() {
  console.log('\n🔄 MOVENDO MEMBROS DE "SÃO GERALDO" PARA "SÃO GERALDO 1"\n');
  console.log('═'.repeat(80));
  
  try {
    // Verificar quantos existem em "São Geraldo"
    const antes = await pool.query(
      "SELECT COUNT(*) as total FROM membros WHERE bairro = 'São Geraldo'"
    );
    
    console.log(`📊 Membros em "São Geraldo": ${antes.rows[0].total}`);
    
    if (antes.rows[0].total === '0') {
      console.log('\n✅ Nenhum membro para mover!\n');
      return;
    }

    // Atualizar para "São Geraldo 1"
    const result = await pool.query(
      "UPDATE membros SET bairro = 'São Geraldo 1' WHERE bairro = 'São Geraldo'"
    );
    
    console.log(`✅ Movidos ${result.rowCount} membros para "São Geraldo 1"\n`);
    console.log('═'.repeat(80));
    
    // Verificar resultado final
    console.log('\n📊 Bairros "São Geraldo" após atualização:\n');
    const verificacao = await pool.query(`
      SELECT bairro, COUNT(*) as total
      FROM membros
      WHERE bairro LIKE 'São Geraldo%'
      GROUP BY bairro
      ORDER BY bairro
    `);

    verificacao.rows.forEach((row, index) => {
      console.log(`${(index + 1)}. ${row.bairro.padEnd(20)} - ${row.total} pessoas`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ ATUALIZAÇÃO CONCLUÍDA!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

moverParaSaoGeraldo1().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
