// Script para testar a API do Access
const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/members',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`✅ API funcionando! Membros encontrados: ${response.length}`);
        if (response.length > 0) {
          console.log('📋 Primeiro membro:', response[0]);
        }
      } catch (error) {
        console.log('❌ Erro no JSON:', data.substring(0, 200));
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Erro na conexão:', error.message);
  });

  req.end();
}

console.log('🔍 Testando API do Access...');
testAPI();