const XLSX = require('xlsx');
const path = require('path');

async function transferirDados() {
  try {
    console.log('📖 Lendo arquivo original...\n');
    
    // Ler arquivo original
    const arquivoOriginal = path.join(__dirname, 'Excel Membros', 'Cadastro de Membros IBVP.xlsx');
    const wbOriginal = XLSX.readFile(arquivoOriginal);
    const wsOriginal = wbOriginal.Sheets[wbOriginal.SheetNames[0]];
    const dadosOriginais = XLSX.utils.sheet_to_json(wsOriginal, { raw: false }); // raw: false para converter datas
    
    console.log(`✅ ${dadosOriginais.length} registros encontrados no arquivo original\n`);
    
    // Mapear dados para o formato do banco
    const dadosMapeados = dadosOriginais.map((row, index) => {
      // Extrair nome e sobrenome do campo "nome"
      const nomeCompleto = String(row['nome'] || row['Nome Completo'] || '').trim();
      const partesNome = nomeCompleto.split(' ');
      const primeiroNome = partesNome[0] || '';
      const sobrenome = partesNome.slice(1).join(' ') || partesNome[0] || '';
      
      return {
        'Id': '',  // Será gerado automaticamente
        'id_externo': row['Id'] || '',
        'nome': primeiroNome,
        'sobrenome': sobrenome,
        'Nome Completo': row['Nome Completo'] || nomeCompleto,
        'data_nascimento': row['data_nascimento'] || '',
        'idade': row['idade'] || '',
        'mes': row['mes'] || '',
        'telefone': row['telefone'] || '',
        'sexo': row['sexo'] || '',
        'observacoes': row['observacoes'] || '',
        'status_civil': row['status_civil'] || '',
        'nome_conjuge ': row['nome_conjuge '] || '',
        'parentesco ': row['parentesco '] || '',
        'rua': row['rua'] || '',
        'numero': row['numero'] || '',
        'bairro': row['bairro'] || '',
        'cidade': row['cidade'] || '',
        'estado': row['estado'] || '',
        'cep': row['cep'] || '',
        'batizado': row['batizado'] || '',
        'membro': row['membro'] || '',
        'situacao_atual': row['situacao_atual'] || '',
        'e_lider': row['e_lider'] || '',
        'e_professor_ebq\n': row['e_professor_ebq\n'] || row['e_professor_ebq'] || '',
        'faixa_etaria ': row['faixa_etaria '] || row['faixa_etaria'] || '',
        'Está em um pequeno grupo ?': row['Está em um pequeno grupo ?'] || '',
        'grupo': row['grupo'] || '',
        'numerodomes': row['numerodomes'] || ''
      };
    });
    
    console.log(`🔄 ${dadosMapeados.length} registros mapeados\n`);
    console.log('📋 Primeiros 3 registros:');
    console.log(JSON.stringify(dadosMapeados.slice(0, 3), null, 2));
    
    // Criar novo arquivo
    const worksheet = XLSX.utils.json_to_sheet(dadosMapeados);
    
    // Definir larguras das colunas
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
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');
    
    // Salvar arquivo
    const outputPath = path.join(__dirname, 'Excel Membros', 'exemplo-importacao-COMPLETO.xlsx');
    XLSX.writeFile(workbook, outputPath);
    
    console.log('\n✅ Arquivo criado com sucesso!');
    console.log(`📄 Local: ${outputPath}`);
    console.log(`📊 Total de registros: ${dadosMapeados.length}`);
    console.log('\n🎯 Pronto para importar no sistema!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

transferirDados();
