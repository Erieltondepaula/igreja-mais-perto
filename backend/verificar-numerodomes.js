const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarNumeroDomes() {
  try {
    console.log('\n🔍 VERIFICANDO CAMPO numerodomes E SUA RELAÇÃO COM mes\n');
    console.log('═'.repeat(80));
    
    // Buscar registros agrupados por mes e numerodomes
    const result = await pool.query(`
      SELECT 
        mes,
        numerodomes,
        COUNT(*) as quantidade
      FROM membros
      WHERE mes IS NOT NULL AND numerodomes IS NOT NULL
      GROUP BY mes, numerodomes
      ORDER BY numerodomes, mes
    `);
    
    console.log('\n📊 RELAÇÃO ENTRE mes E numerodomes:\n');
    
    const mesesOrdenados = {};
    
    result.rows.forEach(row => {
      if (!mesesOrdenados[row.numerodomes]) {
        mesesOrdenados[row.numerodomes] = [];
      }
      mesesOrdenados[row.numerodomes].push({
        mes: row.mes,
        quantidade: row.quantidade
      });
    });
    
    // Exibir de forma organizada
    Object.keys(mesesOrdenados).sort((a, b) => parseInt(a) - parseInt(b)).forEach(num => {
      const meses = mesesOrdenados[num];
      console.log(`📅 numerodomes = ${num.toString().padStart(2, ' ')}`);
      meses.forEach(m => {
        console.log(`   → ${m.mes.padEnd(15)} (${m.quantidade} pessoas)`);
      });
      console.log('');
    });
    
    console.log('═'.repeat(80));
    
    // Verificar o mapeamento padrão
    console.log('\n💡 MAPEAMENTO IDENTIFICADO:\n');
    
    const mapeamento = {
      1: 'janeiro',
      2: 'fevereiro', 
      3: 'março',
      4: 'abril',
      5: 'maio',
      6: 'junho',
      7: 'julho',
      8: 'agosto',
      9: 'setembro',
      10: 'outubro',
      11: 'novembro',
      12: 'dezembro'
    };
    
    Object.keys(mesesOrdenados).forEach(num => {
      const mesEsperado = mapeamento[num];
      const mesReal = mesesOrdenados[num][0].mes;
      const match = mesEsperado === mesReal ? '✅' : '❌';
      console.log(`${match} ${num.toString().padStart(2, ' ')} → ${mesReal.padEnd(15)} (esperado: ${mesEsperado})`);
    });
    
    console.log('\n═'.repeat(80));
    console.log('\n📌 CONCLUSÃO:');
    console.log('   O campo "numerodomes" representa o NÚMERO DO MÊS (1-12)');
    console.log('   Ele é usado para ordenar os aniversariantes por mês numérico.\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarNumeroDomes();
