// SCRIPT PARA ATUALIZAR TODOS OS REGISTROS COM NOVO PK
const { Client } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function atualizarTodosRegistros() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Buscar TODOS os registros que ainda não têm o formato novo
    const registros = await client.query(`
      SELECT id, nome_completo 
      FROM membros 
      WHERE id NOT LIKE '%-%'
      ORDER BY created_at
    `);
    
    console.log(`📊 Encontrados ${registros.rows.length} registros para atualizar`);
    
    let atualizados = 0;
    
    // Atualizar todos os registros
    for (const registro of registros.rows) {
      try {
        // Gerar novo ID compacto
        const novoIdResult = await client.query(
          'SELECT gerar_id_compacto($1) as novo_id',
          [registro.nome_completo]
        );
        
        const novoId = novoIdResult.rows[0].novo_id;
        
        // Atualizar ID
        await client.query(
          'UPDATE membros SET id = $1 WHERE id = $2',
          [novoId, registro.id]
        );
        
        console.log(`✅ ${registro.id} → ${novoId}`);
        atualizados++;
        
      } catch (error) {
        console.error(`❌ Erro ao atualizar ${registro.id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Atualizados ${atualizados} de ${registros.rows.length} registros`);
    
    // Verificar resultado final
    const totalComSufixo = await client.query(`
      SELECT COUNT(*) as total
      FROM membros 
      WHERE id LIKE '%-%'
    `);
    
    const totalSemSufixo = await client.query(`
      SELECT COUNT(*) as total
      FROM membros 
      WHERE id NOT LIKE '%-%'
    `);
    
    console.log(`\n📊 Estatísticas finais:`);
    console.log(`   ✅ Com sufixo: ${totalComSufixo.rows[0].total}`);
    console.log(`   ❌ Sem sufixo: ${totalSemSufixo.rows[0].total}`);
    
    // Mostrar amostra final
    const amostra = await client.query(`
      SELECT id, nome_completo 
      FROM membros 
      ORDER BY id 
      LIMIT 10
    `);
    
    console.log('\n📋 Amostra final de IDs:');
    amostra.rows.forEach(reg => {
      console.log(`   ${reg.id}: ${reg.nome_completo}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
atualizarTodosRegistros();