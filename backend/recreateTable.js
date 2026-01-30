const { Client } = require('pg');

async function recreateTableWithAllFields() {
  console.log('🔧 RECRIANDO TABELA COM TODOS OS CAMPOS DO EXCEL');
  console.log('================================================');
  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dashboard_membros',
    password: '252088',
    port: 5432,
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // 1. Fazer backup dos dados existentes (se houver)
    console.log('📋 Fazendo backup dos dados existentes...');
    const backupData = await client.query('SELECT * FROM membros');
    console.log(`📊 ${backupData.rows.length} registros salvos em backup`);
    
    // 2. Dropar tabela existente
    console.log('🗑️ Removendo tabela antiga...');
    await client.query('DROP TABLE IF EXISTS membros');
    console.log('✅ Tabela antiga removida');
    
    // 3. Criar nova tabela com TODOS os campos do Excel
    console.log('🏗️ Criando nova tabela com todos os campos...');
    await client.query(`
      CREATE TABLE membros (
        id VARCHAR(20) PRIMARY KEY,
        
        -- Campos básicos
        carimbo_data_hora TIMESTAMP,
        excel_id INTEGER,
        nome VARCHAR(100) NOT NULL,
        nome_completo VARCHAR(200),
        data_nascimento DATE NOT NULL,
        idade INTEGER,
        mes VARCHAR(20),
        
        -- Contato
        telefone VARCHAR(20),
        
        -- Pessoais
        sexo VARCHAR(15),
        observacoes TEXT,
        status_civil VARCHAR(30),
        nome_conjuge VARCHAR(100),
        parentesco VARCHAR(100),
        
        -- Endereço
        rua VARCHAR(100),
        numero VARCHAR(10),
        bairro VARCHAR(100),
        cidade VARCHAR(100),
        estado VARCHAR(5),
        cep VARCHAR(15),
        
        -- Igreja
        batizado VARCHAR(10),
        membro VARCHAR(10),
        situacao_atual VARCHAR(30),
        e_lider VARCHAR(10),
        e_professor_ebq VARCHAR(10),
        faixa_etaria VARCHAR(50),
        esta_em_pequeno_grupo VARCHAR(10),
        grupo VARCHAR(50),
        numerodomes INTEGER,
        
        -- Campos de controle
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Campos derivados para compatibilidade
        sobrenome VARCHAR(100),
        email VARCHAR(255),
        endereco VARCHAR(255),
        genero VARCHAR(15),
        estadocivil VARCHAR(30),
        profissao VARCHAR(100),
        dataadmissao DATE,
        status VARCHAR(30) DEFAULT 'Ativo',
        
        UNIQUE(nome_completo, data_nascimento)
      );
    `);
    console.log('✅ Nova tabela criada com todos os campos');
    
    // 4. Recriar função de ID
    console.log('⚙️ Recriando função generate_member_id...');
    await client.query(`
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
    console.log('✅ Função generate_member_id recriada');
    
    // 5. Criar trigger para updated_at
    console.log('🔄 Criando trigger para updated_at...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_membros_updated_at ON membros;
      CREATE TRIGGER update_membros_updated_at
        BEFORE UPDATE ON membros
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Trigger criado');
    
    // 6. Verificar estrutura final
    const finalStructure = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 ESTRUTURA FINAL DA TABELA:');
    finalStructure.rows.forEach(col => {
      console.log(`  ✓ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    console.log('\n🎉 TABELA RECRIADA COM SUCESSO!');
    console.log('📊 Registros atuais: 0 (pronta para reimportação)');
    console.log('🔄 Execute o script de importação para carregar todos os dados');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

recreateTableWithAllFields();