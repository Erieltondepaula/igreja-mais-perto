require('dotenv').config();
const db = require('./config/postgresql.js');

async function createTrigger() {
  try {
    console.log('🔧 Criando trigger para geração automática de ID...');
    
    // Criar função de trigger se não existir
    await db.query(`
      CREATE OR REPLACE FUNCTION set_member_id()
      RETURNS TRIGGER AS $$
      DECLARE
          primeiro_nome varchar;
          resto_nome varchar;
      BEGIN
          IF NEW.id IS NULL THEN
              -- Usar nome e sobrenome, se não tiver sobrenome, usar nome_completo split
              IF NEW.sobrenome IS NOT NULL AND NEW.sobrenome != '' THEN
                  NEW.id = generate_member_id(NEW.nome, NEW.sobrenome);
              ELSE
                  -- Se não tem sobrenome, dividir nome_completo
                  primeiro_nome := SPLIT_PART(NEW.nome_completo, ' ', 1);
                  resto_nome := TRIM(SUBSTRING(NEW.nome_completo FROM LENGTH(primeiro_nome) + 1));
                  
                  IF resto_nome = '' THEN
                      resto_nome := primeiro_nome; -- Se só tem um nome, usar o mesmo
                  END IF;
                  
                  NEW.id = generate_member_id(primeiro_nome, resto_nome);
              END IF;
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Função set_member_id() criada/atualizada');
    
    // Criar trigger
    await db.query(`
      DROP TRIGGER IF EXISTS membros_id_trigger ON membros;
    `);
    
    await db.query(`
      CREATE TRIGGER membros_id_trigger
          BEFORE INSERT ON membros
          FOR EACH ROW
          EXECUTE FUNCTION set_member_id();
    `);
    console.log('✅ Trigger membros_id_trigger criado');
    
    console.log('🎉 Trigger de ID automático configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

createTrigger();