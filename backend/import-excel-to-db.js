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

// Função para gerar ID único
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

// Mapear colunas do Excel para campos do banco
const COLUMN_MAP = {
  'Nome': 'nome',
  'Data de Nascimento': 'data_nascimento',
  'Sexo': 'sexo',
  'Telefone': 'telefone',
  'Bairro': 'bairro',
  'Status': 'status',
  'Batizado': 'batizado',
  'Membro': 'membro',
  'É Líder': 'e_lider',
  'É Professor EBQ': 'e_professor_ebq',
  'Cônjuge': 'conjuge'
};

function normalizeHeader(header) {
  return header.trim().replace(/\s+/g, ' ');
}

function parseDate(dateValue) {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  if (typeof dateValue === 'string') {
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  
  return null;
}

function isYes(value) {
  if (!value) return false;
  const str = String(value).toLowerCase().trim();
  return str === 'sim' || str === 's' || str === 'yes' || str === 'y' || str === '1';
}

function calculateAge(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

function getAgeGroup(age) {
  if (age <= 6) return 'Infância';
  if (age <= 10) return 'Crianças';
  if (age <= 17) return 'Adolescentes';
  if (age <= 35) return 'Jovens';
  if (age <= 59) return 'Adultos';
  return 'Idosos';
}

async function importExcelToDatabase() {
  const excelPath = path.join(__dirname, '..', 'Excel Membros', 'Cadastro de Membros IBVP.xlsx');
  
  console.log('📂 Lendo arquivo:', excelPath);
  
  try {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`✅ Encontrados ${data.length} registros no Excel\n`);
    
    // Limpar tabela antes de importar
    await pool.query('DELETE FROM membros');
    console.log('🗑️  Tabela membros limpa\n');
    
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        const nome = row['nome'] || row['Nome Completo'] || '';
        const dataNascimento = parseDate(row['data_nascimento']);
        const sexo = (row['sexo'] || 'M').charAt(0).toUpperCase(); // Pega primeira letra
        const telefone = String(row['telefone'] || '');
        const bairro = String(row['bairro'] || '').trim();
        const status = (row['situacao_atual'] || 'Ativo').toLowerCase() === 'ativo' ? 'ativo' : 'desligado';
        const batizado = isYes(row['batizado']);
        const membro = isYes(row['membro']);
        const lider = isYes(row['e_lider']);
        const professorEBQ = isYes(row['e_professor_ebq\n'] || row['e_professor_ebq']); // Nota: tem \n no nome
        const conjuge = row['parentesco '] ? String(row['parentesco ']).trim() : null;
        
        if (!nome || nome.length < 2) {
          console.log(`⚠️  Linha ${i + 1}: Nome inválido ("${nome}"), pulando...`);
          continue;
        }
        
        const idade = calculateAge(dataNascimento);
        const faixaEtaria = getAgeGroup(idade);
        const mes = dataNascimento ? dataNascimento.substring(5, 7) : '';
        const id = generateId(); // ✅ Gerar ID único
        
        await pool.query(`
          INSERT INTO membros (
            id, nome, data_nascimento, idade, mes, sexo, telefone, bairro, 
            situacao_atual, batizado, membro, lider, e_professor_ebq, faixa_etaria, conjuge,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        `, [
          id, nome, dataNascimento, idade, mes, sexo, telefone, bairro,
          status, batizado, membro, lider, professorEBQ, faixaEtaria, conjuge
        ]);
        
        imported++;
        
        if (imported % 10 === 0) {
          console.log(`✅ Importados ${imported}/${data.length} registros...`);
        }
        
      } catch (error) {
        errors++;
        console.log(`❌ Erro na linha ${i + 1} (${row['nome']}):`, error.message);
      }
    }
    
    console.log('\n📊 RESUMO DA IMPORTAÇÃO:');
    console.log(`   ✅ Importados: ${imported}`);
    console.log(`   ❌ Erros: ${errors}`);
    console.log(`   📝 Total processado: ${data.length}`);
    
    // Verificar total no banco
    const result = await pool.query('SELECT COUNT(*) as total FROM membros');
    console.log(`\n🐘 Total de membros no PostgreSQL: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Erro ao importar:', error.message);
  } finally {
    await pool.end();
  }
}

importExcelToDatabase();
