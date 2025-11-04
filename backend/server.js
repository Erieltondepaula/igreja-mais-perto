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

// ⚠️ Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('💥 ERRO NÃO CAPTURADO:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 PROMISE REJEITADA NÃO TRATADA:', reason);
  console.error('Promise:', promise);
});

// 🐘 POSTGRESQL: Sistema moderno e robusto
const db = require('./config/postgresql');
const MemberService = require('./services/MemberServicePostgreSQL');
const avatarCleanupService = require('./services/avatarCleanupService');

const app = express();

// Configuração do CORS para permitir a comunicação com o front-end (DEVE VIR ANTES DAS ROTAS)
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 

// Servir arquivos estáticos (avatares)
const avatarsPath = path.join(__dirname, '..', 'public', 'avatars');
app.use('/avatars', express.static(avatarsPath));
console.log('📁 Servindo avatares de:', avatarsPath);

// Rotas
app.use('/api', avatarRouter);
app.use('/api', importarXLSRouter);

// 🐘 INICIALIZAÇÃO POSTGRESQL
async function initializeSystem() {
  logger.info('🔄 Inicializando sistema com PostgreSQL...');
  try {
    logger.info('📡 Conectando ao banco...');
    await db.connect();
    logger.info('✅ Conectado ao PostgreSQL com sucesso!');
    // Verificar se o schema existe
    logger.info('🏥 Executando health check...');
    const healthCheck = await db.healthCheck();
    logger.info(`✅ Health check completo: ${healthCheck.status}`);
    logger.info('✨ Inicialização concluída!');
    return true; // ✅ Retorna sucesso
  } catch (err) {
    logger.error(`❌ Falha ao conectar com PostgreSQL: ${err}`);
    logger.info('💡 Execute: node scripts/setupPostgreSQL.js');
    process.exit(1);
  }
}


// --- ROTAS DA API ---

// Função auxiliar para converter campos do banco (snake_case) para frontend (camelCase)
function convertMemberToFrontend(member) {
  if (!member) return null;
  
  return {
    ...member,
    idExterno: member.id_externo,
    nomeCompleto: member.nome_completo,
    dataNascimento: member.data_nascimento,
    statusCivil: member.status_civil,
    situacaoAtual: member.situacao_atual,
    professorEBQ: member.e_professor_ebq,
    faixaEtaria: member.faixa_etaria,
    pequenoGrupo: member.pequeno_grupo,
    numeroDomes: member.numerodomes,
    avatarUrl: member.avatar_url,
    createdAt: member.created_at,
    updatedAt: member.updated_at
  };
}

// 🐘 ROTA: Buscar TODOS os membros do PostgreSQL
app.get('/api/members', async (req, res) => {
  try {
    const members = await MemberService.getAllMembers();
    // Converter todos os membros para o formato frontend
    const convertedMembers = members.map(convertMemberToFrontend);
    res.json(convertedMembers);
  } catch (error) {
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
    // Converter membro para o formato frontend
    res.json(convertMemberToFrontend(member));
  } catch (error) {
    logger.error(`❌ Erro ao buscar membro ${req.params.id}: ${error}`);
    logger.info(`🔎 Tentativa de buscar membro por ID (${req.params.id}) falhou.`);
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
    // Converter membro para o formato frontend
    res.json(convertMemberToFrontend(updatedMember));
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
    // 🧠 SISTEMA INTELIGENTE - Não precisa mais limpar tabela!
    // O importMembers() agora é inteligente e identifica automaticamente:
    // - Membros existentes (atualiza apenas campos diferentes)
    // - Membros novos (insere com ID único)
    // - PRESERVA avatar_url sempre
    
    if (replaceAll) {
      logger.info("🧠 [LOG] Modo REPLACE ALL - Sistema inteligente ativado");
      logger.info("📋 [LOG] Preservando avatars e atualizando apenas campos diferentes");
    } else {
      logger.info("🔄 [LOG] Modo UPDATE - Sistema inteligente ativado");
    }

    // 🎯 SISTEMA ANTI-DUPLICAÇÃO: Verificar duplicatas por Nome + Data Nascimento
    const processedMembers = [];
    const duplicateChecks = [];
    
    for (const member of members) {
      // Criar chave única para verificação (nome + data nascimento)
      const uniqueKey = `${(member.nome || '').trim().toLowerCase()}_${member.dataNascimento || member.data_nascimento || ''}`;
      
      if (!duplicateChecks.includes(uniqueKey)) {
        duplicateChecks.push(uniqueKey);
        
        // 🔍 DEBUG: Log do membro original
        if (processedMembers.length === 0) {
          logger.info(`🔍 [DEBUG] Primeiro membro - situacao_atual original: "${member.situacao_atual}"`);
          logger.info(`🔍 [DEBUG] Chaves do membro:`, Object.keys(member).filter(k => k.includes('situacao')));
        }
        
        processedMembers.push({
          ...member,
          // Garantir que não há ID do Excel (será gerado pelo PostgreSQL)
          id: undefined,
          // Padronizar nomes dos campos
          nome_completo: member.nomeCompleto || member.nome_completo,
          data_nascimento: member.dataNascimento || member.data_nascimento,
          status_civil: member.statusCivil || member.status_civil,
          situacao_atual: member.situacao_atual || member.situacaoAtual,  // ← ORDEM CORRETA!
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
    const insertedCount = results.filter(r => r.success && r.action === 'inserted').length;
    const updatedCount = results.filter(r => r.success && r.action === 'updated').length;
    
  logger.info(`✅ [LOG] Importação concluída:`);
  logger.info(`   - ${successCount} sucessos (${insertedCount} novos, ${updatedCount} atualizados)`);
  logger.info(`   - ${errorCount} erros`);
  logger.info(`   - ${duplicateCount} duplicatas evitadas`);
    
    // Mostrar alguns IDs gerados como exemplo
    const successResults = results.filter(r => r.success && r.id);
    if (successResults.length > 0) {
      logger.info(`🆔 [EXEMPLOS] IDs: ${successResults.slice(0, 3).map(r => r.id).join(', ')}`);
    }
    
    // 🧹 Executar limpeza automática de avatars não utilizados
    logger.info(`🧹 [LOG] Executando limpeza automática de avatars...`);
    try {
      const cleanupResult = await MemberService.cleanupUnusedAvatars();
      logger.info(`✅ [LOG] Limpeza concluída: ${cleanupResult.removidos} removidos, ${cleanupResult.mantidos} mantidos`);
    } catch (cleanupError) {
      logger.error(`⚠️ [LOG] Erro na limpeza de avatars: ${cleanupError.message}`);
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
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(`🗄️ Banco PostgreSQL: dashboard_membros`);
    logger.info(`🌐 API disponível em: http://localhost:${PORT}`);
    logger.info(`🆔 IDs personalizados: formato AA20253010104302`);
    logger.info(`🧪 Teste ID: http://localhost:${PORT}/api/test-id/ABNER/LIMA`);
    logger.info(`✅ Servidor ATIVO - aguardando requisições...`);
    
    // 🧹 Iniciar limpeza automática de avatars (a cada 24 horas)
    avatarCleanupService.startAutoCleanup(24);
    logger.info(`🤖 Limpeza automática de avatars ativada (a cada 24h)`);
  });

  // Prevenir que o processo termine inesperadamente
  server.on('error', (error) => {
    logger.error(`❌ Erro no servidor: ${error.message}`);
    logger.error(`❌ Stack: ${error.stack}`);
  });

  // Handler para encerramento gracioso
  process.on('SIGINT', () => {
    logger.info('\n🛑 Encerrando servidor...');
    avatarCleanupService.stopAutoCleanup(); // Parar limpeza automática
    server.close(() => {
      logger.info('✅ Servidor fechado com sucesso');
      process.exit(0);
    });
  });

}).catch(error => {
  logger.error(`❌ Falha crítica na inicialização:`);
  logger.error(`❌ Mensagem: ${error.message}`);
  logger.error(`❌ Stack: ${error.stack}`);
  console.error('❌ ERRO COMPLETO:', error);
  process.exit(1);
});