const { Client } = require('pg');
const fs = require('fs');

async function setupCompleteDatabase() {
  console.log('🔧 Configurando banco dashboard_membros completo...');
  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dashboard_membros',
    password: '252088',
    port: 5432,
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao dashboard_membros');
    
    // Ler e executar o script SQL
    const sqlScript = fs.readFileSync('setup_completo_dashboard_membros.sql', 'utf8');
    
    // Dividir por comandos SQL (por ponto e vírgula)
    const commands = sqlScript.split(';').filter(cmd => cmd.trim().length > 0);
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command.length > 0) {
        try {
          console.log(`⚡ Executando comando ${i + 1}/${commands.length}`);
          await client.query(command);
        } catch (err) {
          if (err.message.includes('already exists') || err.message.includes('já existe')) {
            console.log(`ℹ️ Ignorando: ${err.message.split('\n')[0]}`);
          } else {
            console.log(`⚠️ Erro no comando ${i + 1}: ${err.message}`);
          }
        }
      }
    }
    
    // Verificar se tudo foi criado
    console.log('\n🔍 Verificando estrutura...');
    
    // Verificar tabela
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'membros'
    `);
    console.log('✅ Tabela membros:', tableCheck.rows.length > 0 ? 'EXISTE' : 'NÃO EXISTE');
    
    // Verificar função
    const functionCheck = await client.query(`
      SELECT routine_name FROM information_schema.routines 
      WHERE routine_schema = 'public' AND routine_name = 'generate_member_id'
    `);
    console.log('✅ Função generate_member_id:', functionCheck.rows.length > 0 ? 'EXISTE' : 'NÃO EXISTE');
    
    // Testar função
    if (functionCheck.rows.length > 0) {
      const testId = await client.query(`SELECT generate_member_id('Teste', 'Usuario') as id_teste`);
      console.log('🧪 Teste da função:', testId.rows[0].id_teste);
    }
    
    // Contar membros
    const memberCount = await client.query(`SELECT COUNT(*) as total FROM membros`);
    console.log('👥 Total de membros na tabela:', memberCount.rows[0].total);
    
    // Mostrar alguns membros
    const sampleMembers = await client.query(`
      SELECT id, nome, sobrenome, created_at 
      FROM membros 
      ORDER BY created_at 
      LIMIT 5
    `);
    
    console.log('\n📋 Membros na tabela:');
    sampleMembers.rows.forEach((member, index) => {
      console.log(`${index + 1}. ID: ${member.id} - Nome: ${member.nome} ${member.sobrenome}`);
    });
    
    console.log('\n🎉 CONFIGURAÇÃO COMPLETA FINALIZADA!');
    console.log('💡 Agora você pode conectar o pgAdmin ao banco dashboard_membros');
    
  } catch (error) {
    console.error('❌ Erro durante configuração:', error.message);
  } finally {
    await client.end();
  }
}

setupCompleteDatabase();