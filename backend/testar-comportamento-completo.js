require('dotenv/config');

async function testarComportamento() {
  try {
    console.log('🔍 TESTANDO FÁBIO\n');
    console.log('=' .repeat(60));
    
    // 1. Testar API
    console.log('\n📡 1. BUSCANDO FÁBIO NA API');
    console.log('-'.repeat(60));
    
    const response = await fetch('http://localhost:5001/api/members');
    
    if (!response.ok) {
      throw new Error(`API retornou erro: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Buscar Fábio
    const fabio = data.find(m => m.nome && m.nome.toLowerCase().includes('fábio'));
    
    if (fabio) {
      console.log('✅ FÁBIO ENCONTRADO:');
      console.log(JSON.stringify(fabio, null, 2));
    } else {
      console.log('❌ FÁBIO NÃO ENCONTRADO');
      console.log('\nBuscando nomes similares...');
      const similares = data.filter(m => m.nome && m.nome.toLowerCase().includes('fab'));
      console.log('Membros com "fab" no nome:', similares.map(m => m.nome));
    }
    
    const ativos = data.filter(m => m.situacao_atual === 'Ativo');
    const desligados = data.filter(m => m.situacao_atual === 'Desligado');
    const batizados = data.filter(m => m.batizado === true);
    const naoBatizados = data.filter(m => m.batizado === false);
    const homens = data.filter(m => m.sexo === 'M');
    const mulheres = data.filter(m => m.sexo === 'F');
    
    console.log(`Total: ${data.length}`);
    console.log(`├─ Ativos: ${ativos.length}`);
    console.log(`└─ Desligados: ${desligados.length}`);
    console.log(`\nBatismo (todos):`);
    console.log(`├─ Batizados: ${batizados.length}`);
    console.log(`└─ Não Batizados: ${naoBatizados.length}`);
    console.log(`\nGênero (todos):`);
    console.log(`├─ Homens (M): ${homens.length}`);
    console.log(`└─ Mulheres (F): ${mulheres.length}`);
    
    // 3. Verificar aniversariantes
    console.log('\n🎂 3. ANIVERSARIANTES POR MÊS');
    console.log('-'.repeat(60));
    
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const aniversariantesPorMes = {};
    
    data.forEach(m => {
      if (!m.data_nascimento) return;
      const mes = new Date(m.data_nascimento).getMonth();
      if (!aniversariantesPorMes[mes]) {
        aniversariantesPorMes[mes] = [];
      }
      aniversariantesPorMes[mes].push(m);
    });
    
    Object.keys(aniversariantesPorMes).sort((a, b) => parseInt(a) - parseInt(b)).forEach(mesNum => {
      const mes = parseInt(mesNum);
      const lista = aniversariantesPorMes[mes];
      console.log(`${meses[mes]}: ${lista.length} aniversariante(s)`);
    });
    
    // 4. Verificar ANDERSON especificamente (27/10)
    console.log('\n🔍 4. VERIFICANDO ANDERSON (27/10)');
    console.log('-'.repeat(60));
    
    const anderson = data.find(m => 
      m.nome_completo && m.nome_completo.toUpperCase().includes('ANDERSON')
    );
    
    if (anderson) {
      console.log(`Nome: ${anderson.nome_completo}`);
      console.log(`Sexo: ${anderson.sexo}`);
      console.log(`Data Nascimento: ${anderson.data_nascimento}`);
      console.log(`Situação: ${anderson.situacao_atual}`);
      console.log(`Batizado: ${anderson.batizado}`);
      
      const dataNasc = new Date(anderson.data_nascimento);
      const dia = dataNasc.getUTCDate();
      const mes = dataNasc.getUTCMonth() + 1;
      console.log(`\n📅 Aniversário: ${dia}/${mes} (Dia ${dia} de ${meses[mes - 1]})`);
      
      if (anderson.sexo === 'M') {
        console.log(`✅ CORRETO: Sexo masculino - Deveria aparecer AZUL no calendário`);
      } else {
        console.log(`❌ ERRO: Sexo ${anderson.sexo} - Deveria ser 'M'`);
      }
    } else {
      console.log('❌ Anderson não encontrado no banco!');
    }
    
    // 5. Listar todos aniversariantes de outubro
    console.log('\n🎃 5. ANIVERSARIANTES DE OUTUBRO');
    console.log('-'.repeat(60));
    
    const outubro = data.filter(m => {
      if (!m.data_nascimento) return false;
      return new Date(m.data_nascimento).getMonth() === 9; // Outubro = mês 9 (0-based)
    });
    
    outubro.sort((a, b) => {
      const diaA = new Date(a.data_nascimento).getUTCDate();
      const diaB = new Date(b.data_nascimento).getUTCDate();
      return diaA - diaB;
    });
    
    console.log(`Total: ${outubro.length} aniversariante(s)\n`);
    outubro.forEach(m => {
      const dia = new Date(m.data_nascimento).getUTCDate();
      const cor = m.sexo === 'M' ? '🔵 AZUL' : '🌸 ROSA';
      console.log(`Dia ${dia.toString().padStart(2, '0')}: ${m.nome_completo} (${m.sexo}) ${cor}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE CONCLUÍDO!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

testarComportamento();
