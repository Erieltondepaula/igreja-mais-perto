// Script para analisar TODAS as colunas do Excel IBVP
const XLSX = require('xlsx');
const path = require('path');

function analyzeExcelStructure() {
  try {
    console.log('🔍 ANALISANDO ESTRUTURA COMPLETA DO EXCEL IBVP');
    console.log('================================================');
    
    const excelPath = 'C:\\Users\\eriel\\OneDrive - MSFT\\Dashboard_Membros\\Excel Membros\\Cadastro de Membros IBVP.xlsx';
    console.log(`📂 Arquivo: ${excelPath}`);
    
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    console.log(`📄 Planilha: ${sheetName}`);
    
    // Converter para JSON para análise
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`📊 Total de registros: ${data.length}`);
    
    if (data.length > 0) {
      const firstRow = data[0];
      console.log('\n📋 TODAS AS COLUNAS ENCONTRADAS NO EXCEL:');
      console.log('==========================================');
      
      const columns = Object.keys(firstRow);
      columns.forEach((col, index) => {
        const value = firstRow[col];
        const type = typeof value;
        console.log(`${String(index + 1).padStart(2, '0')}. ${col} (${type})`);
        if (value !== null && value !== undefined && value !== '') {
          console.log(`    Exemplo: "${value}"`);
        }
        console.log('');
      });
      
      console.log(`📊 TOTAL DE COLUNAS: ${columns.length}`);
      
      // Mostrar alguns exemplos de dados
      console.log('\n📋 PRIMEIROS 3 REGISTROS COMPLETOS:');
      console.log('===================================');
      data.slice(0, 3).forEach((row, index) => {
        console.log(`\n--- REGISTRO ${index + 1}: ${row.NOME || row.Nome} ---`);
        Object.keys(row).forEach(key => {
          if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
            console.log(`  ${key}: ${row[key]}`);
          }
        });
      });
    }
    
    console.log('\n✅ Análise concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao analisar Excel:', error);
  }
}

analyzeExcelStructure();