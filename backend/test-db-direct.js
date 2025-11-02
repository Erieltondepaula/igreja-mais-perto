// Script para testar conexão direta com Access
const db = require('./config/database');

async function testDatabase() {
  try {
    console.log('🔌 Conectando ao Access...');
    await db.connect();
    
    console.log('📊 Verificando tabela Membros...');
    const count = await db.query('SELECT COUNT(*) as total FROM Membros');
    console.log(`📋 Total de membros na tabela: ${count[0].total}`);
    
    if (count[0].total > 0) {
      console.log('📋 Primeiros 3 membros:');
      const members = await db.query('SELECT TOP 3 ID, Nome FROM Membros');
      members.forEach(member => {
        console.log(`  ${member.ID} - ${member.Nome}`);
      });
    }
    
    console.log('✅ Teste concluído');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }
}

testDatabase();