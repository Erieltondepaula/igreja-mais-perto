-- Tabela principal de membros
CREATE TABLE public.membros (
    id VARCHAR(20) PRIMARY KEY,
    id_externo VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    nome_completo VARCHAR(200),
    data_nascimento DATE,
    idade INTEGER,
    mes VARCHAR(20),
    telefone VARCHAR(30),
    sexo VARCHAR(20),
    email VARCHAR(255),
    observacoes TEXT,
    status_civil VARCHAR(30),
    conjuge VARCHAR(100),
    parentesco VARCHAR(100),
    rua VARCHAR(100),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(10),
    cep VARCHAR(20),
    batizado BOOLEAN DEFAULT false,
    membro BOOLEAN DEFAULT false,
    situacao_atual VARCHAR(30) DEFAULT 'ativo',
    lider BOOLEAN DEFAULT false,
    e_professor_ebq BOOLEAN DEFAULT false,
    faixa_etaria VARCHAR(50),
    pequeno_grupo BOOLEAN DEFAULT false,
    grupo VARCHAR(100),
    numero_domes INTEGER,
    avatar_url TEXT,
    data_batismo DATE,
    data_membresia DATE,
    data_desligamento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para gerar ID customizado (AA + timestamp)
CREATE OR REPLACE FUNCTION public.generate_member_id(p_nome VARCHAR, p_sobrenome VARCHAR)
RETURNS VARCHAR(20) AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_membros_updated_at
    BEFORE UPDATE ON public.membros
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_membros_nome ON public.membros(nome);
CREATE INDEX idx_membros_situacao ON public.membros(situacao_atual);
CREATE INDEX idx_membros_bairro ON public.membros(bairro);
CREATE INDEX idx_membros_data_nascimento ON public.membros(data_nascimento);
CREATE INDEX idx_membros_mes ON public.membros(mes);

-- Habilitar RLS
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (para uso sem autenticação por enquanto)
CREATE POLICY "Allow public read access" ON public.membros
    FOR SELECT USING (true);

-- Política de inserção pública
CREATE POLICY "Allow public insert access" ON public.membros
    FOR INSERT WITH CHECK (true);

-- Política de atualização pública
CREATE POLICY "Allow public update access" ON public.membros
    FOR UPDATE USING (true);

-- Política de deleção pública
CREATE POLICY "Allow public delete access" ON public.membros
    FOR DELETE USING (true);