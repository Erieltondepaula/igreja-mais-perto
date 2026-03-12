const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarBanco() {
  try {
    console.log('\n🔍 VERIFICANDO ESTADO DO BANCO DE DADOS\n');
    
    const result = await pool.query('SELECT COUNT(*) as total FROM membros');
    const total = parseInt(result.rows[0].total);
    
    console.log(`📊 Total de registros no banco: ${total}`);
    
    if (total === 0) {
      console.log('⚠️  BANCO DE DADOS ESTÁ VAZIO!');
    } else {
      console.log(`✅ Banco contém ${total} registros`);
      
      // Mostrar alguns registros
      const sample = await pool.query('SELECT id, nome_completo, created_at FROM membros LIMIT 5');
      console.log('\n📋 Primeiros 5 registros:');
      sample.rows.forEach((r, i) => {
        console.log(`   ${i+1}. ${r.nome_completo} (ID: ${r.id})`);
      });
    }
    
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarBanco();
