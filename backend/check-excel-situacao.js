const XLSX = require('xlsx');
const path = require('path');

const files = [
  'membros-convertido-2025-11-03.xlsx',
  'exemplo-importacao-COMPLETO.xlsx',
  'Cadastro de Membros IBVP.xlsx'
];

files.forEach(filename => {
  try {
    const filePath = path.join(__dirname, '..', 'Excel Membros', filename);
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);
    
    console.log('\n========================================');
    console.log(`📁 ARQUIVO: ${filename}`);
    console.log('========================================');
    console.log(`Total de registros: ${data.length}`);
    
    // Verificar primeiros registros
    console.log('\n📋 Colunas disponíveis:');
    if (data.length > 0) {
      const cols = Object.keys(data[0]);
      const situacaoCols = cols.filter(c => c.toLowerCase().includes('situacao') || c.toLowerCase().includes('status'));
      console.log('Colunas relacionadas a situação/status:');
      situacaoCols.forEach(c => console.log(`  - "${c}"`));
      
      console.log('\n📊 Primeiros 3 registros:');
      data.slice(0, 3).forEach((r, i) => {
        console.log(`\n${i+1}. ${r.nome_completo || r['Nome Completo'] || 'SEM NOME'}:`);
        situacaoCols.forEach(col => {
          console.log(`   ${col}: "${r[col] || 'VAZIO'}"`);
        });
      });
      
      // Estatísticas
      console.log('\n📈 Distribuição de valores:');
      situacaoCols.forEach(col => {
        const stats = {};
        data.forEach(r => {
          const val = r[col] || 'VAZIO';
          stats[val] = (stats[val] || 0) + 1;
        });
        console.log(`\nColuna: ${col}`);
        console.table(stats);
      });
    }
  } catch (error) {
    console.error(`❌ Erro ao ler ${filename}:`, error.message);
  }
});
