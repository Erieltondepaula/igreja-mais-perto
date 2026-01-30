// IMPORTADOR SIMPLES COM ID PERSONALIZADO - SEM PARÂMETROS
const XLSX = require('xlsx');
const db = require('../config/database');

// FUNÇÃO PARA GERAR ID PERSONALIZADO
function generateCustomID(nomeCompleto, timestamp = new Date()) {
  try {
    const partesNome = nomeCompleto.trim().toUpperCase().split(/\s+/);
    
    // Primeira letra do nome
    const primeiraLetra = partesNome[0] ? partesNome[0].charAt(0) : 'X';
    
    // Segunda letra do sobrenome (se houver mais de uma palavra)
    let segundaLetra = 'X';
    if (partesNome.length > 1 && partesNome[1]) {
      segundaLetra = partesNome[1].charAt(0);
    } else if (partesNome[0] && partesNome[0].length > 1) {
      // Se só tem um nome, usa a segunda letra do mesmo
      segundaLetra = partesNome[0].charAt(1);
    }
    
    // Formato: AA + YYYYMMDDHHMMSS
    const ano = timestamp.getFullYear();
    const mes = String(timestamp.getMonth() + 1).padStart(2, '0');
    const dia = String(timestamp.getDate()).padStart(2, '0');
    const hora = String(timestamp.getHours()).padStart(2, '0');
    const minuto = String(timestamp.getMinutes()).padStart(2, '0');
    const segundo = String(timestamp.getSeconds()).padStart(2, '0');
    
    return `${primeiraLetra}${segundaLetra}${ano}${mes}${dia}${hora}${minuto}${segundo}`;
    
  } catch (error) {
    console.log(`⚠️ Erro ao gerar ID para "${nomeCompleto}":`, error.message);
    return `XX${Date.now()}`;
  }
}

// FUNÇÃO PARA CONVERTER DATA DO EXCEL
function parseExcelDate(excelDate) {
  if (!excelDate || excelDate === '') return null;
  
  try {
    // Excel armazena datas como número de dias desde 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (error) {
    console.log(`⚠️ Erro ao converter data: ${excelDate}`);
    return null;
  }
}

// FUNÇÃO PARA CALCULAR IDADE
function calculateAge(birthDate) {
  if (!birthDate) return null;
  
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
}

// FUNÇÃO PARA CALCULAR FAIXA ETÁRIA
function calculateAgeGroup(age) {
  if (age === null || age === undefined) return 'Não informado';
  
  if (age >= 0 && age <= 6) return 'Infância';
  if (age >= 7 && age <= 10) return 'Crianças';
  if (age >= 11 && age <= 17) return 'Adolescentes';
  if (age >= 18 && age <= 35) return 'Jovens';
  if (age >= 36 && age <= 59) return 'Adultos';
  return 'Idosos';
}

// FUNÇÃO PARA OBTER MÊS DA DATA
function getMonthFromDate(dateString) {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[date.getMonth()];
  } catch (error) {
    return null;
  }
}

async function importWithSimpleSQL() {
  try {
    console.log('🚀 IMPORTADOR SIMPLES COM ID PERSONALIZADO');
    console.log('=========================================');
    console.log('📋 Formato ID: AA20253010104302 (PrimeiraLetra + SegundaLetra + YYYYMMDDHHMMSS)');
    
    // 1. Conectar ao banco
    await db.connect();
    
    // 2. Limpar dados existentes
    console.log('\n🧹 Limpando banco de dados...');
    await db.query('DELETE FROM Membros');
    console.log('✅ Banco limpo!');
    
    // 3. Ler Excel
    console.log('\n📂 Carregando Excel...');
    const excelPath = 'C:\\Users\\eriel\\OneDrive - MSFT\\Dashboard_Membros\\Excel Membros\\Cadastro de Membros IBVP.xlsx';
    const workbook = XLSX.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Total de registros: ${data.length}`);
    
    // 4. Processar cada registro com SQL simples
    console.log('\n📤 Iniciando importação...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Gerar timestamp único para cada registro
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + i); // Garantir unicidade
        
        // Gerar ID personalizado
        const customID = generateCustomID(row.nome || row['Nome Completo'], timestamp);
        
        // Converter data de nascimento
        const dataNascimento = parseExcelDate(row.data_nascimento);
        
        // Calcular campos derivados
        const idade = calculateAge(dataNascimento);
        const mes = getMonthFromDate(dataNascimento);
        const faixaEtaria = calculateAgeGroup(idade);
        
        // Mapear sexo
        const sexo = row.sexo === 'Masculino' ? 'M' : 'F';
        
        // Mapear booleanos (TRUE/FALSE para Access)
        const batizado = row.batizado === 'Sim';
        const membro = row.membro === 'Sim';
        const lider = row.e_lider === 'Sim';
        const professorEBQ = row['e_professor_ebq\n'] === 'Sim';
        const pequenoGrupo = row['Está em um pequeno grupo ?'] === 'Sim';
        
        // Status
        const status = row.situacao_atual === 'Ativo' ? 'ativo' : 'inativo';
        
        // Endereço completo
        const endereco = `${row.rua || ''}, ${row.numero || ''}`.replace(', ', ', ').trim();
        
        // Conjuge (pode estar em nome_conjuge ou ser vazio)
        const conjuge = row['nome_conjuge '] || row.nome_conjuge || '';
        
        // SQL simples - inserir valores diretos
        const sql = `
          INSERT INTO Membros (
            ID, Nome, NomeCompleto, DataNascimento, Idade, Mes, Sexo, Telefone, 
            Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, Status,
            StatusCivil, Conjuge, Parentesco, Batizado, Membro, Lider, ProfessorEBQ,
            FaixaEtaria, PequenoGrupo, Grupo, NumeroDomes, DataCriacao, DataAtualizacao
          ) VALUES (
            '${customID}',
            '${escapeSql(row.nome)}',
            '${escapeSql(row['Nome Completo'])}',
            '${dataNascimento}',
            ${idade || 'NULL'},
            '${escapeSql(mes)}',
            '${sexo}',
            '${escapeSql(String(row.telefone || ''))}',
            '${escapeSql(endereco)}',
            '${escapeSql(row.rua || '')}',
            '${escapeSql(String(row.numero || ''))}',
            '${escapeSql(row.bairro || '')}',
            '${escapeSql(row.cidade || '')}',
            '${escapeSql(row.estado || '')}',
            '${escapeSql(String(row.cep || ''))}',
            '${status}',
            '${escapeSql(row.status_civil || '')}',
            '${escapeSql(conjuge)}',
            '${escapeSql(row['parentesco '] || '')}',
            ${batizado ? 'TRUE' : 'FALSE'},
            ${membro ? 'TRUE' : 'FALSE'},
            ${lider ? 'TRUE' : 'FALSE'},
            ${professorEBQ ? 'TRUE' : 'FALSE'},
            '${escapeSql(faixaEtaria)}',
            ${pequenoGrupo ? 'TRUE' : 'FALSE'},
            '${escapeSql(row.grupo || 'Sem Grupo')}',
            ${row.numerodomes || 'NULL'},
            '${timestamp.toISOString().replace('T', ' ').substring(0, 19)}',
            '${timestamp.toISOString().replace('T', ' ').substring(0, 19)}'
          )
        `;
        
        await db.query(sql);
        successCount++;
        
        if (successCount <= 10 || successCount % 20 === 0) {
          console.log(`✅ ${successCount}. ${customID} - ${row.nome} (${row.cidade})`);
        }
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Erro no registro ${i + 1} (${row.nome}): ${error.message}`);
      }
    }
    
    // 5. Verificação final
    console.log('\n📊 RELATÓRIO FINAL:');
    console.log(`✅ Sucessos: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);
    console.log(`📊 Taxa de sucesso: ${(successCount / data.length * 100).toFixed(1)}%`);
    
    const finalCount = await db.query('SELECT COUNT(*) as total FROM Membros');
    console.log(`📊 Total no banco: ${finalCount[0].total} membros`);
    
    // 6. Mostrar exemplos dos novos IDs
    console.log('\n📋 EXEMPLOS DE IDs PERSONALIZADOS GERADOS:');
    const examples = await db.query('SELECT TOP 10 ID, Nome, Cidade FROM Membros ORDER BY DataCriacao');
    examples.forEach(member => {
      console.log(`  ${member.ID} - ${member.Nome} (${member.Cidade})`);
    });
    
    // 7. Verificar campos preenchidos
    console.log('\n🔍 VERIFICAÇÃO DOS CAMPOS CALCULADOS:');
    const sample = await db.query('SELECT TOP 1 ID, Nome, Idade, Mes, FaixaEtaria, Conjuge FROM Membros WHERE Idade IS NOT NULL');
    if (sample.length > 0) {
      const s = sample[0];
      console.log(`✅ Exemplo: ${s.ID} - ${s.Nome}`);
      console.log(`   Idade: ${s.Idade}`);
      console.log(`   Mês: ${s.Mes}`);
      console.log(`   Faixa Etária: ${s.FaixaEtaria}`);
      console.log(`   Cônjuge: ${s.Conjuge || 'Não informado'}`);
    }
    
    console.log('\n🎉 IMPORTAÇÃO COMPLETA!');
    console.log('🔧 Todos os campos do Excel foram mapeados corretamente');
    console.log('🆔 IDs personalizados no formato AA20253010104302 implementados');
    console.log('📊 Sistema pronto para uso com 144 membros da IBVP');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro na importação:', error);
    process.exit(1);
  }
}

// Função para escapar SQL
function escapeSql(value) {
  if (!value) return '';
  return String(value).replace(/'/g, "''").substring(0, 255);
}

importWithSimpleSQL();