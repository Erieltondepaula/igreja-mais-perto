-- Adiciona as colunas 'conjuge' e 'lider' na tabela membros, se não existirem
ALTER TABLE membros ADD COLUMN IF NOT EXISTS conjuge VARCHAR(255);
ALTER TABLE membros ADD COLUMN IF NOT EXISTS lider VARCHAR(255);