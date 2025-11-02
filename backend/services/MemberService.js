// Local do arquivo: backend/services/MemberService.js
// Serviço para operações com membros no Microsoft Access

const accessDB = require('../config/database');

class MemberService {
  
  // ===================================
  // BUSCAR TODOS OS MEMBROS
  // ===================================
  async getAllMembers() {
    const sql = `
      SELECT 
        ID as id,
        Nome as nome,
        NomeCompleto as nomeCompleto,
        PhotoUrl as photoUrl,
        DataNascimento as dataNascimento,
        DateDiff("yyyy", DataNascimento, Date()) as idade,
        Format(DataNascimento, "mmmm") as mes,
        Sexo as sexo,
        Telefone as telefone,
        Email as email,
        Endereco as endereco,
        Rua as rua,
        Numero as numero,
        Bairro as bairro,
        Cidade as cidade,
        Estado as estado,
        CEP as cep,
        Status as status,
        StatusCivil as statusCivil,
        Conjuge as conjuge,
        Parentesco as parentesco,
        Batizado as batizado,
        Membro as membro,
        Lider as lider,
        ProfessorEBQ as professorEBQ,
        IIf(DateDiff("yyyy", DataNascimento, Date()) BETWEEN 0 AND 6, 'Infância',
        IIf(DateDiff("yyyy", DataNascimento, Date()) BETWEEN 7 AND 10, 'Crianças', 
        IIf(DateDiff("yyyy", DataNascimento, Date()) BETWEEN 11 AND 17, 'Adolescentes',
        IIf(DateDiff("yyyy", DataNascimento, Date()) BETWEEN 18 AND 35, 'Jovens',
        IIf(DateDiff("yyyy", DataNascimento, Date()) BETWEEN 36 AND 59, 'Adultos', 'Idosos'))))) as faixaEtaria,
        PequenoGrupo as pequeno_grupo,
        Grupo as grupo,
        NumeroDomes as numero_domes,
        Format(DataBatismo, "yyyy-mm-dd") as dataBatismo,
        Format(DataMembresia, "yyyy-mm-dd") as dataMembresia,
        Format(DataDesligamento, "yyyy-mm-dd") as dataDesligamento,
        Observacoes as observacoes,
        Format(DataCriacao, "yyyy-mm-dd hh:nn:ss") as createdAt,
        Format(DataAtualizacao, "yyyy-mm-dd hh:nn:ss") as updatedAt
      FROM Membros 
      ORDER BY Nome
    `;
    
    try {
      const result = await accessDB.query(sql);
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
        ID as id,
        Nome as nome,
        NomeCompleto as nomeCompleto,
        PhotoUrl as photoUrl,
        Format(DataNascimento, "yyyy-mm-dd") as dataNascimento,
        DateDiff("yyyy", DataNascimento, Date()) as idade,
        Format(DataNascimento, "mmmm") as mes,
        Sexo as sexo,
        Telefone as telefone,
        Email as email,
        Endereco as endereco,
        Rua as rua,
        Numero as numero,
        Bairro as bairro,
        Cidade as cidade,
        Estado as estado,
        CEP as cep,
        Status as status,
        StatusCivil as statusCivil,
        Conjuge as conjuge,
        Parentesco as parentesco,
        Batizado as batizado,
        Membro as membro,
        Lider as lider,
        ProfessorEBQ as professorEBQ,
        FaixaEtaria as faixaEtaria,
        PequenoGrupo as pequeno_grupo,
        Grupo as grupo,
        NumeroDomes as numero_domes,
        Format(DataBatismo, "yyyy-mm-dd") as dataBatismo,
        Format(DataMembresia, "yyyy-mm-dd") as dataMembresia,
        Format(DataDesligamento, "yyyy-mm-dd") as dataDesligamento,
        Observacoes as observacoes,
        Format(DataCriacao, "yyyy-mm-dd hh:nn:ss") as createdAt,
        Format(DataAtualizacao, "yyyy-mm-dd hh:nn:ss") as updatedAt
      FROM Membros 
      WHERE ID = ?
    `;
    
    try {
      const result = await accessDB.query(sql, [id]);
      return result[0] || null;
    } catch (error) {
      console.error(`❌ Erro ao buscar membro ${id}:`, error);
      throw error;
    }
  }

  // ===================================
  // CRIAR NOVO MEMBRO
  // ===================================
  async createMember(memberData) {
    const sql = `
      INSERT INTO Membros (
        Nome, NomeCompleto, PhotoUrl, DataNascimento, Sexo, Telefone, Email,
        Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, Status,
        StatusCivil, Conjuge, Parentesco, Batizado, Membro, Lider, ProfessorEBQ,
        PequenoGrupo, Grupo, NumeroDomes, DataBatismo, DataMembresia, 
        DataDesligamento, Observacoes, DataAtualizacao
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, Now()
      )
    `;

    const params = [
      memberData.nome,
      memberData.nomeCompleto || null,
      memberData.photoUrl || null,
      memberData.dataNascimento,
      memberData.sexo,
      memberData.telefone || null,
      memberData.email || null,
      memberData.endereco || null,
      memberData.rua || null,
      memberData.numero || null,
      memberData.bairro || null,
      memberData.cidade || null,
      memberData.estado || null,
      memberData.cep || null,
      memberData.status || 'ativo',
      memberData.statusCivil || null,
      memberData.conjuge || null,
      memberData.parentesco || null,
      memberData.batizado || false,
      memberData.membro || false,
      memberData.lider || false,
      memberData.professorEBQ || false,
      memberData.pequeno_grupo || false,
      memberData.grupo || null,
      memberData.numero_domes || null,
      memberData.dataBatismo || null,
      memberData.dataMembresia || null,
      memberData.dataDesligamento || null,
      memberData.observacoes || null
    ];

    try {
      await accessDB.execute(sql, params);
      
      // Buscar o ID do membro recém-criado
      const newMemberSql = "SELECT @@IDENTITY as newId";
      const result = await accessDB.query(newMemberSql);
      const newId = result[0].newId;
      
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
      UPDATE Membros SET
        Nome = ?, NomeCompleto = ?, PhotoUrl = ?, DataNascimento = ?, Sexo = ?,
        Telefone = ?, Email = ?, Endereco = ?, Rua = ?, Numero = ?, Bairro = ?,
        Cidade = ?, Estado = ?, CEP = ?, Status = ?, StatusCivil = ?, Conjuge = ?,
        Parentesco = ?, Batizado = ?, Membro = ?, Lider = ?, ProfessorEBQ = ?,
        PequenoGrupo = ?, Grupo = ?, NumeroDomes = ?, DataBatismo = ?, 
        DataMembresia = ?, DataDesligamento = ?, Observacoes = ?, DataAtualizacao = Now()
      WHERE ID = ?
    `;

    const params = [
      memberData.nome,
      memberData.nomeCompleto || null,
      memberData.photoUrl || null,
      memberData.dataNascimento,
      memberData.sexo,
      memberData.telefone || null,
      memberData.email || null,
      memberData.endereco || null,
      memberData.rua || null,
      memberData.numero || null,
      memberData.bairro || null,
      memberData.cidade || null,
      memberData.estado || null,
      memberData.cep || null,
      memberData.status || 'ativo',
      memberData.statusCivil || null,
      memberData.conjuge || null,
      memberData.parentesco || null,
      memberData.batizado || false,
      memberData.membro || false,
      memberData.lider || false,
      memberData.professorEBQ || false,
      memberData.pequeno_grupo || false,
      memberData.grupo || null,
      memberData.numero_domes || null,
      memberData.dataBatismo || null,
      memberData.dataMembresia || null,
      memberData.dataDesligamento || null,
      memberData.observacoes || null,
      id
    ];

    try {
      await accessDB.execute(sql, params);
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
    const sql = "DELETE FROM Membros WHERE ID = ?";
    
    try {
      await accessDB.execute(sql, [id]);
      return { message: 'Membro removido com sucesso!' };
    } catch (error) {
      console.error(`❌ Erro ao deletar membro ${id}:`, error);
      throw error;
    }
  }

  // ===================================
  // IMPORTAR MÚLTIPLOS MEMBROS
  // ===================================
  async importMembers(membersArray) {
    const results = [];
    
    try {
      // Transação para garantir consistência
      await accessDB.execute("BEGIN TRANSACTION");
      
      for (const memberData of membersArray) {
        try {
          const newMember = await this.createMember(memberData);
          results.push({ success: true, member: newMember });
        } catch (error) {
          results.push({ 
            success: false, 
            error: error.message,
            data: memberData 
          });
        }
      }
      
      await accessDB.execute("COMMIT TRANSACTION");
      return results;
      
    } catch (error) {
      await accessDB.execute("ROLLBACK TRANSACTION");
      console.error('❌ Erro na importação em massa:', error);
      throw error;
    }
  }

  // ===================================
  // ESTATÍSTICAS GERAIS
  // ===================================
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as totalMembros,
        SUM(IIf(Status='ativo', 1, 0)) as membrosAtivos,
        SUM(IIf(Status='desligado', 1, 0)) as membrosDesligados,
        SUM(IIf(Sexo='M' AND Status='ativo', 1, 0)) as homensAtivos,
        SUM(IIf(Sexo='F' AND Status='ativo', 1, 0)) as mulheresAtivas,
        SUM(IIf(Batizado=True AND Status='ativo', 1, 0)) as batizadosAtivos,
        SUM(IIf(Lider=True AND Status='ativo', 1, 0)) as lideresAtivos,
        SUM(IIf(ProfessorEBQ=True AND Status='ativo', 1, 0)) as professoresAtivos
      FROM Membros
    `;

    try {
      const result = await accessDB.query(sql);
      return result[0];
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

module.exports = new MemberService();