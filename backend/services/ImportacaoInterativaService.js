// SERVIÇO DE IMPORTAÇÃO INTERATIVA DE USUÁRIOS
const { Client } = require('pg');
const XLSX = require('xlsx');

class ImportacaoInterativaService {
  constructor() {
    this.dbConfig = {
      user: 'postgres',
      host: 'localhost',
      database: 'dashboard_membros',
      password: '252088',
      port: 5432,
    };
  }

  // Função para gerar código de referência
  async gerarCodigoReferencia(nomeCompleto) {
    const client = new Client(this.dbConfig);
    
    try {
      await client.connect();
      
      const result = await client.query(
        'SELECT gerar_codigo_referencia($1) AS codigo',
        [nomeCompleto]
      );
      
      return result.rows[0].codigo;
      
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      throw error;
    } finally {
      await client.end();
    }
  }

  // Verificar se usuário existe por ID externo
  async verificarUsuarioExistente(idExterno) {
    const client = new Client(this.dbConfig);
    
    try {
      await client.connect();
      
      const result = await client.query(
        'SELECT id, nome_completo, codigo_referencia, telefone, cidade FROM membros WHERE id_externo = $1',
        [idExterno]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
      
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      throw error;
    } finally {
      await client.end();
    }
  }

  // Criar novo usuário
  async criarNovoUsuario(dadosUsuario) {
    const client = new Client(this.dbConfig);
    
    try {
      await client.connect();
      
      // Gerar ID único usando a função existente
      const idResult = await client.query(
        'SELECT generate_unique_member_id($1, $2, $3) AS novo_id',
        [dadosUsuario.nome, dadosUsuario.sobrenome, dadosUsuario.dataNascimento]
      );
      
      const novoId = idResult.rows[0].novo_id;
      
      // Inserir novo usuário
      const result = await client.query(`
        INSERT INTO membros (
          id, id_externo, nome, nome_completo, sobrenome, data_nascimento,
          telefone, sexo, cidade, estado, endereco, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING id, codigo_referencia
      `, [
        novoId,
        dadosUsuario.idExterno,
        dadosUsuario.nome,
        dadosUsuario.nomeCompleto,
        dadosUsuario.sobrenome,
        dadosUsuario.dataNascimento,
        dadosUsuario.telefone,
        dadosUsuario.sexo,
        dadosUsuario.cidade,
        dadosUsuario.estado,
        dadosUsuario.endereco
      ]);
      
      return {
        sucesso: true,
        usuario: result.rows[0],
        acao: 'criado'
      };
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return {
        sucesso: false,
        erro: error.message,
        acao: 'erro'
      };
    } finally {
      await client.end();
    }
  }

  // Atualizar usuário existente
  async atualizarUsuario(idExterno, novosDados) {
    const client = new Client(this.dbConfig);
    
    try {
      await client.connect();
      
      const result = await client.query(`
        UPDATE membros 
        SET 
          nome_completo = $1,
          nome = $2,
          sobrenome = $3,
          telefone = $4,
          sexo = $5,
          cidade = $6,
          estado = $7,
          endereco = $8,
          updated_at = NOW()
        WHERE id_externo = $9
        RETURNING id, codigo_referencia, nome_completo
      `, [
        novosDados.nomeCompleto,
        novosDados.nome,
        novosDados.sobrenome,
        novosDados.telefone,
        novosDados.sexo,
        novosDados.cidade,
        novosDados.estado,
        novosDados.endereco,
        idExterno
      ]);
      
      return {
        sucesso: true,
        usuario: result.rows[0],
        acao: 'atualizado'
      };
      
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        sucesso: false,
        erro: error.message,
        acao: 'erro'
      };
    } finally {
      await client.end();
    }
  }

  // Processar arquivo Excel e retornar dados para análise
  async processarArquivoExcel(caminhoArquivo) {
    try {
      const workbook = XLSX.readFile(caminhoArquivo);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dados = XLSX.utils.sheet_to_json(worksheet);
      
      const resultados = [];
      
      for (let i = 0; i < dados.length; i++) {
        const linha = dados[i];
        
        // Mapear dados do Excel
        const dadosLinha = {
          linha: i + 1,
          idExterno: linha.Id || linha.id || linha.ID,
          nomeCompleto: linha['Nome Completo'] || linha.nome || linha.Nome,
          telefone: linha.telefone || linha.Telefone,
          sexo: linha.sexo || linha.Sexo,
          cidade: linha.cidade || linha.Cidade,
          estado: linha.estado || linha.Estado,
          endereco: linha.endereco || linha.Endereco,
          dataNascimento: linha.data_nascimento || linha['Data Nascimento']
        };
        
        // Extrair nome e sobrenome
        if (dadosLinha.nomeCompleto) {
          const partes = dadosLinha.nomeCompleto.trim().split(/\s+/);
          dadosLinha.nome = partes[0];
          dadosLinha.sobrenome = partes.length > 1 ? partes.slice(1).join(' ') : partes[0];
        }
        
        // Verificar se usuário já existe
        const usuarioExistente = await this.verificarUsuarioExistente(dadosLinha.idExterno);
        
        const resultado = {
          ...dadosLinha,
          usuarioExistente,
          requerConfirmacao: false,
          acao: 'pendente'
        };
        
        if (usuarioExistente) {
          // Verificar se há diferenças
          const diferencas = this.compararDados(usuarioExistente, dadosLinha);
          resultado.diferencas = diferencas;
          resultado.requerConfirmacao = diferencas.length > 0;
          resultado.acao = diferencas.length > 0 ? 'confirmar_atualizacao' : 'sem_alteracao';
        } else {
          resultado.acao = 'criar_novo';
        }
        
        resultados.push(resultado);
      }
      
      return {
        sucesso: true,
        dados: resultados,
        totalLinhas: dados.length
      };
      
    } catch (error) {
      console.error('Erro ao processar Excel:', error);
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Comparar dados para identificar diferenças
  compararDados(dadosDB, dadosExcel) {
    const diferencas = [];
    
    const campos = [
      { nome: 'nomeCompleto', label: 'Nome Completo', db: 'nome_completo' },
      { nome: 'telefone', label: 'Telefone', db: 'telefone' },
      { nome: 'cidade', label: 'Cidade', db: 'cidade' }
    ];
    
    campos.forEach(campo => {
      const valorDB = dadosDB[campo.db] || '';
      const valorExcel = dadosExcel[campo.nome] || '';
      
      if (valorDB.trim() !== valorExcel.trim()) {
        diferencas.push({
          campo: campo.nome,
          label: campo.label,
          valorAtual: valorDB,
          valorNovo: valorExcel
        });
      }
    });
    
    return diferencas;
  }

  // Executar ação após confirmação do usuário
  async executarAcao(dadosLinha, acao) {
    try {
      switch (acao) {
        case 'criar_novo':
          return await this.criarNovoUsuario(dadosLinha);
          
        case 'atualizar':
          return await this.atualizarUsuario(dadosLinha.idExterno, dadosLinha);
          
        case 'ignorar':
          return {
            sucesso: true,
            acao: 'ignorado',
            mensagem: 'Linha ignorada pelo usuário'
          };
          
        default:
          return {
            sucesso: false,
            erro: 'Ação não reconhecida: ' + acao
          };
      }
    } catch (error) {
      return {
        sucesso: false,
        erro: error.message,
        acao: 'erro'
      };
    }
  }
}

module.exports = ImportacaoInterativaService;