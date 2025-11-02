-- Adiciona campo para foto/avatar do membro
ALTER TABLE membros ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);