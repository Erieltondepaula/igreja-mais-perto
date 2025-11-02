// SCRIPT PARA EXECUTAR DDL E TESTAR SUFIXOS AUTOMÁTICOS
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function executarDDL() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Ler arquivo DDL
    const ddlPath = path.join(__dirname, 'sql', 'usuarios_ddl.sql');
    const ddlScript = fs.readFileSync(ddlPath, 'utf8');
    
    // Executar DDL
    await client.query(ddlScript);
    console.log('✅ DDL executado com sucesso!');
    
    // Testar função de geração de código
    console.log('\n🧪 Testando geração de códigos com sufixo...');
    
    const nomes = ['JOÃO SILVA', 'MARIA SANTOS', 'PEDRO OLIVEIRA'];
    
    for (const nome of nomes) {
      const resultado = await client.query(
        'SELECT gerar_codigo_referencia($1) AS codigo',
        [nome]
      );
      
      const codigo = resultado.rows[0].codigo;
      console.log(`📝 ${nome}: ${codigo}`);
    }
    
    // Verificar se trigger está ativo
    console.log('\n🔍 Verificando triggers ativos...');
    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public' AND event_object_table = 'membros'
    `);
    
    console.log('📋 Triggers encontrados:');
    triggers.rows.forEach(trigger => {
      console.log(`   - ${trigger.trigger_name}: ${trigger.event_manipulation}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
executarDDL();