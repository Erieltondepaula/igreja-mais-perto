const XLSX = require('xlsx');
const path = require('path');

console.log('📊 VERIFICANDO PLANILHAS EXCEL...\n');

const planilhas = [
  'Cadastro de Membros IBVP.xlsx',
  'membros-convertido-2025-11-04.xlsx'
];

planilhas.forEach(arquivo => {
  try {
    const filePath = path.join(__dirname, '..', 'Excel Membros', arquivo);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`📁 ${arquivo}`);
    console.log(`   Total de linhas: ${data.length}`);
    console.log(`   Última modificação: ${new Date(require('fs').statSync(filePath).mtime).toLocaleString('pt-BR')}`);
    
    if (data.length > 0) {
      console.log(`   Primeiras 3 pessoas:`);
      data.slice(0, 3).forEach((pessoa, i) => {
        const nome = pessoa.NOME || pessoa.nome || pessoa.Nome || pessoa.nome_completo || pessoa['Nome Completo'];
        console.log(`     ${i+1}. ${nome || 'Nome não encontrado'}`);
      });
    }
    console.log('');
  } catch (error) {
    console.error(`❌ Erro ao ler ${arquivo}:`, error.message);
  }
});
