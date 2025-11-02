// Script para limpar todos os dados do banco Access
const db = require('../config/database');

async function clearDatabase() {
    try {
        console.log('🔄 Conectando ao Access...');
        await db.connect();
        
        console.log('🧹 Limpando tabela Membros...');
        await db.query('DELETE FROM Membros');
        
        // Verificar se limpou
        const result = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`✅ Banco limpo! Total de membros: ${result[0].total}`);
        
        console.log('🎯 Banco de dados está pronto para nova importação!');
        
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error.message);
    }
}

clearDatabase();