// Script otimizado para importar o arquivo específico IBVP com mapeamento correto
const XLSX = require('xlsx');
const path = require('path');
const db = require('../config/database');

const excelFilePath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');

async function importIBVPMembersFixed() {
    try {
        console.log('📂 Importando arquivo IBVP com mapeamento correto...');
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        const worksheet = workbook.Sheets['Cadastro de Mebros IBVP'];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Total de registros encontrados: ${rawData.length}`);
        
        // Conectar ao Access
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
                // Mapear campos específicos do IBVP
                const memberData = {
                    nome: (row.nome || row['Nome Completo'] || '').toString().trim(),
                    
                    // Converter data do Excel (número serial) para formato correto
                    dataNascimento: convertExcelDate(row.data_nascimento),
                    
                    // Converter sexo
                    sexo: convertGender(row.sexo),
                    
                    telefone: (row.telefone || '').toString().trim(),
                    
                    // Concatenar endereço completo
                    endereco: buildAddress(row.rua, row.numero),
                    
                    bairro: (row.bairro || '').toString().trim(),
                    cidade: (row.cidade || '').toString().trim(),
                    estado: (row.estado || '').toString().trim(),
                    cep: (row.cep || '').toString().trim(),
                    
                    // Converter status
                    status: convertStatus(row.situacao_atual),
                    
                    // Converter booleanos
                    batizado: convertYesNo(row.batizado),
                    membro: convertYesNo(row.membro),
                    lider: convertYesNo(row.e_lider),
                    professorEBQ: convertYesNo(row['e_professor_ebq\n']),
                    
                    // Outros campos
                    statusCivil: (row.status_civil || '').toString().trim(),
                    conjuge: (row['nome_conjuge '] || '').toString().trim(),
                    parentesco: (row['parentesco '] || '').toString().trim(),
                    grupo: (row.grupo || '').toString().trim(),
                    pequeno_grupo: convertYesNo(row['Está em um pequeno grupo ?']),
                    observacoes: (row.observacoes || '').toString().trim()
                };
                
                // Validar dados obrigatórios
                if (!memberData.nome) {
                    console.log(`⚠️ Linha ${i + 1}: Nome vazio, pulando...`);
                    errorCount++;
                    continue;
                }
                
                if (!memberData.dataNascimento) {
                    console.log(`⚠️ Linha ${i + 1}: Data de nascimento inválida para ${memberData.nome}, usando data padrão...`);
                    memberData.dataNascimento = '1990-01-01'; // Data padrão
                }
                
                // Inserir no banco
                const sql = `
                    INSERT INTO Membros (
                        Nome, NomeCompleto, DataNascimento, Sexo, Telefone, 
                        Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, 
                        Status, StatusCivil, Conjuge, Parentesco, Batizado, 
                        Membro, Lider, ProfessorEBQ, Grupo, PequenoGrupo, 
                        Observacoes, DataCriacao, DataAtualizacao
                    ) VALUES (
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
                    console.log(`✅ ${successCount}. ${memberData.nome} - ${memberData.cidade}`);
                }
                
            } catch (error) {
                errorCount++;
                console.log(`❌ Erro linha ${i + 1} (${row.nome || 'Nome não encontrado'}): ${error.message}`);
                
                if (errorCount <= 5) {
                    console.log(`   Dados da linha:`, JSON.stringify(row, null, 2));
                }
            }
        }
        
        // Resultado final
        console.log('\n🎉 IMPORTAÇÃO CONCLUÍDA!');
        console.log(`✅ Sucesso: ${successCount} membros`);
        console.log(`❌ Erros: ${errorCount} linhas`);
        console.log(`📊 Taxa de sucesso: ${((successCount / rawData.length) * 100).toFixed(1)}%`);
        
        // Verificar resultado no banco
        const result = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`📊 Total no banco Access: ${result[0].total} membros`);
        
        // Estatísticas
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(IIf(Batizado = true, 1, 0)) as batizados,
                SUM(IIf(Membro = true, 1, 0)) as membros,
                SUM(IIf(Sexo = 'M', 1, 0)) as masculino,
                SUM(IIf(Sexo = 'F', 1, 0)) as feminino
            FROM Membros
        `);
        
        const stat = stats[0];
        console.log('\n📈 ESTATÍSTICAS:');
        console.log(`👥 Total: ${stat.total}`);
        console.log(`💒 Batizados: ${stat.batizados}`);
        console.log(`👨‍👩‍👧‍👦 Membros: ${stat.membros}`);
        console.log(`👨 Masculino: ${stat.masculino}`);
        console.log(`👩 Feminino: ${stat.feminino}`);
        
        // Exemplos importados
        const examples = await db.query('SELECT TOP 5 ID, Nome, Cidade, Batizado, Membro FROM Membros ORDER BY ID');
        console.log('\n📋 Primeiros membros importados:');
        examples.forEach(m => {
            console.log(`  ${m.ID} - ${m.Nome} (${m.Cidade}) - Batizado: ${m.Batizado ? 'Sim' : 'Não'} - Membro: ${m.Membro ? 'Sim' : 'Não'}`);
        });
        
    } catch (error) {
        console.error('❌ Erro na importação:', error);
    }
}

// Funções de conversão específicas para o formato IBVP
function convertExcelDate(excelDate) {
    if (!excelDate || isNaN(excelDate)) return null;
    
    try {
        // Data do Excel é um número serial
        const date = XLSX.SSF.parse_date_code(Number(excelDate));
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    } catch (error) {
        return null;
    }
}

function convertGender(sexo) {
    if (!sexo) return 'M';
    const str = sexo.toString().toLowerCase();
    return str.includes('fem') ? 'F' : 'M';
}

function convertStatus(situacao) {
    if (!situacao) return 'ativo';
    const str = situacao.toString().toLowerCase();
    return str.includes('ativ') ? 'ativo' : 'inativo';
}

function convertYesNo(value) {
    if (!value) return false;
    const str = value.toString().toLowerCase();
    return str.includes('sim') || str.includes('yes') || str === 'true';
}

function buildAddress(rua, numero) {
    const ruaStr = (rua || '').toString().trim();
    const numStr = (numero || '').toString().trim();
    
    if (ruaStr && numStr) {
        return `${ruaStr}, ${numStr}`;
    } else if (ruaStr) {
        return ruaStr;
    } else {
        return '';
    }
}

function escapeSql(value) {
    if (!value) return '';
    return String(value).replace(/'/g, "''").substring(0, 255); // Limitar tamanho
}

// Executar importação
console.log('🚀 IMPORTADOR IBVP - VERSÃO OTIMIZADA');
console.log('=====================================');
importIBVPMembersFixed();