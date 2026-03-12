// Script para testar o upload de avatar com ID do membro
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testarUploadAvatar() {
  try {
    console.log('🧪 TESTE DE UPLOAD DE AVATAR');
    console.log('================================\n');
    
    // 1. Buscar um membro de teste
    console.log('1️⃣ Buscando membros...');
    const membrosRes = await fetch('http://localhost:5001/api/members');
    const membros = await membrosRes.json();
    
    if (membros.length === 0) {
      console.log('❌ Nenhum membro encontrado no banco de dados!');
      return;
    }
    
    const membroTeste = membros[0];
    console.log(`✅ Membro de teste: ${membroTeste.nome_completo || membroTeste.nome} (ID: ${membroTeste.id})\n`);
    
    // 2. Criar um arquivo de imagem de teste (pixel 1x1 PNG)
    console.log('2️⃣ Criando arquivo de teste...');
    const testImagePath = path.join(__dirname, 'test-avatar.png');
    
    // PNG de 1x1 pixel transparente (dados base64 decodificados)
    const pngData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    fs.writeFileSync(testImagePath, pngData);
    console.log(`✅ Arquivo de teste criado: ${testImagePath}\n`);
    
    // 3. Fazer upload do avatar
    console.log('3️⃣ Fazendo upload do avatar...');
    const form = new FormData();
    form.append('avatar', fs.createReadStream(testImagePath));
    form.append('memberId', membroTeste.id);
    
    const uploadRes = await fetch('http://localhost:5001/api/upload-avatar', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    const uploadData = await uploadRes.json();
    
    if (uploadRes.ok) {
      console.log('✅ Upload realizado com sucesso!');
      console.log('📄 Resposta:', JSON.stringify(uploadData, null, 2));
    } else {
      console.log('❌ Erro no upload:', uploadData);
      return;
    }
    
    // 4. Verificar se o arquivo foi salvo
    console.log('\n4️⃣ Verificando arquivo salvo...');
    const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
    const expectedFilename = `${membroTeste.id}.png`;
    const savedFilePath = path.join(avatarsDir, expectedFilename);
    
    if (fs.existsSync(savedFilePath)) {
      const stats = fs.statSync(savedFilePath);
      console.log(`✅ Arquivo encontrado: ${expectedFilename} (${stats.size} bytes)`);
    } else {
      console.log(`❌ Arquivo NÃO encontrado: ${expectedFilename}`);
    }
    
    // 5. Verificar se o banco de dados foi atualizado
    console.log('\n5️⃣ Verificando banco de dados...');
    const membroAtualizadoRes = await fetch(`http://localhost:5001/api/members/${membroTeste.id}`);
    const membroAtualizado = await membroAtualizadoRes.json();
    
    if (membroAtualizado.avatar_url) {
      console.log(`✅ Avatar URL no banco: ${membroAtualizado.avatar_url}`);
    } else {
      console.log('❌ Avatar URL NÃO foi atualizado no banco de dados!');
    }
    
    // 6. Testar se a URL do avatar está acessível
    console.log('\n6️⃣ Testando acesso à URL do avatar...');
    const avatarUrl = `http://localhost:5001${uploadData.avatar_url}`;
    const avatarRes = await fetch(avatarUrl);
    
    if (avatarRes.ok) {
      console.log(`✅ Avatar acessível em: ${avatarUrl}`);
      console.log(`   Status: ${avatarRes.status}`);
      console.log(`   Content-Type: ${avatarRes.headers.get('content-type')}`);
    } else {
      console.log(`❌ Erro ao acessar avatar: ${avatarRes.status}`);
    }
    
    // Limpar arquivo de teste
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Arquivo de teste removido.');
    
    console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error);
  }
}

testarUploadAvatar();
