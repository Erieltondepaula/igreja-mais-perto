// ...existing code...
// Exemplo de log de interação
// (deve ser chamado após a inicialização do logger)
const avatarRouter = require('./routes/avatar');
const importarXLSRouter = require('./routes/importarXLS');
const logger = require('./config/logger');
const fs = require('fs');
const path = require('path');
// Arquiva e cria novo log ao iniciar o sistema
function archiveLog(logFileName) {
  const logPath = path.join(__dirname, 'log', logFileName);
  if (fs.existsSync(logPath)) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-') + '_' + now.toLocaleTimeString('pt-BR').replace(/:/g, '-');
    const archiveDir = path.join(__dirname, 'log', 'archive');
    if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir);
    const archivePath = path.join(archiveDir, `${logFileName.replace('.log','')}_${dateStr}.log`);
    fs.copyFileSync(logPath, archivePath);
    fs.writeFileSync(logPath, '', { flag: 'w' });
    console.log(`🧹 Log ${logFileName} arquivado e limpo.`);
  }
}
archiveLog('error.log');
archiveLog('app.log');
// ...existing code...
// Local do arquivo: backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 🐘 POSTGRESQL: Sistema moderno e robusto
const db = require('./config/postgresql');
const MemberService = require('./services/MemberServicePostgreSQL');

const app = express();
app.use('/api', avatarRouter);
app.use('/api', importarXLSRouter);

// Configuração do CORS para permitir a comunicação com o front-end
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 

// 🐘 INICIALIZAÇÃO POSTGRESQL
async function initializeSystem() {
  logger.info('🔄 Inicializando sistema com PostgreSQL...');
  logger.info('🔄 Inicializando sistema com PostgreSQL...');
  try {
    await db.connect();
    logger.info('✅ Conectado ao PostgreSQL com sucesso!');
  logger.info('✅ Conectado ao PostgreSQL com sucesso!');
    // Verificar se o schema existe
    const healthCheck = await db.healthCheck();
    logger.info(`🏥 Status do banco: ${healthCheck.status}`);
  logger.info(`🏥 Status do banco: ${healthCheck.status}`);
  } catch (err) {
    logger.error(`❌ Falha ao conectar com PostgreSQL: ${err}`);
  logger.error(`❌ Falha ao conectar com PostgreSQL: ${err}`);
    logger.info('💡 Execute: node scripts/setupPostgreSQL.js');
  logger.info('💡 Execute: node scripts/setupPostgreSQL.js');
    process.exit(1);
  }
}


// --- ROTAS DA API ---

// 🐘 ROTA: Buscar TODOS os membros do PostgreSQL
app.get('/api/members', async (req, res) => {
  try {
    const members = await MemberService.getAllMembers();
    res.json(members);
  } catch (error) {
    logger.error(`❌ Erro ao buscar membros: ${error}`);
  logger.error(`❌ Erro ao buscar membros: ${error}`);
  logger.info('🔎 Tentativa de buscar todos os membros falhou.');
    res.status(500).json({ message: 'Erro ao buscar membros do PostgreSQL.' });
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
    logger.error(`❌ Erro ao buscar membro ${req.params.id}: ${error}`);
  logger.error(`❌ Erro ao buscar membro ${req.params.id}: ${error}`);
  logger.info(`🔎 Tentativa de buscar membro por ID (${req.params.id}) falhou.`);
  logger.info(`🗑️ ${result.rowCount} membros removidos da tabela`);
    res.status(500).json({ message: 'Erro ao buscar membro.' });
  }
});

// 🐘 ROTA: Criar novo membro com ID personalizado
app.post('/api/members', async (req, res) => {
  try {
    const newMember = await MemberService.createMember(req.body);
    res.status(201).json(newMember);
  } catch (error) {
    logger.error(`❌ Erro ao criar membro: ${error}`);
    res.status(500).json({ message: 'Erro ao criar membro no PostgreSQL.' });
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
    logger.error(`❌ Erro ao atualizar membro ${req.params.id}: ${error}`);
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
    logger.error(`❌ Erro ao deletar membro ${req.params.id}: ${error}`);
    res.status(500).json({ message: 'Erro ao deletar membro.' });
  }
});

// 🐘 ROTA: Importar membros com anti-duplicação e IDs personalizados
app.post('/api/members/batch', async (req, res) => {
  logger.info("➡️ [LOG] Recebida requisição de importação em massa");
  const { members, replaceAll } = req.body;

  if (!members || !Array.isArray(members)) {
    logger.error("❌ [ERRO] 'members' não é um array ou não foi fornecido.");
    return res.status(400).json({ message: "Formato de dados inválido." });
  }
  
  logger.info(`➡️ [LOG] Recebidos ${members.length} membros. Substituir todos: ${replaceAll}`);
  logger.info(`🎯 [LOG] IDs personalizados serão gerados automaticamente (formato: AA20253010104302)`);

  try {
    // Se replaceAll for true, limpar tabela primeiro
    if (replaceAll) {
      logger.info("🗑️ [LOG] Limpando tabela de membros...");
      await MemberService.clearAllMembers();
      logger.info("✅ [LOG] Tabela limpa com sucesso!");
    }

    // 🎯 SISTEMA ANTI-DUPLICAÇÃO: Verificar duplicatas por Nome + Data Nascimento
    const processedMembers = [];
    const duplicateChecks = [];
    
    for (const member of members) {
      // Criar chave única para verificação (nome + data nascimento)
      const uniqueKey = `${(member.nome || '').trim().toLowerCase()}_${member.dataNascimento || member.data_nascimento || ''}`;
      
      if (!duplicateChecks.includes(uniqueKey)) {
        duplicateChecks.push(uniqueKey);
        processedMembers.push({
          ...member,
          // Garantir que não há ID do Excel (será gerado pelo PostgreSQL)
          id: undefined,
          // Padronizar nomes dos campos
          nome_completo: member.nomeCompleto || member.nome_completo,
          data_nascimento: member.dataNascimento || member.data_nascimento,
          status_civil: member.statusCivil || member.status_civil,
          professor_ebq: member.professorEBQ || member.professor_ebq,
          pequeno_grupo: member.pequeno_grupo || false,
          data_batismo: member.dataBatismo || member.data_batismo,
          data_membresia: member.dataMembresia || member.data_membresia,
          data_desligamento: member.dataDesligamento || member.data_desligamento
        });
      } else {
        logger.info(`⚠️ [DUPLICATA] Membro duplicado ignorado: ${member.nome}`);
      }
    }
    
  logger.info(`📊 [LOG] ${processedMembers.length} membros únicos serão processados`);

    const results = await MemberService.importMembers(processedMembers);
    
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    const duplicateCount = members.length - processedMembers.length;
    
  logger.info(`✅ [LOG] Importação concluída:`);
  logger.info(`   - ${successCount} sucessos com IDs personalizados`);
  logger.info(`   - ${errorCount} erros`);
  logger.info(`   - ${duplicateCount} duplicatas evitadas`);
    
    // Mostrar alguns IDs gerados como exemplo
    const successResults = results.filter(r => r.success && r.id);
    if (successResults.length > 0) {
      logger.info(`🆔 [EXEMPLOS] IDs gerados: ${successResults.slice(0, 3).map(r => r.id).join(', ')}`);
    }
    
    res.json({
      message: `Importação concluída: ${successCount} membros com IDs personalizados, ${errorCount} erros, ${duplicateCount} duplicatas evitadas.`,
      results,
      stats: { 
        success: successCount, 
        errors: errorCount, 
        duplicates: duplicateCount,
        total_processed: processedMembers.length,
        total_received: members.length
      }
    });
    
  } catch (error) {
    logger.error(`❌ [ERRO GRAVE] Falha na importação: ${error}`);
    res.status(500).json({ 
      message: 'Erro ao importar membros para o PostgreSQL.', 
      error: error.message 
    });
  }
});

// 🐘 ROTA: Estatísticas gerais do PostgreSQL
app.get('/api/statistics', async (req, res) => {
  try {
    const stats = await MemberService.getStatistics();
    res.json(stats);
  } catch (error) {
    logger.error(`❌ Erro ao buscar estatísticas: ${error}`);
    res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
  }
});

// 🧪 ROTA: Testar geração de ID personalizado
app.get('/api/test-id/:nome/:sobrenome', async (req, res) => {
  try {
    const { nome, sobrenome } = req.params;
    const customId = await MemberService.generateCustomId(nome, `${nome} ${sobrenome}`);
    res.json({ 
      nome, 
      sobrenome, 
      id_gerado: customId, 
      formato: 'AA20253010104302' 
    });
  } catch (error) {
    logger.error(`❌ Erro ao gerar ID teste: ${error}`);
    res.status(500).json({ message: 'Erro ao gerar ID personalizado.' });
  }
});

// 📤 ROTAS: Importação Interativa
const importacaoRoutes = require('./routes/importacao');
app.use('/api/importacao', importacaoRoutes);

const PORT = process.env.PORT || 5001;

// 🐘 INICIALIZAR POSTGRESQL E SUBIR SERVIDOR
initializeSystem().then(() => {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(`� Banco PostgreSQL: dashboard_membros`);
    logger.info(`🌐 API disponível em: http://localhost:${PORT}`);
    logger.info(`🆔 IDs personalizados: formato AA20253010104302`);
    logger.info(`🧪 Teste ID: http://localhost:${PORT}/api/test-id/ABNER/LIMA`);
  });
}).catch(error => {
  logger.error(`❌ Falha crítica na inicialização: ${error}`);
  process.exit(1);
});