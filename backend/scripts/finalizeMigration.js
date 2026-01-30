// Script final para migrar da TempMembros para Membros com estrutura correta
const db = require('../config/database');

async function finalizeMigration() {
    try {
        console.log('🔄 FINALIZANDO MIGRAÇÃO COM IDs PERSONALIZADOS');
        console.log('==============================================');
        
        await db.connect();
        
        // 1. Verificar dados na tabela temporária
        const tempCount = await db.query('SELECT COUNT(*) as total FROM TempMembros');
        console.log(`📊 Total de registros na tabela temporária: ${tempCount[0].total}`);
        
        if (tempCount[0].total === 0) {
            console.log('❌ Tabela temporária está vazia! Execute primeiro reimportSafe.js');
            return;
        }
        
        // 2. Fazer backup da tabela atual
        console.log('💾 Fazendo backup da tabela Membros...');
        try {
            await db.query('DROP TABLE MembrosBackup');
        } catch (error) {
            // Ignorar se não existir
        }
        
        // Renomear tabela atual para backup
        await db.query('SELECT * INTO MembrosBackup FROM Membros');
        console.log('✅ Backup criado na tabela MembrosBackup');
        
        // 3. Apagar tabela Membros atual
        console.log('🗑️ Removendo tabela Membros atual...');
        await db.query('DROP TABLE Membros');
        
        // 4. Renomear TempMembros para Membros
        console.log('🔄 Renomeando tabela temporária...');
        // No Access, vamos recriar a tabela Membros com a estrutura correta
        
        const createMembrosSQL = `
            CREATE TABLE Membros (
              ID TEXT(20) PRIMARY KEY,
              Nome TEXT(100) NOT NULL,
              NomeCompleto TEXT(200),
              PhotoUrl TEXT(255),
              DataNascimento DATE NOT NULL,
              Idade INTEGER,
              Mes TEXT(20),
              Sexo TEXT(1) NOT NULL,
              Telefone TEXT(20),
              Email TEXT(100),
              Endereco TEXT(255),
              Rua TEXT(150),
              Numero TEXT(10),
              Bairro TEXT(100),
              Cidade TEXT(100),
              Estado TEXT(50),
              CEP TEXT(10),
              Status TEXT(20),
              StatusCivil TEXT(20),
              Conjuge TEXT(100),
              Parentesco TEXT(50),
              Batizado YESNO,
              Membro YESNO,
              Lider YESNO,
              ProfessorEBQ YESNO,
              FaixaEtaria TEXT(20),
              PequenoGrupo YESNO,
              Grupo TEXT(100),
              NumeroDomes INTEGER,
              DataBatismo DATE,
              DataMembresia DATE,
              DataDesligamento DATE,
              Observacoes MEMO,
              DataCriacao DATE,
              DataAtualizacao DATE
            )
        `;
        await db.query(createMembrosSQL);
        
        // 5. Copiar dados da TempMembros para Membros
        console.log('📋 Copiando dados...');
        const insertSQL = `
            INSERT INTO Membros (
                ID, Nome, NomeCompleto, DataNascimento, Sexo, Telefone, 
                Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, 
                Status, StatusCivil, Conjuge, Parentesco, Batizado, 
                Membro, Lider, ProfessorEBQ, Grupo, PequenoGrupo, 
                Observacoes, DataCriacao, DataAtualizacao
            )
            SELECT 
                ID, Nome, NomeCompleto, DataNascimento, Sexo, Telefone, 
                Endereco, Rua, Numero, Bairro, Cidade, Estado, CEP, 
                Status, StatusCivil, Conjuge, Parentesco, Batizado, 
                Membro, Lider, ProfessorEBQ, Grupo, PequenoGrupo, 
                Observacoes, DataCriacao, DataAtualizacao
            FROM TempMembros
        `;
        await db.query(insertSQL);
        
        // 6. Verificar migração
        const finalCount = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`✅ Dados migrados: ${finalCount[0].total} registros`);
        
        // 7. Limpar tabela temporária
        console.log('🧹 Limpando tabela temporária...');
        await db.query('DROP TABLE TempMembros');
        
        // 8. Mostrar exemplos finais
        const examples = await db.query('SELECT TOP 5 ID, Nome FROM Membros');
        console.log('\n📋 EXEMPLOS DE IDs FINAIS:');
        examples.forEach(m => {
            console.log(`  ${m.ID} ← ${m.Nome}`);
        });
        
        // 9. Estatísticas finais
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(IIf(Batizado = true, 1, 0)) as batizados,
                SUM(IIf(Membro = true, 1, 0)) as membros,
                SUM(IIf(Sexo = 'M', 1, 0)) as masculino,
                SUM(IIf(Sexo = 'F', 1, 0)) as feminino
            FROM Membros
        `);
        
        const stat = stats[0];
        console.log('\n📈 ESTATÍSTICAS FINAIS:');
        console.log(`👥 Total: ${stat.total}`);
        console.log(`💒 Batizados: ${stat.batizados}`);
        console.log(`👨‍👩‍👧‍👦 Membros: ${stat.membros}`);
        console.log(`👨 Masculino: ${stat.masculino}`);
        console.log(`👩 Feminino: ${stat.feminino}`);
        
        console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('📋 Estrutura: ID agora é TEXT com formato personalizado');
        console.log('💾 Backup: Dados antigos salvos em MembrosBackup');
        console.log('🚀 Sistema: Pronto para reiniciar com novos IDs');
        
        console.log('\n💡 PRÓXIMOS PASSOS:');
        console.log('1. Reinicie o backend: npm run dev');
        console.log('2. Reinicie o frontend: npm run dev');
        console.log('3. Acesse: http://localhost:8080');
        console.log('4. Limpe cache: localStorage.clear(); location.reload()');
        
    } catch (error) {
        console.error('❌ Erro na migração final:', error);
        console.log('\n🔄 Para restaurar backup:');
        console.log('   SELECT * INTO Membros FROM MembrosBackup');
    }
}

finalizeMigration();