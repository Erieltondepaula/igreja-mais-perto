// SCRIPT PARA CORRIGIR OS REGISTROS QUE FALHARAM
const { Client } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: '252088',
  port: 5432,
};

async function corrigirRegistrosFalharam() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // IDs que falharam na atualização anterior
    const idsFalharam = [
      'BL2025103109110301',
      'KP20251031091103', 
      'LD2025103109110302',
      'MD2025103109110301',
      'MD2025103109110302',
      'RC20251031091103',
      'RD20251031091103', 
      'SP20251031091103'
    ];
    
    console.log(`📋 Corrigindo ${idsFalharam.length} registros que falharam...`);
    
    let corrigidos = 0;
    
    for (const id of idsFalharam) {
      try {
        // Buscar nome completo do registro
        const registro = await client.query(
          'SELECT nome_completo FROM membros WHERE codigo_referencia = $1',
          [id]
        );
        
        if (registro.rows.length === 0) {
          console.log(`⚠️  ID ${id} não encontrado`);
          continue;
        }
        
        const nomeCompleto = registro.rows[0].nome_completo;
        
        // Gerar novo código com função corrigida
        const novoCodigo = await client.query(
          'SELECT gerar_codigo_referencia($1) AS codigo',
          [nomeCompleto]
        );
        
        const codigoComSufixo = novoCodigo.rows[0].codigo;
        
        // Atualizar registro
        await client.query(
          'UPDATE membros SET codigo_referencia = $1 WHERE codigo_referencia = $2',
          [codigoComSufixo, id]
        );
        
        console.log(`✅ ${id}: ${nomeCompleto} → ${codigoComSufixo}`);
        corrigidos++;
        
      } catch (error) {
        console.error(`❌ Erro ao corrigir ${id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Corrigidos ${corrigidos} de ${idsFalharam.length} registros`);
    
    // Verificar se ainda há registros sem sufixo
    const semSufixo = await client.query(`
      SELECT COUNT(*) as total
      FROM membros 
      WHERE codigo_referencia NOT LIKE '%-%'
    `);
    
    console.log(`📊 Registros ainda sem sufixo: ${semSufixo.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

// Executar
corrigirRegistrosFalharam();