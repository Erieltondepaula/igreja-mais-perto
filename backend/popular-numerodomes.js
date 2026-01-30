// Script para popular o campo numerodomes automaticamente
// Local: backend/popular-numerodomes.js

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'dashboard_membros',
  user: 'postgres',
  password: '252088'
});

async function popularNumeroDomes() {
  console.log('\n🔢 POPULANDO CAMPO numerodomes\n');
  console.log('═'.repeat(60));
  
  try {
    // 1. Atualizar registros existentes
    console.log('\n📝 Passo 1: Atualizando registros existentes...');
    const updateResult = await pool.query(`
      UPDATE membros 
      SET numerodomes = EXTRACT(MONTH FROM data_nascimento)
      WHERE data_nascimento IS NOT NULL
    `);
    console.log(`✅ ${updateResult.rowCount} registros atualizados`);

    // 2. Criar função trigger
    console.log('\n📝 Passo 2: Criando função de trigger...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION atualizar_numerodomes()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.data_nascimento IS NOT NULL THEN
              NEW.numerodomes = EXTRACT(MONTH FROM NEW.data_nascimento);
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Função criada');

    // 3. Criar trigger para INSERT
    console.log('\n📝 Passo 3: Criando trigger para INSERT...');
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_numerodomes_insert ON membros;
      CREATE TRIGGER trigger_numerodomes_insert
          BEFORE INSERT ON membros
          FOR EACH ROW
          EXECUTE FUNCTION atualizar_numerodomes();
    `);
    console.log('✅ Trigger de INSERT criado');

    // 4. Criar trigger para UPDATE
    console.log('\n📝 Passo 4: Criando trigger para UPDATE...');
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_numerodomes_update ON membros;
      CREATE TRIGGER trigger_numerodomes_update
          BEFORE UPDATE ON membros
          FOR EACH ROW
          WHEN (NEW.data_nascimento IS DISTINCT FROM OLD.data_nascimento)
          EXECUTE FUNCTION atualizar_numerodomes();
    `);
    console.log('✅ Trigger de UPDATE criado');

    // 5. Verificar resultado
    console.log('\n📊 Distribuição por mês de nascimento:\n');
    const verificacao = await pool.query(`
      SELECT 
          numerodomes,
          COUNT(*) as total_pessoas,
          CASE numerodomes
              WHEN 1 THEN 'Janeiro'
              WHEN 2 THEN 'Fevereiro'
              WHEN 3 THEN 'Março'
              WHEN 4 THEN 'Abril'
              WHEN 5 THEN 'Maio'
              WHEN 6 THEN 'Junho'
              WHEN 7 THEN 'Julho'
              WHEN 8 THEN 'Agosto'
              WHEN 9 THEN 'Setembro'
              WHEN 10 THEN 'Outubro'
              WHEN 11 THEN 'Novembro'
              WHEN 12 THEN 'Dezembro'
              ELSE 'Sem data'
          END as mes_nome
      FROM membros
      GROUP BY numerodomes
      ORDER BY numerodomes NULLS LAST
    `);

    let totalComData = 0;
    let totalSemData = 0;

    verificacao.rows.forEach(row => {
      if (row.numerodomes) {
        console.log(`  ${String(row.numerodomes).padStart(2, ' ')}. ${row.mes_nome.padEnd(12)} - ${row.total_pessoas} pessoas`);
        totalComData += parseInt(row.total_pessoas);
      } else {
        totalSemData = parseInt(row.total_pessoas);
      }
    });

    console.log('\n' + '─'.repeat(60));
    console.log(`  Total com data de nascimento: ${totalComData}`);
    if (totalSemData > 0) {
      console.log(`  Total sem data de nascimento: ${totalSemData}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ CAMPO numerodomes CONFIGURADO COM SUCESSO!\n');
    console.log('🎯 O que foi feito:');
    console.log('   1. Todos os registros existentes foram atualizados');
    console.log('   2. Novos registros terão numerodomes preenchido automaticamente');
    console.log('   3. Ao alterar data de nascimento, numerodomes será atualizado\n');
    console.log('📝 Uso do campo:');
    console.log('   - Filtrar aniversariantes por mês');
    console.log('   - Ordenar membros por mês de nascimento');
    console.log('   - Gerar relatórios mensais de aniversários\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar
popularNumeroDomes().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
