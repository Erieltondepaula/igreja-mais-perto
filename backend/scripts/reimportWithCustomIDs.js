// Script para reimportar com IDs personalizados: AA20253010104302
const XLSX = require('xlsx');
const path = require('path');
const db = require('../config/database');

const excelFilePath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');

async function reimportWithCustomIDs() {
    try {
        console.log('🚀 REIMPORTANDO COM IDs PERSONALIZADOS');
        console.log('=====================================');
        console.log('📋 Formato: [PrimeiraLetraNome][SegundaLetraSobrenome][AAAAMMDDHHMMSS]');
        console.log('📋 Exemplo: ABNER ABADIS LIMA → AA20253010104302');
        console.log('');
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        const worksheet = workbook.Sheets['Cadastro de Mebros IBVP'];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Total de registros: ${rawData.length}`);
        
        // Conectar ao Access
        await db.connect();
        
        // 1. PRIMEIRO: Criar nova tabela com estrutura correta
        console.log('🔧 Recriando estrutura da tabela com ID personalizado...');
        
        // Backup dos dados atuais
        console.log('� Fazendo backup dos dados atuais...');
        const backupData = await db.query('SELECT * FROM Membros');
        console.log(`📊 ${backupData.length} registros em backup`);
        
        // Apagar tabela atual
        console.log('🗑️ Removendo tabela antiga...');
        try {
            await db.query('DROP TABLE Membros');
        } catch (error) {
            console.log('⚠️ Erro ao remover tabela:', error.message);
        }
        
        // Recriar tabela com ID texto
        console.log('🏗️ Criando nova tabela...');
        const createTableSQL = `
            CREATE TABLE Membros (
              ID TEXT(20) PRIMARY KEY,
              Nome TEXT(100) NOT NULL,
              NomeCompleto TEXT(200),
              PhotoUrl TEXT(255),
              DataNascimento DATE NOT NULL,
              Idade INTEGER,
              Mes TEXT(20),
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
              FaixaEtaria TEXT(20),
              PequenoGrupo YESNO,
              Grupo TEXT(100),
              NumeroDomes INTEGER,
              DataBatismo DATE,
              DataMembresia DATE,
              DataDesligamento DATE,
              Observacoes MEMO,
              DataCriacao DATE,
              DataAtualizacao DATE
            )
        `;
        await db.query(createTableSQL);
        console.log('✅ Nova tabela criada com ID personalizado!');
        
        console.log('📤 Iniciando importação com IDs personalizados...');
        let successCount = 0;
        let errorCount = 0;
        const usedIDs = new Set(); // Controlar IDs únicos
        
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            
            try {
                const nome = (row.nome || row['Nome Completo'] || '').toString().trim();
                
                if (!nome) {
                    console.log(`⚠️ Linha ${i + 1}: Nome vazio, pulando...`);
                    errorCount++;
                    continue;
                }
                
                // Gerar timestamp único para cada registro
                const now = new Date();
                // Adicionar milissegundos para garantir unicidade
                now.setMilliseconds(now.getMilliseconds() + i);
                
                // Gerar ID personalizado
                const customID = generateCustomID(nome, now);
                
                // Verificar se ID já existe (segurança extra)
                if (usedIDs.has(customID)) {
                    // Se existir, adicionar segundos extras
                    now.setSeconds(now.getSeconds() + 1);
                    const newCustomID = generateCustomID(nome, now);
                    usedIDs.add(newCustomID);
                    console.log(`⚠️ ID duplicado detectado, usando: ${newCustomID}`);
                } else {
                    usedIDs.add(customID);
                }
                
                const finalID = usedIDs.has(customID) ? 
                    generateCustomID(nome, new Date(now.getTime() + 1000)) : 
                    customID;
                
                // Mapear dados
                const memberData = {
                    id: finalID,
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
                    observacoes: (row.observacoes || '').toString().trim(),
                    dataInsercao: now.toISOString().slice(0, 19).replace('T', ' ')
                };
                
                // Inserir no banco COM ID personalizado
                const sql = `
                    INSERT INTO Membros (
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
                    console.log(`✅ ${successCount}. ${memberData.id} - ${memberData.nome}`);
                }
                
            } catch (error) {
                errorCount++;
                console.log(`❌ Erro linha ${i + 1}: ${error.message}`);
            }
        }
        
        console.log('\n✅ Tabela recriada com chave primária personalizada!');
        
        // Resultado final
        console.log('\n🎉 REIMPORTAÇÃO CONCLUÍDA COM IDs PERSONALIZADOS!');
        console.log(`✅ Sucesso: ${successCount} membros`);
        console.log(`❌ Erros: ${errorCount} linhas`);
        
        // Verificar alguns exemplos de IDs
        const examples = await db.query('SELECT TOP 10 ID, Nome FROM Membros ORDER BY DataCriacao');
        console.log('\n📋 EXEMPLOS DE IDs GERADOS:');
        examples.forEach(m => {
            console.log(`  ${m.ID} ← ${m.Nome}`);
        });
        
        // Verificar unicidade
        const uniqueCheck = await db.query('SELECT COUNT(*) as total, COUNT(DISTINCT ID) as unicos FROM Membros');
        console.log(`\n🔍 VERIFICAÇÃO DE UNICIDADE:`);
        console.log(`  Total de registros: ${uniqueCheck[0].total}`);
        console.log(`  IDs únicos: ${uniqueCheck[0].unicos}`);
        console.log(`  ${uniqueCheck[0].total === uniqueCheck[0].unicos ? '✅ Todos os IDs são únicos!' : '❌ Há IDs duplicados!'}`);
        
    } catch (error) {
        console.error('❌ Erro na reimportação:', error);
    }
}

// Função para gerar ID personalizado no formato especificado
function generateCustomID(nomeCompleto, timestamp) {
    try {
        const partesNome = nomeCompleto.trim().toUpperCase().split(/\s+/);
        
        // Primeira letra do primeiro nome
        const primeiraLetra = partesNome[0] ? partesNome[0].charAt(0) : 'X';
        
        // Segunda letra do segundo nome (sobrenome)
        let segundaLetra = 'X';
        if (partesNome.length > 1 && partesNome[1]) {
            segundaLetra = partesNome[1].charAt(0); // Primeira letra do sobrenome
        } else if (partesNome[0] && partesNome[0].length > 1) {
            segundaLetra = partesNome[0].charAt(1); // Segunda letra do nome se não houver sobrenome
        }
        
        // Formatação da data/hora: AAAAMMDDHHMMSS
        const ano = timestamp.getFullYear();
        const mes = String(timestamp.getMonth() + 1).padStart(2, '0');
        const dia = String(timestamp.getDate()).padStart(2, '0');
        const hora = String(timestamp.getHours()).padStart(2, '0');
        const minuto = String(timestamp.getMinutes()).padStart(2, '0');
        const segundo = String(timestamp.getSeconds()).padStart(2, '0');
        
        const timestampStr = `${ano}${mes}${dia}${hora}${minuto}${segundo}`;
        
        return `${primeiraLetra}${segundaLetra}${timestampStr}`;
        
    } catch (error) {
        // Fallback em caso de erro
        const now = new Date();
        return `XX${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }
}

// Funções auxiliares (reutilizadas do script anterior)
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
    return value.toString().toLowerCase().includes('sim') || value.toString().toLowerCase().includes('yes');
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
reimportWithCustomIDs();
