// Local do arquivo: backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ✅ NOVA IMPORTAÇÃO: Substituindo MongoDB por Access
const accessDB = require('./config/database');
const MemberService = require('./services/MemberService');
const AccessInitializer = require('./scripts/initializeAccess');

const app = express();

// Configuração do CORS para permitir a comunicação com o front-end
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 

// ✅ INICIALIZAÇÃO AUTOMÁTICA DO ACCESS
async function initializeSystem() {
  console.log('🔄 Inicializando sistema com Microsoft Access...');
  
  const initializer = new AccessInitializer();
  const accessReady = await initializer.initialize();
  
  if (!accessReady) {
    console.error('❌ Falha na inicialização do Access. Sistema não pode continuar.');
    process.exit(1);
  }
  
  // Conectar após inicialização bem-sucedida
  try {
    await accessDB.connect();
    console.log('✅ Conectado ao Microsoft Access com sucesso!');
  } catch (err) {
    console.error('❌ Falha ao conectar com o Access:', err);
    process.exit(1);
  }
}


// --- ROTAS DA API ---

// ✅ NOVA ROTA: Buscar TODOS os membros do Access
app.get('/api/members', async (req, res) => {
  try {
    const members = await MemberService.getAllMembers();
    res.json(members);
  } catch (error) {
    console.error("❌ Erro ao buscar membros:", error);
    res.status(500).json({ message: 'Erro ao buscar membros do Access.' });
  }
});

// ✅ NOVA ROTA: Buscar membro por ID
app.get('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MemberService.getMemberById(id);
    if (!member) {
        return res.status(404).json({ message: 'Membro não encontrado.' });
    }
    res.json(member);
  } catch (error) {
    console.error(`❌ Erro ao buscar membro ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar membro.' });
  }
});

// ✅ NOVA ROTA: Criar novo membro
app.post('/api/members', async (req, res) => {
  try {
    const newMember = await MemberService.createMember(req.body);
    res.status(201).json(newMember);
  } catch (error) {
    console.error("❌ Erro ao criar membro:", error);
    res.status(500).json({ message: 'Erro ao criar membro no Access.' });
  }
});

// ✅ NOVA ROTA: Atualizar membro
app.put('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await MemberService.updateMember(id, req.body);
    if (!updatedMember) {
        return res.status(404).json({ message: 'Membro não encontrado.' });
    }
    res.json(updatedMember);
  } catch (error) {
    console.error(`❌ Erro ao atualizar membro ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar membro.' });
  }
});

// ✅ NOVA ROTA: Deletar membro
app.delete('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await MemberService.deleteMember(id);
    res.json({ message: 'Membro removido com sucesso!' });
  } catch (error) {
    console.error(`❌ Erro ao deletar membro ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao deletar membro.' });
  }
});

// ✅ NOVA ROTA: Importar membros em massa (do Excel para Access)
app.post('/api/members/batch', async (req, res) => {
  console.log("➡️ [LOG] Recebida requisição em /api/members/batch");
  const { members, replaceAll } = req.body;

  if (!members || !Array.isArray(members)) {
    console.error("❌ [ERRO] 'members' não é um array ou não foi fornecido.");
    return res.status(400).json({ message: "Formato de dados inválido." });
  }
  
  console.log(`➡️ [LOG] Recebidos ${members.length} membros. Substituir todos: ${replaceAll}`);

  try {
    // Se replaceAll for true, limpar tabela primeiro
    if (replaceAll) {
      console.log("🗑️ [LOG] Limpando tabela de membros...");
      await accessDB.execute("DELETE FROM Membros");
      console.log("✅ [LOG] Tabela limpa com sucesso!");
    }

    const results = await MemberService.importMembers(members);
    
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    
    console.log(`✅ [LOG] Importação concluída: ${successCount} sucessos, ${errorCount} erros`);
    
    res.json({
      message: `Importação concluída: ${successCount} membros importados com sucesso, ${errorCount} erros.`,
      results,
      stats: { success: successCount, errors: errorCount }
    });
    
  } catch (error) {
    console.error("❌ [ERRO GRAVE] Falha na importação:", error);
    res.status(500).json({ 
      message: 'Erro ao importar membros para o Access.', 
      error: error.message 
    });
  }
});

// ✅ NOVA ROTA: Estatísticas gerais
app.get('/api/statistics', async (req, res) => {
  try {
    const stats = await MemberService.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
  }
});

const PORT = process.env.PORT || 5001;

// ✅ INICIALIZAR SISTEMA E DEPOIS SUBIR SERVIDOR
initializeSystem().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Banco Access: backend/database/MembrosDB.accdb`);
    console.log(`🌐 API disponível em: http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ Falha crítica na inicialização:', error);
  process.exit(1);
});