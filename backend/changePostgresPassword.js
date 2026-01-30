const { Client } = require('pg');

async function changePostgresPassword() {
  console.log('🔧 Alterando senha do PostgreSQL...');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Solicitar a senha atual
  const currentPassword = await new Promise((resolve) => {
    rl.question('Digite a senha atual do postgres (252088): ', (answer) => {
      resolve(answer || '252088');
    });
  });
  
  // Solicitar a nova senha
  const newPassword = await new Promise((resolve) => {
    rl.question('Digite a NOVA senha que você quer usar: ', (answer) => {
      resolve(answer);
    });
  });
  
  rl.close();
  
  if (!newPassword) {
    console.log('❌ Nova senha é obrigatória');
    return;
  }
  
  try {
    // Conectar com a senha atual
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      password: currentPassword,
      port: 5432,
    });
    
    await client.connect();
    console.log('✅ Conectado com a senha atual');
    
    // Alterar a senha do postgres
    await client.query(`ALTER USER postgres PASSWORD '${newPassword}';`);
    console.log('✅ Senha do postgres alterada com sucesso!');
    
    // Alterar senha do membros_user também
    await client.query(`ALTER USER membros_user PASSWORD '${newPassword}';`);
    console.log('✅ Senha do membros_user também alterada!');
    
    await client.end();
    
    console.log('\n🎉 SENHAS ALTERADAS COM SUCESSO!');
    console.log(`🔑 Nova senha: ${newPassword}`);
    console.log('\n⚠️  IMPORTANTE: Agora você precisa atualizar os arquivos de configuração:');
    console.log('1. backend/config/postgresql.js');
    console.log('2. backend/config/database.js');
    console.log(`3. Altere '252088' para '${newPassword}' nesses arquivos`);
    
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error.message);
    
    if (error.code === '28P01') {
      console.log('\n💡 Dica: A senha atual pode estar incorreta.');
      console.log('Tente executar este comando no terminal:');
      console.log('psql -U postgres -h localhost');
      console.log('E teste diferentes senhas.');
    }
  }
}

changePostgresPassword();