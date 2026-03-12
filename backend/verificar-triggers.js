const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarTriggers() {
  try {
    console.log('🔍 Verificando triggers na tabela membros...\n');
    
    const result = await pool.query(`
      SELECT 
        trigger_name,
        event_manipulation,
        action_timing,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'membros'
      ORDER BY trigger_name
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ NENHUM TRIGGER ENCONTRADO na tabela membros!');
      console.log('   Isso explica porque o ID não está sendo gerado automaticamente.\n');
    } else {
      console.log(`📋 Triggers encontrados: ${result.rows.length}\n`);
      result.rows.forEach((trigger, idx) => {
        console.log(`${idx + 1}. ${trigger.trigger_name}`);
        console.log(`   Evento: ${trigger.event_manipulation}`);
        console.log(`   Timing: ${trigger.action_timing}`);
        console.log(`   Ação: ${trigger.action_statement}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarTriggers();
