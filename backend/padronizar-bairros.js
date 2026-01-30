// Script para padronizar nomes de bairros
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

// Função para normalizar nome de bairro
function normalizarBairro(bairro) {
  if (!bairro) return null;
  
  // Remove espaços extras no início e fim
  let normalizado = bairro.trim();
  
  // Remove espaços duplos
  normalizado = normalizado.replace(/\s+/g, ' ');
  
  // Capitaliza corretamente (primeira letra de cada palavra maiúscula)
  normalizado = normalizado.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
  
  // Exceções para preposições (de, da, do, dos, das) - manter minúsculas
  normalizado = normalizado.replace(/\b(De|Da|Do|Dos|Das)\b/g, prep => prep.toLowerCase());
  
  return normalizado;
}

async function padronizarBairros() {
  console.log('\n🔧 PADRONIZANDO NOMES DE BAIRROS\n');
  console.log('═'.repeat(80));
  
  try {
    // 1. Buscar todos os bairros únicos
    const bairros = await pool.query(`
      SELECT DISTINCT bairro
      FROM membros
      WHERE bairro IS NOT NULL AND bairro != ''
      ORDER BY bairro
    `);

    console.log(`\n📊 Total de bairros únicos encontrados: ${bairros.rows.length}\n`);
    
    let totalAtualizados = 0;
    const alteracoes = [];

    // 2. Para cada bairro, verificar se precisa normalização
    for (const row of bairros.rows) {
      const original = row.bairro;
      const normalizado = normalizarBairro(original);
      
      if (original !== normalizado) {
        // Contar quantos registros serão afetados
        const count = await pool.query(
          'SELECT COUNT(*) as total FROM membros WHERE bairro = $1',
          [original]
        );
        
        const qtd = parseInt(count.rows[0].total);
        alteracoes.push({ original, normalizado, qtd });
      }
    }

    if (alteracoes.length === 0) {
      console.log('✅ Todos os bairros já estão padronizados!\n');
      return;
    }

    console.log(`⚠️  Encontradas ${alteracoes.length} variações para padronizar:\n`);
    
    alteracoes.forEach((alt, index) => {
      console.log(`${index + 1}. "${alt.original}" → "${alt.normalizado}" (${alt.qtd} pessoas)`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n🔄 Iniciando padronização...\n');

    // 3. Atualizar cada variação
    for (const alt of alteracoes) {
      const result = await pool.query(
        'UPDATE membros SET bairro = $1 WHERE bairro = $2',
        [alt.normalizado, alt.original]
      );
      
      totalAtualizados += result.rowCount;
      console.log(`✅ "${alt.original}" → "${alt.normalizado}" (${result.rowCount} registros)`);
    }

    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ PADRONIZAÇÃO CONCLUÍDA!`);
    console.log(`   Total de registros atualizados: ${totalAtualizados}`);
    console.log(`   Bairros unificados: ${alteracoes.length}\n`);

    // 4. Verificar resultado final
    console.log('📊 Verificando resultado final...\n');
    
    const bairrosFinais = await pool.query(`
      SELECT bairro, COUNT(*) as total
      FROM membros
      WHERE bairro IS NOT NULL AND bairro != ''
      GROUP BY bairro
      ORDER BY total DESC, bairro
      LIMIT 20
    `);

    console.log('📍 Top 20 bairros após padronização:\n');
    bairrosFinais.rows.forEach((row, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${row.bairro.padEnd(30)} - ${row.total} pessoas`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 DICA: Recarregue o sistema para ver os bairros unificados no mapa!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

padronizarBairros().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
