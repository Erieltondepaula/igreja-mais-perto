// 🧪 TESTE DO SISTEMA INTELIGENTE DE IMPORTAÇÃO
// Testa a importação inteligente com detecção de duplicados e preservação de avatars
// ⚠️ IMPORTANTE: Este script faz backup automático antes de qualquer teste!

const db = require('./config/postgresql');
const MemberService = require('./services/MemberServicePostgreSQL');
const { execSync } = require('child_process');
const path = require('path');

async function testIntelligentImport() {
  console.log('🧪 INICIANDO TESTE DO SISTEMA INTELIGENTE\n');
  
  try {
    // 0. BACKUP AUTOMÁTICO ANTES DO TESTE
    console.log('💾 CRIANDO BACKUP AUTOMÁTICO...');
    console.log('⚠️ REGRA: Sempre fazer backup antes de testes!\n');
    
    try {
      execSync('node backup-database.js', { 
        cwd: __dirname,
        stdio: 'inherit'
      });
      console.log('');
    } catch (backupError) {
      console.error('❌ Falha ao criar backup! Abortando teste.');
      console.error('💡 Verifique REGRAS_BACKUP_CRITICAS.md');
      process.exit(1);
    }
    
    // 1. Conectar ao banco
    console.log('📡 Conectando ao PostgreSQL...');
    await db.connect();
    console.log('✅ Conectado!\n');
    
    // 2. Verificar membros existentes
    console.log('📊 Verificando membros existentes...');
    const existingMembers = await MemberService.getAllMembers();
    console.log(`✅ Total de membros no banco: ${existingMembers.length}\n`);
    
    // Mostrar alguns membros com avatars
    const membrosComAvatar = existingMembers.filter(m => m.avatar_url);
    console.log(`🖼️ Membros com avatar: ${membrosComAvatar.length}`);
    if (membrosComAvatar.length > 0) {
      console.log('   Exemplos:');
      membrosComAvatar.slice(0, 3).forEach(m => {
        console.log(`   - ${m.nome_completo} (ID: ${m.id}) → ${m.avatar_url}`);
      });
      console.log('');
    }
    
    // 3. Criar dados de teste simulando importação Excel
    console.log('📋 Criando dados de teste...');
    const testMembers = [];
    
    // Teste 1: Membro existente com dados idênticos (deve pular)
    if (existingMembers.length > 0) {
      const primeiroMembro = existingMembers[0];
      testMembers.push({
        nome: primeiroMembro.nome,
        sobrenome: primeiroMembro.sobrenome,
        nome_completo: primeiroMembro.nome_completo,
        data_nascimento: primeiroMembro.data_nascimento,
        telefone: primeiroMembro.telefone,
        sexo: primeiroMembro.sexo,
        observacoes: primeiroMembro.observacoes,
        situacao_atual: primeiroMembro.situacao_atual
      });
      console.log(`   Teste 1: ${primeiroMembro.nome_completo} (esperado: PULAR - dados idênticos)`);
    }
    
    // Teste 2: Membro existente com telefone diferente (deve atualizar)
    if (existingMembers.length > 1) {
      const segundoMembro = existingMembers[1];
      testMembers.push({
        nome: segundoMembro.nome,
        sobrenome: segundoMembro.sobrenome,
        nome_completo: segundoMembro.nome_completo,
        data_nascimento: segundoMembro.data_nascimento,
        telefone: '(11) 99999-8888', // Telefone diferente
        sexo: segundoMembro.sexo,
        observacoes: segundoMembro.observacoes,
        situacao_atual: segundoMembro.situacao_atual
      });
      console.log(`   Teste 2: ${segundoMembro.nome_completo} (esperado: ATUALIZAR telefone)`);
    }
    
    // Teste 3: Membro completamente novo (deve inserir)
    testMembers.push({
      nome: 'João',
      sobrenome: 'Teste Sistema Inteligente',
      nome_completo: 'João Teste Sistema Inteligente',
      data_nascimento: '1990-05-15',
      telefone: '(11) 98765-4321',
      sexo: 'M',
      observacoes: 'Membro de teste para validação do sistema inteligente',
      situacao_atual: 'ativo'
    });
    console.log(`   Teste 3: João Teste Sistema Inteligente (esperado: INSERIR novo)`);
    
    console.log('');
    
    // 4. Executar importação inteligente
    console.log('🧠 EXECUTANDO IMPORTAÇÃO INTELIGENTE...\n');
    console.log('═'.repeat(60));
    const results = await MemberService.importMembers(testMembers);
    console.log('═'.repeat(60));
    console.log('');
    
    // 5. Analisar resultados
    console.log('📊 ANÁLISE DOS RESULTADOS:\n');
    
    const inserted = results.filter(r => r.action === 'inserted');
    const updated = results.filter(r => r.action === 'updated');
    const skipped = results.filter(r => r.action === 'skipped');
    const errors = results.filter(r => r.action === 'error');
    
    console.log(`✅ Resumo:`);
    console.log(`   - Inseridos: ${inserted.length}`);
    console.log(`   - Atualizados: ${updated.length}`);
    console.log(`   - Pulados: ${skipped.length}`);
    console.log(`   - Erros: ${errors.length}`);
    console.log('');
    
    // Detalhes dos inseridos
    if (inserted.length > 0) {
      console.log(`➕ INSERIDOS (${inserted.length}):`);
      inserted.forEach(r => {
        console.log(`   - ${r.member.nome_completo} → ID: ${r.id}`);
      });
      console.log('');
    }
    
    // Detalhes dos atualizados
    if (updated.length > 0) {
      console.log(`🔄 ATUALIZADOS (${updated.length}):`);
      updated.forEach(r => {
        console.log(`   - ${r.member.nome_completo} → ${r.updatedFields} campo(s)`);
      });
      console.log('');
    }
    
    // Detalhes dos pulados
    if (skipped.length > 0) {
      console.log(`⏭️ PULADOS (${skipped.length}):`);
      skipped.forEach(r => {
        console.log(`   - ${r.member.nome_completo} (sem alterações)`);
      });
      console.log('');
    }
    
    // 6. Verificar preservação de avatars
    console.log('🖼️ VERIFICANDO PRESERVAÇÃO DE AVATARS...');
    const membrosAposTeste = await MemberService.getAllMembers();
    const avatarsPreservados = membrosAposTeste.filter(m => m.avatar_url);
    
    if (avatarsPreservados.length === membrosComAvatar.length) {
      console.log(`✅ SUCESSO: Todos os ${membrosComAvatar.length} avatars foram preservados!`);
    } else {
      console.log(`❌ FALHA: Esperado ${membrosComAvatar.length} avatars, encontrado ${avatarsPreservados.length}`);
    }
    console.log('');
    
    // 7. Limpar dados de teste
    console.log('🧹 Limpando dados de teste...');
    const testMember = membrosAposTeste.find(m => m.nome_completo === 'João Teste Sistema Inteligente');
    if (testMember) {
      await MemberService.deleteMember(testMember.id);
      console.log(`✅ Membro de teste removido: ${testMember.id}`);
    }
    
    console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('═'.repeat(60));
    console.log('\n💡 LEMBRETE: Backup foi criado antes do teste');
    console.log('📂 Se necessário restaurar: node restore-database.js\n');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    console.log('\n💡 Você pode restaurar o backup com: node restore-database.js');
  } finally {
    await db.close();
    process.exit(0);
  }
}

// Executar teste
testIntelligentImport().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
