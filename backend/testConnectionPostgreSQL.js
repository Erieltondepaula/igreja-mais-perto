// 🐘 TESTE DE CONEXÃO POSTGRESQL COM DIFERENTES SENHAS
// Script para descobrir a senha correta do PostgreSQL

const { Client } = require('pg');

async function testPostgreSQLConnection() {
    console.log('🔍 Testando conexões PostgreSQL...');
    
    // Senhas comuns para testar
    const commonPasswords = [
        'postgres',
        'root', 
        'admin',
        '123456',
        'password',
        '1234',
        '', // Sem senha
    ];
    
    for (const password of commonPasswords) {
        console.log(`🧪 Testando senha: "${password || '(vazio)'}"`);
        
        const config = {
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: password,
            database: 'postgres'
        };
        
        try {
            const client = new Client(config);
            await client.connect();
            
            // Testar query simples
            const result = await client.query('SELECT version() as version');
            await client.end();
            
            console.log('✅ CONEXÃO BEM-SUCEDIDA!');
            console.log(`🎯 Senha correta: "${password || '(vazio)'}"`);
            console.log(`📊 PostgreSQL: ${result.rows[0].version}`);
            console.log('');
            console.log('🔧 Para configurar, atualize o arquivo:');
            console.log('   backend/scripts/setupPostgreSQL.js');
            console.log(`   password: '${password}',`);
            
            return password;
            
        } catch (error) {
            console.log(`   ❌ Falha: ${error.message.split('\n')[0]}`);
        }
    }
    
    console.log('');
    console.log('🚫 Nenhuma senha comum funcionou.');
    console.log('');
    console.log('💡 Opções:');
    console.log('   1. Resetar senha do PostgreSQL:');
    console.log('      - Abra pgAdmin');
    console.log('      - Ou use: ALTER USER postgres PASSWORD \'nova_senha\';');
    console.log('');
    console.log('   2. Usar autenticação trust temporariamente:');
    console.log('      - Edite: C:\\Program Files\\PostgreSQL\\18\\data\\pg_hba.conf');
    console.log('      - Mude "md5" para "trust" na linha do localhost');
    console.log('      - Reinicie serviço PostgreSQL');
    
    return null;
}

// Executar teste
if (require.main === module) {
    testPostgreSQLConnection()
        .catch(error => {
            console.error('💥 Erro fatal:', error);
            process.exit(1);
        });
}

module.exports = { testPostgreSQLConnection };