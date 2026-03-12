/**
 * ⚡ GOOGLE APPS SCRIPT - WEBHOOK EM TEMPO REAL ⚡
 * 
 * Este script deve ser instalado na sua planilha do Google Sheets
 * para enviar notificações automáticas ao sistema quando houver edições.
 * 
 * 📋 INSTRUÇÕES DE INSTALAÇÃO:
 * 
 * 1. Abra sua planilha no Google Sheets
 * 2. Vá em: Extensões → Apps Script
 * 3. Cole este código completo
 * 4. Configure a URL do webhook (veja abaixo)
 * 5. Salve e autorize as permissões
 * 6. Configurar trigger automático (veja documentação)
 * 
 * ⚙️ CONFIGURAÇÃO OBRIGATÓRIA:
 */

// 🔧 CONFIGURE ESTA URL COM O ENDEREÇO DO SEU SERVIDOR
const WEBHOOK_URL = 'http://SEU-SERVIDOR:3000/api/webhook/google-sheets';

// 📝 Para desenvolvimento local, use: 'http://localhost:3000/api/webhook/google-sheets'
// 📝 Para produção, use: 'https://seu-dominio.com/api/webhook/google-sheets'

// ⚠️ IMPORTANTE: Para localhost funcionar, você precisa usar ngrok ou similar
// 📖 Veja a documentação completa para mais detalhes

/**
 * Função principal - chamada automaticamente quando a planilha é editada
 */
function onEdit(e) {
  try {
    Logger.log('📝 Edição detectada na planilha');
    
    // Informações sobre a edição
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    const range = e.range;
    const row = range.getRow();
    const column = range.getColumn();
    const oldValue = e.oldValue || '';
    const newValue = e.value || '';
    
    Logger.log(`Planilha: ${sheetName}, Linha: ${row}, Coluna: ${column}`);
    Logger.log(`Valor antigo: "${oldValue}" → Valor novo: "${newValue}"`);
    
    // Envia notificação para o webhook
    enviarWebhook({
      action: 'edit',
      sheetName: sheetName,
      row: row,
      column: column,
      oldValue: oldValue,
      newValue: newValue,
      timestamp: new Date().toISOString(),
      user: Session.getActiveUser().getEmail()
    });
    
  } catch (error) {
    Logger.log('❌ Erro no onEdit: ' + error);
  }
}

/**
 * Função para detectar quando linhas são adicionadas/removidas
 */
function onChange(e) {
  try {
    Logger.log('🔄 Mudança detectada na planilha');
    
    const changeType = e.changeType;
    Logger.log('Tipo de mudança: ' + changeType);
    
    // Envia notificação para o webhook
    enviarWebhook({
      action: changeType,
      sheetName: e.source.getActiveSheet().getName(),
      timestamp: new Date().toISOString(),
      user: Session.getActiveUser().getEmail()
    });
    
  } catch (error) {
    Logger.log('❌ Erro no onChange: ' + error);
  }
}

/**
 * Função que envia dados para o webhook do sistema
 */
function enviarWebhook(dados) {
  try {
    Logger.log('📤 Enviando webhook para: ' + WEBHOOK_URL);
    
    const payload = JSON.stringify(dados);
    
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': payload,
      'muteHttpExceptions': true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`✅ Webhook enviado! Status: ${statusCode}`);
    Logger.log(`Resposta: ${responseText}`);
    
    if (statusCode !== 200) {
      Logger.log('⚠️ Webhook retornou status diferente de 200');
    }
    
  } catch (error) {
    Logger.log('❌ Erro ao enviar webhook: ' + error);
    // Não lança erro para não travar a planilha
  }
}

/**
 * Função para sincronização manual completa
 * Execute esta função manualmente para forçar uma sincronização
 */
function sincronizarManual() {
  try {
    Logger.log('🔄 Sincronização manual iniciada');
    
    enviarWebhook({
      action: 'manual_sync',
      sheetName: SpreadsheetApp.getActiveSheet().getName(),
      timestamp: new Date().toISOString(),
      user: Session.getActiveUser().getEmail()
    });
    
    Logger.log('✅ Sincronização manual concluída');
    SpreadsheetApp.getUi().alert('✅ Sincronização manual enviada com sucesso!');
    
  } catch (error) {
    Logger.log('❌ Erro na sincronização manual: ' + error);
    SpreadsheetApp.getUi().alert('❌ Erro: ' + error);
  }
}

/**
 * Função para testar o webhook
 * Execute esta função para verificar se a comunicação está funcionando
 */
function testarWebhook() {
  try {
    Logger.log('🧪 Testando webhook...');
    
    enviarWebhook({
      action: 'test',
      sheetName: SpreadsheetApp.getActiveSheet().getName(),
      timestamp: new Date().toISOString(),
      message: 'Teste de conexão'
    });
    
    Logger.log('✅ Teste concluído - verifique os logs');
    SpreadsheetApp.getUi().alert(
      '🧪 Teste Enviado!\n\n' +
      'Verifique os logs do Apps Script e do servidor para confirmar o recebimento.\n\n' +
      'URL: ' + WEBHOOK_URL
    );
    
  } catch (error) {
    Logger.log('❌ Erro no teste: ' + error);
    SpreadsheetApp.getUi().alert('❌ Erro no teste: ' + error);
  }
}

/**
 * Cria menu personalizado na planilha
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 Sincronização')
    .addItem('📤 Sincronizar Agora', 'sincronizarManual')
    .addItem('🧪 Testar Webhook', 'testarWebhook')
    .addItem('ℹ️ Ver Configuração', 'mostrarConfiguracao')
    .addToUi();
}

/**
 * Mostra informações de configuração
 */
function mostrarConfiguracao() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '⚙️ Configuração do Webhook\n\n' +
    'URL Configurada:\n' + WEBHOOK_URL + '\n\n' +
    'Para alterar a URL, edite o código do Apps Script.\n\n' +
    'Triggers Configurados:\n' +
    '• onEdit - Detecta edições em células\n' +
    '• onChange - Detecta mudanças estruturais\n\n' +
    'Status: ' + (WEBHOOK_URL.includes('SEU-SERVIDOR') ? '❌ NÃO CONFIGURADO' : '✅ CONFIGURADO')
  );
}

/**
 * 📖 COMO CONFIGURAR OS TRIGGERS (GATILHOS AUTOMÁTICOS):
 * 
 * 1. No Apps Script, clique no ícone de relógio ⏰ (Triggers)
 * 2. Clique em "+ Adicionar gatilho"
 * 3. Configure o primeiro trigger:
 *    - Função: onEdit
 *    - Evento: "Ao editar"
 *    - Tipo: "Baseado em planilha"
 * 4. Configure o segundo trigger:
 *    - Função: onChange
 *    - Evento: "Ao alterar"
 *    - Tipo: "Baseado em planilha"
 * 5. Salve os triggers
 * 
 * Pronto! Agora qualquer edição na planilha enviará automaticamente
 * uma notificação para o seu sistema. 🎉
 */
