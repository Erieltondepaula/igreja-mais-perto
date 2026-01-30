require('dotenv').config();
const db = require('./config/postgresql.js');

async function investigateAvatarProblem() {
  try {
    console.log('🔍 Investigando problema do avatar temp...\n');
    
    // Buscar membros com avatar temp
    const tempAvatars = await db.query("SELECT id, nome_completo, avatar_url FROM membros WHERE avatar_url LIKE '%temp%'");
    console.log(`📋 Membros com avatar temp: ${tempAvatars.length}`);
    tempAvatars.forEach(m => {
      console.log(`  - ${m.nome_completo} (${m.id}): ${m.avatar_url}`);
    });
    
    // Buscar membros com nome Luiz Fernando
    const luizFernando = await db.query("SELECT id, nome_completo, avatar_url FROM membros WHERE nome_completo ILIKE '%luiz%fernando%'");
    console.log(`\n📋 Membros com nome Luiz Fernando: ${luizFernando.length}`);
    luizFernando.forEach(m => {
      console.log(`  - ${m.nome_completo} (${m.id}): ${m.avatar_url || 'NENHUM'}`);
    });
    
    // Verificar se arquivo temp existe fisicamente
    const fs = require('fs');
    const path = require('path');
    
    const tempPath = path.join(__dirname, '..', 'public', 'avatars', 'temp-1762253289629.jpeg');
    const tempExists = fs.existsSync(tempPath);
    console.log(`\n📁 Arquivo temp-1762253289629.jpeg existe: ${tempExists ? '✅ SIM' : '❌ NÃO'}`);
    
    if (tempExists) {
      const stats = fs.statSync(tempPath);
      console.log(`   Tamanho: ${(stats.size / 1024).toFixed(1)} KB`);
      console.log(`   Criado: ${stats.birthtime.toLocaleString()}`);
    }
    
    // Listar todos os membros com ID começando com LL
    const llMembers = await db.query("SELECT id, nome_completo, avatar_url FROM membros WHERE id LIKE 'LL%' ORDER BY id");
    console.log(`\n📋 Membros com ID começando com LL: ${llMembers.length}`);
    llMembers.forEach(m => {
      console.log(`  - ${m.nome_completo} (${m.id}): ${m.avatar_url || 'NENHUM'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

investigateAvatarProblem();