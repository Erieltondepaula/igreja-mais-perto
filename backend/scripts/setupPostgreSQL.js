// 🛠️ SETUP POSTGRESQL AUTOMÁTICO
// Script para configurar o banco PostgreSQL

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupPostgreSQL() {
    console.log('🚀 Configurando PostgreSQL...');
    
    // Configurações para conexão inicial (usando usuário postgres padrão)
    const adminConfig = {
        host: 'localhost',
        port: 5432,
        user: 'postgres', // Usuário padrão do PostgreSQL
        password: 'root', // Senha padrão comum
        database: 'postgres' // Banco padrão
    };
    
    try {
        // 1. Conectar como administrador
        console.log('🔌 Conectando como administrador...');
        const adminClient = new Client(adminConfig);
        await adminClient.connect();
        
        // 2. Criar banco de dados
        console.log('🏗️ Criando banco de dados...');
        try {
            await adminClient.query('CREATE DATABASE dashboard_membros');
            console.log('✅ Banco "dashboard_membros" criado!');
        } catch (error) {
            if (error.code === '42P04') {
                console.log('ℹ️ Banco "dashboard_membros" já existe');
            } else {
                throw error;
            }
        }
        
        // 3. Criar usuário
        console.log('👤 Criando usuário...');
        try {
            await adminClient.query("CREATE USER membros_user WITH PASSWORD 'membros_password_2025'");
            console.log('✅ Usuário "membros_user" criado!');
        } catch (error) {
            if (error.code === '42710') {
                console.log('ℹ️ Usuário "membros_user" já existe');
            } else {
                throw error;
            }
        }
        
        // 4. Dar permissões
        console.log('🔐 Configurando permissões...');
        await adminClient.query('GRANT ALL PRIVILEGES ON DATABASE dashboard_membros TO membros_user');
        await adminClient.query('ALTER USER membros_user CREATEDB');
        
        await adminClient.end();
        
        // 5. Conectar ao banco específico e executar scripts
        console.log('📜 Executando scripts de inicialização...');
        const dbClient = new Client({
            host: 'localhost',
            port: 5432,
            user: 'membros_user',
            password: 'membros_password_2025',
            database: 'dashboard_membros'
        });
        
        await dbClient.connect();
        
        // 6. Executar script de criação de schema
        const schemaPath = path.join(__dirname, '../database/init/01-create-schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
            await dbClient.query(schemaSQL);
            console.log('✅ Schema criado com sucesso!');
        } else {
            console.log('⚠️ Arquivo de schema não encontrado, criando estrutura básica...');
            
            // Criar estrutura básica se o arquivo não existir
            await createBasicSchema(dbClient);
        }
        
        await dbClient.end();
        
        // 7. Testar conexão final
        console.log('🧪 Testando conexão...');
        const testClient = new Client({
            host: 'localhost',
            port: 5432,
            user: 'membros_user',
            password: 'membros_password_2025',
            database: 'dashboard_membros'
        });
        
        await testClient.connect();
        const testResult = await testClient.query('SELECT generate_member_id($1, $2) as test_id', ['TESTE', 'TESTE USUARIO']);
        await testClient.end();
        
        console.log('🎉 PostgreSQL configurado com sucesso!');
        console.log(`🆔 ID de teste gerado: ${testResult.rows[0].test_id}`);
        console.log('');
        console.log('📋 Configurações:');
        console.log('  - Host: localhost');
        console.log('  - Porta: 5432');
        console.log('  - Banco: dashboard_membros');
        console.log('  - Usuário: membros_user');
        console.log('  - Senha: membros_password_2025');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error.message);
        console.log('');
        console.log('💡 Dicas para resolver:');
        console.log('  1. Verifique se o PostgreSQL está rodando');
        console.log('  2. Confirme usuário/senha do postgres');
        console.log('  3. Verifique se a porta 5432 está livre');
        
        return false;
    }
}

async function createBasicSchema(client) {
    const createTableSQL = `
        -- Função para gerar ID personalizado
        CREATE OR REPLACE FUNCTION generate_member_id(nome TEXT, nome_completo TEXT)
        RETURNS TEXT AS $$
        DECLARE
            primeiro_nome TEXT;
            sobrenome TEXT;
            partes_nome TEXT[];
            first_letter CHAR(1);
            second_letter CHAR(1);
            timestamp_str TEXT;
        BEGIN
            partes_nome := string_to_array(COALESCE(nome_completo, nome, ''), ' ');
            primeiro_nome := COALESCE(partes_nome[1], '');
            
            IF array_length(partes_nome, 1) > 1 THEN
                sobrenome := array_to_string(partes_nome[2:], ' ');
            ELSE
                sobrenome := '';
            END IF;
            
            first_letter := UPPER(COALESCE(SUBSTRING(primeiro_nome FROM 1 FOR 1), 'A'));
            second_letter := UPPER(COALESCE(SUBSTRING(sobrenome FROM 1 FOR 1), 'A'));
            
            timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
            
            RETURN first_letter || second_letter || timestamp_str;
        END;
        $$ LANGUAGE plpgsql;

        -- Tabela principal
        CREATE TABLE IF NOT EXISTS membros (
            id TEXT PRIMARY KEY DEFAULT '',
            nome VARCHAR(100) NOT NULL,
            nome_completo VARCHAR(200),
            photo_url VARCHAR(500),
            data_nascimento DATE,
            idade INTEGER,
            mes VARCHAR(20),
            sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
            telefone VARCHAR(20),
            email VARCHAR(100),
            endereco VARCHAR(255),
            rua VARCHAR(150),
            numero VARCHAR(10),
            bairro VARCHAR(100),
            cidade VARCHAR(100),
            estado VARCHAR(50),
            cep VARCHAR(10),
            status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'desligado', 'inativo')),
            status_civil VARCHAR(20),
            conjuge VARCHAR(100),
            parentesco VARCHAR(50),
            batizado BOOLEAN DEFAULT FALSE,
            membro BOOLEAN DEFAULT FALSE,
            lider BOOLEAN DEFAULT FALSE,
            professor_ebq BOOLEAN DEFAULT FALSE,
            faixa_etaria VARCHAR(20),
            pequeno_grupo BOOLEAN DEFAULT FALSE,
            grupo VARCHAR(100),
            numero_domes INTEGER,
            data_batismo DATE,
            data_membresia DATE,
            data_desligamento DATE,
            observacoes TEXT,
            data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Trigger para auto-gerar ID
        CREATE OR REPLACE FUNCTION auto_generate_member_id()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.id IS NULL OR NEW.id = '' THEN
                NEW.id := generate_member_id(NEW.nome, NEW.nome_completo);
                
                WHILE EXISTS (SELECT 1 FROM membros WHERE id = NEW.id) LOOP
                    NEW.id := generate_member_id(NEW.nome, NEW.nome_completo);
                END LOOP;
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_auto_generate_member_id ON membros;
        CREATE TRIGGER trigger_auto_generate_member_id
            BEFORE INSERT ON membros
            FOR EACH ROW
            EXECUTE FUNCTION auto_generate_member_id();
    `;
    
    await client.query(createTableSQL);
}

// Executar se chamado diretamente
if (require.main === module) {
    setupPostgreSQL()
        .then(success => {
            if (success) {
                console.log('🎯 Pronto para migrar dados do Access!');
                process.exit(0);
            } else {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Erro fatal:', error);
            process.exit(1);
        });
}

module.exports = { setupPostgreSQL };