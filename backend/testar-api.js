const fetch = require('node-fetch');

async function testarAPI() {
  try {
    console.log('\n🧪 TESTANDO API DO SISTEMA\n');
    console.log('═'.repeat(80));
    
    console.log('\n📡 Fazendo requisição: GET http://localhost:5001/api/members\n');
    
    const response = await fetch('http://localhost:5001/api/members');
    
    console.log(`📊 Status HTTP: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers: ${response.headers.get('content-type')}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`\n✅ Resposta recebida:`);
    console.log(`   Total de registros: ${data.length}`);
    
    if (data.length > 0) {
      console.log(`\n📋 Primeiros 3 registros:`);
      data.slice(0, 3).forEach((member, i) => {
        console.log(`   ${i+1}. ${member.nome_completo || member.nome} (ID: ${member.id})`);
      });
    } else {
      console.log(`\n⚠️  API retornou array vazio!`);
    }
    
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Erro ao testar API:', error.message);
    console.error('\n💡 Certifique-se de que o servidor está rodando em http://localhost:5001');
  }
}

testarAPI();
