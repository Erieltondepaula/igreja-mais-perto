// Local do arquivo: backend/config/database.js
// Configuração de conexão com Microsoft Access via ODBC

const odbc = require('odbc');
const path = require('path');

// Caminho para o arquivo Access
const ACCESS_DB_PATH = path.join(__dirname, '..', 'database', 'MembrosDB.accdb');

// String de conexão ODBC para Access
const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ACCESS_DB_PATH};`;

class AccessDatabase {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await odbc.connect(connectionString);
      console.log('✅ Conectado ao Microsoft Access com sucesso!');
      return this.connection;
    } catch (error) {
      console.error('❌ Erro ao conectar com Access:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      console.log('📤 Conexão com Access encerrada.');
    }
  }

  async query(sql, params = []) {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      const result = await this.connection.query(sql, params);
      return result;
    } catch (error) {
      console.error('❌ Erro na consulta SQL:', error);
      throw error;
    }
  }

  // Método para executar comandos (INSERT, UPDATE, DELETE)
  async execute(sql, params = []) {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      const result = await this.connection.query(sql, params);
      return result;
    } catch (error) {
      console.error('❌ Erro ao executar comando SQL:', error);
      throw error;
    }
  }
}

module.exports = new AccessDatabase();