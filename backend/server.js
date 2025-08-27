// Local do arquivo: backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Member = require('./models/Member');

const app = express();

// Configuração do CORS para permitir a comunicação com o front-end
const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 

// Conectar ao Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Falha ao conectar com o MongoDB:', err));


// --- ROTAS DA API ---

// Rota para buscar TODOS os membros
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find({}).sort({ nome: 1 });
    res.json(members);
  } catch (error) {
    console.error("❌ Erro ao buscar membros:", error);
    res.status(500).json({ message: 'Erro ao buscar membros.' });
  }
});

// Rota para ATUALIZAR um membro
app.put('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await Member.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMember) {
        return res.status(404).json({ message: 'Membro não encontrado.' });
    }
    res.json(updatedMember);
  } catch (error) {
    console.error(`❌ Erro ao atualizar membro ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar membro.' });
  }
});

// Rota para ADICIONAR ou SUBSTITUIR membros em massa
app.post('/api/members/batch', async (req, res) => {
  console.log("➡️ [LOG] Recebida requisição em /api/members/batch");
  const { members, replaceAll } = req.body;

  if (!members || !Array.isArray(members)) {
    console.error("❌ [ERRO] 'members' não é um array ou não foi fornecido.");
    return res.status(400).json({ message: "Formato de dados inválido." });
  }
  
  console.log(`➡️ [LOG] Recebidos ${members.length} membros. Substituir todos: ${replaceAll}`);

  try {
    if (replaceAll) {
      console.log("➡️ [LOG] Deletando todos os membros existentes...");
      await Member.deleteMany({});
      console.log("✅ [LOG] Membros deletados.");
    }
    
    const validMembers = members.filter(m => m && m.nome);
    const membersToInsert = validMembers.map(({ id, ...rest }) => rest);

    if (membersToInsert.length === 0) {
      console.warn("⚠️ [AVISO] Nenhum membro válido para importar.");
      return res.status(400).json({ message: "Nenhum membro válido para importar." });
    }

    console.log(`➡️ [LOG] Inserindo ${membersToInsert.length} novos membros...`);
    const newMembers = await Member.insertMany(membersToInsert);
    console.log("✅ [SUCESSO] Membros inseridos no banco de dados!");

    res.status(201).json(newMembers);
  } catch (error) {
    console.error("❌ [ERRO GRAVE] Falha ao salvar no banco:", error);
    res.status(500).json({ message: 'Erro ao importar membros para o banco de dados.', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));