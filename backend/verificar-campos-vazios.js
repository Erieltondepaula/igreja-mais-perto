const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function verificarCamposVazios() {
  try {
    console.log('\n🔍 VERIFICANDO CAMPOS VAZIOS/NULL NO BANCO DE DADOS\n');
    console.log('═'.repeat(100));
    
    // Buscar todos os registros
    const result = await pool.query('SELECT * FROM membros ORDER BY id_externo::int LIMIT 5');
    
    console.log(`\n📊 Analisando os primeiros 5 registros de ${result.rowCount} totais...\n`);
    
    // Analisar cada registro
    result.rows.forEach((row, index) => {
      console.log(`\n${'─'.repeat(100)}`);
      console.log(`📋 REGISTRO ${index + 1}: ${row.nome_completo} (id_externo: ${row.id_externo})`);
      console.log('─'.repeat(100));
      
      const camposVazios = [];
      const camposPreenchidos = [];
      
      Object.keys(row).forEach(campo => {
        const valor = row[campo];
        if (valor === null || valor === '' || valor === undefined) {
          camposVazios.push(campo);
        } else {
          camposPreenchidos.push(campo);
        }
      });
      
      if (camposVazios.length > 0) {
        console.log(`\n⚠️  CAMPOS VAZIOS/NULL (${camposVazios.length}):`);
        camposVazios.forEach(campo => {
          console.log(`   - ${campo}`);
        });
      }
      
      console.log(`\n✅ CAMPOS PREENCHIDOS (${camposPreenchidos.length}):`);
      camposPreenchidos.slice(0, 10).forEach(campo => {
        let valor = row[campo];
        if (typeof valor === 'string' && valor.length > 50) {
          valor = valor.substring(0, 47) + '...';
        }
        console.log(`   - ${campo}: ${valor}`);
      });
      if (camposPreenchidos.length > 10) {
        console.log(`   ... e mais ${camposPreenchidos.length - 10} campos`);
      }
    });
    
    // Estatísticas gerais
    console.log('\n\n' + '═'.repeat(100));
    console.log('📊 ESTATÍSTICAS GERAIS DE CAMPOS VAZIOS/NULL\n');
    
    const colunas = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'membros' 
      ORDER BY ordinal_position
    `);
    
    for (const col of colunas.rows) {
      const campo = col.column_name;
      
      // Para campos de texto, verificar NULL e string vazia
      // Para outros tipos, verificar apenas NULL
      const nullCount = await pool.query(
        `SELECT COUNT(*) as total FROM membros WHERE ${campo} IS NULL`,
        []
      );
      
      const total = nullCount.rows[0].total;
      
      if (total > 0) {
        const percentual = ((total / 144) * 100).toFixed(1);
        console.log(`⚠️  ${campo.padEnd(30)} → ${total} registros NULL (${percentual}%)`);
      }
    }
    
    console.log('\n' + '═'.repeat(100));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarCamposVazios();
