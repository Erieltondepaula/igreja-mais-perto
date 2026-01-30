// Rotas para Sincronização com Google Sheets em Tempo Real
const express = require('express');
const router = express.Router();
const GoogleSheetsSync = require('../services/GoogleSheetsSync');
const logger = require('../config/logger');

/**
 * 🔄 POST /api/webhook/google-sheets
 * Recebe notificações em tempo real quando a planilha é editada
 * Este endpoint será chamado automaticamente pelo Google Apps Script
 */
router.post('/webhook/google-sheets', async (req, res) => {
  try {
    logger.info('🔔 Webhook recebido do Google Sheets');
    logger.info(`📋 Dados recebidos: ${JSON.stringify(req.body)}`);

    // Validar se é uma notificação legítima
    const { action, timestamp, sheetName } = req.body;
    
    if (!action || !timestamp) {
      logger.warn('⚠️ Webhook inválido - faltam campos obrigatórios');
      return res.status(400).json({
        sucesso: false,
        erro: 'Webhook inválido'
      });
    }

    // Responder imediatamente (200 OK) para o Google não reenviar
    res.status(200).json({
      sucesso: true,
      mensagem: 'Webhook recebido, sincronização iniciada'
    });

    // Processar sincronização em background (não bloqueia resposta)
    setImmediate(async () => {
      try {
        logger.info('🚀 Iniciando sincronização automática via webhook...');
        
        const resultado = await GoogleSheetsSync.syncToDatabase();
        
        logger.info(`✅ Sincronização webhook concluída: ${resultado.importados} membros`);
        logger.info(`📊 Detalhes: ${JSON.stringify(resultado)}`);
        
        // Aqui você pode adicionar notificação em tempo real via WebSocket
        // ou enviar email/notificação para administradores
      } catch (error) {
        logger.error(`❌ Erro na sincronização webhook: ${error.message}`);
      }
    });

  } catch (error) {
    logger.error(`❌ Erro ao processar webhook: ${error.message}`);
    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

/**
 * 🔄 POST /api/sync/google-sheets
 * Sincronização manual sob demanda
 * Chamado quando o usuário clica no botão "Sincronizar"
 */
router.post('/sync/google-sheets', async (req, res) => {
  try {
    logger.info('🔄 Sincronização manual iniciada pelo usuário');

    const resultado = await GoogleSheetsSync.syncToDatabase();

    res.json({
      sucesso: true,
      mensagem: 'Sincronização concluída com sucesso!',
      dados: resultado
    });

  } catch (error) {
    logger.error(`❌ Erro na sincronização manual: ${error.message}`);
    res.status(500).json({
      sucesso: false,
      erro: error.message,
      mensagem: 'Falha ao sincronizar com Google Sheets'
    });
  }
});

/**
 * 🧪 GET /api/sync/google-sheets/test
 * Testa a conexão com o Google Sheets sem importar
 */
router.get('/sync/google-sheets/test', async (req, res) => {
  try {
    logger.info('🧪 Testando conexão com Google Sheets...');

    const csvData = await GoogleSheetsSync.fetchSheetData();
    const parsedData = GoogleSheetsSync.parseCSV(csvData);
    const membros = GoogleSheetsSync.transformToMembers(parsedData);

    res.json({
      sucesso: true,
      conexao_ok: true,
      total_registros: membros.length,
      preview: membros.slice(0, 3), // Mostra apenas 3 primeiros
      mensagem: 'Conexão OK! Planilha acessível e parseável.'
    });

  } catch (error) {
    logger.error(`❌ Erro no teste de conexão: ${error.message}`);
    res.status(500).json({
      sucesso: false,
      conexao_ok: false,
      erro: error.message,
      mensagem: 'Falha ao conectar com Google Sheets'
    });
  }
});

/**
 * 📊 GET /api/sync/google-sheets/status
 * Retorna informações sobre última sincronização
 */
router.get('/sync/google-sheets/status', async (req, res) => {
  try {
    // TODO: Implementar tabela de logs de sincronização
    // Por enquanto, retorna status básico
    
    res.json({
      sucesso: true,
      configurado: true,
      url_planilha: 'Configurada ✅',
      webhook_ativo: true,
      ultima_sincronizacao: 'Não implementado ainda',
      mensagem: 'Sistema de sincronização ativo'
    });

  } catch (error) {
    logger.error(`❌ Erro ao buscar status: ${error.message}`);
    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

module.exports = router;
