require('dotenv').config();
const MemberService = require('./services/MemberServicePostgreSQL.js');
const fs = require('fs');
const path = require('path');

async function testAvatarPreservation() {
  try {
    console.log('🧪 TESTE: Sistema de Preservação de Avatars\n');

    // 1. Inserir alguns membros com avatars
    console.log('🔄 1. Inserindo membros de teste com avatars...');
    const testMembers = [
      {
        nome: 'JOÃO',
        sobrenome: 'SILVA', 
        nome_completo: 'JOÃO SILVA',
        data_nascimento: '1985-03-15',
        sexo: 'M',
        telefone: '11999001',
        situacao_atual: 'ativo',
        batizado: true,
        membro: true,
        avatar_url: 'avatar1.jpg'
      },
      {
        nome: 'MARIA',
        sobrenome: 'SANTOS',
        nome_completo: 'MARIA SANTOS', 
        data_nascimento: '1990-07-22',
        sexo: 'F',
        telefone: '11999002',
        situacao_atual: 'ativo',
        batizado: true,
        membro: true,
        avatar_url: 'avatar2.jpg'
      },
      {
        nome: 'PEDRO',
        sobrenome: 'OLIVEIRA',
        nome_completo: 'PEDRO OLIVEIRA',
        data_nascimento: '1988-12-10', 
        sexo: 'M',
        telefone: '11999003',
        situacao_atual: 'ativo',
        batizado: true,
        membro: true,
        avatar_url: 'avatar3.jpg'
      }
    ];

    const insertResults = await MemberService.importMembers(testMembers);
    console.log(`✅ ${insertResults.filter(r => r.success).length} membros inseridos com avatars`);
    
    // Mostrar IDs gerados
    insertResults.forEach(result => {
      if (result.success) {
        console.log(`   - ${result.member.nome_completo}: ${result.id} (avatar: ${result.member.avatar_url})`);
      }
    });

    // 2. Verificar membros na base antes do Replace All
    console.log('\n🔍 2. Verificando membros antes da limpeza...');
    const membersBefore = await MemberService.getAllMembers();
    console.log(`📊 Total de membros: ${membersBefore.length}`);
    const withAvatars = membersBefore.filter(m => m.avatar_url);
    console.log(`🖼️ Membros com avatars: ${withAvatars.length}`);
    withAvatars.forEach(m => {
      console.log(`   - ${m.nome_completo} → ${m.avatar_url}`);
    });

    // 3. Executar Replace All (Clear + Import)
    console.log('\n🔄 3. Executando Replace All...');
    
    // Novos dados (alguns iguais, alguns diferentes)
    const newMembers = [
      {
        nome: 'JOÃO',
        sobrenome: 'SILVA',
        nome_completo: 'JOÃO SILVA', // MESMO PESSOA - deve manter avatar
        data_nascimento: '1985-03-15',
        sexo: 'M', 
        telefone: '11999001999', // Telefone atualizado
        situacao_atual: 'ativo',
        batizado: true,
        membro: true
        // SEM avatar_url - deve ser preservado do backup
      },
      {
        nome: 'MARIA',
        sobrenome: 'SANTOS',
        nome_completo: 'MARIA SANTOS', // MESMA PESSOA - deve manter avatar
        data_nascimento: '1990-07-22',
        sexo: 'F',
        telefone: '11999002999', // Telefone atualizado
        situacao_atual: 'ativo', 
        batizado: true,
        membro: true
        // SEM avatar_url - deve ser preservado do backup
      },
      {
        nome: 'ANA',
        sobrenome: 'COSTA',
        nome_completo: 'ANA COSTA', // PESSOA NOVA - não terá avatar
        data_nascimento: '1992-05-18',
        sexo: 'F',
        telefone: '11999004',
        situacao_atual: 'ativo',
        batizado: false,
        membro: true
        // SEM avatar_url - pessoa nova
      }
      // Note: PEDRO OLIVEIRA foi removido da lista
    ];

    // Limpar tabela (com backup de avatars)
    await MemberService.clearAllMembers();
    console.log('✅ Tabela limpa (avatars salvos em backup)');

    // Importar novos membros
    const importResults = await MemberService.importMembers(newMembers);
    console.log(`✅ ${importResults.filter(r => r.success).length} novos membros importados`);

    // 4. Verificar se avatars foram preservados
    console.log('\n🔍 4. Verificando preservação de avatars...');
    const membersAfter = await MemberService.getAllMembers();
    console.log(`📊 Total de membros após Replace All: ${membersAfter.length}`);
    
    membersAfter.forEach(m => {
      console.log(`   - ${m.nome_completo} (${m.data_nascimento})`);
      console.log(`     🆔 ID: ${m.id}`);
      console.log(`     📞 Telefone: ${m.telefone}`);
      console.log(`     🖼️ Avatar: ${m.avatar_url || 'NENHUM'}`);
      
      // Verificar se avatar foi preservado corretamente
      if (m.nome_completo === 'JOÃO SILVA') {
        if (m.avatar_url === 'avatar1.jpg') {
          console.log(`     ✅ Avatar preservado corretamente!`);
        } else {
          console.log(`     ❌ Avatar perdido! Esperado: avatar1.jpg, Atual: ${m.avatar_url}`);
        }
      }
      
      if (m.nome_completo === 'MARIA SANTOS') {
        if (m.avatar_url === 'avatar2.jpg') {
          console.log(`     ✅ Avatar preservado corretamente!`);
        } else {
          console.log(`     ❌ Avatar perdido! Esperado: avatar2.jpg, Atual: ${m.avatar_url}`);
        }
      }
      
      if (m.nome_completo === 'ANA COSTA') {
        if (!m.avatar_url) {
          console.log(`     ✅ Pessoa nova sem avatar (correto)`);
        } else {
          console.log(`     ⚠️ Pessoa nova com avatar inesperado: ${m.avatar_url}`);
        }
      }
      
      console.log('');
    });

    // 5. Resumo do teste
    console.log('📋 RESUMO DO TESTE:');
    console.log(`   • Membros antes: ${membersBefore.length} (${withAvatars.length} com avatars)`);
    console.log(`   • Membros depois: ${membersAfter.length} (${membersAfter.filter(m => m.avatar_url).length} com avatars)`);
    
    const preservedCount = membersAfter.filter(m => m.avatar_url).length;
    console.log(`   • Avatars preservados: ${preservedCount}`);
    
    if (preservedCount === 2) {
      console.log('   ✅ TESTE PASSOU: Avatars preservados corretamente!');
    } else {
      console.log('   ❌ TESTE FALHOU: Avatars não foram preservados');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testAvatarPreservation();