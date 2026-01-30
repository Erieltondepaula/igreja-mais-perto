require('dotenv/config');

async function verificarAnderson() {
  try {
    console.log('\n🔍 VERIFICANDO DADOS DE ANDERSON NO BANCO E NA API\n');
    
    // 1. Verificar diretamente no banco de dados PostgreSQL
    const { Pool } = require('pg');
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'dashboard_membros',
      password: '252088',
      port: 5432,
    });

    const dbResult = await pool.query(`
      SELECT id, nome, nome_completo, sexo, data_nascimento, situacao_atual
      FROM membros 
      WHERE UPPER(nome_completo) LIKE '%ANDERSON%'
      ORDER BY nome_completo
    `);

    console.log('📊 DADOS NO BANCO DE DADOS POSTGRESQL:');
    console.log('Total de registros com "ANDERSON":', dbResult.rows.length);
    console.table(dbResult.rows);

    await pool.end();

    // 2. Verificar via API (o que o frontend recebe)
    console.log('\n🌐 DADOS VIA API (http://localhost:5001/api/members):\n');
    
    const response = await fetch('http://localhost:5001/api/members');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const apiData = await response.json();
    
    // Filtrar Anderson
    const andersonAPI = apiData.filter(m => 
      m.nome_completo && m.nome_completo.toUpperCase().includes('ANDERSON')
    );
    
    console.log('Total de registros com "ANDERSON" via API:', andersonAPI.length);
    andersonAPI.forEach(m => {
      console.log('\n📋 Registro via API:');
      console.log(`  ID: ${m.id}`);
      console.log(`  Nome Completo: ${m.nome_completo}`);
      console.log(`  Sexo: ${m.sexo}`);
      console.log(`  Data Nascimento: ${m.data_nascimento}`);
      console.log(`  Situação: ${m.situacao_atual}`);
    });

    // 3. Verificar aniversariantes de outubro
    console.log('\n🎂 ANIVERSARIANTES DE OUTUBRO (MÊS 10):\n');
    
    const outubro = apiData.filter(m => {
      if (!m.data_nascimento) return false;
      const date = new Date(m.data_nascimento);
      return date.getMonth() + 1 === 10; // Outubro = mês 10
    });
    
    console.log(`Total de aniversariantes em outubro: ${outubro.length}`);
    
    // Agrupar por dia
    const porDia = {};
    outubro.forEach(m => {
      const date = new Date(m.data_nascimento);
      const dia = date.getDate();
      if (!porDia[dia]) {
        porDia[dia] = [];
      }
      porDia[dia].push({
        nome: m.nome_completo,
        sexo: m.sexo,
        data: m.data_nascimento
      });
    });
    
    // Mostrar dia 27 especificamente
    if (porDia[27]) {
      console.log('\n📅 DIA 27 DE OUTUBRO:');
      console.table(porDia[27]);
    } else {
      console.log('\n❌ Nenhum aniversariante encontrado no dia 27 de outubro');
    }
    
    // Mostrar todos os dias com aniversários
    console.log('\n📅 TODOS OS ANIVERSÁRIOS DE OUTUBRO POR DIA:');
    Object.keys(porDia).sort((a, b) => Number(a) - Number(b)).forEach(dia => {
      console.log(`\nDia ${dia}:`);
      console.table(porDia[dia]);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarAnderson();
