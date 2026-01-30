-- Corrigir search_path nas funções para segurança
CREATE OR REPLACE FUNCTION public.generate_member_id(p_nome VARCHAR, p_sobrenome VARCHAR)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    primeira_letra VARCHAR(1);
    segunda_letra VARCHAR(1);
    timestamp_str VARCHAR(14);
    new_id VARCHAR(20);
BEGIN
    primeira_letra := UPPER(LEFT(TRIM(p_nome), 1));
    segunda_letra := UPPER(LEFT(TRIM(p_sobrenome), 1));
    timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
    new_id := primeira_letra || segunda_letra || timestamp_str;
    RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;