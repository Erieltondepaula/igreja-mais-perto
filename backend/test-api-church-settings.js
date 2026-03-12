// Script para testar a rota da API diretamente
// Local: backend/test-api-church-settings.js

const http = require('http');

function testAPI(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📡 ${method} ${path}`);
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📝 Response:`, data);
        
        try {
          const json = JSON.parse(data);
          console.log(`🎯 JSON Parsed:`, JSON.stringify(json, null, 2));
        } catch (e) {
          console.log(`⚠️  Não é JSON válido`);
        }
        
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Erro na requisição:`, error.message);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testando rotas da API church-settings...\n');
  
  try {
    // Teste 1: GET
    await testAPI('GET', '/api/church-settings');
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
  
  console.log('\n✅ Testes concluídos!');
  process.exit(0);
}

runTests();
