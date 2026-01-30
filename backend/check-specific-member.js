require('dotenv').config();
const db = require('./config/postgresql.js');

async function checkSpecificMember() {
  try {
    console.log('🔍 Verificando membro com ID LL20251104074314-JE0T...');
    
    const result = await db.query('SELECT id, nome_completo, avatar_url FROM membros WHERE id = $1', ['LL20251104074314-JE0T']);
    
    if (result.length > 0) {
      console.log('📋 Membro encontrado:');
      console.log('  ID:', result[0].id);
      console.log('  Nome:', result[0].nome_completo);
      console.log('  Avatar URL:', result[0].avatar_url);
      
      // Verificar se o arquivo existe
      const fs = require('fs');
      const path = require('path');
      
      if (result[0].avatar_url) {
        const avatarPath = path.join(__dirname, '..', 'public', result[0].avatar_url);
        const exists = fs.existsSync(avatarPath);
        console.log('  Arquivo existe:', exists ? '✅ SIM' : '❌ NÃO');
        console.log('  Caminho completo:', avatarPath);
      }
      
      // Verificar se existe arquivo temp
      const tempFile = path.join(__dirname, '..', 'public', 'avatars', 'temp-1762253289629.jpeg');
      const tempExists = fs.existsSync(tempFile);
      console.log('  Arquivo temp existe:', tempExists ? '✅ SIM' : '❌ NÃO');
      
    } else {
      console.log('❌ Membro não encontrado com esse ID');
      
      // Buscar por nome similar
      const similarResult = await db.query("SELECT id, nome_completo, avatar_url FROM membros WHERE nome_completo ILIKE '%luiz fernando%'");
      
      if (similarResult.length > 0) {
        console.log('\n🔍 Membros com nome similar encontrados:');
        similarResult.forEach((m, i) => {
          console.log(`  ${i+1}. ID: ${m.id}`);
          console.log(`     Nome: ${m.nome_completo}`);
          console.log(`     Avatar: ${m.avatar_url || 'NENHUM'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

checkSpecificMember();