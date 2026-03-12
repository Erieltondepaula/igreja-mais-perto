// Script para importar arquivo XLSX completo para o banco de dados
const XLSX = require('xlsx');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuração do banco
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dashboard_membros',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '252088'
});

// Mapeamento de colunas (deve corresponder exatamente às colunas do Excel)
const REQUIRED_COLUMNS_MAP = {
  'id_externo': 'idExterno',
  'nome': 'nome',
  'sobrenome': 'sobrenome',
  'Nome Completo': 'nomeCompleto',
  'data_nascimento': 'dataNascimento',
  'idade': 'idade',
  'mes': 'mes',
  'telefone': 'telefone',
  'sexo': 'sexo',
  'observacoes': 'observacoes',
  'status_civil': 'statusCivil',
  'nome_conjuge ': 'conjuge',
  'parentesco ': 'parentesco',
  'rua': 'rua',
  'numero': 'numero',
  'bairro': 'bairro',
  'cidade': 'cidade',
  'estado': 'estado',
  'cep': 'cep',
  'batizado': 'batizado',
  'membro': 'membro',
  'situacao_atual': 'situacaoAtual',
  'e_lider': 'lider',
  'e_professor_ebq\r\n': 'eProfessorEbq',
  'faixa_etaria ': 'faixaEtaria',
  'Está em um pequeno grupo ?': 'pequenoGrupo',
  'grupo': 'grupo',
  'numerodomes': 'numeroDomes'
};

// Função para converter "Sim"/"Não" em boolean
function isYes(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'sim' || value.toLowerCase() === 's';
  }
  return false;
}

// Função para converter sexo
function parseSexo(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const v = value.toLowerCase();
    if (v.includes('masc') || v === 'm') return 'M';
    if (v.includes('fem') || v === 'f') return 'F';
  }
  return value;
}

// Função para processar data
function parseDate(value) {
  if (!value) return null;
  
  // Se já for uma data válida
  if (value instanceof Date && !isNaN(value)) {
    return value.toISOString().split('T')[0];
  }
  
  // Se for string no formato DD/MM/YYYY
  if (typeof value === 'string' && value.includes('/')) {
    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  // Se for número (serial do Excel)
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  return null;
}

// Função para gerar ID único
let idCounter = 0;
function gerarID() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const counter = String(idCounter++).padStart(3, '0');
  
  return `JS${year}${month}${day}${hour}${minute}${second}${counter}`;
}

async function importarArquivo(caminhoArquivo) {
  console.log('📁 Lendo arquivo:', caminhoArquivo);
  
  // Ler o arquivo XLSX
  const workbook = XLSX.readFile(caminhoArquivo);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`📊 Total de linhas no arquivo: ${data.length}`);
  
  if (data.length === 0) {
    console.log('⚠️ Nenhum dado encontrado no arquivo');
    return;
  }
  
  // Processar dados
  const membros = data.map((row, index) => {
    const membro = {};
    
    // Mapear colunas
    Object.keys(REQUIRED_COLUMNS_MAP).forEach(excelCol => {
      const jsKey = REQUIRED_COLUMNS_MAP[excelCol];
      const value = row[excelCol];
      
      if (value !== undefined && value !== null && value !== '') {
        if (jsKey === 'dataNascimento') {
          membro[jsKey] = parseDate(value);
        } else if (jsKey === 'sexo') {
          membro[jsKey] = parseSexo(value);
        } else if (['batizado', 'membro', 'lider', 'eProfessorEbq', 'pequenoGrupo'].includes(jsKey)) {
          membro[jsKey] = isYes(value);
        } else if (jsKey === 'idade' || jsKey === 'numeroDomes') {
          membro[jsKey] = parseInt(value) || null;
        } else {
          membro[jsKey] = String(value).trim();
        }
      }
    });
    
    return membro;
  }).filter(m => m.nome || m.nomeCompleto); // Filtrar apenas registros com nome
  
  console.log(`✅ ${membros.length} membros processados`);
  
  // Limpar banco antes de importar
  console.log('🗑️ Limpando banco de dados...');
  await pool.query('DELETE FROM membros');
  console.log('✅ Banco limpo');
  
  // Inserir no banco
  let inseridos = 0;
  let erros = 0;
  
  for (const membro of membros) {
    try {
      const id = gerarID();
      
      const query = `
        INSERT INTO membros (
          id, id_externo, nome, sobrenome, nome_completo, data_nascimento, idade, mes,
          telefone, sexo, observacoes, status_civil, conjuge, parentesco,
          rua, numero, bairro, cidade, estado, cep,
          batizado, membro, situacao_atual, lider, e_professor_ebq,
          faixa_etaria, pequeno_grupo, grupo, numerodomes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW(), NOW()
        )
      `;
      
      const values = [
        id,
        membro.idExterno || null,
        membro.nome || '',
        membro.sobrenome || '',
        membro.nomeCompleto || `${membro.nome || ''} ${membro.sobrenome || ''}`.trim(),
        membro.dataNascimento || null,
        membro.idade || null,
        membro.mes || null,
        membro.telefone || null,
        membro.sexo || null,
        membro.observacoes || null,
        membro.statusCivil || null,
        membro.conjuge || null,
        membro.parentesco || null,
        membro.rua || null,
        membro.numero || null,
        membro.bairro || null,
        membro.cidade || null,
        membro.estado || null,
        membro.cep || null,
        membro.batizado || false,
        membro.membro || false,
        membro.situacaoAtual || null,
        membro.lider || false,
        membro.eProfessorEbq || false,
        membro.faixaEtaria || null,
        membro.pequenoGrupo || false,
        membro.grupo || null,
        membro.numeroDomes || null
      ];
      
      await pool.query(query, values);
      inseridos++;
      
      if (inseridos % 10 === 0) {
        console.log(`  ⏳ ${inseridos}/${membros.length} inseridos...`);
      }
    } catch (error) {
      erros++;
      console.error(`  ❌ Erro ao inserir membro: ${membro.nomeCompleto || membro.nome}`, error.message);
    }
  }
  
  console.log('\n✅ IMPORTAÇÃO CONCLUÍDA!');
  console.log(`📊 Total no arquivo: ${data.length}`);
  console.log(`✅ Inseridos com sucesso: ${inseridos}`);
  console.log(`❌ Erros: ${erros}`);
  
  // Verificar total no banco
  const result = await pool.query('SELECT COUNT(*) FROM membros');
  console.log(`📈 Total no banco de dados: ${result.rows[0].count}`);
  
  await pool.end();
}

// Executar
const caminhoArquivo = path.join(__dirname, '..', 'Excel Membros', 'membros-convertido-2025-11-03.xlsx');
importarArquivo(caminhoArquivo)
  .then(() => {
    console.log('🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
