// Local do arquivo: backend/scripts/excelToAccess.js
// Script para importar dados diretamente do Excel para o Microsoft Access

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const accessDB = require('../config/database');

class ExcelToAccessImporter {
  
  constructor() {
    this.excelFolder = path.join(__dirname, '../../Excel Membros');
    this.logFile = path.join(__dirname, '../logs/import.log');
  }

  // ===================================
  // BUSCAR ARQUIVOS EXCEL NA PASTA
  // ===================================
  findExcelFiles() {
    try {
      if (!fs.existsSync(this.excelFolder)) {
        console.error(`❌ Pasta não encontrada: ${this.excelFolder}`);
        return [];
      }

      const files = fs.readdirSync(this.excelFolder)
        .filter(file => file.match(/\.(xlsx|xls)$/i))
        .map(file => path.join(this.excelFolder, file));

      console.log(`📁 Encontrados ${files.length} arquivos Excel`);
      return files;
    } catch (error) {
      console.error('❌ Erro ao buscar arquivos Excel:', error);
      return [];
    }
  }

  // ===================================
  // PROCESSAR ARQUIVO EXCEL
  // ===================================
  async processExcelFile(filePath) {
    try {
      console.log(`\n📄 Processando: ${path.basename(filePath)}`);
      
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      
      if (jsonData.length === 0) {
        console.warn('⚠️ Arquivo vazio ou sem dados');
        return { success: 0, errors: 0 };
      }

      console.log(`📊 Encontradas ${jsonData.length} linhas de dados`);
      
      // Processar cada linha
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < jsonData.length; i++) {
        try {
          const rowData = this.normalizeRowData(jsonData[i], i + 2); // +2 porque linha 1 é header
          
          if (rowData) {
            await this.insertMemberIntoAccess(rowData);
            successCount++;
            
            if (successCount % 10 === 0) {
              console.log(`✅ Processadas ${successCount} linhas...`);
            }
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Erro na linha ${i + 2}: ${error.message}`);
          this.logError(filePath, i + 2, error.message, jsonData[i]);
        }
      }

      console.log(`\n📈 Resumo do arquivo ${path.basename(filePath)}:`);
      console.log(`✅ Sucessos: ${successCount}`);
      console.log(`❌ Erros: ${errorCount}`);
      
      return { success: successCount, errors: errorCount };
      
    } catch (error) {
      console.error(`❌ Erro ao processar arquivo ${filePath}:`, error);
      return { success: 0, errors: 1 };
    }
  }

  // ===================================
  // NORMALIZAR DADOS DA LINHA
  // ===================================
  normalizeRowData(row, lineNumber) {
    try {
      // Mapear colunas (ajustar conforme sua planilha)
      const normalizedData = {
        nome: this.getString(row['Nome'] || row['NOME']),
        nomeCompleto: this.getString(row['Nome Completo'] || row['NOME_COMPLETO']),
        dataNascimento: this.parseDate(row['Data de Nascimento'] || row['DATA_NASCIMENTO']),
        sexo: this.parseSexo(row['Sexo'] || row['SEXO']),
        telefone: this.getString(row['Telefone'] || row['TELEFONE']),
        email: this.getString(row['Email'] || row['EMAIL']),
        endereco: this.getString(row['Endereço'] || row['ENDERECO']),
        rua: this.getString(row['Rua'] || row['RUA']),
        numero: this.getString(row['Número'] || row['NUMERO']),
        bairro: this.getString(row['Bairro'] || row['BAIRRO']),
        cidade: this.getString(row['Cidade'] || row['CIDADE']),
        estado: this.getString(row['Estado'] || row['ESTADO']),
        cep: this.getString(row['CEP'] || row['CEP']),
        status: this.parseStatus(row['Status'] || row['Situação Atual']),
        statusCivil: this.getString(row['Estado Civil'] || row['STATUS_CIVIL']),
        conjuge: this.getString(row['Cônjuge'] || row['CONJUGE']),
        batizado: this.parseBoolean(row['Batizado'] || row['BATIZADO']),
        membro: this.parseBoolean(row['Membro'] || row['MEMBRO']),
        lider: this.parseBoolean(row['É Líder?'] || row['E_LIDER']),
        professorEBQ: this.parseBoolean(row['É Professor EBQ?'] || row['E_PROFESSOR_EBQ']),
        pequeno_grupo: this.parseBoolean(row['Pequeno Grupo'] || row['PEQUENO_GRUPO']),
        grupo: this.getString(row['Grupo'] || row['GRUPO']),
        observacoes: this.getString(row['Observações'] || row['OBSERVACOES'])
      };

      // Validar dados obrigatórios
      if (!normalizedData.nome || !normalizedData.dataNascimento || !normalizedData.sexo) {
        throw new Error('Dados obrigatórios não encontrados (Nome, Data Nascimento, Sexo)');
      }

      return normalizedData;
      
    } catch (error) {
      console.error(`❌ Erro ao normalizar linha ${lineNumber}:`, error.message);
      return null;
    }
  }

  // ===================================
  // UTILITÁRIOS DE CONVERSÃO
  // ===================================
  getString(value) {
    return value ? String(value).trim() : null;
  }

  parseDate(value) {
    if (!value) return null;
    
    try {
      // Tentar diferentes formatos
      let date;
      
      if (typeof value === 'number') {
        // Excel serial date
        date = XLSX.SSF.parse_date_code(value);
        return date ? `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}` : null;
      }
      
      const dateStr = String(value).trim();
      
      // Formato brasileiro DD/MM/YYYY
      const brMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (brMatch) {
        const [_, day, month, year] = brMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Formato ISO YYYY-MM-DD
      const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (isoMatch) {
        const [_, year, month, day] = isoMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  parseSexo(value) {
    if (!value) return null;
    const sexo = String(value).trim().toUpperCase();
    return sexo === 'M' || sexo === 'MASCULINO' || sexo === 'HOMEM' ? 'M' : 
           sexo === 'F' || sexo === 'FEMININO' || sexo === 'MULHER' ? 'F' : null;
  }

  parseStatus(value) {
    if (!value) return 'ativo';
    const status = String(value).trim().toLowerCase();
    return status.includes('desligado') || status.includes('inativo') ? 'desligado' : 'ativo';
  }

  parseBoolean(value) {
    if (!value) return false;
    const str = String(value).trim().toLowerCase();
    return ['sim', 's', 'true', '1', 'yes', 'y'].includes(str);
  }

  // ===================================
  // INSERIR NO ACCESS
  // ===================================
  async insertMemberIntoAccess(memberData) {
    const sql = `
      INSERT INTO Membros (
        Nome, NomeCompleto, DataNascimento, Sexo, Telefone, Email, Endereco, 
        Rua, Numero, Bairro, Cidade, Estado, CEP, Status, StatusCivil, Conjuge,
        Batizado, Membro, Lider, ProfessorEBQ, PequenoGrupo, Grupo, Observacoes,
        DataCriacao, DataAtualizacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, Now(), Now())
    `;

    const params = [
      memberData.nome,
      memberData.nomeCompleto,
      memberData.dataNascimento,
      memberData.sexo,
      memberData.telefone,
      memberData.email,
      memberData.endereco,
      memberData.rua,
      memberData.numero,
      memberData.bairro,
      memberData.cidade,
      memberData.estado,
      memberData.cep,
      memberData.status,
      memberData.statusCivil,
      memberData.conjuge,
      memberData.batizado,
      memberData.membro,
      memberData.lider,
      memberData.professorEBQ,
      memberData.pequeno_grupo,
      memberData.grupo,
      memberData.observacoes
    ];

    await accessDB.execute(sql, params);
  }

  // ===================================
  // LOG DE ERROS
  // ===================================
  logError(fileName, lineNumber, error, rowData) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      file: path.basename(fileName),
      line: lineNumber,
      error: error,
      data: rowData
    };

    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }

  // ===================================
  // EXECUTAR IMPORTAÇÃO COMPLETA
  // ===================================
  async runImport(options = {}) {
    try {
      console.log('🚀 Iniciando importação Excel → Access');
      
      // Conectar ao Access
      await accessDB.connect();
      
      // Limpar tabela se solicitado
      if (options.clearTable) {
        console.log('🗑️ Limpando tabela Membros...');
        await accessDB.execute('DELETE FROM Membros');
        console.log('✅ Tabela limpa!');
      }
      
      // Buscar arquivos Excel
      const excelFiles = this.findExcelFiles();
      
      if (excelFiles.length === 0) {
        console.log('❌ Nenhum arquivo Excel encontrado!');
        return;
      }
      
      let totalSuccess = 0;
      let totalErrors = 0;
      
      // Processar cada arquivo
      for (const file of excelFiles) {
        const result = await this.processExcelFile(file);
        totalSuccess += result.success;
        totalErrors += result.errors;
      }
      
      console.log('\n📊 RESUMO GERAL:');
      console.log(`✅ Total de sucessos: ${totalSuccess}`);
      console.log(`❌ Total de erros: ${totalErrors}`);
      console.log(`📁 Arquivos processados: ${excelFiles.length}`);
      
      if (totalErrors > 0) {
        console.log(`📄 Log de erros salvo em: ${this.logFile}`);
      }
      
      return { success: totalSuccess, errors: totalErrors, files: excelFiles.length };
      
    } catch (error) {
      console.error('❌ Erro crítico na importação:', error);
      throw error;
    }
  }
}

// ===================================
// EXECUTAR SE CHAMADO DIRETAMENTE
// ===================================
if (require.main === module) {
  const importer = new ExcelToAccessImporter();
  
  // Opções da linha de comando
  const args = process.argv.slice(2);
  const clearTable = args.includes('--clear');
  
  importer.runImport({ clearTable })
    .then(result => {
      console.log('✅ Importação concluída com sucesso!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Importação falhou:', error);
      process.exit(1);
    });
}

module.exports = ExcelToAccessImporter;