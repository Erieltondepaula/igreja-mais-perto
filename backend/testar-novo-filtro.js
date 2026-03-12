// Script para testar o novo comportamento de filtros
require('dotenv/config');

async function testarFiltros() {
  try {
    console.log('🔍 TESTANDO NOVO COMPORTAMENTO DE FILTROS\n');
    console.log('=' .repeat(60));
    
    const response = await fetch('http://localhost:5001/api/members');
    
    if (!response.ok) {
      throw new Error(`API retornou erro: ${response.status}`);
    }
    
    const data = await response.json();
    
    const ativos = data.filter(m => m.situacao_atual === 'Ativo');
    const desligados = data.filter(m => m.situacao_atual === 'Desligado');
    
    console.log('\n📊 RESUMO DO BANCO DE DADOS');
    console.log('-'.repeat(60));
    console.log(`Total de membros: ${data.length}`);
    console.log(`├─ Ativos: ${ativos.length}`);
    console.log(`└─ Desligados: ${desligados.length}`);
    
    console.log('\n✅ COMPORTAMENTO ESPERADO DO NOVO FILTRO:');
    console.log('-'.repeat(60));
    console.log('1. SEM FILTRO DE STATUS (padrão):');
    console.log(`   → Mostra apenas ATIVOS: ${ativos.length} membros`);
    console.log('   → Calendário: apenas aniversários de ativos');
    console.log('   → Estatísticas: calculadas apenas com ativos');
    
    console.log('\n2. FILTRO "Ativos" SELECIONADO:');
    console.log(`   → Mostra apenas ATIVOS: ${ativos.length} membros`);
    
    console.log('\n3. FILTRO "Desligados" SELECIONADO:');
    console.log(`   → Mostra apenas DESLIGADOS: ${desligados.length} membros`);
    console.log('   → Calendário: sem aniversários (desligados não aparecem)');
    console.log('   → Estatísticas: continua com ativos (não muda)');
    
    console.log('\n📋 EXEMPLOS DE MEMBROS DESLIGADOS:');
    console.log('-'.repeat(60));
    if (desligados.length > 0) {
      desligados.slice(0, 5).forEach(m => {
        console.log(`• ${m.nome_completo || m.nome} - Desligado`);
      });
      if (desligados.length > 5) {
        console.log(`  ... e mais ${desligados.length - 5} desligados`);
      }
    } else {
      console.log('Nenhum membro desligado encontrado.');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE CONCLUÍDO!');
    console.log('Recarregue o navegador para ver as mudanças.');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testarFiltros();
