const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Excel Membros', 'membros-convertido-2025-11-03.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('📋 Colunas disponíveis:');
console.log(Object.keys(data[0]).sort());

console.log('\n📊 Primeiros 5 membros - situacao_atual:');
data.slice(0, 5).forEach((r, i) => {
  console.log(`${i+1}. ${r.nome_completo}: situacao_atual='${r.situacao_atual || 'VAZIO'}'`);
});

console.log('\n📈 Contagem de situacao_atual:');
const stats = {};
data.forEach(r => {
  const status = r.situacao_atual || 'VAZIO';
  stats[status] = (stats[status] || 0) + 1;
});
console.table(stats);
