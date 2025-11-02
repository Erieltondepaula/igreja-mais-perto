// ABORDAGEM ALTERNATIVA: Recriar tabela com ID TEXT personalizado
const db = require('../config/database');

async function recreateTableWithCustomID() {
  try {
    console.log('🔄 RECRIANDO TABELA COM ID PERSONALIZADO');
    console.log('========================================');
    
    await db.connect();
    
    // 1. Fazer backup da estrutura atual
    console.log('📋 Analisando estrutura atual...');
    const currentData = await db.query('SELECT COUNT(*) as total FROM Membros');
    console.log(`📊 Registros atuais: ${currentData[0].total}`);
    
    // 2. Renomear tabela atual
    console.log('\n📦 Fazendo backup da tabela atual...');
    try {
      await db.execute('DROP TABLE MembrosBackup');
    } catch (error) {
      // Tabela de backup não existe, ok
    }
    
    try {
      await db.execute('SELECT * INTO MembrosBackup FROM Membros');
      console.log('✅ Backup criado: MembrosBackup');
    } catch (error) {
      console.log('⚠️ Erro no backup, continuando...');
    }
    
    // 3. Dropar tabela atual
    console.log('\n🗑️ Removendo tabela atual...');
    await db.execute('DROP TABLE Membros');
    console.log('✅ Tabela removida');
    
    // 4. Criar nova tabela com ID TEXT
    console.log('\n🛠️ Criando nova tabela com ID personalizado...');
    const createTableSQL = `
      CREATE TABLE Membros (
        ID TEXT(20) PRIMARY KEY,
        Nome TEXT(100) NOT NULL,
        NomeCompleto TEXT(150),
        PhotoUrl TEXT(200),
        DataNascimento DATETIME,
        Idade INTEGER,
        Mes TEXT(20),
        Sexo TEXT(1),
        Telefone TEXT(20),
        Email TEXT(100),
        Endereco TEXT(200),
        Rua TEXT(100),
        Numero TEXT(10),
        Bairro TEXT(100),
        Cidade TEXT(100),
        Estado TEXT(2),
        CEP TEXT(10),
        Status TEXT(20) DEFAULT 'ativo',
        StatusCivil TEXT(20),
        Conjuge TEXT(100),
        Parentesco TEXT(100),
        Batizado YESNO DEFAULT No,
        Membro YESNO DEFAULT No,
        Lider YESNO DEFAULT No,
        ProfessorEBQ YESNO DEFAULT No,
        FaixaEtaria TEXT(20),
        PequenoGrupo YESNO DEFAULT No,
        Grupo TEXT(50),
        NumeroDomes INTEGER,
        DataBatismo DATETIME,
        DataMembresia DATETIME,
        DataDesligamento DATETIME,
        Observacoes MEMO,
        DataCriacao DATETIME DEFAULT Now(),
        DataAtualizacao DATETIME DEFAULT Now()
      )
    `;
    
    await db.execute(createTableSQL);
    console.log('✅ Nova tabela criada com ID TEXT personalizado!');
    
    // 5. Verificar se tabela foi criada
    const testTable = await db.query('SELECT COUNT(*) as total FROM Membros');
    console.log(`📊 Nova tabela criada: ${testTable[0].total} registros`);
    
    console.log('\n🎉 ESTRUTURA RECRIADA COM SUCESSO!');
    console.log('📋 Agora a tabela aceita IDs personalizados no formato AA20253010104302');
    console.log('🔄 Execute o script de importação novamente');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao recriar tabela:', error);
    process.exit(1);
  }
}

recreateTableWithCustomID();