const XLSX = require('xlsx');
const path = require('path');

// Cria uma planilha de exemplo para importação
const criarTemplateImportacao = () => {
  // Dados de exemplo com TODAS as colunas do banco de dados
  const dadosExemplo = [
    {
      'Id': '',  // Deixar vazio - será gerado automaticamente
      'id_externo': '',  // ID do sistema antigo (opcional)
      'nome': 'João',
      'sobrenome': 'Silva',
      'Nome Completo': 'João Silva Santos',
      'data_nascimento': '15/01/1985',
      'idade': '',  // Calculado automaticamente
      'mes': '',  // Calculado automaticamente
      'telefone': '27995298253',
      'sexo': 'Masculino',
      'observacoes': 'Membro ativo da congregação',
      'status_civil': 'Casado(a)',
      'nome_conjuge ': 'Maria Silva',
      'parentesco ': '',
      'rua': 'Rua das Flores',
      'numero': '123',
      'bairro': 'Centro',
      'cidade': 'Cariacica',
      'estado': 'ES',
      'cep': '29140000',
      'batizado': 'Sim',
      'membro': 'Sim',
      'situacao_atual': 'Ativo',
      'e_lider': 'Sim',
      'e_professor_ebq\n': 'Não',
      'faixa_etaria ': '',  // Calculado automaticamente
      'Está em um pequeno grupo ?': 'Sim',
      'grupo': 'Grupo de Jovens',
      'numerodomes': '1'
    },
    {
      'Id': '',
      'id_externo': '',
      'nome': 'Maria',
      'sobrenome': 'Santos',
      'Nome Completo': 'Maria Santos Oliveira',
      'data_nascimento': '22/07/1992',
      'idade': '',
      'mes': '',
      'telefone': '27991234567',
      'sexo': 'Feminino',
      'observacoes': '',
      'status_civil': 'Solteiro(a)',
      'nome_conjuge ': '',
      'parentesco ': '',
      'rua': 'Avenida Principal',
      'numero': '456',
      'bairro': 'Jardim das Flores',
      'cidade': 'Cariacica',
      'estado': 'ES',
      'cep': '29141000',
      'batizado': 'Sim',
      'membro': 'Sim',
      'situacao_atual': 'Ativo',
      'e_lider': 'Não',
      'e_professor_ebq\n': 'Sim',
      'faixa_etaria ': '',
      'Está em um pequeno grupo ?': 'Sim',
      'grupo': 'Grupo de Mulheres',
      'numerodomes': '2'
    },
    {
      'Id': '',
      'id_externo': '',
      'nome': 'Pedro',
      'sobrenome': 'Oliveira',
      'Nome Completo': 'Pedro Oliveira Costa',
      'data_nascimento': '10/11/2005',
      'idade': '',
      'mes': '',
      'telefone': '27998765432',
      'sexo': 'Masculino',
      'observacoes': 'Congregado',
      'status_civil': 'Solteiro(a)',
      'nome_conjuge ': '',
      'parentesco ': 'Maria Santos Oliveira',
      'rua': 'Rua do Comércio',
      'numero': '789',
      'bairro': 'Vila Nova',
      'cidade': 'Cariacica',
      'estado': 'ES',
      'cep': '29142000',
      'batizado': 'Não',
      'membro': 'Não',
      'situacao_atual': 'Ativo',
      'e_lider': 'Não',
      'e_professor_ebq\n': 'Não',
      'faixa_etaria ': '',
      'Está em um pequeno grupo ?': 'Sim',
      'grupo': 'Grupo de Adolescentes',
      'numerodomes': '2'
    }
  ];

  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(dadosExemplo);
  
  // Define larguras das colunas
  worksheet['!cols'] = [
    { wch: 5 },   // Id
    { wch: 12 },  // id_externo
    { wch: 15 },  // nome
    { wch: 15 },  // sobrenome
    { wch: 30 },  // Nome Completo
    { wch: 18 },  // data_nascimento
    { wch: 8 },   // idade
    { wch: 12 },  // mes
    { wch: 15 },  // telefone
    { wch: 12 },  // sexo
    { wch: 30 },  // observacoes
    { wch: 15 },  // status_civil
    { wch: 25 },  // nome_conjuge
    { wch: 25 },  // parentesco
    { wch: 25 },  // rua
    { wch: 8 },   // numero
    { wch: 20 },  // bairro
    { wch: 15 },  // cidade
    { wch: 8 },   // estado
    { wch: 12 },  // cep
    { wch: 12 },  // batizado
    { wch: 10 },  // membro
    { wch: 15 },  // situacao_atual
    { wch: 12 },  // e_lider
    { wch: 18 },  // e_professor_ebq
    { wch: 25 },  // faixa_etaria
    { wch: 28 },  // Está em um pequeno grupo?
    { wch: 25 },  // grupo
    { wch: 12 }   // numerodomes
  ];

  // Cria o workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');

  // Salva o arquivo na pasta "Excel Membros"
  const outputPath = path.join(__dirname, 'Excel Membros', 'exemplo-importacao-COMPLETO.xlsx');
  XLSX.writeFile(workbook, outputPath);

  console.log('✅ Template criado com sucesso!');
  console.log(`📄 Local: ${outputPath}`);
  console.log('\n📋 INSTRUÇÕES DE USO:');
  console.log('1. Preencha a planilha com os dados dos membros');
  console.log('2. Use o formato de data: DD/MM/YYYY (ex: 15/03/1985)');
  console.log('3. Sexo: "Masculino" ou "Feminino"');
  console.log('4. Respostas Sim/Não: use "Sim" ou "Não"');
  console.log('5. Situação Atual: use "Ativo" ou "Desligado"');
  console.log('\n⚠️  COLUNAS OBRIGATÓRIAS:');
  console.log('   - nome');
  console.log('   - data_nascimento');
  console.log('   - sexo');
  console.log('\n✨ COLUNAS CALCULADAS AUTOMATICAMENTE (deixe vazias):');
  console.log('   - Id (será gerado formato: AA20253010104302)');
  console.log('   - idade');
  console.log('   - mes');
  console.log('   - faixa_etaria');
  console.log('\n🎯 TODAS as 27 colunas estão mapeadas!');
  console.log('📖 Veja DE-PARA_COMPLETO.md para detalhes');
};

criarTemplateImportacao();
