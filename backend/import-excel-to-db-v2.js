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

// ✅ FUNÇÃO PARA GERAR ID ÚNICO (Opção 2: Timestamp + Random)
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return (timestamp + random).substring(0, 20);
}

// ✅ FUNÇÃO PARA GERAR ID EXTERNO (referência à linha do Excel)
function generateExternalId(rowNumber) {
  return `EXCEL_LINHA_${rowNumber}`;
}

// Função para normalizar nome (separar nome e sobrenome)
function splitName(fullName) {
  if (!fullName) return { nome: '', sobrenome: '' };
  
  const parts = fullName.trim().split(' ');
  const nome = parts[0] || '';
  const sobrenome = parts.slice(1).join(' ') || '';
  
  return { nome, sobrenome };
}

// Função para calcular idade
function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Função para obter mês por extenso
function getMonthName(date) {
  if (!date) return null;
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const d = new Date(date);
  return months[d.getMonth()];
}

// Função para obter faixa etária
function getAgeGroup(age) {
  if (age === null) return null;
  if (age <= 6) return 'Infância';
  if (age <= 10) return 'Crianças';
  if (age <= 17) return 'Adolescentes';
  if (age <= 35) return 'Jovens';
  if (age <= 59) return 'Adultos';
  return 'Idosos';
}

// Função para parsear data do Excel
function parseDate(dateValue) {
  if (!dateValue) return null;
  
  // Se for número (formato Excel)
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  // Se for string (dd/mm/yyyy)
  if (typeof dateValue === 'string') {
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  
  return null;
}

// Função para converter para booleano
function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'sim' || lower === 's' || lower === 'true' || lower === '1' || lower === 'yes';
  }
  return false;
}

async function importExcel() {
  const client = await pool.connect();
  
  try {
    console.log('\n🚀 INICIANDO IMPORTAÇÃO DO EXCEL PARA POSTGRESQL\n');
    console.log('═'.repeat(80));
    
    // Ler arquivo Excel
    const filePath = path.join(__dirname, '..', 'Excel Membros', 'Cadastro de Membros IBVP.xlsx');
    console.log(`📂 Lendo arquivo: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`✅ ${data.length} registros encontrados no Excel\n`);
    
    // Limpar tabela antes de importar
    console.log('🧹 Limpando tabela membros...');
    await client.query('TRUNCATE TABLE membros CASCADE');
    console.log('✅ Tabela limpa\n');
    
    console.log('📝 Importando dados...\n');
    
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 porque: +1 para índice base-1, +1 para pular header
      
      try {
        // ✅ USAR NOMES EXATOS DAS COLUNAS DO EXCEL (minúsculas!)
        // Separar nome completo em nome e sobrenome
        const { nome, sobrenome } = splitName(row['Nome Completo']);
        const nomeCompleto = row['Nome Completo'] || '';
        
        // Parsear data de nascimento
        const dataNascimento = parseDate(row['data_nascimento']);
        const idade = row['idade'] || calculateAge(dataNascimento);
        const mes = row['mes'] || getMonthName(dataNascimento);
        const faixaEtaria = row['faixa_etaria ']?.trim() || getAgeGroup(idade); // Atenção: tem espaço no final!
        
        // Gerar IDs
        const id = generateId();
        const idExterno = generateExternalId(rowNumber);
        
        // Montar o INSERT
        const query = `
          INSERT INTO membros (
            id, id_externo, nome, sobrenome, nome_completo, 
            data_nascimento, idade, mes, telefone, sexo,
            bairro, batizado, membro, situacao_atual,
            lider, e_professor_ebq, faixa_etaria, conjuge,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14,
            $15, $16, $17, $18,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `;
        
        const values = [
          id,                                    // $1 - id (PK gerado)
          idExterno,                             // $2 - id_externo (referência ao Excel)
          nome,                                  // $3 - nome
          sobrenome,                             // $4 - sobrenome
          nomeCompleto,                          // $5 - nome_completo
          dataNascimento,                        // $6 - data_nascimento
          idade,                                 // $7 - idade
          mes,                                   // $8 - mes
          row['Telefone'] || null,               // $9 - telefone
          row['Sexo'] || null,                   // $10 - sexo
          row['Bairro'] || null,                 // $11 - bairro
          parseBoolean(row['Batizado']),         // $12 - batizado
          parseBoolean(row['Membro']),           // $13 - membro
          row['Status'] || 'ativo',              // $14 - situacao_atual
          parseBoolean(row['É Líder']),          // $15 - lider
          parseBoolean(row['É Professor EBQ']),  // $16 - e_professor_ebq
          faixaEtaria,                           // $17 - faixa_etaria
          row['Cônjuge'] || null                 // $18 - conjuge
        ];
        
        await client.query(query, values);
        
        imported++;
        
        // Mostrar progresso a cada 10 registros
        if (imported % 10 === 0) {
          console.log(`   ✓ ${imported} registros importados...`);
        }
        
      } catch (error) {
        errors++;
        console.log(`   ❌ Erro na linha ${rowNumber}: ${error.message}`);
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ Importação concluída!`);
    console.log(`   📊 Total processados: ${data.length}`);
    console.log(`   ✅ Importados com sucesso: ${imported}`);
    console.log(`   ❌ Erros: ${errors}\n`);
    
    // Mostrar alguns exemplos importados
    const examples = await client.query(`
      SELECT id, id_externo, nome, sobrenome, data_nascimento, idade, situacao_atual
      FROM membros
      ORDER BY id
      LIMIT 5
    `);
    
    console.log('📋 Primeiros 5 registros importados:\n');
    console.log('ID (PK)'.padEnd(22) + 'ID Externo'.padEnd(20) + 'Nome Completo'.padEnd(30) + 'Idade'.padEnd(8) + 'Status');
    console.log('─'.repeat(80));
    
    examples.rows.forEach(r => {
      console.log(
        r.id.padEnd(22) +
        r.id_externo.padEnd(20) +
        `${r.nome} ${r.sobrenome}`.padEnd(30) +
        String(r.idade || '').padEnd(8) +
        r.situacao_atual
      );
    });
    
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Erro durante importação:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar
importExcel();
