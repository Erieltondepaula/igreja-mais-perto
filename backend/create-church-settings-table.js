// Script para criar tabela de configurações da igreja
// Local: backend/create-church-settings-table.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: 'postgres',
  port: 5432,
});

async function createChurchSettingsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🏗️  Criando tabela church_settings...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS church_settings (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        denominacao VARCHAR(255),
        telefone VARCHAR(20),
        email VARCHAR(255),
        endereco TEXT,
        cidade VARCHAR(100),
        estado VARCHAR(50),
        cep VARCHAR(10),
        pais VARCHAR(100),
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabela church_settings criada com sucesso!');
    
    // Adicionar coluna CEP se não existir (para tabelas antigas)
    try {
      await client.query(`
        ALTER TABLE church_settings 
        ADD COLUMN IF NOT EXISTS cep VARCHAR(10);
      `);
      console.log('✅ Coluna CEP verificada/adicionada');
    } catch (err) {
      console.log('ℹ️  Coluna CEP já existe');
    }
    
    // Verificar se já existe algum registro
    const result = await client.query('SELECT COUNT(*) FROM church_settings');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('📝 Inserindo configurações padrão...');
      
      await client.query(`
        INSERT INTO church_settings (
          nome, denominacao, telefone, email, endereco, cidade, estado, cep, pais
        ) VALUES (
          'Igreja Evangélica Quadrangular',
          'Templo Central de Cariacica',
          '(27) 3254-3636',
          'cariacica@ieqcariacica.com.br',
          'Rua Principal, Centro',
          'Cariacica',
          'ES',
          '29140-000',
          'Brasil'
        );
      `);
      
      console.log('✅ Configurações padrão inseridas!');
    } else {
      console.log('ℹ️  Configurações já existem no banco de dados.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createChurchSettingsTable()
  .then(() => {
    console.log('✅ Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
