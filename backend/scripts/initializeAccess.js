// Script para inicialização automática do Microsoft Access
// Arquivo: backend/scripts/initializeAccess.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class AccessInitializer {
    constructor() {
        this.dbPath = path.join(__dirname, '../database/MembrosDB.accdb');
        this.dbDir = path.dirname(this.dbPath);
    }

    // Verificar se o Access está disponível no sistema
    async checkAccessAvailability() {
        console.log('🔍 Verificando disponibilidade do Microsoft Access...');
        
        try {
            // Verificar se o Access Runtime ou Full está instalado
            await execAsync('reg query "HKEY_CLASSES_ROOT\\Access.Application" /ve');
            console.log('✅ Microsoft Access detectado no sistema');
            return true;
        } catch (error) {
            try {
                // Tentar Access Runtime
                await execAsync('reg query "HKEY_CLASSES_ROOT\\Access.ACCDBFile" /ve');
                console.log('✅ Microsoft Access Runtime detectado');
                return true;
            } catch (runtimeError) {
                console.log('❌ Microsoft Access não encontrado');
                return false;
            }
        }
    }

    // Verificar se o diretório do banco existe
    ensureDatabaseDirectory() {
        if (!fs.existsSync(this.dbDir)) {
            console.log('📁 Criando diretório do banco de dados...');
            fs.mkdirSync(this.dbDir, { recursive: true });
        }
    }

    // Verificar se o banco existe
    databaseExists() {
        return fs.existsSync(this.dbPath);
    }

    // Criar banco Access usando VBScript (método mais confiável)
    async createDatabase() {
        console.log('🔨 Criando banco de dados Microsoft Access...');
        
        const vbsScript = `
Set accessApp = CreateObject("Access.Application")
accessApp.NewCurrentDatabase("${this.dbPath.replace(/\\/g, '\\\\')}")
accessApp.DoCmd.RunSQL "CREATE TABLE Members (ID COUNTER PRIMARY KEY, Nome TEXT(255), Email TEXT(255), Telefone TEXT(50), DataNascimento DATETIME, Genero TEXT(20), Estado TEXT(50), Cidade TEXT(100), Endereco TEXT(255), Profissao TEXT(100), EstadoCivil TEXT(50), Ativo YESNO DEFAULT True)"
accessApp.Quit
WScript.Echo "Banco criado com sucesso!"
        `;

        const vbsPath = path.join(__dirname, 'temp_create_db.vbs');
        
        try {
            fs.writeFileSync(vbsPath, vbsScript);
            await execAsync(`cscript //NoLogo "${vbsPath}"`);
            
            // Limpar arquivo temporário
            if (fs.existsSync(vbsPath)) {
                fs.unlinkSync(vbsPath);
            }
            
            console.log('✅ Banco de dados criado com sucesso!');
            return true;
        } catch (error) {
            console.error('❌ Erro ao criar banco:', error.message);
            
            // Limpar arquivo temporário mesmo em caso de erro
            if (fs.existsSync(vbsPath)) {
                fs.unlinkSync(vbsPath);
            }
            return false;
        }
    }

    // Verificar conectividade ODBC
    async testODBCConnection() {
        console.log('🔗 Testando conexão ODBC...');
        
        try {
            const odbc = require('odbc');
            const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${this.dbPath}`;
            
            const connection = await odbc.connect(connectionString);
            await connection.close();
            
            console.log('✅ Conexão ODBC funcionando corretamente');
            return true;
        } catch (error) {
            console.error('❌ Erro na conexão ODBC:', error.message);
            return false;
        }
    }

    // Função principal de inicialização
    async initialize() {
        console.log('🚀 Iniciando configuração automática do Microsoft Access...');
        console.log('='.repeat(60));

        // 1. Verificar disponibilidade do Access
        const accessAvailable = await this.checkAccessAvailability();
        if (!accessAvailable) {
            console.log('❌ Microsoft Access não está instalado!');
            console.log('💡 Instale o Microsoft Access ou Access Runtime');
            return false;
        }

        // 2. Garantir diretório existe
        this.ensureDatabaseDirectory();

        // 3. Verificar/Criar banco
        if (!this.databaseExists()) {
            console.log('📊 Banco de dados não encontrado, criando...');
            const created = await this.createDatabase();
            if (!created) {
                return false;
            }
        } else {
            console.log('📊 Banco de dados já existe');
        }

        // 4. Testar conexão
        const connectionOk = await this.testODBCConnection();
        if (!connectionOk) {
            return false;
        }

        console.log('='.repeat(60));
        console.log('🎉 Microsoft Access configurado e pronto para uso!');
        console.log(`📁 Banco localizado em: ${this.dbPath}`);
        return true;
    }

    // Método para verificar status sem criar
    async checkStatus() {
        console.log('📊 Verificando status do Microsoft Access...');
        
        const results = {
            accessInstalled: await this.checkAccessAvailability(),
            databaseExists: this.databaseExists(),
            odbcWorking: false
        };

        if (results.databaseExists) {
            results.odbcWorking = await this.testODBCConnection();
        }

        return results;
    }
}

// Se executado diretamente
if (require.main === module) {
    const initializer = new AccessInitializer();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'init';

    if (command === 'check') {
        // Apenas verificar status
        initializer.checkStatus().then(status => {
            console.log('📊 Status do Sistema:');
            console.log(`   Access instalado: ${status.accessInstalled ? '✅' : '❌'}`);
            console.log(`   Banco existe: ${status.databaseExists ? '✅' : '❌'}`);
            console.log(`   ODBC funcionando: ${status.odbcWorking ? '✅' : '❌'}`);
        });
    } else {
        // Inicialização completa
        initializer.initialize().then(success => {
            if (success) {
                console.log('✅ Inicialização completa!');
                process.exit(0);
            } else {
                console.log('❌ Falha na inicialização!');
                process.exit(1);
            }
        });
    }
}

module.exports = AccessInitializer;