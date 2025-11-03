const XLSX = require('xlsx');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

// ✅ FUNÇÃO PARA GERAR CÓDIGO DE REFERÊNCIA
function gerarCodigoReferencia(nomeCompleto) {
  if (!nomeCompleto) return 'UNKN-0000';
  
  // Pegar iniciais (primeiras letras de cada palavra)
  const palavras = nomeCompleto.trim().toUpperCase().split(' ');
  const iniciais = palavras
    .filter(p => p.length > 2) // Ignorar "DE", "DA", etc
    .slice(0, 2) // Pegar até 2 palavras
    .map(p => p[0])
    .join('');
  
  // Timestamp: YYYYMMDDHHMMSS
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:T]/g, '')
    .slice(0, 14);
  
  // Sufixo aleatório de 4 caracteres
  const sufixo = crypto.randomBytes(2)
    .toString('hex')
    .toUpperCase()
    .slice(0, 4);
  
  return `${iniciais}${timestamp}-${sufixo}`;
}

// ✅ FUNÇÃO PARA PROCESSAR CADA LINHA DO EXCEL
async function processarLinha(row, index) {
  try {
    // 1. Extrair dados da planilha
    const idExterno = row['Id'] ? String(row['Id']).trim() : null;
    const nome = row['nome'] || '';
    const nomeCompleto = row['Nome Completo'] || nome;
    
    // Converter data do Excel (número serial) para data SQL
    let dataNascimento = null;
    if (row['data_nascimento']) {
      const excelDate = parseInt(row['data_nascimento']);
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
      dataNascimento = jsDate.toISOString().split('T')[0];
    }
    
    const idade = row['idade'];
    const mes = row['mes'];
    const telefone = row['telefone'] ? String(row['telefone']) : '';
    const sexo = row['sexo'];
    
    // Campos de endereço
    const rua = row['rua'] || null;
    const numero = row['numero'] || null;
    const bairro = row['bairro'] || null;
    const cidade = row['cidade'] || null;
    const estado = row['estado'] || null;
    const cep = row['cep'] ? String(row['cep']) : null;
    
    // Campos de relacionamento
    const statusCivil = row['status_civil'] || null;
    const conjuge = row['nome_conjuge '] || null; // Note o espaço extra no Excel
    const parentesco = row['parentesco '] || null; // Note o espaço extra no Excel
    
    // Campos de situação
    const batizado = row['batizado'] === 'Sim';
    const membro = row['membro'] === 'Sim';
    const situacaoAtual = row['situacao_atual'] || 'Ativo';
    const eLider = row['e_lider'] === 'Sim';
    const eProfessorEbq = (row['e_professor_ebq\n'] || row['e_professor_ebq']) === 'Sim'; // Trata variação com \n
    
    // Campos de grupo
    const faixaEtaria = row['faixa_etaria '] || null; // Note o espaço extra no Excel
    const pequenoGrupo = row['Está em um pequeno grupo ?'] === 'Sim';
    const grupo = row['grupo'] || null;
    const numerodomes = row['numerodomes'] || null;
    
    // Validações básicas
    if (!nome || !idExterno) {
      console.log(`⚠️  Linha ${index + 2}: Pulada (sem Nome ou Id)`);
      return { tipo: 'pulado' };
    }
    
    // 2. ✅ VERIFICAR SE JÁ EXISTE (usando id_externo)
    const existe = await pool.query(
      'SELECT id, nome, nome_completo FROM membros WHERE id_externo = $1',
      [idExterno]
    );
    
    if (existe.rows.length > 0) {
      // ✅ CASO 2: REGISTRO JÁ EXISTE
      const registroExistente = existe.rows[0];
      
      // Comparar dados
      if (registroExistente.nome !== nome || registroExistente.nome_completo !== nomeCompleto) {
        console.log(`\n🔄 CONFLITO DETECTADO (id_externo: ${idExterno}):`);
        console.log(`   Banco: "${registroExistente.nome_completo}"`);
        console.log(`   Excel: "${nomeCompleto}"`);
        console.log(`   ⏭️  Pulando atualização (modo automático)`);
        return { tipo: 'conflito', idExterno };
      } else {
        console.log(`✅ Linha ${index + 2}: Dados idênticos (id_externo: ${idExterno})`);
        return { tipo: 'identico' };
      }
    } else {
      // ✅ CASO 1: NOVO REGISTRO (INSERT)
      const id = gerarCodigoReferencia(nomeCompleto);
      
      // Separar nome e sobrenome
      const partesNome = nome.trim().split(' ');
      const primeiroNome = partesNome[0];
      const sobrenome = partesNome.slice(1).join(' ') || primeiroNome;
      
      await pool.query(`
        INSERT INTO membros (
          id, id_externo, nome, sobrenome, nome_completo,
          data_nascimento, idade, mes, telefone, sexo,
          status_civil, conjuge, parentesco,
          rua, numero, bairro, cidade, estado, cep,
          situacao_atual, batizado, membro, lider, e_professor_ebq,
          faixa_etaria, pequeno_grupo, grupo, numerodomes,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28,
          NOW(), NOW()
        )
      `, [
        id,
        idExterno,
        primeiroNome,
        sobrenome,
        nomeCompleto,
        dataNascimento,
        idade,
        mes,
        telefone,
        sexo,
        statusCivil,
        conjuge,
        parentesco,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        situacaoAtual,
        batizado,
        membro,
        eLider,
        eProfessorEbq,
        faixaEtaria,
        pequenoGrupo,
        grupo,
        numerodomes
      ]);
      
      console.log(`✅ Linha ${index + 2}: CRIADO (PK: ${id}, id_externo: ${idExterno})`);
      return { tipo: 'criado', id, idExterno };
    }
    
  } catch (err) {
    console.error(`❌ Erro na linha ${index + 2}:`, err.message);
    return { tipo: 'erro', erro: err.message };
  }
}

// ✅ FUNÇÃO PRINCIPAL DE IMPORTAÇÃO
async function importarExcel() {
  try {
    console.log('📊 IMPORTAÇÃO COM CHAVE DE SINCRONIZAÇÃO (id_externo)\n');
    console.log('═'.repeat(80));
    
    // Ler arquivo Excel
    const excelPath = path.join(__dirname, '..', 'Excel Membros', 'Cadastro de Membros IBVP.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`📁 Arquivo: ${excelPath}`);
    console.log(`📄 Planilha: ${sheetName}`);
    console.log(`📊 Total de linhas: ${data.length}\n`);
    console.log('═'.repeat(80));
    console.log('Processando...\n');
    
    // Estatísticas
    const stats = {
      criados: 0,
      conflitos: 0,
      identicos: 0,
      pulados: 0,
      erros: 0
    };
    
    // Processar cada linha
    for (let i = 0; i < data.length; i++) {
      const resultado = await processarLinha(data[i], i);
      
      switch (resultado.tipo) {
        case 'criado': stats.criados++; break;
        case 'conflito': stats.conflitos++; break;
        case 'identico': stats.identicos++; break;
        case 'pulado': stats.pulados++; break;
        case 'erro': stats.erros++; break;
      }
    }
    
    // Relatório final
    console.log('\n' + '═'.repeat(80));
    console.log('📊 RELATÓRIO FINAL DE IMPORTAÇÃO\n');
    console.log(`✅ Registros CRIADOS:     ${stats.criados}`);
    console.log(`🔄 Conflitos DETECTADOS:  ${stats.conflitos}`);
    console.log(`✔️  Registros IDÊNTICOS:  ${stats.identicos}`);
    console.log(`⏭️  Registros PULADOS:    ${stats.pulados}`);
    console.log(`❌ Erros:                ${stats.erros}`);
    console.log(`📈 TOTAL PROCESSADO:     ${data.length}`);
    console.log('═'.repeat(80));
    
    // Verificar total no banco
    const total = await pool.query('SELECT COUNT(*) as total FROM membros');
    console.log(`\n🗄️  Total de registros no banco: ${total.rows[0].total}\n`);
    
  } catch (err) {
    console.error('❌ Erro fatal:', err.message);
  } finally {
    await pool.end();
  }
}

// Executar importação
importarExcel();
