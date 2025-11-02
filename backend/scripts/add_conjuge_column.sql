-- Adiciona a coluna 'conjuge' na tabela membros, se não existir
ALTER TABLE membros ADD COLUMN IF NOT EXISTS conjuge VARCHAR(255);