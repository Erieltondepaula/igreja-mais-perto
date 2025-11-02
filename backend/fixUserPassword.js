const { Client } = require('pg');

async function fixUserPassword() {
  console.log('🔧 Corrigindo senha do usuário membros_user...');
  
  // Conectar como postgres (admin)
  const adminClient = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '252088',
    port: 5432,
  });
  
  try {
    await adminClient.connect();
    console.log('✅ Conectado como postgres');
    
    // Alterar senha do usuário membros_user
    console.log('🔑 Alterando senha do usuário membros_user...');
    await adminClient.query(`ALTER USER membros_user PASSWORD '252088';`);
    console.log('✅ Senha do membros_user alterada para 252088');
    
    // Conceder todos os privilégios novamente
    await adminClient.query(`GRANT ALL PRIVILEGES ON DATABASE dashboard_membros TO membros_user;`);
    console.log('✅ Privilégios concedidos');
    
    // Conectar ao banco específico para conceder privilégios na tabela
    await adminClient.end();
    
    const dbClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'dashboard_membros',
      password: '252088',
      port: 5432,
    });
    
    await dbClient.connect();
    await dbClient.query(`GRANT ALL PRIVILEGES ON TABLE membros TO membros_user;`);
    await dbClient.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO membros_user;`);
    await dbClient.end();
    
    console.log('✅ Privilégios na tabela concedidos');
    
    // Testar conexão com o usuário corrigido
    console.log('🧪 Testando conexão com membros_user...');
    const testClient = new Client({
      user: 'membros_user',
      host: 'localhost',
      database: 'dashboard_membros',
      password: '252088',
      port: 5432,
    });
    
    await testClient.connect();
    const result = await testClient.query('SELECT NOW() as test_time');
    console.log('✅ Teste de conexão bem-sucedido:', result.rows[0].test_time);
    await testClient.end();
    
    console.log('\n🎉 USUÁRIO CORRIGIDO COM SUCESSO!');
    console.log('👤 Usuário: membros_user');
    console.log('🔑 Senha: 252088');
    console.log('📊 Database: dashboard_membros');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    try {
      await adminClient.end();
    } catch (e) {}
  }
}

fixUserPassword();