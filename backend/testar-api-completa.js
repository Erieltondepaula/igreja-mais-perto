require('dotenv/config');

async function testarAPI() {
  try {
    console.log('🔍 Testando API em http://localhost:5001/api/members\n');
    
    const response = await fetch('http://localhost:5001/api/members');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Total de membros retornados:', data.length);
    
    // Estatísticas
    const ativos = data.filter(m => m.situacao_atual === 'Ativo');
    const desligados = data.filter(m => m.situacao_atual === 'Desligado');
    const batizados = data.filter(m => m.batizado === true);
    const naoBatizados = data.filter(m => m.batizado === false);
    const homens = data.filter(m => m.sexo === 'M');
    const mulheres = data.filter(m => m.sexo === 'F');
    
    console.log('\n📊 ESTATÍSTICAS DA API:');
    console.log('Total:', data.length);
    console.log('Ativos:', ativos.length);
    console.log('Desligados:', desligados.length);
    console.log('Batizados:', batizados.length);
    console.log('Não Batizados:', naoBatizados.length);
    console.log('Homens (M):', homens.length);
    console.log('Mulheres (F):', mulheres.length);
    
    // Aniversariantes de novembro
    const novembro = data.filter(m => {
      if (!m.data_nascimento) return false;
      const mes = new Date(m.data_nascimento).getMonth() + 1;
      return mes === 11;
    });
    
    console.log('\n🎂 Aniversariantes de Novembro:', novembro.length);
    if (novembro.length > 0) {
      console.log('Primeiros 5:');
      novembro.slice(0, 5).forEach(m => {
        console.log(`  - ${m.nome_completo} (${m.sexo}) - ${m.data_nascimento}`);
      });
    }
    
    // Amostra de 3 registros
    console.log('\n📋 Amostra de 3 registros:');
    data.slice(0, 3).forEach(m => {
      console.log(`\n  ID: ${m.id}`);
      console.log(`  Nome: ${m.nome_completo}`);
      console.log(`  Sexo: ${m.sexo}`);
      console.log(`  Data Nascimento: ${m.data_nascimento}`);
      console.log(`  Batizado: ${m.batizado}`);
      console.log(`  Situação: ${m.situacao_atual}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testarAPI();
