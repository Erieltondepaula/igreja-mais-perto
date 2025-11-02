-- Script para recriar a tabela membros alinhada ao CSV, mantendo PK id e id_externo
DROP TABLE IF EXISTS membros CASCADE;
CREATE TABLE membros (
    id VARCHAR(20) PRIMARY KEY, -- PK personalizada
    id_externo VARCHAR(50),     -- ID do Excel ou sistema externo
    nome VARCHAR(100) NOT NULL, -- Nome (usado para PK)
    sobrenome VARCHAR(100) NOT NULL, -- Sobrenome (usado para PK)
    nome_completo VARCHAR(200), -- Coluna extra para referência
    data_nascimento DATE,
    idade INTEGER,
    mes VARCHAR(20),
    telefone VARCHAR(30),
    sexo VARCHAR(20),
    observacoes TEXT,
    status_civil VARCHAR(30),
    conjuge VARCHAR(100),
    parentesco VARCHAR(100),
    rua VARCHAR(100),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(10),
    cep VARCHAR(20),
    batizado BOOLEAN,
    membro BOOLEAN,
    situacao_atual VARCHAR(30),
    lider BOOLEAN,
    e_professor_ebq BOOLEAN,
    faixa_etaria VARCHAR(50),
    pequeno_grupo BOOLEAN,
    grupo VARCHAR(100),
    numerodomes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Trigger para updated_at
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
