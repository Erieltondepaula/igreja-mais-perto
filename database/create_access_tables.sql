-- Script SQL para criar as tabelas no Microsoft Access
-- Execute este script no Access ou salve como .sql

-- ===================================
-- TABELA PRINCIPAL DE MEMBROS
-- ===================================
CREATE TABLE Membros (
    ID AUTOINCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    NomeCompleto VARCHAR(200),
    PhotoUrl VARCHAR(500),
    DataNascimento DATE NOT NULL,
    Idade INTEGER,
    Mes VARCHAR(20),
    Sexo VARCHAR(1) NOT NULL CHECK (Sexo IN ('M', 'F')),
    Telefone VARCHAR(20),
    Email VARCHAR(100),
    Endereco VARCHAR(300),
    Rua VARCHAR(150),
    Numero VARCHAR(10),
    Bairro VARCHAR(100),
    Cidade VARCHAR(100),
    Estado VARCHAR(50),
    CEP VARCHAR(10),
    Status VARCHAR(20) DEFAULT 'ativo' CHECK (Status IN ('ativo', 'desligado')),
    StatusCivil VARCHAR(20),
    Conjuge VARCHAR(100),
    Parentesco VARCHAR(50),
    Batizado YESNO DEFAULT No,
    Membro YESNO DEFAULT No,
    Lider YESNO DEFAULT No,
    ProfessorEBQ YESNO DEFAULT No,
    FaixaEtaria VARCHAR(20),
    PequenoGrupo YESNO DEFAULT No,
    Grupo VARCHAR(100),
    NumeroDomes INTEGER,
    DataBatismo DATE,
    DataMembresia DATE,
    DataDesligamento DATE,
    Observacoes MEMO,
    DataCriacao DATETIME DEFAULT Now(),
    DataAtualizacao DATETIME DEFAULT Now()
);

-- ===================================
-- TABELA DE GRUPOS/MINISTÉRIOS
-- ===================================
CREATE TABLE Grupos (
    ID AUTOINCREMENT PRIMARY KEY,
    NomeGrupo VARCHAR(100) NOT NULL,
    Descricao MEMO,
    TipoGrupo VARCHAR(50), -- 'Pequeno Grupo', 'Ministério', 'Departamento'
    LiderID INTEGER,
    DataCriacao DATETIME DEFAULT Now(),
    Ativo YESNO DEFAULT Yes,
    FOREIGN KEY (LiderID) REFERENCES Membros(ID)
);

-- ===================================
-- TABELA DE EVENTOS/CALENDÁRIO
-- ===================================
CREATE TABLE Eventos (
    ID AUTOINCREMENT PRIMARY KEY,
    Titulo VARCHAR(200) NOT NULL,
    Descricao MEMO,
    DataEvento DATE NOT NULL,
    HoraInicio TIME,
    HoraFim TIME,
    TipoEvento VARCHAR(50), -- 'Culto', 'Reunião', 'Aniversário', 'Casamento', etc.
    Local VARCHAR(200),
    Responsavel INTEGER,
    DataCriacao DATETIME DEFAULT Now(),
    FOREIGN KEY (Responsavel) REFERENCES Membros(ID)
);

-- ===================================
-- TABELA DE PARTICIPAÇÃO EM GRUPOS
-- ===================================
CREATE TABLE MembrosGrupos (
    ID AUTOINCREMENT PRIMARY KEY,
    MembroID INTEGER NOT NULL,
    GrupoID INTEGER NOT NULL,
    DataIngresso DATE DEFAULT Date(),
    DataSaida DATE,
    Funcao VARCHAR(50), -- 'Membro', 'Líder', 'Vice-Líder', etc.
    Ativo YESNO DEFAULT Yes,
    FOREIGN KEY (MembroID) REFERENCES Membros(ID),
    FOREIGN KEY (GrupoID) REFERENCES Grupos(ID)
);

-- ===================================
-- TABELA DE HISTÓRICO DE ALTERAÇÕES
-- ===================================
CREATE TABLE HistoricoAlteracoes (
    ID AUTOINCREMENT PRIMARY KEY,
    MembroID INTEGER NOT NULL,
    CampoAlterado VARCHAR(50) NOT NULL,
    ValorAnterior MEMO,
    ValorNovo MEMO,
    UsuarioAlteracao VARCHAR(100),
    DataAlteracao DATETIME DEFAULT Now(),
    FOREIGN KEY (MembroID) REFERENCES Membros(ID)
);

-- ===================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ===================================
CREATE INDEX idx_membros_nome ON Membros (Nome);
CREATE INDEX idx_membros_status ON Membros (Status);
CREATE INDEX idx_membros_bairro ON Membros (Bairro);
CREATE INDEX idx_membros_datanasc ON Membros (DataNascimento);
CREATE INDEX idx_eventos_data ON Eventos (DataEvento);

-- ===================================
-- VIEWS PARA CONSULTAS FREQUENTES
-- ===================================

-- View para Membros Ativos com Idade Calculada
CREATE VIEW v_MembrosAtivos AS
SELECT 
    m.*,
    DateDiff("yyyy", m.DataNascimento, Date()) AS IdadeCalculada,
    CASE 
        WHEN DateDiff("yyyy", m.DataNascimento, Date()) BETWEEN 0 AND 6 THEN 'Infância'
        WHEN DateDiff("yyyy", m.DataNascimento, Date()) BETWEEN 7 AND 10 THEN 'Crianças'
        WHEN DateDiff("yyyy", m.DataNascimento, Date()) BETWEEN 11 AND 17 THEN 'Adolescentes'
        WHEN DateDiff("yyyy", m.DataNascimento, Date()) BETWEEN 18 AND 35 THEN 'Jovens'
        WHEN DateDiff("yyyy", m.DataNascimento, Date()) BETWEEN 36 AND 59 THEN 'Adultos'
        ELSE 'Idosos'
    END AS FaixaEtariaCalculada
FROM Membros m
WHERE m.Status = 'ativo';

-- View para Aniversariantes do Mês
CREATE VIEW v_AniversariantesMes AS
SELECT 
    m.*,
    DateDiff("yyyy", m.DataNascimento, Date()) AS Idade,
    Day(m.DataNascimento) AS DiaAniversario
FROM Membros m
WHERE Month(m.DataNascimento) = Month(Date()) 
    AND m.Status = 'ativo'
ORDER BY Day(m.DataNascimento);

-- View para Estatísticas Gerais
CREATE VIEW v_EstatisticasGerais AS
SELECT 
    COUNT(*) AS TotalMembros,
    SUM(IIf(Status='ativo', 1, 0)) AS MembrosAtivos,
    SUM(IIf(Status='desligado', 1, 0)) AS MembrosDesligados,
    SUM(IIf(Sexo='M' AND Status='ativo', 1, 0)) AS HomensAtivos,
    SUM(IIf(Sexo='F' AND Status='ativo', 1, 0)) AS MulheresAtivas,
    SUM(IIf(Batizado=True AND Status='ativo', 1, 0)) AS BatizadosAtivos,
    SUM(IIf(Lider=True AND Status='ativo', 1, 0)) AS LideresAtivos
FROM Membros;