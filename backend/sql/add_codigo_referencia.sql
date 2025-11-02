-- Adiciona a coluna codigo_referencia na tabela membros
ALTER TABLE membros ADD COLUMN codigo_referencia VARCHAR(32);
-- Opcional: Preencher com valor padrão ou nulo
UPDATE membros SET codigo_referencia = NULL WHERE codigo_referencia IS NULL;