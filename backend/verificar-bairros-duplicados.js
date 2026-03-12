// Verificar bairros Santo André
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarBairros() {
  try {
    console.log('\n📍 VERIFICANDO BAIRROS "SANTO ANDRÉ"\n');
    console.log('═'.repeat(80));
    
    const result = await pool.query(`
      SELECT 
        bairro, 
        cidade, 
        estado, 
        COUNT(*) as total,
        string_agg(DISTINCT nome_completo, ', ') as pessoas
      FROM membros 
      WHERE UPPER(bairro) LIKE '%SANTO ANDR%'
      GROUP BY bairro, cidade, estado
      ORDER BY bairro, cidade
    `);

    if (result.rows.length === 0) {
      console.log('❌ Nenhum registro encontrado com bairro contendo "Santo André"');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`\n📍 Variação ${index + 1}:`);
        console.log(`   Bairro: "${row.bairro}"`);
        console.log(`   Cidade: "${row.cidade || '(vazio)'}"`);
        console.log(`   Estado: "${row.estado || '(vazio)'}"`);
        console.log(`   Total:  ${row.total} pessoa(s)`);
        console.log(`   Pessoas: ${row.pessoas}`);
      });

      console.log('\n' + '═'.repeat(80));
      console.log(`\n✅ Total de variações diferentes: ${result.rows.length}`);
      
      if (result.rows.length > 1) {
        console.log('\n⚠️  ATENÇÃO: Existem múltiplas variações do mesmo bairro!');
        console.log('💡 Recomendação: Padronizar para uma única forma.\n');
      }
    }

    // Verificar todos os bairros com duplicação
    console.log('\n\n🔍 VERIFICANDO TODOS OS BAIRROS DUPLICADOS\n');
    console.log('═'.repeat(80));
    
    const duplicados = await pool.query(`
      SELECT 
        UPPER(TRIM(bairro)) as bairro_normalizado,
        COUNT(DISTINCT bairro) as variacoes,
        array_agg(DISTINCT bairro ORDER BY bairro) as formas_diferentes,
        SUM(qtd) as total_pessoas
      FROM (
        SELECT bairro, COUNT(*) as qtd
        FROM membros
        WHERE bairro IS NOT NULL AND bairro != ''
        GROUP BY bairro
      ) sub
      GROUP BY UPPER(TRIM(bairro))
      HAVING COUNT(DISTINCT bairro) > 1
      ORDER BY total_pessoas DESC
    `);

    if (duplicados.rows.length === 0) {
      console.log('✅ Nenhum bairro com duplicação encontrado!');
    } else {
      console.log(`\n⚠️  Encontrados ${duplicados.rows.length} bairros com múltiplas formas:\n`);
      duplicados.rows.forEach((row, index) => {
        console.log(`${index + 1}. "${row.bairro_normalizado}"`);
        console.log(`   Variações: ${row.variacoes} formas diferentes`);
        console.log(`   Formas: ${row.formas_diferentes.join(' | ')}`);
        console.log(`   Total: ${row.total_pessoas} pessoas\n`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarBairros();
