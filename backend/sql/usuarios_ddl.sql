-- SCRIPT SQL PARA ADAPTAÇÃO DA TABELA MEMBROS
-- Adicionando campos necessários para o sistema de importação interativa

-- 1. Adicionar campos de controle se não existirem
ALTER TABLE membros 
ADD COLUMN IF NOT EXISTS id_externo VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS codigo_referencia VARCHAR(30) UNIQUE;

-- 2. Atualizar registros existentes com código de referência
UPDATE membros 
SET codigo_referencia = id 
WHERE codigo_referencia IS NULL;

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_membros_id_externo ON membros(id_externo);
CREATE INDEX IF NOT EXISTS idx_membros_codigo_referencia ON membros(codigo_referencia);

-- 4. Função para gerar código de referência único
CREATE OR REPLACE FUNCTION gerar_codigo_referencia(p_nome_completo VARCHAR)
RETURNS VARCHAR(30) AS $$
DECLARE
    iniciais VARCHAR(3);
    timestamp_str VARCHAR(14);
    sufixo_aleatorio VARCHAR(4);
    codigo_final VARCHAR(30);
    contador INTEGER := 0;
BEGIN
    -- Extrair iniciais (até 3 caracteres para evitar overflow)
    SELECT LEFT(STRING_AGG(UPPER(LEFT(palavra, 1)), ''), 3)
    INTO iniciais
    FROM (
        SELECT UNNEST(STRING_TO_ARRAY(TRIM(p_nome_completo), ' ')) AS palavra
    ) AS palavras
    LIMIT 3;
    
    -- Se não conseguir iniciais, usar 'XX'
    IF iniciais IS NULL OR LENGTH(iniciais) = 0 THEN
        iniciais := 'XX';
    END IF;
    
    LOOP
        -- Timestamp atual
        timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
        
        -- Sufixo aleatório (4 caracteres alfanuméricos)
        sufixo_aleatorio := UPPER(
            CHR(65 + (RANDOM() * 25)::INT) ||
            CHR(65 + (RANDOM() * 25)::INT) ||
            (RANDOM() * 9)::INT ||
            CHR(65 + (RANDOM() * 25)::INT)
        );
        
        -- Montar código final
        codigo_final := iniciais || timestamp_str || '-' || sufixo_aleatorio;
        
        -- Verificar se já existe
        IF NOT EXISTS (SELECT 1 FROM membros WHERE codigo_referencia = codigo_final) THEN
            EXIT;
        END IF;
        
        contador := contador + 1;
        
        -- Evitar loop infinito
        IF contador > 100 THEN
            codigo_final := iniciais || timestamp_str || '-' || LPAD(contador::TEXT, 4, '0');
            EXIT;
        END IF;
    END LOOP;
    
    RETURN codigo_final;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para gerar código automaticamente em novos registros
CREATE OR REPLACE FUNCTION trigger_gerar_codigo_referencia()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_referencia IS NULL THEN
        NEW.codigo_referencia := gerar_codigo_referencia(NEW.nome_completo);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS before_insert_gerar_codigo ON membros;
CREATE TRIGGER before_insert_gerar_codigo
    BEFORE INSERT ON membros
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_codigo_referencia();