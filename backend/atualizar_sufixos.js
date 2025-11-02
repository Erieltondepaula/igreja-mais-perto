// SCRIPT PARA ATUALIZAR REGISTROS EXISTENTES COM SUFIXO
const { Client } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function atualizarRegistrosComSufixo() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // 1. Buscar todos os registros com código sem sufixo (formato antigo)
    const registrosAntigos = await client.query(`
      SELECT id, nome_completo, codigo_referencia
      FROM membros 
      WHERE codigo_referencia NOT LIKE '%-%'
      ORDER BY id
    `);
    
    console.log(`📋 Encontrados ${registrosAntigos.rows.length} registros para atualizar`);
    
    let atualizados = 0;
    
    // 2. Atualizar cada registro com novo código com sufixo
    for (const registro of registrosAntigos.rows) {
      try {
        // Gerar novo código com sufixo
        const novoCodigo = await client.query(
          'SELECT gerar_codigo_referencia($1) AS codigo',
          [registro.nome_completo]
        );
        
        const codigoComSufixo = novoCodigo.rows[0].codigo;
        
        // Atualizar registro
        await client.query(
          'UPDATE membros SET codigo_referencia = $1 WHERE id = $2',
          [codigoComSufixo, registro.id]
        );
        
        console.log(`✅ ${registro.id}: ${registro.codigo_referencia} → ${codigoComSufixo}`);
        atualizados++;
        
      } catch (error) {
        console.error(`❌ Erro ao atualizar ${registro.id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Atualizados ${atualizados} de ${registrosAntigos.rows.length} registros`);
    
    // 3. Verificar resultado
    console.log('\n📋 Amostra de registros atualizados:');
    const amostra = await client.query(`
      SELECT id, nome_completo, codigo_referencia
      FROM membros 
      WHERE codigo_referencia LIKE '%-%'
      ORDER BY id
      LIMIT 10
    `);
    
    amostra.rows.forEach(registro => {
      console.log(`   ${registro.id}: ${registro.nome_completo} → ${registro.codigo_referencia}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
atualizarRegistrosComSufixo();