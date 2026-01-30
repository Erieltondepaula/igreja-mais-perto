require('dotenv').config();
const db = require('./config/postgresql.js');

async function checkMembersByName() {
  try {
    const nomes = [
      'Raniely Pimentel Santa Clara Inácio',
      'Elisa pimentel inacio'
    ];
    for (const nome of nomes) {
      console.log(`🔍 Verificando membro: ${nome}`);
      const result = await db.query('SELECT id, nome_completo, avatar_url FROM membros WHERE LOWER(nome_completo) LIKE LOWER($1)', [`%${nome}%`]);
      if (result.length > 0) {
        console.log('📋 Membro encontrado:');
        result.forEach((m, i) => {
          console.log(`  ${i+1}. ID: ${m.id}`);
          console.log(`     Nome: ${m.nome_completo}`);
          console.log(`     Avatar: ${m.avatar_url || 'NENHUM'}`);
        });
      } else {
        console.log('❌ Membro não encontrado no banco.');
      }
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  process.exit(0);
}

checkMembersByName();
