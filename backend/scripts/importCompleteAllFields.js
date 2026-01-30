// IMPORTADOR COMPLETO COM TODOS OS CAMPOS DO EXCEL
const XLSX = require('xlsx');
const { Client } = require('pg');
const path = require('path');

// Configuração PostgreSQL
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

// FUNÇÃO PARA CONVERTER DATA DO EXCEL
function parseExcelDate(excelDate) {
  if (!excelDate || excelDate === '') return null;
  
  try {
    // Se já é uma string de data
    if (typeof excelDate === 'string') {
      const date = new Date(excelDate);
      return date.toISOString().split('T')[0];
    }
    
    // Excel armazena datas como número de dias desde 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (error) {
    console.log(`⚠️ Erro ao converter data: ${excelDate}`);
    return null;
  }
}

// FUNÇÃO PARA CONVERTER TIMESTAMP DO EXCEL
function parseExcelTimestamp(excelDate) {
  if (!excelDate || excelDate === '') return null;
  
  try {
    // Se já é uma string de data
    if (typeof excelDate === 'string') {
      return new Date(excelDate).toISOString();
    }
    
    // Excel armazena datas como número de dias desde 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString();
  } catch (error) {
    console.log(`⚠️ Erro ao converter timestamp: ${excelDate}`);
    return null;
  }
}

// FUNÇÃO PARA LIMPAR STRINGS
function cleanString(str) {
  if (!str) return null;
  return String(str).trim() || null;
}

// FUNÇÃO PARA EXTRAIR IDADE DOS DADOS
function extractAge(idadeStr) {
  if (!idadeStr) return null;
  const num = parseInt(String(idadeStr));
  return isNaN(num) ? null : num;
}

async function importCompleteExcel() {
  console.log('🚀 IMPORTAÇÃO COMPLETA COM TODOS OS CAMPOS');
  console.log('===========================================');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Caminho do Excel
    const excelPath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');
    console.log(`📁 Lendo arquivo: ${excelPath}`);
    
    // Ler Excel
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 ${data.length} registros encontrados no Excel`);
    
    let importados = 0;
    let duplicados = 0;
    let erros = 0;
    const errosDetalhados = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // =============================================
        // MAPEAR TODOS OS CAMPOS DO EXCEL
        // =============================================
        
        // Campos básicos
        const carimboDataHora = parseExcelTimestamp(row['Carimbo de data/hora']);
        const excelId = cleanString(row['Id']) ? parseInt(row['Id']) : null;
        const nome = cleanString(row['nome']);
        const nomeCompleto = cleanString(row['Nome Completo']) || cleanString(row['nome']);
        const dataNascimento = parseExcelDate(row['data_nascimento']);
        const idade = extractAge(row['idade']);
        const mes = cleanString(row['mes']);
        
        // Contato
        const telefone = cleanString(row['telefone']);
        
        // Pessoais
        const sexo = cleanString(row['sexo']);
        const observacoes = cleanString(row['observacoes']);
        const statusCivil = cleanString(row['status_civil']);
        const nomeConjuge = cleanString(row['nome_conjuge ']); // Note o espaço extra no Excel
        const parentesco = cleanString(row['parentesco ']); // Note o espaço extra no Excel
        
        // Endereço
        const rua = cleanString(row['rua']);
        const numero = cleanString(row['numero']);
        const bairro = cleanString(row['bairro']);
        const cidade = cleanString(row['cidade']);
        const estado = cleanString(row['estado']);
        const cep = cleanString(row['cep']);
        
        // Igreja
        const batizado = cleanString(row['batizado']);
        const membro = cleanString(row['membro']);
        const situacaoAtual = cleanString(row['situacao_atual']);
        const eLider = cleanString(row['e_lider']);
        const eProfessorEbq = cleanString(row['e_professor_ebq\n']); // Note a quebra de linha
        const faixaEtaria = cleanString(row['faixa_etaria ']); // Note o espaço extra
        const estaEmPequenoGrupo = cleanString(row['Está em um pequeno grupo ?']);
        const grupo = cleanString(row['grupo']);
        const numeroDomes = cleanString(row['numerodomes']) ? parseInt(row['numerodomes']) : null;
        
        // Validações básicas
        if (!nomeCompleto) {
          console.log(`⚠️ Linha ${i+1}: Nome completo em branco, pulando...`);
          continue;
        }
        
        if (!dataNascimento) {
          console.log(`⚠️ Linha ${i+1}: Data de nascimento inválida para ${nomeCompleto}`);
          continue;
        }
        
        // Extrair nome e sobrenome do nome completo
        const partesNome = nomeCompleto.trim().split(/\s+/);
        const nomePrimeiro = partesNome[0];
        const sobrenome = partesNome.length > 1 ? partesNome.slice(1).join(' ') : partesNome[0];
        
        // Verificar duplicatas
        const duplicateCheck = await client.query(`
          SELECT COUNT(*) FROM membros 
          WHERE LOWER(nome_completo) = LOWER($1) 
          AND data_nascimento = $2
        `, [nomeCompleto, dataNascimento]);
        
        if (parseInt(duplicateCheck.rows[0].count) > 0) {
          console.log(`⚠️ Duplicado: ${nomeCompleto} (${dataNascimento})`);
          duplicados++;
          continue;
        }
        
        // Gerar ID usando a função PostgreSQL melhorada
        const idResult = await client.query(`
          SELECT generate_unique_member_id($1, $2, $3) AS novo_id
        `, [nomePrimeiro, sobrenome, dataNascimento]);
        
        const novoId = idResult.rows[0].novo_id;
        
        // Campos derivados para compatibilidade
        const endereco = rua && numero ? `${rua}, ${numero}` : (rua || numero || null);
        const genero = sexo;
        const estadoCivil = statusCivil;
        const status = situacaoAtual || 'Ativo';
        
        // =============================================
        // INSERIR TODOS OS CAMPOS NO BANCO
        // =============================================
        await client.query(`
          INSERT INTO membros (
            id, carimbo_data_hora, excel_id, nome, nome_completo, data_nascimento, 
            idade, mes, telefone, sexo, observacoes, status_civil, nome_conjuge, 
            parentesco, rua, numero, bairro, cidade, estado, cep, batizado, 
            membro, situacao_atual, e_lider, e_professor_ebq, faixa_etaria, 
            esta_em_pequeno_grupo, grupo, numerodomes, sobrenome, email, 
            endereco, genero, estadocivil, status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
            $29, $30, $31, $32, $33, $34, $35
          )
        `, [
          novoId, carimboDataHora, excelId, nomePrimeiro, nomeCompleto, dataNascimento,
          idade, mes, telefone, sexo, observacoes, statusCivil, nomeConjuge,
          parentesco, rua, numero, bairro, cidade, estado, cep, batizado,
          membro, situacaoAtual, eLider, eProfessorEbq, faixaEtaria,
          estaEmPequenoGrupo, grupo, numeroDomes, sobrenome, null, // email não existe no Excel
          endereco, genero, estadoCivil, status
        ]);
        
        console.log(`✅ ${i+1}/${data.length}: ${novoId} - ${nomeCompleto}`);
        importados++;
        
      } catch (error) {
        console.error(`❌ Erro linha ${i+1} (${row['Nome Completo'] || row['nome']}):`, error.message);
        errosDetalhados.push({
          linha: i+1,
          nome: row['Nome Completo'] || row['nome'],
          erro: error.message
        });
        erros++;
      }
    }
    
    // Estatísticas finais
    console.log('\n📊 RESULTADO DA IMPORTAÇÃO COMPLETA:');
    console.log(`✅ Importados: ${importados}`);
    console.log(`⚠️ Duplicados: ${duplicados}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`📋 Total processados: ${data.length}`);
    
    // Verificar total final no banco
    const finalCount = await client.query('SELECT COUNT(*) FROM membros');
    console.log(`🗄️ Total no banco: ${finalCount.rows[0].count}`);
    
    // Mostrar exemplos dos dados importados
    console.log('\n📋 EXEMPLOS DOS DADOS IMPORTADOS:');
    const examples = await client.query(`
      SELECT id, nome_completo, data_nascimento, telefone, cidade, batizado, membro
      FROM membros 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    examples.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.id} - ${row.nome_completo} | ${row.cidade} | Batizado: ${row.batizado} | Membro: ${row.membro}`);
    });
    
    if (errosDetalhados.length > 0) {
      console.log('\n❌ DETALHES DOS ERROS:');
      errosDetalhados.slice(0, 5).forEach(erro => {
        console.log(`Linha ${erro.linha}: ${erro.nome} - ${erro.erro}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na importação:', error.message);
  } finally {
    await client.end();
  }
}

importCompleteExcel();