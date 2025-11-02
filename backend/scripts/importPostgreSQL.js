// IMPORTADOR POSTGRESQL COM ID PERSONALIZADO
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

// FUNÇÃO PARA LIMPAR STRINGS
function cleanString(str) {
  if (!str) return null;
  return String(str).trim() || null;
}

async function importFromExcel() {
  console.log('🚀 IMPORTADOR POSTGRESQL COM ID PERSONALIZADO');
  console.log('=====================================================');
  
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
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Extrair dados básicos
        const nomeCompleto = cleanString(row['Nome Completo'] || row['nome']);
        if (!nomeCompleto) {
          console.log(`⚠️ Linha ${i+1}: Nome em branco, pulando...`);
          continue;
        }
        
        // Dividir nome completo em nome e sobrenome
        const partesNome = nomeCompleto.trim().split(/\s+/);
        const nome = partesNome[0];
        const sobrenome = partesNome.length > 1 ? partesNome.slice(1).join(' ') : partesNome[0];
        
        // Data de nascimento
        const dataNascimento = parseExcelDate(row['data_nascimento']);
        
        if (!dataNascimento) {
          console.log(`⚠️ Linha ${i+1}: Data de nascimento inválida para ${nome} ${sobrenome}`);
          continue;
        }
        
        // Verificar duplicatas (nome + data nascimento)
        const duplicateCheck = await client.query(`
          SELECT COUNT(*) FROM membros 
          WHERE LOWER(nome) = LOWER($1) 
          AND LOWER(sobrenome) = LOWER($2)
          AND datanascimento = $3
        `, [nome, sobrenome, dataNascimento]);
        
        if (parseInt(duplicateCheck.rows[0].count) > 0) {
          console.log(`⚠️ Duplicado: ${nome} ${sobrenome} (${dataNascimento})`);
          duplicados++;
          continue;
        }
        
        // Gerar ID usando a função PostgreSQL
        const idResult = await client.query(`
          SELECT generate_member_id($1, $2) AS novo_id
        `, [nome, sobrenome]);
        
        const novoId = idResult.rows[0].novo_id;
        
        // Extrair outros campos baseados nas colunas reais do Excel
        const email = null; // Não tem no Excel atual
        const telefone = cleanString(row['telefone']);
        
        // Montar endereço completo
        const rua = cleanString(row['rua']);
        const numero = cleanString(row['numero']);
        const endereco = rua && numero ? `${rua}, ${numero}` : (rua || numero || null);
        
        const cidade = cleanString(row['cidade']);
        const estado = cleanString(row['estado']);
        const cep = cleanString(row['cep']);
        const genero = cleanString(row['sexo']);
        const estadoCivil = cleanString(row['status_civil']);
        const profissao = null; // Não tem no Excel atual
        
        const dataAdmissao = null; // Não tem no Excel atual
        
        const status = cleanString(row['situacao_atual']) || 'Ativo';
        const observacoes = cleanString(row['observacoes']);
        
        // Inserir no banco
        await client.query(`
          INSERT INTO membros (
            id, nome, sobrenome, datanascimento, email, telefone, 
            endereco, cidade, estado, cep, genero, estadocivil, 
            profissao, dataadmissao, status, observacoes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
          novoId, nome, sobrenome, dataNascimento, email, telefone,
          endereco, cidade, estado, cep, genero, estadoCivil,
          profissao, dataAdmissao, status, observacoes
        ]);
        
        console.log(`✅ ${i+1}/${data.length}: ${novoId} - ${nome} ${sobrenome}`);
        importados++;
        
      } catch (error) {
        console.error(`❌ Erro linha ${i+1}:`, error.message);
        erros++;
      }
    }
    
    // Estatísticas finais
    console.log('\n📊 RESULTADO DA IMPORTAÇÃO:');
    console.log(`✅ Importados: ${importados}`);
    console.log(`⚠️ Duplicados: ${duplicados}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`📋 Total processados: ${data.length}`);
    
    // Verificar total final no banco
    const finalCount = await client.query('SELECT COUNT(*) FROM membros');
    console.log(`🗄️ Total no banco: ${finalCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Erro na importação:', error.message);
  } finally {
    await client.end();
  }
}

importFromExcel();