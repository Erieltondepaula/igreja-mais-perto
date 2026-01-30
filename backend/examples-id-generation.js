const crypto = require('crypto');

console.log('\n📋 EXEMPLOS DE GERAÇÃO DE IDs PARA O BANCO DE DADOS\n');
console.log('═'.repeat(80));

// ========================================
// 1. ID (Chave Primária) - VARCHAR(20)
// ========================================
console.log('\n🔑 1. CAMPO: id (PRIMARY KEY) - VARCHAR(20)');
console.log('─'.repeat(80));
console.log('Descrição: Identificador único interno do sistema');
console.log('Tamanho máximo: 20 caracteres');
console.log('Obrigatório: SIM\n');

// Opção 1: UUID curto (16 caracteres)
const uuidShort = crypto.randomBytes(8).toString('hex').substring(0, 16);
console.log('✅ Opção 1: UUID Curto (16 caracteres)');
console.log(`   Exemplo: ${uuidShort}`);
console.log(`   Formato: hex string aleatória`);
console.log(`   Vantagem: Único, curto, rápido\n`);

// Opção 2: Timestamp + Random (20 caracteres)
const timestamp = Date.now().toString(36); // Base36 para ser mais curto
const random = Math.random().toString(36).substring(2, 11);
const timestampId = (timestamp + random).substring(0, 20);
console.log('✅ Opção 2: Timestamp + Random (20 caracteres)');
console.log(`   Exemplo: ${timestampId}`);
console.log(`   Formato: timestamp(base36) + random(base36)`);
console.log(`   Vantagem: Ordenável por data de criação\n`);

// Opção 3: Prefixo + Número sequencial
const prefixId = `MBR${Date.now().toString().slice(-10)}`;
console.log('✅ Opção 3: Prefixo + Número (14 caracteres)');
console.log(`   Exemplo: ${prefixId}`);
console.log(`   Formato: MBR + timestamp`);
console.log(`   Vantagem: Legível, identificável\n`);

// Opção 4: nanoid (recomendado)
// Se tivesse nanoid instalado: const { nanoid } = require('nanoid');
// const nanoId = nanoid(16);
console.log('✅ Opção 4: NanoID (16 caracteres) - RECOMENDADO');
console.log(`   Exemplo: V1StGXR8_Z5jdHi6`);
console.log(`   Formato: URL-safe random string`);
console.log(`   Vantagem: Seguro, único, otimizado\n`);

console.log('🎯 ESCOLHA RECOMENDADA PARA id:');
console.log('   Opção 2 (Timestamp + Random) ou Opção 4 (NanoID)\n');

// ========================================
// 2. ID_EXTERNO - VARCHAR(50)
// ========================================
console.log('\n🔗 2. CAMPO: id_externo (OPCIONAL) - VARCHAR(50)');
console.log('─'.repeat(80));
console.log('Descrição: ID do sistema antigo/externo (se houver)');
console.log('Tamanho máximo: 50 caracteres');
console.log('Obrigatório: NÃO\n');

console.log('✅ Casos de uso:');
console.log('   1. Migração de outro sistema:');
console.log(`      Exemplo: ACCESS_001, OLD_DB_123, LEGACY_XYZ`);
console.log(`      
   2. Integração com sistema externo:
      Exemplo: GOOGLE_SHEETS_ROW_5, CRM_CONTACT_789`);
console.log(`      
   3. ID de planilha Excel (número da linha):
      Exemplo: EXCEL_ROW_2, PLANILHA_LINHA_45`);
console.log(`      
   4. Código interno da igreja:
      Exemplo: IBVP-2024-001, CADASTRO-145\n`);

console.log('💡 EXEMPLO PRÁTICO DE MIGRAÇÃO:\n');

// Simular dados vindos do Excel
const exemplosDados = [
  { linha: 2, nome: 'João Silva', dataImportacao: new Date() },
  { linha: 3, nome: 'Maria Santos', dataImportacao: new Date() },
  { linha: 4, nome: 'Pedro Oliveira', dataImportacao: new Date() }
];

console.log('Linha | Nome              | id (PK)              | id_externo');
console.log('─'.repeat(80));

exemplosDados.forEach(dado => {
  // Gerar ID único
  const id = crypto.randomBytes(8).toString('hex').substring(0, 16);
  
  // ID externo = referência à linha do Excel
  const idExterno = `EXCEL_LINHA_${dado.linha}`;
  
  console.log(
    String(dado.linha).padEnd(6) + 
    String(dado.nome).padEnd(18) + 
    String(id).padEnd(21) + 
    idExterno
  );
});

console.log('\n\n' + '═'.repeat(80));
console.log('\n📝 CÓDIGO EXEMPLO PARA GERAR IDs:\n');

console.log(`
// Função para gerar ID principal (opção 2)
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return (timestamp + random).substring(0, 20);
}

// Função para gerar ID externo (linha do Excel)
function generateExternalId(linha) {
  return \`EXCEL_LINHA_\${linha}\`;
}

// Exemplo de uso:
const novoMembro = {
  id: generateId(),                    // "lwxyz9876abcdefghij"
  id_externo: generateExternalId(2),   // "EXCEL_LINHA_2"
  nome: "João",
  sobrenome: "Silva",
  // ... outros campos
};

console.log(novoMembro);
// {
//   id: "lwxyz9876abcdefghij",
//   id_externo: "EXCEL_LINHA_2",
//   nome: "João",
//   sobrenome: "Silva"
// }
`);

console.log('═'.repeat(80));
console.log('\n✅ Resumo:\n');
console.log('📌 id (PK):         Sempre gerar novo (único, 16-20 chars)');
console.log('📌 id_externo:      Opcional, usar para rastreabilidade');
console.log('📌 Recomendação:    Timestamp + Random para id');
console.log('📌 Vantagem:        Permite saber de onde veio o dado (Excel, Access, etc)\n');
