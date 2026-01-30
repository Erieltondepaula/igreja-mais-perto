// Script para importar o arquivo específico "Cadastro de Membros IBVP.xlsx"
const XLSX = require('xlsx');
const path = require('path');
const db = require('../config/database');

const excelFilePath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');

async function importIBVPMembers() {
    try {
        console.log('📂 Lendo arquivo Excel IBVP...');
        console.log(`📁 Caminho: ${excelFilePath}`);
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0]; // Primeira aba
        const worksheet = workbook.Sheets[sheetName];
        
        console.log(`📋 Aba encontrada: ${sheetName}`);
        
        // Converter para JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Total de linhas encontradas: ${rawData.length}`);
        console.log('📋 Primeiras 3 linhas do arquivo:');
        rawData.slice(0, 3).forEach((row, index) => {
            console.log(`  Linha ${index + 1}:`, Object.keys(row));
        });
        
        if (rawData.length === 0) {
            console.log('⚠️ Arquivo vazio ou sem dados válidos');
            return;
        }
        
        // Mostrar colunas disponíveis
        console.log('\n📋 Colunas disponíveis no arquivo:');
        Object.keys(rawData[0]).forEach((col, index) => {
            console.log(`  ${index + 1}. ${col}`);
        });
        
        // Conectar ao Access
        console.log('\n🔄 Conectando ao banco Access...');
        await db.connect();
        
        // Limpar dados anteriores
        console.log('🧹 Limpando dados anteriores...');
        await db.query('DELETE FROM Membros');
        
        console.log('\n📤 Iniciando importação...');
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            
            try {
                // Mapear campos do Excel para o banco Access
                // Vamos tentar identificar os campos automaticamente
                const memberData = {
                    nome: row.Nome || row.NOME || row.name || row.Name || 
                          row['Nome Completo'] || row['NOME COMPLETO'] ||
                          Object.values(row)[0], // Primeiro campo se não encontrar
                    
                    dataNascimento: formatDate(row['Data Nascimento'] || row['DATA NASCIMENTO'] || 
                                             row.DataNascimento || row.Nascimento || 
                                             row['Data de Nascimento']),
                    
                    sexo: formatGender(row.Sexo || row.SEXO || row.Gênero || row.GENERO || 
                                     row.Gender || row.género),
                    
                    telefone: row.Telefone || row.TELEFONE || row.Phone || row.Celular || 
                             row.CELULAR || row['Número'] || row.Fone,
                    
                    email: row.Email || row.EMAIL || row['E-mail'] || row['E-MAIL'],
                    
                    endereco: row.Endereço || row.ENDERECO || row.Endereco || row.Address,
                    
                    bairro: row.Bairro || row.BAIRRO,
                    
                    cidade: row.Cidade || row.CIDADE,
                    
                    estado: row.Estado || row.ESTADO || row.UF,
                    
                    cep: row.CEP || row.cep,
                    
                    status: 'ativo', // Default
                    
                    batizado: parseBooleanField(row.Batizado || row.BATIZADO),
                    
                    membro: parseBooleanField(row.Membro || row.MEMBRO)
                };
                
                // Validar dados obrigatórios
                if (!memberData.nome) {
                    console.log(`⚠️ Linha ${i + 1}: Nome não encontrado, pulando...`);
                    errorCount++;
                    continue;
                }
                
                // Inserir no banco
                const sql = `
                    INSERT INTO Membros (
                        Nome, DataNascimento, Sexo, Telefone, Email, Endereco, 
                        Bairro, Cidade, Estado, CEP, Status, Batizado, Membro, 
                        DataCriacao, DataAtualizacao
                    ) VALUES (
                        '${escapeSql(memberData.nome)}', 
                        ${memberData.dataNascimento ? `'${memberData.dataNascimento}'` : 'NULL'}, 
                        '${memberData.sexo}', 
                        '${escapeSql(memberData.telefone)}', 
                        '${escapeSql(memberData.email)}', 
                        '${escapeSql(memberData.endereco)}', 
                        '${escapeSql(memberData.bairro)}', 
                        '${escapeSql(memberData.cidade)}', 
                        '${escapeSql(memberData.estado)}', 
                        '${escapeSql(memberData.cep)}', 
                        '${memberData.status}', 
                        ${memberData.batizado}, 
                        ${memberData.membro}, 
                        Now(), 
                        Now()
                    )
                `;
                
                await db.query(sql);
                successCount++;
                
                if (successCount <= 5 || successCount % 10 === 0) {
                    console.log(`✅ ${successCount}. ${memberData.nome}`);
                }
                
            } catch (error) {
                errorCount++;
                console.log(`❌ Erro na linha ${i + 1}: ${error.message}`);
            }
        }
        
        // Resultado final
        console.log('\n🎉 IMPORTAÇÃO CONCLUÍDA!');
        console.log(`✅ Sucesso: ${successCount} membros`);
        console.log(`❌ Erros: ${errorCount} linhas`);
        
        // Verificar resultado no banco
        const result = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`📊 Total no banco Access: ${result[0].total} membros`);
        
        // Mostrar alguns exemplos
        const examples = await db.query('SELECT TOP 5 ID, Nome, Sexo, Telefone FROM Membros');
        console.log('\n📋 Primeiros membros importados:');
        examples.forEach(m => {
            console.log(`  ${m.ID} - ${m.Nome} (${m.Sexo}) - ${m.Telefone}`);
        });
        
    } catch (error) {
        console.error('❌ Erro na importação:', error);
    }
}

// Funções auxiliares
function formatDate(dateValue) {
    if (!dateValue) return null;
    
    try {
        let date;
        
        if (typeof dateValue === 'number') {
            // Data do Excel (número serial)
            date = XLSX.SSF.parse_date_code(dateValue);
            return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        } else if (typeof dateValue === 'string') {
            // String de data
            date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

function formatGender(genderValue) {
    if (!genderValue) return 'M';
    
    const str = String(genderValue).toLowerCase();
    if (str.includes('f') || str.includes('mulher') || str.includes('feminino')) {
        return 'F';
    }
    return 'M';
}

function parseBooleanField(value) {
    if (value === true || value === 'true' || value === 'TRUE' || value === 'Sim' || value === 'SIM' || value === 1) {
        return true;
    }
    return false;
}

function escapeSql(value) {
    if (!value) return '';
    return String(value).replace(/'/g, "''");
}

// Executar importação
console.log('🚀 IMPORTADOR DE MEMBROS IBVP');
console.log('===============================');
importIBVPMembers();