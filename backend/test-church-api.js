// Teste simples da API de church_settings
const db = require('./config/postgresql');

async function test() {
  try {
    console.log('🔍 Conectando ao banco...');
    await db.connect();
    
    console.log('\n📊 Testando GET (query)...');
    const result = await db.query('SELECT * FROM church_settings LIMIT 1');
    console.log('Tipo do result:', typeof result);
    console.log('É array?:', Array.isArray(result));
    console.log('Length:', result.length);
    console.log('Dados:', result);
    
    if (result.length > 0) {
      console.log('\n✅ Primeira linha:', result[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

test();
