// REMOVER ARQUIVOS OBSOLETOS DO PROJETO

const fs = require('fs');
const path = require('path');

console.log('🗑️ REMOÇÃO DE ARQUIVOS OBSOLETOS\n');
console.log('═'.repeat(60));

const filesToRemove = [
  // Access Database Files
  'backend/database/MembrosDB.accdb',
  'backend/database/MembrosDB_CustomID.accdb',
  'backend/database/MembrosDB_CustomID.laccdb',
  
  // Access SQL Scripts
  'database/create_access_tables.sql',
  
  // Access Setup Scripts
  'backend/scripts/setupDatabase.js',
  'backend/scripts/createNewAccessDB.js',
  'backend/scripts/analyzeAccessStructure.js',
  
  // Access Import Scripts
  'backend/scripts/importCompleteWithCustomID.js',
  'backend/scripts/importSimpleWithCustomID.js',
  'backend/scripts/reimportWithCustomIDs.js',
  'backend/scripts/replaceWithCustomIDs.js',
  'backend/scripts/recreateTableWithCustomID.js',
  'backend/scripts/addCustomIDColumn.js',
  
  // Old Migration Scripts
  'backend/scripts/finalizeMigration.js',
  'backend/scripts/clearDatabase.js',
  'backend/scripts/reimportSafe.js',
  'backend/scripts/testImport.js',
  
  // Old Test Files
  'backend/test-db-direct.js',
  'backend/test-query.js',
  'backend/test-database-status.js',
  
  // Excel Analysis Scripts (já executados)
  'backend/scripts/analyzeExcel.js',
  'backend/scripts/analyzeExcelStructure.js',
  
  // Import Scripts Diversos (obsoletos)
  'backend/scripts/importIBVP.js',
  'backend/scripts/importIBVP_Fixed.js',
  'backend/scripts/import_csvjson.js',
  'backend/scripts/importCompleteAllFields.js',
  
  // Correção de IDs Scripts (já executados)
  'backend/atualizar_sufixos.js',
  'backend/atualizar_todos_ids_pk.js',
  'backend/atualizar_todos_pk.js',
  'backend/corrigir_falhados.js',
  'backend/corrigir_pk_sufixo.js',
  'backend/improveIDGeneration.js',
  
  // Database Recreation Scripts
  'backend/recreateTable.js',
  'backend/limpar_membros.js',
  'backend/scripts/recreateTable.js',
  
  // Old Service Backup
  'backend/services/MemberServicePostgreSQL.js.backup'
];

const projectRoot = path.join(__dirname, '..');
let removed = 0;
let notFound = 0;
let errors = 0;
let totalSize = 0;

console.log('⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL!\n');
console.log(`📋 ${filesToRemove.length} arquivos serão removidos.\n`);
console.log('═'.repeat(60));

filesToRemove.forEach((file, index) => {
  const fullPath = path.join(projectRoot, file);
  
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.statSync(fullPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      fs.unlinkSync(fullPath);
      totalSize += stats.size;
      removed++;
      
      console.log(`✅ [${index + 1}/${filesToRemove.length}] Removido: ${file} (${sizeKB} KB)`);
    } catch (error) {
      errors++;
      console.error(`❌ [${index + 1}/${filesToRemove.length}] Erro ao remover ${file}: ${error.message}`);
    }
  } else {
    notFound++;
    console.log(`⏭️ [${index + 1}/${filesToRemove.length}] Não encontrado: ${file}`);
  }
});

console.log('\n═'.repeat(60));
console.log('📊 RESULTADO DA REMOÇÃO:\n');
console.log(`✅ Removidos: ${removed} arquivos`);
console.log(`⏭️ Não encontrados: ${notFound} arquivos`);
console.log(`❌ Erros: ${errors} arquivos`);
console.log(`💾 Espaço liberado: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('═'.repeat(60));

console.log('\n🎯 ARQUIVOS MANTIDOS (ainda em uso):\n');
console.log('✅ backend/config/postgresql.js - Configuração PostgreSQL ATIVA');
console.log('✅ backend/services/MemberServicePostgreSQL.js - Serviço principal ATIVO');
console.log('✅ backend/server.js - Servidor backend ATIVO');
console.log('✅ backend/backup-database.js - Sistema de backup ATIVO');
console.log('✅ backend/restore-database.js - Sistema de restore ATIVO');
console.log('✅ backend/list-backups.js - Gerenciador de backups ATIVO');
console.log('✅ backend/setupPostgreSQL.js - Setup PostgreSQL (pode ser útil)');

console.log('\n✅ LIMPEZA CONCLUÍDA!');
