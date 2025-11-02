-- SCRIPT PARA EXPANDIR O CAMPO ID E CORRIGIR PK COM SUFIXO

-- 1. Primeiro expandir o campo ID para comportar o novo formato
ALTER TABLE membros ALTER COLUMN id TYPE VARCHAR(30);

-- 2. Atualizar função para formato mais compacto
CREATE OR REPLACE FUNCTION gerar_id_compacto(p_nome_completo VARCHAR)
RETURNS VARCHAR(30) AS $$
DECLARE
    letra_nome VARCHAR(1);
    letra_sobrenome VARCHAR(1);
    ano_str VARCHAR(4);
    mes_str VARCHAR(2);
    dia_str VARCHAR(2);
    hora_str VARCHAR(2);
    minuto_str VARCHAR(2);
    segundo_str VARCHAR(2);
    sufixo_aleatorio VARCHAR(4);
    codigo_final VARCHAR(30);
    contador INTEGER := 0;
    palavras TEXT[];
BEGIN
    -- Extrair primeira letra do nome e sobrenome
    palavras := STRING_TO_ARRAY(TRIM(p_nome_completo), ' ');
    letra_nome := UPPER(LEFT(palavras[1], 1));
    IF array_length(palavras, 1) > 1 THEN
        letra_sobrenome := UPPER(LEFT(palavras[array_length(palavras, 1)], 1));
    ELSE
        letra_sobrenome := 'X';
    END IF;

    ano_str := TO_CHAR(NOW(), 'YYYY');
    mes_str := TO_CHAR(NOW(), 'MM');
    dia_str := TO_CHAR(NOW(), 'DD');
    hora_str := TO_CHAR(NOW(), 'HH24');
    minuto_str := TO_CHAR(NOW(), 'MI');
    segundo_str := TO_CHAR(NOW(), 'SS');

    LOOP
        -- Sufixo aleatório (4 caracteres alfanuméricos)
        sufixo_aleatorio := UPPER(
            CHR(65 + (RANDOM() * 25)::INT) ||
            CHR(65 + (RANDOM() * 25)::INT) ||
            (RANDOM() * 9)::INT ||
            CHR(65 + (RANDOM() * 25)::INT)
        );

        -- Montar código final conforme solicitado
        codigo_final := letra_nome || letra_sobrenome || ano_str || mes_str || dia_str || hora_str || minuto_str || segundo_str || '-' || sufixo_aleatorio;

        -- Verificar se já existe
        IF NOT EXISTS (SELECT 1 FROM membros WHERE id = codigo_final) THEN
            EXIT;
        END IF;

        contador := contador + 1;

        -- Evitar loop infinito
        IF contador > 100 THEN
            codigo_final := letra_nome || letra_sobrenome || ano_str || mes_str || dia_str || hora_str || minuto_str || segundo_str || '-' || LPAD(contador::TEXT, 4, '0');
            EXIT;
        END IF;
    END LOOP;

    RETURN codigo_final;
END;
$$ LANGUAGE plpgsql;