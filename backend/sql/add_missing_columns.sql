-- Adiciona colunas que faltam na tabela membros
ALTER TABLE membros ADD COLUMN conjuge VARCHAR(100);
ALTER TABLE membros ADD COLUMN parentesco VARCHAR(100);
ALTER TABLE membros ADD COLUMN status_civil VARCHAR(50);
ALTER TABLE membros ADD COLUMN professor_ebq BOOLEAN DEFAULT FALSE;
ALTER TABLE membros ADD COLUMN faixa_etaria VARCHAR(50);
ALTER TABLE membros ADD COLUMN pequeno_grupo BOOLEAN DEFAULT FALSE;
ALTER TABLE membros ADD COLUMN grupo VARCHAR(100);
ALTER TABLE membros ADD COLUMN numero_domes INTEGER;
ALTER TABLE membros ADD COLUMN data_batismo DATE;
ALTER TABLE membros ADD COLUMN data_membresia DATE;
ALTER TABLE membros ADD COLUMN data_desligamento DATE;
ALTER TABLE membros ADD COLUMN observacoes TEXT;
ALTER TABLE membros ADD COLUMN data_criacao TIMESTAMP;
ALTER TABLE membros ADD COLUMN data_atualizacao TIMESTAMP;
