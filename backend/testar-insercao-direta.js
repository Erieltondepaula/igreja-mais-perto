const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function testarInsercao() {
  try {
    console.log('🧪 Testando inserção de 1 membro COM ID GERADO...\n');
    
    // 1. GERAR ID PRIMEIRO
    const nomeCompleto = 'João Silva';
    const idResult = await pool.query('SELECT gerar_id_compacto($1) as id', [nomeCompleto]);
    const generatedId = idResult.rows[0].id;
    
    console.log(`🆔 ID Gerado: ${generatedId}\n`);
    
    const sql = `
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
    
    const params = [
      generatedId, // ID GERADO!
      '1', // id_externo
      'João', // nome
      'Silva', // sobrenome
      'João Silva', // nome_completo
      '1990-01-15', // data_nascimento
      34, // idade
      'janeiro', // mes
      '(27) 99999-9999', // telefone
      'M', // sexo
      null, // observacoes
      'Casado(a)', // status_civil
      'Maria Silva', // conjuge
      null, // parentesco
      'Rua Teste', // rua
      '123', // numero
      'Centro', // bairro
      'Vitória', // cidade
      'ES', // estado
      '29000-000', // cep
      true, // batizado
      true, // membro
      'Ativo', // situacao_atual
      false, // lider
      false, // e_professor_ebq
      '36 a 59 anos: Adulto', // faixa_etaria
      false, // pequeno_grupo
      'Sem Grupo', // grupo
      1 // numerodomes
    ];
    
    console.log('📋 Parâmetros:', params);
    console.log('');
    
    const result = await pool.query(sql, params);
    
    console.log('✅ SUCESSO!');
    console.log('🆔 ID gerado:', result.rows[0].id);
    console.log('📊 Linhas afetadas:', result.rowCount);
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO:');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Detalhes:', error.detail);
    console.error('Hint:', error.hint);
    console.error('\n📝 Stack completo:');
    console.error(error);
  } finally {
    await pool.end();
  }
}

testarInsercao();
