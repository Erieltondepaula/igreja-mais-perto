// Script para analisar a estrutura da tabela Membros no Access
const db = require('../config/database');

async function analyzeAccessStructure() {
  try {
    console.log('🔍 ANALISANDO ESTRUTURA DO BANCO ACCESS');
    console.log('======================================');
    
    await db.connect();
    
    // Buscar informações da tabela
    console.log('📊 Verificando estrutura da tabela Membros...');
    
    // Primeiro, pegar um registro para ver os campos
    const sample = await db.query('SELECT TOP 1 * FROM Membros');
    
    if (sample.length > 0) {
      console.log('\n📋 CAMPOS EXISTENTES NO BANCO ACCESS:');
      console.log('===================================');
      
      const fields = Object.keys(sample[0]);
      fields.forEach((field, index) => {
        const value = sample[0][field];
        const type = typeof value;
        console.log(`${String(index + 1).padStart(2, '0')}. ${field} (${type})`);
        if (value !== null && value !== undefined && value !== '') {
          console.log(`    Exemplo: "${value}"`);
        }
        console.log('');
      });
      
      console.log(`📊 TOTAL DE CAMPOS NO ACCESS: ${fields.length}`);
      
      // Mostrar registro completo
      console.log('\n📋 EXEMPLO DE REGISTRO COMPLETO:');
      console.log('===============================');
      Object.keys(sample[0]).forEach(key => {
        console.log(`  ${key}: ${sample[0][key]}`);
      });
    }
    
    console.log('\n✅ Análise do Access concluída!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao analisar Access:', error);
    process.exit(1);
  }
}

analyzeAccessStructure();