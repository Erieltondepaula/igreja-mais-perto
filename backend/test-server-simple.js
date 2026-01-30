const express = require('express');
const cors = require('cors');
const db = require('./config/postgresql');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/members', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM membros LIMIT 10');
    res.json(result);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5001;

async function start() {
  try {
    console.log('1. Conectando...');
    await db.connect();
    console.log('2. Conectado!');
    
    console.log('3. Iniciando servidor...');
    app.listen(PORT, () => {
      console.log(`4. Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  }
}

start();
