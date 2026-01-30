// Local do arquivo: backend/scripts/setupDatabase.js
// Script para configurar e criar o banco de dados Access

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const accessDB = require('../config/database');

class AccessDatabaseSetup {
  
  constructor() {
    this.dbPath = path.join(__dirname, '../database/MembrosDB.accdb');
    this.sqlScript = path.join(__dirname, '../database/create_access_tables.sql');
  }

  // ===================================
  // VERIFICAR SE O ACCESS ESTÁ INSTALADO
  // ===================================
  async checkAccessInstallation() {
    return new Promise((resolve) => {
      exec('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Office" /s | findstr Access', (error) => {
        if (error) {
          console.log('⚠️ Microsoft Access pode não estar instalado.');
          console.log('💡 Dica: Instale o Microsoft Access ou use o Access Runtime (gratuito)');
          resolve(false);
        } else {
          console.log('✅ Microsoft Access detectado no sistema!');
          resolve(true);
        }
      });
    });
  }

  // ===================================
  // CRIAR ARQUIVO ACCESS VAZIO
  // ===================================
  async createAccessFile() {
    try {
      const dbDir = path.dirname(this.dbPath);
      
      // Criar diretório se não existir
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`📁 Diretório criado: ${dbDir}`);
      }

      // Verificar se arquivo já existe
      if (fs.existsSync(this.dbPath)) {
        console.log('⚠️ Arquivo Access já existe. Deseja sobrescrever? (y/N)');
        // Em produção, você pode adicionar lógica de confirmação aqui
        return true;
      }

      // Criar arquivo Access usando ADOX (via script VBS)
      const vbsScript = `
        Dim cat
        Set cat = CreateObject("ADOX.Catalog")
        cat.Create "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${this.dbPath.replace(/\\/g, '\\\\')}"
        Set cat = Nothing
        WScript.Echo "Banco Access criado com sucesso!"
      `;

      const vbsPath = path.join(__dirname, 'temp_create_db.vbs');
      fs.writeFileSync(vbsPath, vbsScript);

      return new Promise((resolve, reject) => {
        exec(`cscript //NoLogo "${vbsPath}"`, (error, stdout, stderr) => {
          // Limpar arquivo temporário
          fs.unlinkSync(vbsPath);
          
          if (error) {
            console.error('❌ Erro ao criar arquivo Access:', stderr);
            reject(error);
          } else {
            console.log('✅ Arquivo Access criado:', this.dbPath);
            resolve(true);
          }
        });
      });

    } catch (error) {
      console.error('❌ Erro ao criar arquivo Access:', error);
      throw error;
    }
  }

  // ===================================
  // CRIAR TABELAS NO ACCESS
  // ===================================
  async createTables() {
    try {
      console.log('📋 Criando estrutura das tabelas...');
      
      // Conectar ao banco
      await accessDB.connect();

      // SQL para criar tabela de membros (sintaxe corrigida para Access)
      const createMembrosSQL = `
        CREATE TABLE Membros (
          ID COUNTER PRIMARY KEY,
          Nome TEXT(100) NOT NULL,
          NomeCompleto TEXT(200),
          PhotoUrl TEXT(255),
          DataNascimento DATE NOT NULL,
          Idade INTEGER,
          Mes TEXT(20),
          Sexo TEXT(1) NOT NULL,
          Telefone TEXT(20),
          Email TEXT(100),
          Endereco TEXT(255),
          Rua TEXT(150),
          Numero TEXT(10),
          Bairro TEXT(100),
          Cidade TEXT(100),
          Estado TEXT(50),
          CEP TEXT(10),
          Status TEXT(20),
          StatusCivil TEXT(20),
          Conjuge TEXT(100),
          Parentesco TEXT(50),
          Batizado YESNO,
          Membro YESNO,
          Lider YESNO,
          ProfessorEBQ YESNO,
          FaixaEtaria TEXT(20),
          PequenoGrupo YESNO,
          Grupo TEXT(100),
          NumeroDomes INTEGER,
          DataBatismo DATE,
          DataMembresia DATE,
          DataDesligamento DATE,
          Observacoes MEMO,
          DataCriacao DATE,
          DataAtualizacao DATE
        )
      `;

      await accessDB.execute(createMembrosSQL);
      console.log('✅ Tabela Membros criada');

      // Criar índices para melhor performance
      const indexes = [
        "CREATE INDEX idx_membros_nome ON Membros (Nome)",
        "CREATE INDEX idx_membros_status ON Membros (Status)",
        "CREATE INDEX idx_membros_bairro ON Membros (Bairro)",
        "CREATE INDEX idx_membros_datanasc ON Membros (DataNascimento)"
      ];

      for (const indexSQL of indexes) {
        try {
          await accessDB.execute(indexSQL);
        } catch (error) {
          // Índice pode já existir, continuar
          console.log(`⚠️ Índice já existe ou erro: ${error.message}`);
        }
      }

      console.log('✅ Índices criados');

      // Criar tabelas auxiliares
      await this.createAuxiliaryTables();

      console.log('✅ Estrutura do banco criada com sucesso!');
      return true;

    } catch (error) {
      console.error('❌ Erro ao criar tabelas:', error);
      throw error;
    }
  }

  // ===================================
  // CRIAR TABELAS AUXILIARES
  // ===================================
  async createAuxiliaryTables() {
    try {
      // Tabela de Grupos
      const createGruposSQL = `
        CREATE TABLE Grupos (
          ID COUNTER PRIMARY KEY,
          NomeGrupo TEXT(100) NOT NULL,
          Descricao MEMO,
          TipoGrupo TEXT(50),
          LiderID INTEGER,
          DataCriacao DATE,
          Ativo YESNO
        )
      `;

      await accessDB.execute(createGruposSQL);
      console.log('✅ Tabela Grupos criada');

      // Tabela de Eventos
      const createEventosSQL = `
        CREATE TABLE Eventos (
          ID COUNTER PRIMARY KEY,
          Titulo TEXT(200) NOT NULL,
          Descricao MEMO,
          DataEvento DATE NOT NULL,
          HoraInicio DATE,
          HoraFim DATE,
          TipoEvento TEXT(50),
          Local TEXT(200),
          Responsavel INTEGER,
          DataCriacao DATE
        )
      `;

      await accessDB.execute(createEventosSQL);
      console.log('✅ Tabela Eventos criada');

      // Tabela de Histórico
      const createHistoricoSQL = `
        CREATE TABLE HistoricoAlteracoes (
          ID COUNTER PRIMARY KEY,
          MembroID INTEGER NOT NULL,
          CampoAlterado TEXT(50) NOT NULL,
          ValorAnterior MEMO,
          ValorNovo MEMO,
          UsuarioAlteracao TEXT(100),
          DataAlteracao DATE
        )
      `;

      await accessDB.execute(createHistoricoSQL);
      console.log('✅ Tabela HistoricoAlteracoes criada');

    } catch (error) {
      console.error('❌ Erro ao criar tabelas auxiliares:', error);
      // Não falhar por causa das tabelas auxiliares
    }
  }

  // ===================================
  // INSERIR DADOS DE EXEMPLO
  // ===================================
  async insertSampleData() {
    try {
      console.log('📊 Inserindo dados de exemplo...');

      const sampleMembers = [
        {
          nome: 'João Silva',
          dataNascimento: '1990-05-15',
          sexo: 'M',
          telefone: '(11) 99999-0001',
          bairro: 'Centro',
          status: 'ativo',
          batizado: true,
          membro: true,
          lider: false
        },
        {
          nome: 'Maria Santos',
          dataNascimento: '1985-08-22',
          sexo: 'F',
          telefone: '(11) 99999-0002',
          bairro: 'Jardim das Flores',
          status: 'ativo',
          batizado: true,
          membro: true,
          lider: true
        },
        {
          nome: 'Pedro Oliveira',
          dataNascimento: '1995-12-03',
          sexo: 'M',
          telefone: '(11) 99999-0003',
          bairro: 'Vila Nova',
          status: 'ativo',
          batizado: false,
          membro: false,
          lider: false
        }
      ];

      for (const member of sampleMembers) {
        const sql = `
          INSERT INTO Membros (Nome, DataNascimento, Sexo, Telefone, Bairro, Status, Batizado, Membro, Lider, DataCriacao, DataAtualizacao)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, Date(), Date())
        `;
        
        const params = [
          member.nome,
          member.dataNascimento,
          member.sexo,
          member.telefone,
          member.bairro,
          member.status,
          member.batizado,
          member.membro,
          member.lider
        ];

        await accessDB.execute(sql, params);
      }

      console.log(`✅ ${sampleMembers.length} membros de exemplo inseridos`);

    } catch (error) {
      console.error('❌ Erro ao inserir dados de exemplo:', error);
      // Não falhar por causa dos dados de exemplo
    }
  }

  // ===================================
  // SETUP COMPLETO
  // ===================================
  async runSetup(options = {}) {
    try {
      console.log('🚀 Iniciando configuração do banco Access...\n');

      // 1. Verificar instalação do Access
      const accessInstalled = await this.checkAccessInstallation();
      
      if (!accessInstalled && !options.force) {
        console.log('❌ Setup cancelado. Use --force para continuar mesmo assim.');
        return false;
      }

      // 2. Criar arquivo Access
      console.log('\n📁 Criando arquivo do banco...');
      await this.createAccessFile();

      // 3. Criar estrutura das tabelas
      console.log('\n📋 Criando estrutura das tabelas...');
      await this.createTables();

      // 4. Inserir dados de exemplo (opcional)
      if (options.sampleData) {
        console.log('\n📊 Inserindo dados de exemplo...');
        await this.insertSampleData();
      }

      console.log('\n🎉 Setup do banco Access concluído com sucesso!');
      console.log(`📍 Localização: ${this.dbPath}`);
      console.log('\n📝 Próximos passos:');
      console.log('   1. Execute: npm install (para instalar dependências)');
      console.log('   2. Execute: npm run dev (para iniciar o servidor)');
      console.log('   3. Importe seus dados: node scripts/excelToAccess.js');

      return true;

    } catch (error) {
      console.error('\n❌ Erro no setup:', error);
      return false;
    }
  }
}

// ===================================
// EXECUTAR SE CHAMADO DIRETAMENTE
// ===================================
if (require.main === module) {
  const setup = new AccessDatabaseSetup();
  
  // Opções da linha de comando
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force'),
    sampleData: args.includes('--sample-data')
  };
  
  setup.runSetup(options)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Setup falhou:', error);
      process.exit(1);
    });
}

module.exports = AccessDatabaseSetup;