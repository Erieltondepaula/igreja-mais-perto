require('dotenv').config();
const db = require('./config/postgresql.js');

async function checkTriggers() {
  try {
    console.log('🔍 Verificando triggers e funções...');
    
    // Verificar se a função existe
    const func = await db.query("SELECT proname FROM pg_proc WHERE proname = 'generate_member_id'");
    console.log('📋 Função generate_member_id:', func.length > 0 ? '✅ EXISTE' : '❌ NÃO EXISTE');
    
    // Verificar se o trigger existe
    const trigger = await db.query("SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'membros_id_trigger'");
    console.log('📋 Trigger membros_id_trigger:', trigger.length > 0 ? '✅ EXISTE' : '❌ NÃO EXISTE');
    
    // Verificar se tem default na coluna
    const column = await db.query("SELECT column_default FROM information_schema.columns WHERE table_name = 'membros' AND column_name = 'id'");
    console.log('📋 Default da coluna id:', column[0]?.column_default || 'NENHUM');
    
    // Listar todos os triggers da tabela membros
    const allTriggers = await db.query("SELECT trigger_name, event_manipulation FROM information_schema.triggers WHERE event_object_table = 'membros'");
    console.log('📋 Todos os triggers na tabela membros:');
    allTriggers.forEach(t => console.log(`  - ${t.trigger_name} (${t.event_manipulation})`));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

checkTriggers();