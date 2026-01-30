// Script para testar a query getAllMembers diretamente
const db = require('./config/database');

async function testQuery() {
  try {
    console.log('🔌 Conectando ao Access...');
    await db.connect();
    
    console.log('🔍 Testando query simples...');
    const simpleQuery = 'SELECT TOP 5 ID, Nome FROM Membros';
    const simple = await db.query(simpleQuery);
    console.log('✅ Query simples funciona:', simple.length, 'registros');
    
    console.log('🔍 Testando query complexa...');
    const complexQuery = `
      SELECT TOP 5
        ID,
        Nome,
        NomeCompleto,
        DataNascimento,
        Sexo,
        Telefone,
        Cidade
      FROM Membros 
      ORDER BY Nome
      `;
    
    const complex = await db.query(complexQuery);
    console.log('✅ Query complexa funciona:', complex.length, 'registros');
    
    if (complex.length > 0) {
      console.log('📋 Primeiro registro:', complex[0]);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro na query:', error);
    process.exit(1);
  }
}

testQuery();