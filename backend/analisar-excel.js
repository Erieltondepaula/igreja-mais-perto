const XLSX = require('xlsx');

const arquivo = 'c:/Users/eriel/OneDrive - MSFT/Dashboard_Membros/Excel Membros/membros-convertido-2025-11-03.xlsx';

console.log('📁 Analisando arquivo:', arquivo);

const wb = XLSX.readFile(arquivo);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('\n📊 Total de registros:', data.length);
console.log('\n📋 Colunas disponíveis:');
console.log(Object.keys(data[0]));

console.log('\n🔍 Primeiro registro completo:');
console.log(JSON.stringify(data[0], null, 2));

console.log('\n🔍 Valores de Sexo e Data nos primeiros 10:');
data.slice(0, 10).forEach((r, i) => {
  console.log(`${i+1}. ${r['Nome Completo'] || r.nome_completo} - Sexo: '${r.Sexo || r.sexo}' - Data: '${r['Data de Nascimento'] || r.data_nascimento}'`);
});
