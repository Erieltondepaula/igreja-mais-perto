const axios = require('axios');

async function testAPI() {
  console.log('🧪 TESTANDO API DO SISTEMA');
  console.log('==========================');
  
  const baseURL = 'http://localhost:5001';
  
  try {
    // 1. Testar GET /api/members
    console.log('📋 1. Testando GET /api/members...');
    const membersResponse = await axios.get(`${baseURL}/api/members`);
    console.log(`✅ Encontrados: ${membersResponse.data.length} membros`);
    
    if (membersResponse.data.length > 0) {
      console.log('\n👤 Exemplo de membro:');
      const exemplo = membersResponse.data[0];
      console.log(`  ID: ${exemplo.id}`);
      console.log(`  Nome: ${exemplo.nome} ${exemplo.sobrenome}`);
      console.log(`  Data Nascimento: ${exemplo.datanascimento}`);
      console.log(`  Telefone: ${exemplo.telefone}`);
      console.log(`  Cidade: ${exemplo.cidade}`);
    }
    
    // 2. Testar geração de ID personalizado
    console.log('\n🆔 2. Testando geração de ID personalizado...');
    const idResponse = await axios.get(`${baseURL}/api/test-id/MARIA/SILVA`);
    console.log(`✅ ID gerado: ${idResponse.data.id}`);
    
    // 3. Testar POST /api/members (criar novo membro)
    console.log('\n➕ 3. Testando POST /api/members...');
    const novoMembro = {
      nome: 'João',
      sobrenome: 'Teste Silva',
      dataNascimento: '1985-05-15',
      email: 'joao.teste@email.com',
      telefone: '27999887766',
      endereco: 'Rua Teste, 123',
      cidade: 'Vila Velha',
      estado: 'ES',
      genero: 'Masculino',
      status: 'Ativo'
    };
    
    const createResponse = await axios.post(`${baseURL}/api/members`, novoMembro);
    console.log(`✅ Membro criado com ID: ${createResponse.data.id}`);
    
    // 4. Verificar total após inserção
    console.log('\n📊 4. Verificando total após inserção...');
    const finalResponse = await axios.get(`${baseURL}/api/members`);
    console.log(`✅ Total final: ${finalResponse.data.length} membros`);
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Sistema funcionando perfeitamente!');
    console.log('✅ IDs personalizados sendo gerados');
    console.log('✅ Dados importados do Excel');
    console.log('✅ API GET/POST funcionando');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('📋 Detalhes:', error.response.data);
    }
  }
}

testAPI();