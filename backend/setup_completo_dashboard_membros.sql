-- Script completo para configurar o banco dashboard_membros
-- Execute no pgAdmin conectado ao banco dashboard_membros

-- 1. Criar tabela membros
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

-- 2. Criar função para gerar ID customizado
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

-- 3. Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_membros_updated_at ON membros;
CREATE TRIGGER update_membros_updated_at
    BEFORE UPDATE ON membros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Inserir alguns dados de teste
INSERT INTO membros (id, nome, sobrenome, dataNascimento, email, telefone)
VALUES 
(generate_member_id('João', 'Silva'), 'João', 'Silva', '1990-01-15', 'joao@email.com', '11999999999'),
(generate_member_id('Maria', 'Santos'), 'Maria', 'Santos', '1985-03-20', 'maria@email.com', '11888888888'),
(generate_member_id('Pedro', 'Oliveira'), 'Pedro', 'Oliveira', '1992-07-10', 'pedro@email.com', '11777777777')
ON CONFLICT (nome, dataNascimento) DO NOTHING;

-- 5. Testar a função
SELECT 'Teste da função:' as info, generate_member_id('Teste', 'Usuario') as id_gerado;

-- 6. Ver dados inseridos
SELECT id, nome, sobrenome, dataNascimento, created_at FROM membros ORDER BY created_at;