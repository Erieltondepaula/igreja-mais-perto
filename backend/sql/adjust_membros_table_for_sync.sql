-- ═══════════════════════════════════════════════════════════════════════════════
-- AJUSTE DA TABELA MEMBROS PARA SINCRONIZAÇÃO COM EXCEL
-- ═══════════════════════════════════════════════════════════════════════════════
-- 
-- REGRA DE NEGÓCIO PRINCIPAL:
-- O campo `id_externo` armazena o "Id" da planilha Excel (Coluna B)
-- Este campo é a PONTE/CHAVE DE SINCRONIZAÇÃO que evita duplicidade
-- 
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Adicionar constraint UNIQUE no id_externo (se ainda não existe)
-- Isso garante que nunca teremos dois registros com o mesmo Id do Excel

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'membros_id_externo_unique'
    ) THEN
        ALTER TABLE membros 
        ADD CONSTRAINT membros_id_externo_unique 
        UNIQUE (id_externo);
        
        RAISE NOTICE '✅ Constraint UNIQUE adicionada em id_externo';
    ELSE
        RAISE NOTICE 'ℹ️ Constraint UNIQUE já existe em id_externo';
    END IF;
END $$;

-- 2. Criar índice no id_externo para melhorar performance das consultas de sincronização
-- A query "WHERE id_externo = ?" será executada para CADA linha do Excel

CREATE INDEX IF NOT EXISTS idx_membros_id_externo 
ON membros (id_externo);

COMMENT ON INDEX idx_membros_id_externo IS 
'Índice para otimizar consultas de sincronização com planilha Excel';

-- 3. Adicionar comentários explicativos nas colunas principais

COMMENT ON COLUMN membros.id IS 
'Chave Primária interna (UUID gerado pela aplicação)';

COMMENT ON COLUMN membros.id_externo IS 
'CHAVE DE SINCRONIZAÇÃO: Armazena o Id da planilha Excel (Coluna B). 
Esta é a ponte que comunica com o sistema legado.
UNIQUE para evitar duplicidade.
CRUCIAL para lógica de INSERT vs UPDATE';

COMMENT ON COLUMN membros.nome_completo IS 
'Nome completo do membro (usado para comparação na atualização)';

-- 4. Verificar estrutura atual
SELECT 
    'Verificação da Tabela Membros' as titulo,
    (SELECT COUNT(*) FROM membros) as total_registros,
    (SELECT COUNT(*) FROM membros WHERE id_externo IS NOT NULL) as registros_com_id_externo,
    (SELECT COUNT(*) FROM membros WHERE id_externo IS NULL) as registros_sem_id_externo;

-- 5. Mostrar constraints e índices
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'membros'::regclass
ORDER BY contype;

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════════
