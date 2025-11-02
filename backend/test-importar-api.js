// Teste simples para rota /api/importar
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testarImportarArquivo(filePath) {
  const form = new FormData();
  form.append('arquivo', fs.createReadStream(filePath));
  try {
    const response = await axios.post('http://localhost:5001/api/importar', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    console.log(`✅ Sucesso (${filePath}):`, response.data);
  } catch (err) {
    if (err.response) {
      console.error(`❌ Erro (${filePath}):`, err.response.status, err.response.data);
    } else {
      console.error(`❌ Erro (${filePath}):`, err.message);
    }
  }
}

async function testarImportar() {
  await testarImportarArquivo('./Excel Membros/Cadastro de Membros IBVP.xlsx');
  // Se existir um arquivo exemplo .xls, teste também
  if (fs.existsSync('./exemplo-importacao.xls')) {
    await testarImportarArquivo('./exemplo-importacao.xls');
  } else {
    console.log('⚠️ Arquivo exemplo-importacao.xls não encontrado, teste apenas com CSV.');
  }
}

testarImportar();
