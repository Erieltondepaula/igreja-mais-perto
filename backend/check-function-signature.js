require('dotenv').config();
const db = require('./config/postgresql.js');

async function checkFunction() {
  try {
    console.log('🔍 Verificando assinatura da função generate_member_id...');
    
    const result = await db.query(`
      SELECT 
        proname as nome_funcao,
        pg_catalog.pg_get_function_arguments(p.oid) as argumentos,
        pg_catalog.pg_get_function_result(p.oid) as retorno
      FROM pg_proc p
      WHERE p.proname = 'generate_member_id'
    `);
    
    if (result.length > 0) {
      console.log('📋 Função generate_member_id encontrada:');
      console.log('   Nome:', result[0].nome_funcao);
      console.log('   Argumentos:', result[0].argumentos);
      console.log('   Retorno:', result[0].retorno);
    } else {
      console.log('❌ Função generate_member_id não encontrada');
    }
    
    // Testar chamada direta com conversão de tipos
    console.log('\n🧪 Testando chamadas com diferentes tipos...');
    
    try {
      const test1 = await db.query("SELECT generate_member_id($1::text, $2::date) as id", ['TESTE USER', '1990-01-01']);
      console.log('✅ Com TEXT + DATE:', test1[0].id);
    } catch (e) {
      console.log('❌ Com TEXT + DATE:', e.message.split('.')[0]);
    }
    
    try {
      const test2 = await db.query("SELECT generate_member_id($1::varchar, $2::varchar) as id", ['TESTE USER', '1990-01-01']);
      console.log('✅ Com VARCHAR + VARCHAR:', test2[0].id);
    } catch (e) {
      console.log('❌ Com VARCHAR + VARCHAR:', e.message.split('.')[0]);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

checkFunction();