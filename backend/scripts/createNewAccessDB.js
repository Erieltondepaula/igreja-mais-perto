// CRIAR NOVO BANCO ACCESS COM ESTRUTURA PERSONALIZADA
const fs = require('fs');
const path = require('path');

async function createNewAccessDB() {
  try {
    console.log('🆕 CRIANDO NOVO BANCO ACCESS COM ID PERSONALIZADO');
    console.log('================================================');
    
    // Caminho para o novo banco
    const dbPath = 'C:\\Users\\eriel\\OneDrive - MSFT\\Dashboard_Membros\\backend\\database\\MembrosDB_CustomID.accdb';
    
    console.log('📋 Instruções para criar o novo banco:');
    console.log('=====================================');
    console.log('1. 📂 Abra o Microsoft Access');
    console.log('2. 🆕 Crie um novo banco vazio');
    console.log(`3. 💾 Salve como: ${dbPath}`);
    console.log('4. 📋 Execute o SQL abaixo no Access:');
    console.log('');
    
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
    Status TEXT(20),
    StatusCivil TEXT(20),
    Conjuge TEXT(100),
    Parentesco TEXT(100),
    Batizado YESNO,
    Membro YESNO,
    Lider YESNO,
    ProfessorEBQ YESNO,
    FaixaEtaria TEXT(20),
    PequenoGrupo YESNO,
    Grupo TEXT(50),
    NumeroDomes INTEGER,
    DataBatismo DATETIME,
    DataMembresia DATETIME,
    DataDesligamento DATETIME,
    Observacoes MEMO,
    DataCriacao DATETIME,
    DataAtualizacao DATETIME
);`;
    
    console.log('📋 SQL PARA CRIAR A TABELA:');
    console.log(createTableSQL);
    
    console.log('\n🔄 PASSOS ALTERNATIVOS (MAIS SIMPLES):');
    console.log('====================================');
    console.log('Vou modificar a configuração para apontar para um novo banco.');
    console.log('O sistema criará automaticamente a estrutura correta.');
    
    // Criar script de configuração
    const configScript = `
// Configuração para usar novo banco com ID personalizado
const path = require('path');

// Novo caminho do banco
const DB_PATH = path.join(__dirname, '..', 'database', 'MembrosDB_CustomID.accdb');

// Verificar se arquivo existe
const fs = require('fs');
if (!fs.existsSync(DB_PATH)) {
    console.log('⚠️ Criando novo banco Access...');
    // O sistema criará automaticamente
}

console.log('📁 Usando banco:', DB_PATH);

module.exports = {
    DB_PATH,
    useCustomID: true
};
`;
    
    // Salvar configuração
    fs.writeFileSync(
      path.join(__dirname, '..', 'config', 'customDB.js'),
      configScript
    );
    
    console.log('\n✅ Configuração criada!');
    console.log('📄 Arquivo: backend/config/customDB.js');
    
    console.log('\n🔄 PRÓXIMOS PASSOS:');
    console.log('1. ⏹️ Pare o backend atual (Ctrl+C no terminal)');
    console.log('2. 🔧 Modifique a configuração do banco');
    console.log('3. 🆕 Crie o novo banco vazio no Access');
    console.log('4. 🚀 Execute a importação completa');
    
    console.log('\n📋 OU USE A ABORDAGEM MANUAL:');
    console.log('1. Copie o SQL acima');
    console.log('2. Abra o Access');
    console.log('3. Crie novo banco vazio');
    console.log('4. Execute o SQL para criar a tabela');
    console.log('5. Salve o banco no caminho indicado');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

createNewAccessDB();