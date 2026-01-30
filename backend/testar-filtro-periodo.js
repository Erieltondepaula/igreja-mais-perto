// Testar a lógica do filtro de aniversariantes por período

function parseDateString(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return { year: parseInt(match[1], 10), month: parseInt(match[2], 10), day: parseInt(match[3], 10) };
}

function isBirthdayInPeriod(birthDate, startDate, endDate) {
  if (!birthDate || !startDate || !endDate) return false;

  const birth = parseDateString(birthDate);
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  if (!birth || !start || !end) return false;
  
  // Usar o ano do período selecionado para todas as comparações
  const periodYear = start.year;

  // Cria datas de aniversário usando o ano do período selecionado
  const birthInPeriodYear = new Date(Date.UTC(periodYear, birth.month - 1, birth.day));
  const birthInNextYear = new Date(Date.UTC(periodYear + 1, birth.month - 1, birth.day));
  
  const startUTC = new Date(Date.UTC(start.year, start.month - 1, start.day));
  const endUTC = new Date(Date.UTC(end.year, end.month - 1, end.day));

  // Se o período cruza o ano (ex: Dezembro a Janeiro)
  if (startUTC > endUTC) {
    return birthInPeriodYear >= startUTC || birthInNextYear <= endUTC;
  }

  return birthInPeriodYear >= startUTC && birthInPeriodYear <= endUTC;
}

// Dados de teste dos aniversariantes de janeiro
const aniversariantes = [
  { nome: 'Gildazio lima dos santos', dataNascimento: '1994-01-02' },
  { nome: 'Lohanna Oliveira Santos', dataNascimento: '1995-01-02' },
  { nome: 'Pedro Marcos Rolim', dataNascimento: '1968-01-02' },
  { nome: 'ABNER ABADIS LIMA', dataNascimento: '2022-01-02' },
  { nome: 'Tiago Dias Quaresma França', dataNascimento: '2004-01-04' },
  { nome: 'Maria Helena Rocha', dataNascimento: '1976-01-15' },
  { nome: 'Mayra Da silva rolim herpet', dataNascimento: '1997-01-15' },
  { nome: 'CHRISTOPHER ASAFE CRUZ DE SOUSA', dataNascimento: '2011-01-24' },
  { nome: 'Joseph das Neves Azevedo', dataNascimento: '1987-01-29' }
];

// Testar com o período selecionado pelo usuário
const startDate = '2026-01-01';
const endDate = '2026-01-31';

console.log('🧪 TESTANDO FILTRO DE ANIVERSARIANTES POR PERÍODO\n');
console.log(`📅 Período selecionado: ${startDate} até ${endDate}\n`);
console.log('═'.repeat(80));

let encontrados = 0;
aniversariantes.forEach(pessoa => {
  const resultado = isBirthdayInPeriod(pessoa.dataNascimento, startDate, endDate);
  console.log(`${resultado ? '✅' : '❌'} ${pessoa.nome}`);
  console.log(`   Data de nascimento: ${pessoa.dataNascimento}`);
  if (resultado) encontrados++;
});

console.log('═'.repeat(80));
console.log(`\n📊 Resultado: ${encontrados} de ${aniversariantes.length} aniversariantes encontrados`);

if (encontrados === aniversariantes.length) {
  console.log('✅ SUCESSO! Todos os aniversariantes de Janeiro foram encontrados!\n');
} else {
  console.log('❌ ERRO! Nem todos os aniversariantes foram encontrados.\n');
}
