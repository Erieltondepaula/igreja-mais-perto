const { Client } = require('pg');

// Configuração para conexão administrativa
const adminConfig = {
  user: 'postgres',
  host: 'localhost',
  password: '252088', // Senha fornecida pelo usuário
  port: 5432,
};

// Configuração para o banco de dados específico
const dbConfig = {
  ...adminConfig,
  database: 'dashboard_membros'
};

async function setupDatabase() {
  console.log('🔧 Iniciando configuração do PostgreSQL...');
  
  let adminClient;
  let dbClient;
  
  try {
    // 1. Conectar como administrador
    console.log('📡 Conectando ao PostgreSQL como administrador...');
    adminClient = new Client(adminConfig);
    await adminClient.connect();
    console.log('✅ Conectado ao PostgreSQL!');
    
    // 2. Criar banco de dados se não existir
    console.log('🗄️ Criando banco de dados dashboard_membros...');
    try {
      await adminClient.query(`CREATE DATABASE dashboard_membros;`);
      console.log('✅ Banco de dados dashboard_membros criado!');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('ℹ️ Banco de dados dashboard_membros já existe');
      } else {
        throw err;
      }
    }
    
    // 3. Criar usuário se não existir
    console.log('👤 Criando usuário membros_user...');
    try {
      await adminClient.query(`
        CREATE USER membros_user WITH PASSWORD '252088';
      `);
      console.log('✅ Usuário membros_user criado!');
    } catch (err) {
      if (err.code === '42710') {
        console.log('ℹ️ Usuário membros_user já existe');
      } else {
        throw err;
      }
    }
    
    // 4. Conceder privilégios
    console.log('🔐 Concedendo privilégios...');
    await adminClient.query(`
      GRANT ALL PRIVILEGES ON DATABASE dashboard_membros TO membros_user;
    `);
    console.log('✅ Privilégios concedidos!');
    
    // Fechar conexão admin
    await adminClient.end();
    
    // 5. Conectar ao banco específico
    console.log('🔗 Conectando ao banco dashboard_membros...');
    dbClient = new Client(dbConfig);
    await dbClient.connect();
    
    // 6. Criar tabela membros
    console.log('📋 Criando tabela membros...');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS membros (
        id VARCHAR(20) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        sobrenome VARCHAR(100) NOT NULL,
        dataNascimento DATE NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        endereco VARCHAR(255),
        cidade VARCHAR(100),
        estado VARCHAR(2),
        cep VARCHAR(10),
        genero VARCHAR(10),
        estadoCivil VARCHAR(20),
        profissao VARCHAR(100),
        dataAdmissao DATE,
        status VARCHAR(20) DEFAULT 'Ativo',
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(nome, dataNascimento)
      );
    `);
    console.log('✅ Tabela membros criada!');
    
    // 7. Criar função para gerar ID customizado
    console.log('⚙️ Criando função generate_member_id...');
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION generate_member_id(p_nome VARCHAR, p_sobrenome VARCHAR)
      RETURNS VARCHAR(20) AS $$
      DECLARE
        primeira_letra VARCHAR(1);
        segunda_letra VARCHAR(1);
        timestamp_str VARCHAR(14);
        new_id VARCHAR(20);
      BEGIN
        -- Primeira letra do nome (maiúscula)
        primeira_letra := UPPER(LEFT(TRIM(p_nome), 1));
        
        -- Segunda letra do sobrenome (maiúscula)
        segunda_letra := UPPER(LEFT(TRIM(p_sobrenome), 1));
        
        -- Timestamp no formato YYYYMMDDHHMMSS
        timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
        
        -- Combinar: AA + YYYYMMDDHHMMSS
        new_id := primeira_letra || segunda_letra || timestamp_str;
        
        RETURN new_id;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Função generate_member_id criada!');
    
    // 8. Criar trigger para atualizar updated_at
    console.log('🔄 Criando trigger para updated_at...');
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_membros_updated_at ON membros;
      CREATE TRIGGER update_membros_updated_at
        BEFORE UPDATE ON membros
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Trigger criado!');
    
    // 9. Conceder privilégios na tabela
    console.log('🔐 Concedendo privilégios na tabela...');
    await dbClient.query(`
      GRANT ALL PRIVILEGES ON TABLE membros TO membros_user;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO membros_user;
    `);
    console.log('✅ Privilégios na tabela concedidos!');
    
    // 10. Testar a função
    console.log('🧪 Testando função generate_member_id...');
    const testResult = await dbClient.query(`
      SELECT generate_member_id('João', 'Silva') as test_id;
    `);
    console.log('✅ Teste da função:', testResult.rows[0].test_id);
    
    console.log('\n🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('📊 Banco de dados: dashboard_membros');
    console.log('👤 Usuário: membros_user');
    console.log('🔑 Senha: 252088');
    console.log('🆔 Sistema de ID customizado ativo: AA20253010104302');
    console.log('\n✨ Sistema pronto para uso!');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.error('🔍 Detalhes:', error);
  } finally {
    if (adminClient) {
      try {
        await adminClient.end();
      } catch (e) {}
    }
    if (dbClient) {
      try {
        await dbClient.end();
      } catch (e) {}
    }
  }
}

// Executar configuração
setupDatabase();