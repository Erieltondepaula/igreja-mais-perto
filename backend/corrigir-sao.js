// Corrigir capitalização incorreta de "São"
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function corrigirSao() {
  console.log('\n🔧 CORRIGINDO CAPITALIZAÇÃO DE "SÃO"\n');
  console.log('═'.repeat(80));
  
  try {
    // Buscar todos os bairros com "SãO"
    const result = await pool.query(`
      SELECT DISTINCT bairro, COUNT(*) as total
      FROM membros
      WHERE bairro LIKE '%SãO%'
      GROUP BY bairro
      ORDER BY bairro
    `);

    if (result.rows.length === 0) {
      console.log('✅ Nenhum bairro com capitalização incorreta encontrado!\n');
      return;
    }

    console.log(`⚠️  Encontrados ${result.rows.length} bairros com "SãO" para corrigir:\n`);
    
    let totalAtualizados = 0;

    for (const row of result.rows) {
      const original = row.bairro;
      const corrigido = original.replace(/SãO/g, 'São');
      
      if (original !== corrigido) {
        const updateResult = await pool.query(
          'UPDATE membros SET bairro = $1 WHERE bairro = $2',
          [corrigido, original]
        );
        
        totalAtualizados += updateResult.rowCount;
        console.log(`✅ "${original}" → "${corrigido}" (${updateResult.rowCount} registros)`);
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ CORREÇÃO CONCLUÍDA!`);
    console.log(`   Total de registros atualizados: ${totalAtualizados}\n`);

    // Verificar resultado
    console.log('📊 Bairros com "São" após correção:\n');
    const verificacao = await pool.query(`
      SELECT bairro, COUNT(*) as total
      FROM membros
      WHERE bairro LIKE '%São%'
      GROUP BY bairro
      ORDER BY total DESC, bairro
    `);

    verificacao.rows.forEach((row, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${row.bairro.padEnd(30)} - ${row.total} pessoas`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 Recarregue o sistema para ver as correções!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

corrigirSao().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
