const { Client } = require('pg');

async function improveIDGeneration() {
  console.log('🔧 MELHORANDO ALGORITMO DE GERAÇÃO DE ID');
  console.log('=========================================');
  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dashboard_membros',
    password: '252088',
    port: 5432,
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Limpar tabela para reimportação
    console.log('🗑️ Limpando tabela para reimportação...');
    await client.query('DELETE FROM membros');
    console.log('✅ Tabela limpa');
    
    // Criar função de ID melhorada com contador sequencial
    console.log('⚙️ Criando função de ID melhorada...');
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_unique_member_id(p_nome VARCHAR, p_sobrenome VARCHAR, p_data_nascimento DATE)
      RETURNS VARCHAR(20) AS $$
      DECLARE
        primeira_letra VARCHAR(1);
        segunda_letra VARCHAR(1);
        timestamp_str VARCHAR(14);
        seq_num INTEGER;
        new_id VARCHAR(20);
        final_id VARCHAR(20);
        counter INTEGER := 0;
      BEGIN
        -- Primeira letra do nome (maiúscula)
        primeira_letra := UPPER(LEFT(TRIM(p_nome), 1));
        
        -- Segunda letra do sobrenome (maiúscula)
        segunda_letra := UPPER(LEFT(TRIM(p_sobrenome), 1));
        
        -- Se sobrenome for igual ao nome, usar segunda letra do nome
        IF TRIM(p_sobrenome) = TRIM(p_nome) AND LENGTH(TRIM(p_nome)) > 1 THEN
          segunda_letra := UPPER(SUBSTRING(TRIM(p_nome), 2, 1));
        END IF;
        
        -- Timestamp no formato YYYYMMDDHHMMSS
        timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
        
        -- Tentar gerar ID único
        LOOP
          -- Base do ID
          new_id := primeira_letra || segunda_letra || timestamp_str;
          
          -- Se não é primeira tentativa, adicionar sufixo
          IF counter > 0 THEN
            new_id := new_id || LPAD(counter::TEXT, 2, '0');
          END IF;
          
          -- Verificar se já existe
          SELECT COUNT(*) INTO seq_num FROM membros WHERE id = new_id;
          
          IF seq_num = 0 THEN
            final_id := new_id;
            EXIT;
          END IF;
          
          counter := counter + 1;
          
          -- Adicionar microsegundos se necessário
          IF counter > 99 THEN
            timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISSUS');
            counter := 0;
          END IF;
          
        END LOOP;
        
        RETURN final_id;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Nova função de ID criada com sistema anti-duplicação');
    
    // Testar a nova função
    console.log('\n🧪 TESTANDO NOVA FUNÇÃO:');
    
    for (let i = 1; i <= 5; i++) {
      const result = await client.query(`
        SELECT generate_unique_member_id('João', 'Silva', '1990-01-01') as test_id
      `);
      console.log(`Teste ${i}: ${result.rows[0].test_id}`);
    }
    
    console.log('\n🎉 FUNÇÃO MELHORADA INSTALADA!');
    console.log('✅ Agora pode reimportar todos os 144 registros sem duplicação');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

improveIDGeneration();