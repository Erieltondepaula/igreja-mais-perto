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
        avatar_url,
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
        avatar_url,
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
    // Buscar dados atuais do membro
    const currentMember = await this.getMemberById(id);
    if (!currentMember) {
      return null;
    }

    // Mesclar dados atuais com novos dados (preserva campos não enviados)
    const mergedData = {
      ...currentMember,
      ...memberData,
      id // Garantir que o ID não mude
    };

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
        avatar_url = $30,
        updated_at = $31
      WHERE id = $1
      RETURNING id
    `;

    const params = [
      id,
      mergedData.id_externo || null,
      mergedData.nome,
      mergedData.sobrenome,
      mergedData.nome_completo,
      mergedData.data_nascimento,
      mergedData.idade,
      mergedData.mes,
      mergedData.telefone,
      mergedData.sexo,
      mergedData.observacoes,
      mergedData.status_civil,
      mergedData.conjuge,
      mergedData.parentesco,
      mergedData.rua,
      mergedData.numero,
      mergedData.bairro,
      mergedData.cidade,
      mergedData.estado,
      mergedData.cep,
      mergedData.batizado,
      mergedData.membro,
      mergedData.situacao_atual,
      mergedData.lider,
      mergedData.e_professor_ebq,
      mergedData.faixa_etaria,
      mergedData.pequeno_grupo,
      mergedData.grupo,
      mergedData.numerodomes,
      mergedData.avatar_url || null,
      new Date()
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
  // IMPORTAR MÚLTIPLOS MEMBROS COM TRANSAÇÃO (UPSERT)
  // ===================================
  async importMembers(membersArray) {
    const results = [];
    
    try {
      // Função para aguardar (delay)
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      // Executar cada inserção/atualização
      for (let i = 0; i < membersArray.length; i++) {
        const memberData = membersArray[i];
        
        try {
          const nomeCompleto = memberData.nomeCompleto || memberData.nome_completo || `${memberData.nome || ''} ${memberData.sobrenome || ''}`.trim();
          const dataNascimento = memberData.dataNascimento || memberData.data_nascimento;
          
          // 🔍 VERIFICAR SE JÁ EXISTE (por nome completo + data nascimento)
          const existingMember = await db.query(
            'SELECT id FROM membros WHERE LOWER(nome_completo) = LOWER($1) AND data_nascimento = $2 LIMIT 1',
            [nomeCompleto, dataNascimento]
          );
          
          let resultId;
          let action;
          
          if (existingMember.length > 0) {
            // ✏️ MEMBRO JÁ EXISTE - FAZER UPDATE
            const existingId = existingMember[0].id;
            action = 'updated';
            
            const updateSql = `
              UPDATE membros SET
                id_externo = $1,
                nome = $2,
                sobrenome = $3,
                nome_completo = $4,
                data_nascimento = $5,
                idade = $6,
                mes = $7,
                telefone = $8,
                sexo = $9,
                observacoes = $10,
                status_civil = $11,
                conjuge = $12,
                parentesco = $13,
                rua = $14,
                numero = $15,
                bairro = $16,
                cidade = $17,
                estado = $18,
                cep = $19,
                batizado = $20,
                membro = $21,
                situacao_atual = $22,
                lider = $23,
                e_professor_ebq = $24,
                faixa_etaria = $25,
                pequeno_grupo = $26,
                grupo = $27,
                numerodomes = $28,
                updated_at = NOW()
              WHERE id = $29
              RETURNING id
            `;
            
            const updateParams = [
              memberData.idExterno || memberData.id_externo || null,
              memberData.nome || '',
              memberData.sobrenome || '',
              nomeCompleto,
              dataNascimento,
              memberData.idade || null,
              memberData.mes || null,
              memberData.telefone || null,
              memberData.sexo || null,
              memberData.observacoes || null,
              memberData.statusCivil || memberData.status_civil || null,
              memberData.conjuge || null,
              memberData.parentesco || null,
              memberData.rua || null,
              memberData.numero || null,
              memberData.bairro || null,
              memberData.cidade || null,
              memberData.estado || null,
              memberData.cep || null,
              memberData.batizado || false,
              memberData.membro || false,
              memberData.situacaoAtual || memberData.situacao_atual || null,
              memberData.lider || false,
              memberData.eProfessorEbq || memberData.e_professor_ebq || false,
              memberData.faixaEtaria || memberData.faixa_etaria || null,
              memberData.pequenoGrupo || memberData.pequeno_grupo || false,
              memberData.grupo || null,
              memberData.numeroDomes || memberData.numerodomes || null,
              existingId  // WHERE id = $29
            ];
            
            const result = await db.execute(updateSql, updateParams);
            resultId = existingId;
            
          } else {
            // ➕ MEMBRO NÃO EXISTE - FAZER INSERT
            action = 'inserted';
            
            // 🆔 GERAR ID USANDO A FUNÇÃO DO POSTGRESQL
            const idResult = await db.query('SELECT gerar_id_compacto($1) as id', [nomeCompleto]);
            const generatedId = idResult[0].id;
            
            // ✅ INSERIR COM O ID GERADO
            const insertSql = `
              INSERT INTO membros (
                id, id_externo, nome, sobrenome, nome_completo, data_nascimento, idade, mes,
                telefone, sexo, observacoes, status_civil, conjuge, parentesco,
                rua, numero, bairro, cidade, estado, cep,
                batizado, membro, situacao_atual, lider, e_professor_ebq,
                faixa_etaria, pequeno_grupo, grupo, numerodomes,
                created_at, updated_at
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW(), NOW()
              ) RETURNING id
            `;
            
            const insertParams = [
              generatedId, // 🆔 ID GERADO
              memberData.idExterno || memberData.id_externo || null,
              memberData.nome || '',
              memberData.sobrenome || '',
              nomeCompleto,
              dataNascimento,
              memberData.idade || null,
              memberData.mes || null,
              memberData.telefone || null,
              memberData.sexo || null,
              memberData.observacoes || null,
              memberData.statusCivil || memberData.status_civil || null,
              memberData.conjuge || null,
              memberData.parentesco || null,
              memberData.rua || null,
              memberData.numero || null,
              memberData.bairro || null,
              memberData.cidade || null,
              memberData.estado || null,
              memberData.cep || null,
              memberData.batizado || false,
              memberData.membro || false,
              memberData.situacaoAtual || memberData.situacao_atual || null,
              memberData.lider || false,
              memberData.eProfessorEbq || memberData.e_professor_ebq || false,
              memberData.faixaEtaria || memberData.faixa_etaria || null,
              memberData.pequenoGrupo || memberData.pequeno_grupo || false,
              memberData.grupo || null,
              memberData.numeroDomes || memberData.numerodomes || null
            ];
            
            const result = await db.execute(insertSql, insertParams);
            resultId = result.rows[0]?.id;
          }
          
          // ✅ RESULTADO (INSERT ou UPDATE)
          results.push({ 
            success: true, 
            id: resultId,
            action: action,
            member: { nome: nomeCompleto }
          });
          
          console.log(`✅ [${i + 1}/${membersArray.length}] Membro ${action === 'updated' ? 'atualizado' : 'inserido'}: ${nomeCompleto} (ID: ${resultId})`);
          
          // Delay de 50ms entre cada operação
          if (i < membersArray.length - 1) {
            await sleep(50);
          }
        } catch (error) {
          const nomeCompleto = memberData.nomeCompleto || memberData.nome_completo || `${memberData.nome || ''} ${memberData.sobrenome || ''}`.trim();
          console.error(`❌ Erro ao importar membro ${nomeCompleto}:`, error.message);
          results.push({ 
            success: false, 
            error: error.message,
            data: { nome: nomeCompleto }
          });
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