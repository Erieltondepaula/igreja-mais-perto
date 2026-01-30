// IDENTIFICAR E LISTAR ARQUIVOS OBSOLETOS DO PROJETO

const fs = require('fs');
const path = require('path');

console.log('🔍 VARREDURA DE ARQUIVOS OBSOLETOS\n');
console.log('═'.repeat(60));

const obsoletePatterns = {
  'Access Database Files': {
    pattern: /\.(accdb|laccdb|mdb)$/i,
    reason: 'Sistema migrado para PostgreSQL'
  },
  'Access SQL Scripts': {
    pattern: /create_access_tables\.sql$/i,
    reason: 'Scripts SQL do Access não mais necessários'
  },
  'Access Setup Scripts': {
    files: [
      'setupDatabase.js',
      'createNewAccessDB.js',
      'analyzeAccessStructure.js'
    ],
    reason: 'Scripts de setup do Access obsoletos'
  },
  'Access Import Scripts': {
    files: [
      'importCompleteWithCustomID.js',
      'importSimpleWithCustomID.js',
      'reimportWithCustomIDs.js',
      'replaceWithCustomIDs.js',
      'recreateTableWithCustomID.js',
      'addCustomIDColumn.js'
    ],
    reason: 'Scripts de importação para Access'
  },
  'Old Migration Scripts': {
    files: [
      'finalizeMigration.js',
      'clearDatabase.js',
      'reimportSafe.js',
      'testImport.js'
    ],
    reason: 'Scripts de migração já concluída'
  },
  'Access Database Config': {
    files: [
      'config/database.js'
    ],
    reason: 'Configuração do Access (agora usa postgresql.js)',
    exceptions: ['Ainda pode ser usado por scripts legados - verificar']
  },
  'Old Test Files': {
    files: [
      'test-db-direct.js',
      'test-query.js',
      'test-database-status.js'
    ],
    reason: 'Testes antigos do Access'
  },
  'Excel Analysis Scripts': {
    files: [
      'scripts/analyzeExcel.js',
      'scripts/analyzeExcelStructure.js'
    ],
    reason: 'Scripts de análise já executados'
  },
  'Import Scripts Diversos': {
    files: [
      'scripts/importIBVP.js',
      'scripts/importIBVP_Fixed.js',
      'scripts/import_csvjson.js',
      'scripts/importCompleteAllFields.js'
    ],
    reason: 'Scripts de importação antigos (sistema agora usa importMembers inteligente)'
  },
  'Correção de IDs Scripts': {
    files: [
      'atualizar_sufixos.js',
      'atualizar_todos_ids_pk.js',
      'atualizar_todos_pk.js',
      'corrigir_falhados.js',
      'corrigir_pk_sufixo.js',
      'improveIDGeneration.js'
    ],
    reason: 'Scripts de correção de IDs já executados'
  },
  'Database Recreation Scripts': {
    files: [
      'recreateTable.js',
      'limpar_membros.js'
    ],
    reason: 'Scripts de recriação não mais necessários'
  },
  'Old Service Files': {
    files: [
      'services/MemberServicePostgreSQL.js.backup'
    ],
    reason: 'Backup do serviço - arquivo novo já criado'
  }
};

const projectRoot = path.join(__dirname, '..');
const obsoleteFiles = [];

function scanDirectory(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Pular node_modules, dist, .git
      if (!['node_modules', 'dist', '.git', 'Backup_banco'].includes(item)) {
        scanDirectory(fullPath, relativePath);
      }
    } else {
      // Verificar se o arquivo é obsoleto
      for (const [category, config] of Object.entries(obsoletePatterns)) {
        let isObsolete = false;
        
        if (config.pattern && config.pattern.test(item)) {
          isObsolete = true;
        }
        
        if (config.files && config.files.some(f => relativePath.includes(f))) {
          isObsolete = true;
        }
        
        if (isObsolete) {
          obsoleteFiles.push({
            category,
            path: relativePath,
            fullPath: fullPath,
            size: stats.size,
            reason: config.reason,
            exceptions: config.exceptions
          });
        }
      }
    }
  });
}

console.log('📁 Escaneando diretórios...\n');
scanDirectory(projectRoot);

console.log(`✅ Varredura completa! ${obsoleteFiles.length} arquivos obsoletos encontrados.\n`);
console.log('═'.repeat(60));

// Agrupar por categoria
const grouped = {};
obsoleteFiles.forEach(file => {
  if (!grouped[file.category]) {
    grouped[file.category] = [];
  }
  grouped[file.category].push(file);
});

let totalSize = 0;

Object.keys(grouped).forEach(category => {
  console.log(`\n📂 ${category}`);
  console.log(`   Motivo: ${grouped[category][0].reason}`);
  
  if (grouped[category][0].exceptions) {
    console.log(`   ⚠️ Atenção: ${grouped[category][0].exceptions}`);
  }
  
  console.log(`   Arquivos (${grouped[category].length}):`);
  
  grouped[category].forEach(file => {
    const sizeKB = (file.size / 1024).toFixed(2);
    totalSize += file.size;
    console.log(`   - ${file.path} (${sizeKB} KB)`);
  });
});

console.log('\n═'.repeat(60));
console.log(`📊 RESUMO:`);
console.log(`   Total de arquivos: ${obsoleteFiles.length}`);
console.log(`   Espaço total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('═'.repeat(60));

console.log('\n💡 PRÓXIMOS PASSOS:');
console.log('   1. Revise a lista acima');
console.log('   2. Execute: node remove-obsolete-files.js');
console.log('   3. Ou mova manualmente para uma pasta "legacy"');
