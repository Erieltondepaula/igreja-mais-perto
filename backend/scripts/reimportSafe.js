// Script seguro para reimportar com IDs personalizados usando tabela temporária
const XLSX = require('xlsx');
const path = require('path');
const db = require('../config/database');

const excelFilePath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');

async function reimportWithCustomIDsSafe() {
    try {
        console.log('🚀 REIMPORTAÇÃO SEGURA COM IDs PERSONALIZADOS');
        console.log('===========================================');
        console.log('📋 Formato: [PrimeiraLetraNome][PrimeiraLetraSobrenome][AAAAMMDDHHMMSS]');
        console.log('📋 Exemplo: ABNER ABADIS LIMA → AA20253010104302');
        console.log('');
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        const worksheet = workbook.Sheets['Cadastro de Mebros IBVP'];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Total de registros: ${rawData.length}`);
        
        // Conectar ao Access
        await db.connect();
        
        // 1. Criar tabela temporária
        console.log('🏗️ Criando tabela temporária...');
        try {
            await db.query('DROP TABLE TempMembros');
        } catch (error) {
            // Ignorar se não existir
        }
        
        const createTempTableSQL = `
            CREATE TABLE TempMembros (
              ID TEXT(20) PRIMARY KEY,
              Nome TEXT(100) NOT NULL,
              NomeCompleto TEXT(200),
              DataNascimento DATE NOT NULL,
              Sexo TEXT(1) NOT NULL,
              Telefone TEXT(20),
              Email TEXT(100),
              Endereco TEXT(255),
              Rua TEXT(150),
              Numero TEXT(10),
              Bairro TEXT(100),
              Cidade TEXT(100),
              Estado TEXT(50),
              CEP TEXT(10),
              Status TEXT(20),
              StatusCivil TEXT(20),
              Conjuge TEXT(100),
              Parentesco TEXT(50),
              Batizado YESNO,
              Membro YESNO,
              Lider YESNO,
              ProfessorEBQ YESNO,
              Grupo TEXT(100),
              PequenoGrupo YESNO,
              Observacoes MEMO,
              DataCriacao DATE,
              DataAtualizacao DATE
            )
        `;
        await db.query(createTempTableSQL);
        console.log('✅ Tabela temporária criada!');
        
        // 2. Importar dados na tabela temporária
        console.log('📤 Importando dados na tabela temporária...');
        let successCount = 0;
        let errorCount = 0;
        const usedIDs = new Set();
        
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            
            try {
                const nome = (row.nome || row['Nome Completo'] || '').toString().trim();
                
                if (!nome) {
                    errorCount++;
                    continue;
                }
                
                // Gerar timestamp único
                const now = new Date();
                now.setMilliseconds(now.getMilliseconds() + i);
                
                // Gerar ID personalizado
                let customID = generateCustomID(nome, now);
                
                // Garantir unicidade
                let counter = 0;
                while (usedIDs.has(customID)) {
                    counter++;
                    const newTime = new Date(now.getTime() + (counter * 1000));
                    customID = generateCustomID(nome, newTime);
                }
                usedIDs.add(customID);
                
                // Mapear dados
                const memberData = {
                    id: customID,
                    nome: nome,
                    dataNascimento: convertExcelDate(row.data_nascimento) || '1990-01-01',
                    sexo: convertGender(row.sexo),
                    telefone: (row.telefone || '').toString().trim(),
                    endereco: buildAddress(row.rua, row.numero),
                    bairro: (row.bairro || '').toString().trim(),
                    cidade: (row.cidade || '').toString().trim(),
                    estado: (row.estado || '').toString().trim(),
                    cep: (row.cep || '').toString().trim(),
                    status: convertStatus(row.situacao_atual),
                    batizado: convertYesNo(row.batizado),
                    membro: convertYesNo(row.membro),
                    lider: convertYesNo(row.e_lider),
                    professorEBQ: convertYesNo(row['e_professor_ebq\n']),
                    statusCivil: (row.status_civil || '').toString().trim(),
                    conjuge: (row['nome_conjuge '] || '').toString().trim(),
                    parentesco: (row['parentesco '] || '').toString().trim(),
                    grupo: (row.grupo || '').toString().trim(),
                    pequeno_grupo: convertYesNo(row['Está em um pequeno grupo ?']),
                    observacoes: (row.observacoes || '').toString().trim()
                };
                
                // Inserir na tabela temporária
                const sql = `
                    INSERT INTO TempMembros (
                        ID, Nome, NomeCompleto, DataNascimento, Sexo, Telefone, 
                        Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, 
                        Status, StatusCivil, Conjuge, Parentesco, Batizado, 
                        Membro, Lider, ProfessorEBQ, Grupo, PequenoGrupo, 
                        Observacoes, DataCriacao, DataAtualizacao
                    ) VALUES (
                        '${memberData.id}', 
                        '${escapeSql(memberData.nome)}', 
                        '${escapeSql(memberData.nome)}', 
                        '${memberData.dataNascimento}', 
                        '${memberData.sexo}', 
                        '${escapeSql(memberData.telefone)}', 
                        '${escapeSql(memberData.endereco)}', 
                        '${escapeSql(row.rua || '')}', 
                        '${escapeSql(row.numero || '')}', 
                        '${escapeSql(memberData.bairro)}', 
                        '${escapeSql(memberData.cidade)}', 
                        '${escapeSql(memberData.estado)}', 
                        '${escapeSql(memberData.cep)}', 
                        '${memberData.status}', 
                        '${escapeSql(memberData.statusCivil)}', 
                        '${escapeSql(memberData.conjuge)}', 
                        '${escapeSql(memberData.parentesco)}', 
                        ${memberData.batizado}, 
                        ${memberData.membro}, 
                        ${memberData.lider}, 
                        ${memberData.professorEBQ}, 
                        '${escapeSql(memberData.grupo)}', 
                        ${memberData.pequeno_grupo}, 
                        '${escapeSql(memberData.observacoes)}', 
                        Now(), 
                        Now()
                    )
                `;
                
                await db.query(sql);
                successCount++;
                
                if (successCount <= 10 || successCount % 20 === 0) {
                    console.log(`✅ ${successCount}. ${memberData.id} ← ${memberData.nome}`);
                }
                
            } catch (error) {
                errorCount++;
                console.log(`❌ Erro linha ${i + 1}: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Importação na tabela temporária concluída:`);
        console.log(`✅ Sucessos: ${successCount}`);
        console.log(`❌ Erros: ${errorCount}`);
        
        // 3. Verificar dados na tabela temporária
        const tempCount = await db.query('SELECT COUNT(*) as total FROM TempMembros');
        console.log(`📋 Total na tabela temporária: ${tempCount[0].total}`);
        
        // 4. Mostrar exemplos dos IDs gerados
        const examples = await db.query('SELECT TOP 10 ID, Nome FROM TempMembros ORDER BY DataCriacao');
        console.log('\n📋 EXEMPLOS DE IDs GERADOS:');
        examples.forEach(m => {
            console.log(`  ${m.ID} ← ${m.Nome}`);
        });
        
        // 5. Instruções para finalizar
        console.log('\n📝 PRÓXIMOS PASSOS:');
        console.log('1. ✅ Dados importados na tabela TempMembros');
        console.log('2. 🛑 Pare o backend/frontend');
        console.log('3. 🔄 Execute o script de migração final');
        console.log('4. 🚀 Reinicie o sistema');
        
        console.log('\n💡 COMANDOS PARA FINALIZAR:');
        console.log('   node scripts/finalizeMigration.js');
        
    } catch (error) {
        console.error('❌ Erro na reimportação:', error);
    }
}

// Função para gerar ID personalizado
function generateCustomID(nomeCompleto, timestamp) {
    try {
        const partesNome = nomeCompleto.trim().toUpperCase().split(/\s+/);
        
        // Primeira letra do primeiro nome
        const primeiraLetra = partesNome[0] ? partesNome[0].charAt(0) : 'X';
        
        // Primeira letra do segundo nome (sobrenome) 
        let segundaLetra = 'X';
        if (partesNome.length > 1 && partesNome[1]) {
            segundaLetra = partesNome[1].charAt(0);
        } else if (partesNome[0] && partesNome[0].length > 1) {
            segundaLetra = partesNome[0].charAt(1);
        }
        
        // Formatação: AAAAMMDDHHMMSS
        const ano = timestamp.getFullYear();
        const mes = String(timestamp.getMonth() + 1).padStart(2, '0');
        const dia = String(timestamp.getDate()).padStart(2, '0');
        const hora = String(timestamp.getHours()).padStart(2, '0');
        const minuto = String(timestamp.getMinutes()).padStart(2, '0');
        const segundo = String(timestamp.getSeconds()).padStart(2, '0');
        
        return `${primeiraLetra}${segundaLetra}${ano}${mes}${dia}${hora}${minuto}${segundo}`;
        
    } catch (error) {
        const now = new Date();
        return `XX${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }
}

// Funções auxiliares
function convertExcelDate(excelDate) {
    if (!excelDate || isNaN(excelDate)) return null;
    try {
        const date = XLSX.SSF.parse_date_code(Number(excelDate));
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    } catch (error) {
        return null;
    }
}

function convertGender(sexo) {
    if (!sexo) return 'M';
    return sexo.toString().toLowerCase().includes('fem') ? 'F' : 'M';
}

function convertStatus(situacao) {
    if (!situacao) return 'ativo';
    return situacao.toString().toLowerCase().includes('ativ') ? 'ativo' : 'inativo';
}

function convertYesNo(value) {
    if (!value) return false;
    return value.toString().toLowerCase().includes('sim');
}

function buildAddress(rua, numero) {
    const ruaStr = (rua || '').toString().trim();
    const numStr = (numero || '').toString().trim();
    return ruaStr && numStr ? `${ruaStr}, ${numStr}` : ruaStr || '';
}

function escapeSql(value) {
    if (!value) return '';
    return String(value).replace(/'/g, "''").substring(0, 255);
}

// Executar
reimportWithCustomIDsSafe();