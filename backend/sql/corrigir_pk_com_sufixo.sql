-- SCRIPT PARA CORRIGIR: USAR ID COMO PK COM SUFIXO
-- Remover o campo codigo_referencia e atualizar os IDs existentes

-- 1. Primeiro, vamos atualizar todos os IDs existentes para o formato com sufixo
DO $$
DECLARE
    registro RECORD;
    novo_id VARCHAR(30);
    contador INTEGER := 1;
BEGIN
    -- Para cada registro existente, gerar novo ID com sufixo
    FOR registro IN 
        SELECT id, nome_completo 
        FROM membros 
        ORDER BY id
    LOOP
        -- Gerar novo ID com sufixo usando a função existente
        SELECT gerar_codigo_referencia(registro.nome_completo) INTO novo_id;
        
        -- Atualizar o ID (PK)
        UPDATE membros SET id = novo_id WHERE id = registro.id;
        
        RAISE NOTICE 'Atualizado: % -> %', registro.id, novo_id;
        
        contador := contador + 1;
    END LOOP;
    
    RAISE NOTICE 'Total de registros atualizados: %', contador - 1;
END $$;

-- 2. Remover o campo codigo_referencia (não precisamos mais dele)
ALTER TABLE membros DROP COLUMN IF EXISTS codigo_referencia;

-- 3. Remover o campo id_externo também (usaremos apenas o ID principal)
ALTER TABLE membros DROP COLUMN IF EXISTS id_externo;

-- 4. Atualizar a função generate_unique_member_id para usar o novo formato
CREATE OR REPLACE FUNCTION generate_unique_member_id(
    p_nome VARCHAR, 
    p_nome_completo VARCHAR, 
    p_data_nascimento DATE DEFAULT NULL
)
RETURNS VARCHAR(30) AS $$
BEGIN
    -- Usar a função de gerar código de referência como ID principal
    RETURN gerar_codigo_referencia(p_nome_completo);
END;
$$ LANGUAGE plpgsql;

-- 5. Atualizar o trigger para usar apenas o ID principal
CREATE OR REPLACE FUNCTION trigger_gerar_id_com_sufixo()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o ID não foi fornecido, gerar automaticamente
    IF NEW.id IS NULL OR NEW.id = '' THEN
        NEW.id := gerar_codigo_referencia(NEW.nome_completo);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar o trigger
DROP TRIGGER IF EXISTS before_insert_gerar_codigo ON membros;
DROP TRIGGER IF EXISTS before_insert_gerar_id ON membros;

CREATE TRIGGER before_insert_gerar_id
    BEFORE INSERT ON membros
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_id_com_sufixo();

-- 6. Remover índices do campo removido
DROP INDEX IF EXISTS idx_membros_id_externo;
DROP INDEX IF EXISTS idx_membros_codigo_referencia;