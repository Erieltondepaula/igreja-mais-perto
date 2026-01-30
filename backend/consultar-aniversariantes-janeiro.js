import pg from 'pg';
const { Client } = pg;

async function consultarAniversariantesJaneiro() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'dashboard_membros',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    // Consulta para buscar aniversariantes de Janeiro
    const query = `
      SELECT 
        id,
        nome_completo,
        nome,
        data_nascimento,
        idade,
        telefone,
        sexo,
        EXTRACT(DAY FROM data_nascimento) as dia_nascimento
      FROM membros
      WHERE EXTRACT(MONTH FROM data_nascimento) = 1
        AND (situacao_atual IS NULL OR situacao_atual != 'Desligado')
      ORDER BY EXTRACT(DAY FROM data_nascimento) ASC
    `;

    const result = await client.query(query);

    if (result.rows.length === 0) {
      console.log('❌ Não há aniversariantes em Janeiro no banco de dados.');
    } else {
      console.log(`🎂 ANIVERSARIANTES DE JANEIRO - Total: ${result.rows.length}\n`);
      console.log('═'.repeat(80));
      
      result.rows.forEach((membro, index) => {
        const dataNasc = new Date(membro.data_nascimento);
        const dia = dataNasc.getUTCDate();
        const mes = dataNasc.getUTCMonth() + 1;
        const ano = dataNasc.getUTCFullYear();
        
        console.log(`\n${index + 1}. ${membro.nome_completo || membro.nome}`);
        console.log(`   📅 Data: ${dia}/${mes}/${ano}`);
        console.log(`   👤 Idade: ${membro.idade} anos`);
        console.log(`   📞 Telefone: ${membro.telefone || 'Não informado'}`);
        console.log(`   ⚥ Sexo: ${membro.sexo === 'M' ? 'Masculino' : 'Feminino'}`);
        console.log(`   🆔 ID: ${membro.id}`);
      });
      
      console.log('\n' + '═'.repeat(80));
      console.log(`\n📊 Resumo: ${result.rows.length} aniversariante(s) em Janeiro\n`);
    }

  } catch (error) {
    console.error('❌ Erro ao consultar banco de dados:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
    console.log('\n✅ Conexão encerrada');
  }
}

consultarAniversariantesJaneiro();
