const { Client } = require('pg');

async function testDatabaseStatus() {
  console.log('🔍 Verificando status do banco de dados PostgreSQL...');
  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dashboard_membros',
    password: '252088',
    port: 5432,
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // 1. Verificar se a tabela existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'membros'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Tabela membros existe');
      
      // 2. Contar registros
      const countResult = await client.query('SELECT COUNT(*) FROM membros;');
      console.log(`📊 Registros na tabela: ${countResult.rows[0].count}`);
      
      // 3. Testar função de ID
      try {
        const idTest = await client.query(`SELECT generate_member_id('João', 'Silva') AS id_teste;`);
        console.log(`🆔 Função ID teste: ${idTest.rows[0].id_teste}`);
      } catch (funcErr) {
        console.log('❌ Função generate_member_id não encontrada:', funcErr.message);
      }
      
      // 4. Ver estrutura da tabela
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'membros' 
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Estrutura da tabela:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
      
    } else {
      console.log('❌ Tabela membros NÃO existe');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

testDatabaseStatus();