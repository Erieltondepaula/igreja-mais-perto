// Serviço de Sincronização com Google Sheets em Tempo Real
const axios = require('axios');
const logger = require('../config/logger');

class GoogleSheetsSync {
  constructor() {
    // URL pública da planilha (formato CSV)
    this.sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdZMkpYxYB5uydpPPPhJWL0uPyBa44JOWzSyDQxcKof3mAbfvOCk2c9nZOiOFkRz7convCRILjtzuH/pub?gid=2093457985&single=true&output=csv';
  }

  /**
   * Busca dados da planilha do Google Sheets
   */
  async fetchSheetData() {
    try {
      logger.info('🔄 Buscando dados do Google Sheets...');
      
      const response = await axios.get(this.sheetUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Dashboard-Membros/1.0'
        }
      });

      if (response.status !== 200) {
        throw new Error(`Erro ao buscar planilha: Status ${response.status}`);
      }

      const csvData = response.data;
      logger.info('✅ Dados baixados com sucesso do Google Sheets');
      
      return csvData;
    } catch (error) {
      logger.error(`❌ Erro ao buscar Google Sheets: ${error.message}`);
      throw new Error(`Falha ao conectar com Google Sheets: ${error.message}`);
    }
  }

  /**
   * Converte CSV para array de objetos
   */
  parseCSV(csvData) {
    try {
      const lines = csvData.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Planilha vazia ou sem dados');
      }

      // Primeira linha = cabeçalhos
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Restante = dados
      const rows = lines.slice(1).map(line => {
        // Parser CSV avançado que lida com vírgulas dentro de aspas
        const values = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim().replace(/"/g, ''));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim().replace(/"/g, ''));
        
        // Criar objeto com cabeçalhos
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        
        return obj;
      });

      logger.info(`✅ CSV parseado: ${rows.length} registros encontrados`);
      return rows;
    } catch (error) {
      logger.error(`❌ Erro ao parsear CSV: ${error.message}`);
      throw new Error(`Erro ao processar dados da planilha: ${error.message}`);
    }
  }

  /**
   * Converte dados do Google Sheets para formato do banco
   */
  transformToMembers(data) {
    const MemberService = require('./MemberServicePostgreSQL');
    
    const membros = data.map((row, index) => {
      try {
        // Função auxiliar para converter Sim/Não
        const toBoolean = (val) => {
          if (!val) return false;
          const str = String(val).trim().toLowerCase();
          return str === 'sim' || str === 'true' || str === '1';
        };

        // Função para dividir nome
        const splitNome = (nomeCompleto) => {
          if (!nomeCompleto) return { nome: '', sobrenome: '' };
          const partes = String(nomeCompleto).trim().split(' ');
          return {
            nome: partes[0] || '',
            sobrenome: partes.slice(1).join(' ') || ''
          };
        };

        // Função para normalizar sexo
        const normalizeSexo = (sexo) => {
          if (!sexo) return '';
          const s = String(sexo).trim().toLowerCase();
          if (s === 'masculino' || s === 'm') return 'M';
          if (s === 'feminino' || s === 'f') return 'F';
          // Tenta pegar só a primeira letra se for válido
          if (s[0] === 'm') return 'M';
          if (s[0] === 'f') return 'F';
          return '';
        };

        // Mapear campos da planilha para o banco
        const nomeCompleto = row['Nome'] || row['Nome Completo'] || row['nome'] || '';
        const { nome, sobrenome } = splitNome(nomeCompleto);

        return {
          id_externo: row['ID'] || row['Id'] || row['id'],
          nome,
          sobrenome,
          nome_completo: nomeCompleto,
          data_nascimento: row['Data de Nascimento'] || row['data_nascimento'] || row['Data Nascimento'],
          idade: parseInt(row['Idade'] || row['idade']) || null,
          mes: row['Mês'] || row['mes'] || row['Mes'],
          telefone: row['Telefone'] || row['telefone'] || row['Celular'],
          sexo: normalizeSexo(row['Sexo'] || row['sexo'] || row['Gênero']),
          observacoes: row['Observações'] || row['observacoes'] || row['Obs'],
          status_civil: row['Estado Civil'] || row['status_civil'] || row['Status Civil'],
          conjuge: row['Cônjuge'] || row['conjuge'] || row['Nome Cônjuge'],
          parentesco: row['Parentesco'] || row['parentesco'],
          rua: row['Rua'] || row['rua'] || row['Endereço'],
          numero: row['Número'] || row['numero'] || row['Numero'],
          bairro: row['Bairro'] || row['bairro'],
          cidade: row['Cidade'] || row['cidade'],
          estado: row['Estado'] || row['estado'] || row['UF'],
          cep: row['CEP'] || row['cep'],
          batizado: toBoolean(row['Batizado'] || row['batizado'] || row['Batizado?']),
          membro: toBoolean(row['Membro'] || row['membro'] || row['É Membro?']),
          situacao_atual: row['Situação Atual'] || row['situacao_atual'] || row['Status'] || 'ativo',
          lider: toBoolean(row['Líder'] || row['lider'] || row['É Líder?']),
          e_professor_ebq: toBoolean(row['Professor EBQ'] || row['e_professor_ebq'] || row['É Professor EBQ?']),
          faixa_etaria: row['Faixa Etária'] || row['faixa_etaria'] || row['Faixa Etaria'],
          pequeno_grupo: toBoolean(row['Pequeno Grupo'] || row['pequeno_grupo'] || row['Está em um pequeno grupo ?']),
          grupo: row['Grupo'] || row['grupo'] || row['Nome do Grupo'],
          numerodomes: row['Número do Mês'] || row['numerodomes'] || row['NumerodoMes']
        };
      } catch (error) {
        logger.error(`❌ Erro ao transformar linha ${index + 1}: ${error.message}`);
        return null;
      }
    }).filter(m => m !== null && m.nome); // Remove nulos e registros sem nome

    logger.info(`✅ ${membros.length} membros transformados para formato do banco`);
    return membros;
  }

  /**
   * Sincroniza dados completos da planilha com o banco
   */
  async syncToDatabase() {
    const MemberService = require('./MemberServicePostgreSQL');
    
    try {
      logger.info('🚀 Iniciando sincronização completa com Google Sheets...');
      
      // 1. Buscar dados da planilha
      const csvData = await this.fetchSheetData();
      
      // 2. Parsear CSV
      const parsedData = this.parseCSV(csvData);
      
      // 3. Transformar para formato do banco
      const membros = this.transformToMembers(parsedData);
      
      if (membros.length === 0) {
        throw new Error('Nenhum membro válido encontrado na planilha');
      }
      
      // 4. Importar para o banco (substitui tudo)
      logger.info(`📝 Importando ${membros.length} membros para o banco...`);
      const resultados = await MemberService.importMembers(membros);
      
      logger.info('✅ Sincronização concluída com sucesso!');
      
      return {
        sucesso: true,
        total_processados: membros.length,
        importados: resultados.importados || membros.length,
        atualizados: resultados.atualizados || 0,
        erros: resultados.erros || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`❌ Erro na sincronização: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sincronização inteligente - apenas mudanças
   * (Para implementação futura - incremental)
   */
  async syncChangesOnly() {
    // TODO: Implementar sincronização incremental
    // Comparar com banco e atualizar apenas o que mudou
    logger.info('ℹ️ Sincronização incremental ainda não implementada');
    return this.syncToDatabase();
  }
}

module.exports = new GoogleSheetsSync();
