-- Script para popular campo numerodomes automaticamente
-- Este campo armazena o número do mês de nascimento (1-12) para facilitar ordenação e filtros

-- Atualizar registros existentes
UPDATE membros 
SET numerodomes = EXTRACT(MONTH FROM data_nascimento)
WHERE data_nascimento IS NOT NULL AND numerodomes IS NULL;

-- Criar função para preencher automaticamente
CREATE OR REPLACE FUNCTION atualizar_numerodomes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.data_nascimento IS NOT NULL THEN
        NEW.numerodomes = EXTRACT(MONTH FROM NEW.data_nascimento);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para INSERT
DROP TRIGGER IF EXISTS trigger_numerodomes_insert ON membros;
CREATE TRIGGER trigger_numerodomes_insert
    BEFORE INSERT ON membros
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_numerodomes();

-- Criar trigger para UPDATE
DROP TRIGGER IF EXISTS trigger_numerodomes_update ON membros;
CREATE TRIGGER trigger_numerodomes_update
    BEFORE UPDATE ON membros
    FOR EACH ROW
    WHEN (NEW.data_nascimento IS DISTINCT FROM OLD.data_nascimento)
    EXECUTE FUNCTION atualizar_numerodomes();

-- Verificar resultado
SELECT 
    numerodomes,
    COUNT(*) as total_pessoas,
    CASE numerodomes
        WHEN 1 THEN 'Janeiro'
        WHEN 2 THEN 'Fevereiro'
        WHEN 3 THEN 'Março'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Maio'
        WHEN 6 THEN 'Junho'
        WHEN 7 THEN 'Julho'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Setembro'
        WHEN 10 THEN 'Outubro'
        WHEN 11 THEN 'Novembro'
        WHEN 12 THEN 'Dezembro'
    END as mes_nome
FROM membros
WHERE numerodomes IS NOT NULL
GROUP BY numerodomes
ORDER BY numerodomes;
