const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function showDatabaseStructure() {
  try {
    console.log('\n🔍 ESTRUTURA DO BANCO DE DADOS: dashboard_membros\n');
    console.log('═'.repeat(80));
    
    // 1. Listar todas as tabelas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 TABELAS NO BANCO:');
    console.log('─'.repeat(80));
    tables.rows.forEach((t, i) => {
      console.log(`${i + 1}. ${t.table_name}`);
    });
    
    // 2. Para cada tabela, mostrar colunas
    for (const table of tables.rows) {
      console.log('\n\n📊 TABELA:', table.table_name.toUpperCase());
      console.log('─'.repeat(80));
      
      const columns = await pool.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = $1
        ORDER BY ordinal_position
      `, [table.table_name]);
      
      console.log('\nCOLUNAS:');
      console.log(
        String('Nome da Coluna').padEnd(30) + 
        String('Tipo').padEnd(20) + 
        String('Tamanho').padEnd(10) + 
        String('Nulo?').padEnd(10) + 
        'Padrão'
      );
      console.log('─'.repeat(80));
      
      columns.rows.forEach(col => {
        const name = String(col.column_name).padEnd(30);
        const type = String(col.data_type).padEnd(20);
        const length = col.character_maximum_length ? 
          String(col.character_maximum_length).padEnd(10) : 
          '-'.padEnd(10);
        const nullable = String(col.is_nullable).padEnd(10);
        const def = col.column_default || '-';
        
        console.log(`${name}${type}${length}${nullable}${def}`);
      });
      
      // Mostrar constraints (chaves primárias, únicas, etc)
      const constraints = await pool.query(`
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = $1
        ORDER BY tc.constraint_type, kcu.ordinal_position
      `, [table.table_name]);
      
      if (constraints.rows.length > 0) {
        console.log('\nCONSTRAINTS (Restrições):');
        console.log('─'.repeat(80));
        constraints.rows.forEach(c => {
          console.log(`  • ${c.constraint_type.padEnd(15)} ${c.constraint_name.padEnd(30)} (${c.column_name})`);
        });
      }
      
      // Mostrar índices
      const indexes = await pool.query(`
        SELECT
          indexname,
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = $1
        ORDER BY indexname
      `, [table.table_name]);
      
      if (indexes.rows.length > 0) {
        console.log('\nÍNDICES:');
        console.log('─'.repeat(80));
        indexes.rows.forEach(idx => {
          console.log(`  • ${idx.indexname}`);
          console.log(`    ${idx.indexdef}`);
        });
      }
      
      // Contar registros
      const count = await pool.query(`SELECT COUNT(*) as total FROM ${table.table_name}`);
      console.log(`\n📈 TOTAL DE REGISTROS: ${count.rows[0].total}`);
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ Análise completa!\n');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await pool.end();
  }
}

showDatabaseStructure();
