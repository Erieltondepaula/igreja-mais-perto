require('dotenv').config();
const MemberService = require('./services/MemberServicePostgreSQL.js');

async function testSmartUpsert() {
  try {
    console.log('🧪 TESTE: Sistema UPSERT Inteligente\n');

    // Dados de teste simulando Excel
    const testData = [
      {
        nome: 'JOÃO',
        sobrenome: 'SILVA',
        nome_completo: 'JOÃO SILVA',
        data_nascimento: '1985-03-15',
        telefone: '11999888777', // Telefone NOVO
        sexo: 'M',
        situacao_atual: 'ativo',
        batizado: true,
        membro: true
      },
      {
        nome: 'MARIA',
        sobrenome: 'SANTOS',
        nome_completo: 'MARIA SANTOS',
        data_nascimento: '1990-07-22',
        telefone: '11999888888', // Telefone NOVO
        sexo: 'F',
        situacao_atual: 'ativo',
        batizado: true,
        membro: true,
        observacoes: 'Observação nova' // Campo NOVO
      },
      {
        nome: 'PEDRO',
        sobrenome: 'COSTA',
        nome_completo: 'PEDRO COSTA',
        data_nascimento: '1988-12-10',
        telefone: '11999777666',
        sexo: 'M',
        situacao_atual: 'ativo',
        batizado: false,
        membro: true
      }
    ];

    console.log('📊 Estado ANTES da importação:');
    const membersBefore = await MemberService.getAllMembers();
    console.log(`   Total de membros: ${membersBefore.length}`);
    console.log(`   Com avatars: ${membersBefore.filter(m => m.avatar_url).length}\n`);

    // Executar importação inteligente
    console.log('🚀 Executando importação inteligente...\n');
    const results = await MemberService.importMembers(testData);

    console.log('\n📊 Estado DEPOIS da importação:');
    const membersAfter = await MemberService.getAllMembers();
    console.log(`   Total de membros: ${membersAfter.length}`);
    console.log(`   Com avatars: ${membersAfter.filter(m => m.avatar_url).length}`);

    // Verificar se avatars foram preservados
    const withAvatarsAfter = membersAfter.filter(m => m.avatar_url);
    if (withAvatarsAfter.length > 0) {
      console.log('\n🖼️ Membros que MANTIVERAM avatars:');
      withAvatarsAfter.forEach(m => {
        console.log(`   - ${m.nome_completo} → ${m.avatar_url}`);
      });
    }

    // Verificar membros específicos
    const joao = membersAfter.find(m => m.nome_completo === 'JOÃO SILVA');
    if (joao) {
      console.log(`\n🔍 JOÃO SILVA:`);
      console.log(`   ID: ${joao.id} (${joao.id.startsWith('JS') ? '✅ ID preservado' : '❌ ID mudou'})`);
      console.log(`   Telefone: ${joao.telefone} (${joao.telefone === '11999888777' ? '✅ Atualizado' : '❌ Não atualizado'})`);
      console.log(`   Avatar: ${joao.avatar_url || 'NENHUM'} (${joao.avatar_url ? '✅ Preservado' : '⚪ Sem avatar'})`);
    }

    const maria = membersAfter.find(m => m.nome_completo === 'MARIA SANTOS');
    if (maria) {
      console.log(`\n🔍 MARIA SANTOS:`);
      console.log(`   ID: ${maria.id} (${maria.id.startsWith('MS') ? '✅ ID preservado' : '❌ ID mudou'})`);
      console.log(`   Telefone: ${maria.telefone} (${maria.telefone === '11999888888' ? '✅ Atualizado' : '❌ Não atualizado'})`);
      console.log(`   Avatar: ${maria.avatar_url || 'NENHUM'} (${maria.avatar_url ? '✅ Preservado' : '⚪ Sem avatar'})`);
      console.log(`   Observações: ${maria.observacoes || 'NENHUMA'} (${maria.observacoes === 'Observação nova' ? '✅ Atualizado' : '❌ Não atualizado'})`);
    }

    // Estatísticas
    console.log(`\n📈 Resumo dos resultados:`);
    const stats = results.reduce((acc, r) => {
      acc[r.action] = (acc[r.action] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(stats).forEach(([action, count]) => {
      const emoji = action === 'inserted' ? '➕' : action === 'updated' ? '🔄' : action === 'skipped' ? '⏭️' : '❌';
      console.log(`   ${emoji} ${action}: ${count}`);
    });

    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testSmartUpsert();