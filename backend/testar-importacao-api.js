const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testarImportacaoCompleta() {
  try {
    console.log('\n🧪 TESTANDO IMPORTAÇÃO COMPLETA VIA API\n');
    console.log('═'.repeat(80));
    
    const caminhoArquivo = path.join(__dirname, '../Excel Membros/Cadastro de Membros IBVP.xlsx');
    
    if (!fs.existsSync(caminhoArquivo)) {
      console.error('❌ Arquivo Excel não encontrado:', caminhoArquivo);
      return;
    }
    
    console.log('📁 Arquivo encontrado:', caminhoArquivo);
    console.log('📊 Enviando para API...\n');
    
    const formData = new FormData();
    formData.append('arquivo', fs.createReadStream(caminhoArquivo));
    
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://localhost:5000/api/importacao/importar-completo', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });
    
    const resultado = await response.json();
    
    console.log('═'.repeat(80));
    console.log('📊 RESULTADO DA IMPORTAÇÃO:\n');
    
    if (resultado.sucesso) {
      console.log('✅ Status: SUCESSO\n');
      console.log('📈 Estatísticas:');
      console.log(`   Total de linhas: ${resultado.estatisticas.totalLinhas}`);
      console.log(`   ✅ Criados: ${resultado.estatisticas.criados}`);
      console.log(`   ⏭️  Pulados: ${resultado.estatisticas.pulados}`);
      console.log(`   ❌ Erros: ${resultado.estatisticas.erros}`);
      console.log(`   📊 Total final no banco: ${resultado.estatisticas.totalFinal}`);
      
      if (resultado.detalhes && resultado.detalhes.length > 0) {
        console.log('\n⚠️  Detalhes de erros:');
        resultado.detalhes.forEach(d => {
          console.log(`   Linha ${d.linha}: ${d.erro}`);
        });
      }
    } else {
      console.log('❌ Status: ERRO\n');
      console.log('Erro:', resultado.erro);
    }
    
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testarImportacaoCompleta();
