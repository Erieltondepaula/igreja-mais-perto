// Script para verificar e adicionar a coluna avatar_url
const db = require('./config/postgresql');

(async () => {
  try {
    console.log('🔍 Conectando ao banco de dados...');
    await db.connect();
    
    console.log('🔍 Verificando se a coluna avatar_url existe...');
    const result = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      AND column_name = 'avatar_url'
    `);
    
    if (result.length > 0) {
      console.log('✅ Coluna avatar_url já existe no banco de dados!');
    } else {
      console.log('❌ Coluna avatar_url NÃO existe - executando migração...');
      await db.execute(`ALTER TABLE membros ADD COLUMN avatar_url VARCHAR(255)`);
      console.log('✅ Coluna avatar_url criada com sucesso!');
    }
    
    await db.close();
    console.log('✅ Processo concluído!');
    
  } catch (e) {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  }
})();
