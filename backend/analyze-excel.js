const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'Excel Membros', 'Cadastro de Membros IBVP.xlsx');

console.log('📂 Lendo arquivo:', excelPath);

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
console.log('📄 Planilha:', sheetName);

const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('\n📊 Total de registros:', data.length);

if (data.length > 0) {
  console.log('\n🔍 Colunas encontradas:');
  Object.keys(data[0]).forEach(col => {
    console.log(`   - "${col}"`);
  });
  
  console.log('\n📝 Primeiro registro:');
  console.log(JSON.stringify(data[0], null, 2));
}
