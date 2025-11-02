// SCRIPT PARA EXPANDIR ID E ATUALIZAR PK COM SUFIXO
const { Client } = require('pg');
const fs = require('fs');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function corrigirPkComSufixo() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // 1. Expandir campo ID
    console.log('📝 Expandindo campo ID...');
    await client.query('ALTER TABLE membros ALTER COLUMN id TYPE VARCHAR(30)');
    
    // 2. Carregar e executar função compacta
    console.log('📝 Criando função de ID compacto...');
    const sqlExpandir = fs.readFileSync('sql/expandir_id.sql', 'utf8');
    await client.query(sqlExpandir);
    
    // 3. Testar função
    const teste = await client.query("SELECT gerar_id_compacto('JOÃO SILVA') as teste");
    console.log('🧪 Teste da função:', teste.rows[0].teste);
    
    // 4. Buscar registros existentes
    console.log('📋 Buscando registros existentes...');
    const registros = await client.query(`
      SELECT id, nome_completo 
      FROM membros 
      ORDER BY created_at
      LIMIT 10
    `);
    
    console.log(`📊 Encontrados ${registros.rows.length} registros para atualizar`);
    
    // 5. Atualizar IDs um por vez
    for (const registro of registros.rows) {
      try {
        // Gerar novo ID compacto
        const novoIdResult = await client.query(
          'SELECT gerar_id_compacto($1) as novo_id',
          [registro.nome_completo]
        );
        
        const novoId = novoIdResult.rows[0].novo_id;
        
        // Atualizar ID
        await client.query(
          'UPDATE membros SET id = $1 WHERE id = $2',
          [novoId, registro.id]
        );
        
        console.log(`✅ ${registro.id} → ${novoId}`);
        
      } catch (error) {
        console.error(`❌ Erro ao atualizar ${registro.id}:`, error.message);
      }
    }
    
    // 6. Remover campos desnecessários
    console.log('🗑️ Removendo campos desnecessários...');
    try {
      await client.query('ALTER TABLE membros DROP COLUMN IF EXISTS codigo_referencia');
      await client.query('ALTER TABLE membros DROP COLUMN IF EXISTS id_externo');
      console.log('✅ Campos removidos');
    } catch (error) {
      console.log('⚠️ Campos já removidos ou não existem');
    }
    
    // 7. Criar trigger para novos registros
    console.log('🔄 Criando trigger...');
    await client.query(`
      CREATE OR REPLACE FUNCTION trigger_gerar_id_com_sufixo()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.id IS NULL OR NEW.id = '' THEN
              NEW.id := gerar_id_compacto(NEW.nome_completo);
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query('DROP TRIGGER IF EXISTS before_insert_gerar_id ON membros');
    await client.query(`
      CREATE TRIGGER before_insert_gerar_id
          BEFORE INSERT ON membros
          FOR EACH ROW
          EXECUTE FUNCTION trigger_gerar_id_com_sufixo()
    `);
    
    console.log('✅ Trigger criado');
    
    // 8. Verificar resultado
    const amostra = await client.query(`
      SELECT id, nome_completo 
      FROM membros 
      WHERE id LIKE '%-%'
      ORDER BY id 
      LIMIT 5
    `);
    
    console.log('\n📋 Amostra de IDs atualizados:');
    amostra.rows.forEach(reg => {
      console.log(`   ${reg.id}: ${reg.nome_completo}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
corrigirPkComSufixo();