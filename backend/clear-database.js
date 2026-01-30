const db = require('./config/postgresql');

(async () => {
  try {
    console.log('🗑️ LIMPANDO BANCO DE DADOS...\n');
    
    await db.connect();
    
    // Verificar quantos membros existem antes
    const before = await db.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Membros antes da limpeza: ${before[0].total}`);
    
    // Confirmar limpeza
    console.log('\n⚠️ ATENÇÃO: Todos os membros serão removidos!');
    console.log('🔄 Executando limpeza em 2 segundos...\n');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Limpar tabela
    await db.execute('DELETE FROM membros');
    console.log('✅ Tabela membros limpa com sucesso!');
    
    // Verificar após limpeza
    const after = await db.query('SELECT COUNT(*) as total FROM membros');
    console.log(`📊 Membros após limpeza: ${after[0].total}`);
    
    console.log('\n✅ Banco de dados limpo e pronto para importação manual!');
    console.log('📋 Você pode agora importar sua planilha pela interface.');
    
    await db.close();
    process.exit(0);
  } catch(e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }
})();
