const db = require('./config/postgresql');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    // Buscar avatars em uso no banco
    const result = await db.query(
      "SELECT DISTINCT avatar_url FROM membros WHERE avatar_url IS NOT NULL AND avatar_url != ''"
    );
    
    console.log('Avatars em uso no banco de dados:');
    console.log('='.repeat(50));
    
    const avatarsEmUso = new Set();
    
    if (result.length === 0) {
      console.log('Nenhum avatar em uso no banco de dados');
    } else {
      result.forEach(r => {
        const filename = r.avatar_url.replace('/avatars/', '');
        avatarsEmUso.add(filename);
        console.log(r.avatar_url);
      });
    }
    
    console.log('='.repeat(50));
    console.log(`Total: ${result.length} avatars em uso no banco\n`);
    
    // Listar todos os arquivos na pasta avatars
    const avatarsDir = path.join(__dirname, '../public/avatars');
    const arquivos = fs.readdirSync(avatarsDir);
    
    console.log('Arquivos na pasta public/avatars:');
    console.log('='.repeat(50));
    
    const arquivosNaoUsados = [];
    
    arquivos.forEach(arquivo => {
      if (avatarsEmUso.has(arquivo)) {
        console.log(`✅ ${arquivo} - EM USO`);
      } else {
        console.log(`❌ ${arquivo} - NÃO USADO (pode remover)`);
        arquivosNaoUsados.push(arquivo);
      }
    });
    
    console.log('='.repeat(50));
    console.log(`\nResumo:`);
    console.log(`  Total de arquivos: ${arquivos.length}`);
    console.log(`  Em uso: ${avatarsEmUso.size}`);
    console.log(`  Não usados: ${arquivosNaoUsados.length}`);
    
    if (arquivosNaoUsados.length > 0) {
      console.log(`\n📋 Arquivos que podem ser removidos:`);
      arquivosNaoUsados.forEach(arquivo => {
        console.log(`  - ${arquivo}`);
      });
    }
    
    process.exit(0);
  } catch(e) {
    console.error('Erro:', e.message);
    process.exit(1);
  }
})();
