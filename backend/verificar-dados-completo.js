require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
});

async function verificarDados() {
  try {
    console.log('\n📊 VERIFICANDO DADOS NO BANCO\n');

    // Total de registros
    const total = await pool.query('SELECT COUNT(*) FROM membros');
    console.log(`📈 Total de membros: ${total.rows[0].count}\n`);

    // Distribuição por situação atual
    const situacao = await pool.query(`
      SELECT situacao_atual, COUNT(*) as total 
      FROM membros 
      GROUP BY situacao_atual 
      ORDER BY total DESC
    `);
    console.log('📋 Distribuição por situação_atual:');
    console.table(situacao.rows);

    // Distribuição por batismo
    const batismo = await pool.query(`
      SELECT batizado, COUNT(*) as total 
      FROM membros 
      GROUP BY batizado 
      ORDER BY total DESC
    `);
    console.log('\n💧 Distribuição por batizado:');
    console.table(batismo.rows);

    // Distribuição por sexo
    const sexo = await pool.query(`
      SELECT sexo, COUNT(*) as total 
      FROM membros 
      GROUP BY sexo 
      ORDER BY total DESC
    `);
    console.log('\n👥 Distribuição por sexo:');
    console.table(sexo.rows);

    // Aniversariantes do mês atual (novembro)
    const aniversariantes = await pool.query(`
      SELECT nome_completo, data_nascimento, sexo, mes
      FROM membros 
      WHERE EXTRACT(MONTH FROM data_nascimento) = 11
      ORDER BY EXTRACT(DAY FROM data_nascimento)
      LIMIT 10
    `);
    console.log('\n🎂 Aniversariantes de novembro (primeiros 10):');
    console.table(aniversariantes.rows);

    // Verificar valores únicos de cada campo importante
    const campos = await pool.query(`
      SELECT 
        COUNT(DISTINCT situacao_atual) as situacoes,
        COUNT(DISTINCT batizado) as batizados,
        COUNT(DISTINCT sexo) as sexos,
        COUNT(DISTINCT mes) as meses
      FROM membros
    `);
    console.log('\n🔍 Valores únicos:');
    console.table(campos.rows);

    // Amostra de 5 registros
    const amostra = await pool.query(`
      SELECT id, nome_completo, sexo, data_nascimento, batizado, situacao_atual
      FROM membros 
      LIMIT 5
    `);
    console.log('\n📝 Amostra de 5 registros:');
    console.table(amostra.rows);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarDados();
