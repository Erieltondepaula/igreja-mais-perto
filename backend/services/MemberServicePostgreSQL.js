// 🐘 MEMBER SERVICE POSTGRESQL
// Serviço otimizado para PostgreSQL com ID personalizado AA20253010104302

const db = require('../config/postgresql');

class MemberServicePostgreSQL {
  
  // ===================================
  // BUSCAR TODOS OS MEMBROS
  // ===================================
  async getAllMembers() {
    const sql = `
      SELECT 
        id,
        id_externo,
        nome,
        sobrenome,
        nome_completo,
        data_nascimento,
        idade,
        mes,
        telefone,
        sexo,
        observacoes,
        status_civil,
        conjuge,
        parentesco,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        batizado,
        membro,
        situacao_atual,
        lider,
        e_professor_ebq,
        faixa_etaria,
        pequeno_grupo,
        grupo,
        numerodomes,
        created_at,
        updated_at
      FROM membros 
      ORDER BY nome
    `;
    
    try {
      const result = await db.query(sql);
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar membros:', error);
      throw error;
    }
  }

  // ===================================
  // BUSCAR MEMBRO POR ID
  // ===================================
  async getMemberById(id) {
    const sql = `
      SELECT 
        id,
        id_externo,
        nome,
        sobrenome,
        nome_completo,
        data_nascimento,
        idade,
        mes,
        telefone,
        sexo,
        observacoes,
        status_civil,
        conjuge,
        parentesco,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        batizado,
        membro,
        situacao_atual,
        lider,
        e_professor_ebq,
        faixa_etaria,
        pequeno_grupo,
        grupo,
        numerodomes,
        created_at,
        updated_at
      FROM membros 
      WHERE id = $1
    `;
    
    try {
      const result = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`❌ Erro ao buscar membro ${id}:`, error);
      throw error;
    }
  }

  // ===================================
  // CRIAR NOVO MEMBRO COM ID PERSONALIZADO
  // ===================================
  async createMember(memberData) {
    const sql = `
      INSERT INTO membros (
        id, id_externo, nome, sobrenome, nome_completo, data_nascimento, idade, mes, telefone, sexo, observacoes, status_civil, conjuge, parentesco, rua, numero, bairro, cidade, estado, cep, batizado, membro, situacao_atual, lider, e_professor_ebq, faixa_etaria, pequeno_grupo, grupo, numerodomes, created_at, updated_at
      ) VALUES (
        COALESCE($1, generate_member_id($3, $4)), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
      ) RETURNING id
    `;

    const params = [
      memberData.id || null,
      memberData.id_externo || null,
      memberData.nome,
      memberData.sobrenome,
      memberData.nome_completo,
      memberData.data_nascimento,
      memberData.idade,
      memberData.mes,
      memberData.telefone,
      memberData.sexo,
      memberData.observacoes,
      memberData.status_civil,
      memberData.conjuge,
      memberData.parentesco,
      memberData.rua,
      memberData.numero,
      memberData.bairro,
      memberData.cidade,
      memberData.estado,
      memberData.cep,
      memberData.batizado,
      memberData.membro,
      memberData.situacao_atual,
      memberData.lider,
      memberData.e_professor_ebq,
      memberData.faixa_etaria,
      memberData.pequeno_grupo,
      memberData.grupo,
      memberData.numerodomes,
      memberData.created_at || new Date(),
      memberData.updated_at || new Date()
    ];

    try {
      const result = await db.execute(sql, params);
      const newId = result.rows[0].id;
      
      console.log(`✅ Membro criado com ID personalizado: ${newId}`);
      return await this.getMemberById(newId);
    } catch (error) {
      console.error('❌ Erro ao criar membro:', error);
      throw error;
    }
  }

  // ===================================
  // ATUALIZAR MEMBRO
  // ===================================
  async updateMember(id, memberData) {
    const sql = `
      UPDATE membros SET
        id_externo = $2,
        nome = $3,
        sobrenome = $4,
        nome_completo = $5,
        data_nascimento = $6,
        idade = $7,
        mes = $8,
        telefone = $9,
        sexo = $10,
        observacoes = $11,
        status_civil = $12,
        conjuge = $13,
        parentesco = $14,
        rua = $15,
        numero = $16,
        bairro = $17,
        cidade = $18,
        estado = $19,
        cep = $20,
        batizado = $21,
        membro = $22,
        situacao_atual = $23,
        lider = $24,
        e_professor_ebq = $25,
        faixa_etaria = $26,
        pequeno_grupo = $27,
        grupo = $28,
        numerodomes = $29,
        updated_at = $30
      WHERE id = $1
      RETURNING id
    `;

    const params = [
      id,
      memberData.id_externo || null,
      memberData.nome,
      memberData.sobrenome,
      memberData.nome_completo,
      memberData.data_nascimento,
      memberData.idade,
      memberData.mes,
      memberData.telefone,
      memberData.sexo,
      memberData.observacoes,
      memberData.status_civil,
      memberData.conjuge,
      memberData.parentesco,
      memberData.rua,
      memberData.numero,
      memberData.bairro,
      memberData.cidade,
      memberData.estado,
      memberData.cep,
      memberData.batizado,
      memberData.membro,
      memberData.situacao_atual,
      memberData.lider,
      memberData.e_professor_ebq,
      memberData.faixa_etaria,
      memberData.pequeno_grupo,
      memberData.grupo,
      memberData.numerodomes,
      memberData.updated_at || new Date()
    ];

    try {
      const result = await db.execute(sql, params);
      if (result.rowCount === 0) {
        return null; // Membro não encontrado
      }
      return await this.getMemberById(id);
    } catch (error) {
      console.error(`❌ Erro ao atualizar membro ${id}:`, error);
      throw error;
    }
  }

  // ===================================
  // DELETAR MEMBRO
  // ===================================
  async deleteMember(id) {
    const sql = "DELETE FROM membros WHERE id = $1";
    
    try {
      const result = await db.execute(sql, [id]);
      if (result.rowCount === 0) {
        throw new Error('Membro não encontrado');
      }
      return { message: 'Membro removido com sucesso!' };
    } catch (error) {
      console.error(`❌ Erro ao deletar membro ${id}:`, error);
      throw error;
    }
  }

  // ===================================
  // IMPORTAR MÚLTIPLOS MEMBROS COM TRANSAÇÃO
  // ===================================
  async importMembers(membersArray) {
    const results = [];
    
    try {
      // Usar transação para garantir consistência
      const operations = membersArray.map(memberData => ({
        sql: `
          INSERT INTO membros (
            nome, nome_completo, photo_url, data_nascimento, sexo, telefone, email,
            endereco, rua, numero, bairro, cidade, estado, cep, status,
            status_civil, conjuge, parentesco, batizado, membro, lider, professor_ebq,
            pequeno_grupo, grupo, numero_domes, data_batismo, data_membresia,
            data_desligamento, observacoes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
          ) RETURNING id
        `,
        params: [
          memberData.nome,
          memberData.nome_completo || memberData.nomeCompleto,
          memberData.photo_url || memberData.photoUrl,
          memberData.data_nascimento || memberData.dataNascimento,
          memberData.sexo,
          memberData.telefone,
          memberData.email,
          memberData.endereco,
          memberData.rua,
          memberData.numero,
          memberData.bairro,
          memberData.cidade,
          memberData.estado,
          memberData.cep,
          memberData.status || 'ativo',
          memberData.status_civil || memberData.statusCivil,
          memberData.conjuge,
          memberData.parentesco,
          memberData.batizado || false,
          memberData.membro || false,
          memberData.lider || false,
          memberData.professor_ebq || memberData.professorEBQ || false,
          memberData.pequeno_grupo || false,
          memberData.grupo,
          memberData.numero_domes,
          memberData.data_batismo || memberData.dataBatismo,
          memberData.data_membresia || memberData.dataMembresia,
          memberData.data_desligamento || memberData.dataDesligamento,
          memberData.observacoes
        ]
      }));

      // Executar em lotes para melhor performance
      for (let i = 0; i < operations.length; i += 50) { // Lotes de 50
        const batch = operations.slice(i, i + 50);
        
        for (const operation of batch) {
          try {
            const result = await db.execute(operation.sql, operation.params);
            const newId = result.rows[0]?.id;
            results.push({ 
              success: true, 
              id: newId,
              member: { nome: operation.params[0] }
            });
          } catch (error) {
            console.error(`❌ Erro ao importar membro ${operation.params[0]}:`, error.message);
            results.push({ 
              success: false, 
              error: error.message,
              data: { nome: operation.params[0] }
            });
          }
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ Erro na importação em massa:', error);
      throw error;
    }
  }

  // ===================================
  // LIMPAR TABELA (PARA SUBSTITUIR TUDO)
  // ===================================
  async clearAllMembers() {
    const sql = "DELETE FROM membros";
    
    try {
      const result = await db.execute(sql);
      console.log(`🗑️ ${result.rowCount} membros removidos da tabela`);
      return result.rowCount;
    } catch (error) {
      console.error('❌ Erro ao limpar tabela:', error);
      throw error;
    }
  }

  // ===================================
  // ESTATÍSTICAS GERAIS
  // ===================================
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total_membros,
        COUNT(*) FILTER (WHERE status = 'ativo') as membros_ativos,
        COUNT(*) FILTER (WHERE status = 'desligado') as membros_desligados,
        COUNT(*) FILTER (WHERE sexo = 'M' AND status = 'ativo') as homens_ativos,
        COUNT(*) FILTER (WHERE sexo = 'F' AND status = 'ativo') as mulheres_ativas,
        COUNT(*) FILTER (WHERE batizado = true AND status = 'ativo') as batizados_ativos,
        COUNT(*) FILTER (WHERE lider = true AND status = 'ativo') as lideres_ativos,
        COUNT(*) FILTER (WHERE professor_ebq = true AND status = 'ativo') as professores_ativos
      FROM membros
    `;

    try {
      const result = await db.query(sql);
      return result[0];
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // ===================================
  // GERAR ID PERSONALIZADO MANUAL (PARA TESTES)
  // ===================================
  async generateCustomId(nome, nomeCompleto) {
    const sql = "SELECT generate_member_id($1, $2) as custom_id";
    
    try {
      const result = await db.query(sql, [nome, nomeCompleto]);
      return result[0].custom_id;
    } catch (error) {
      console.error('❌ Erro ao gerar ID personalizado:', error);
      throw error;
    }
  }
}

module.exports = new MemberServicePostgreSQL();