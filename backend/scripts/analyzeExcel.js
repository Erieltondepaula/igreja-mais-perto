// Script para analisar a estrutura do arquivo Excel IBVP
const XLSX = require('xlsx');
const path = require('path');

const excelFilePath = path.join(__dirname, '../../Excel Membros/Cadastro de Membros IBVP.xlsx');

function analyzeExcel() {
    try {
        console.log('📂 Analisando arquivo Excel IBVP...');
        console.log(`📁 Caminho: ${excelFilePath}`);
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile(excelFilePath);
        
        console.log('\n📋 Abas disponíveis:');
        workbook.SheetNames.forEach((name, index) => {
            console.log(`  ${index + 1}. ${name}`);
        });
        
        // Analisar primeira aba
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        
        console.log(`\n📊 Analisando aba: ${firstSheet}`);
        
        // Converter para JSON para ver a estrutura
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(`📈 Total de linhas: ${data.length}`);
        
        if (data.length > 0) {
            console.log('\n📋 CABEÇALHOS (Primeira linha):');
            data[0].forEach((header, index) => {
                console.log(`  ${index + 1}. "${header}"`);
            });
            
            if (data.length > 1) {
                console.log('\n📝 EXEMPLO DE DADOS (Segunda linha):');
                data[1].forEach((value, index) => {
                    const header = data[0][index] || `Coluna ${index + 1}`;
                    console.log(`  ${header}: "${value}"`);
                });
            }
            
            if (data.length > 2) {
                console.log('\n📝 EXEMPLO DE DADOS (Terceira linha):');
                data[2].forEach((value, index) => {
                    const header = data[0][index] || `Coluna ${index + 1}`;
                    console.log(`  ${header}: "${value}"`);
                });
            }
        }
        
        // Converter com headers automáticos
        const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet);
        
        if (dataWithHeaders.length > 0) {
            console.log('\n🔍 MAPEAMENTO AUTOMÁTICO (Primeiras 2 linhas):');
            dataWithHeaders.slice(0, 2).forEach((row, index) => {
                console.log(`\n📋 Linha ${index + 1}:`);
                Object.keys(row).forEach(key => {
                    console.log(`  "${key}": "${row[key]}"`);
                });
            });
        }
        
        // Sugestões de mapeamento
        console.log('\n🎯 SUGESTÕES DE MAPEAMENTO:');
        console.log('Procure por colunas que podem ser:');
        console.log('  📝 Nome: Nome, NOME, Nome Completo, Name');
        console.log('  📅 Data Nascimento: Data Nascimento, DataNascimento, Nascimento, Data de Nascimento');
        console.log('  👤 Sexo/Gênero: Sexo, SEXO, Gênero, Gender, M/F');
        console.log('  📞 Telefone: Telefone, TELEFONE, Celular, Phone, Fone');
        console.log('  📧 Email: Email, E-mail, EMAIL');
        console.log('  🏠 Endereço: Endereço, ENDERECO, Address');
        console.log('  🌍 Bairro: Bairro, BAIRRO');
        console.log('  🏙️ Cidade: Cidade, CIDADE');
        console.log('  🗺️ Estado: Estado, ESTADO, UF');
        console.log('  💒 Batizado: Batizado, BATIZADO, Batismo');
        console.log('  👨‍👩‍👧‍👦 Membro: Membro, MEMBRO, Membresia');
        
    } catch (error) {
        console.error('❌ Erro ao analisar arquivo:', error.message);
    }
}

analyzeExcel();