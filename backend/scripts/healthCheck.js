// Script de verificação de saúde do sistema Access
// Arquivo: backend/scripts/healthCheck.js

const AccessInitializer = require('./initializeAccess');
const accessDB = require('../config/database');

class SystemHealthCheck {
    constructor() {
        this.initializer = new AccessInitializer();
    }

    async runCompleteCheck() {
        console.log('🏥 VERIFICAÇÃO COMPLETA DE SAÚDE DO SISTEMA');
        console.log('='.repeat(50));

        const results = {
            overall: false,
            checks: {}
        };

        try {
            // 1. Verificar Status do Access
            console.log('1️⃣ Verificando Microsoft Access...');
            const accessStatus = await this.initializer.checkStatus();
            results.checks.access = accessStatus;
            
            if (!accessStatus.accessInstalled) {
                console.log('   ❌ Microsoft Access não instalado');
            } else if (!accessStatus.databaseExists) {
                console.log('   ⚠️ Banco de dados não existe');
            } else if (!accessStatus.odbcWorking) {
                console.log('   ❌ Conexão ODBC falhando');
            } else {
                console.log('   ✅ Microsoft Access funcionando');
            }

            // 2. Verificar Conectividade da API
            console.log('2️⃣ Verificando conectividade da API...');
            try {
                await accessDB.connect();
                const testQuery = "SELECT COUNT(*) as total FROM Members";
                const result = await accessDB.query(testQuery);
                results.checks.apiConnection = true;
                console.log(`   ✅ API conectada (${result[0]?.total || 0} membros no banco)`);
            } catch (error) {
                results.checks.apiConnection = false;
                console.log('   ❌ Falha na conexão da API:', error.message);
            }

            // 3. Verificar Estrutura das Tabelas
            console.log('3️⃣ Verificando estrutura do banco...');
            try {
                const tableCheck = await accessDB.query("SELECT * FROM Members WHERE 1=0");
                results.checks.tableStructure = true;
                console.log('   ✅ Estrutura das tabelas válida');
            } catch (error) {
                results.checks.tableStructure = false;
                console.log('   ❌ Problema na estrutura:', error.message);
            }

            // 4. Verificar Permissões de Escrita
            console.log('4️⃣ Testando permissões de escrita...');
            try {
                const testData = {
                    Nome: 'TESTE_HEALTH_CHECK',
                    Email: 'teste@healthcheck.com'
                };
                
                // Inserir
                const insertSql = `INSERT INTO Members (Nome, Email) VALUES ('${testData.Nome}', '${testData.Email}')`;
                await accessDB.execute(insertSql);
                
                // Buscar
                const findSql = `SELECT ID FROM Members WHERE Email = '${testData.Email}'`;
                const found = await accessDB.query(findSql);
                
                // Deletar
                if (found.length > 0) {
                    const deleteSql = `DELETE FROM Members WHERE ID = ${found[0].ID}`;
                    await accessDB.execute(deleteSql);
                }
                
                results.checks.writePermissions = true;
                console.log('   ✅ Permissões de escrita funcionando');
            } catch (error) {
                results.checks.writePermissions = false;
                console.log('   ❌ Falha nas permissões:', error.message);
            }

            // Resultado geral
            const allChecksPass = Object.values(results.checks).every(check => 
                typeof check === 'boolean' ? check : (check.accessInstalled && check.databaseExists && check.odbcWorking)
            );

            results.overall = allChecksPass;

            console.log('='.repeat(50));
            if (allChecksPass) {
                console.log('🎉 SISTEMA SAUDÁVEL - Tudo funcionando perfeitamente!');
            } else {
                console.log('⚠️ SISTEMA COM PROBLEMAS - Verificar logs acima');
            }
            
            return results;

        } catch (error) {
            console.error('❌ ERRO CRÍTICO no health check:', error);
            results.overall = false;
            return results;
        }
    }

    async quickCheck() {
        console.log('⚡ VERIFICAÇÃO RÁPIDA...');
        
        try {
            await accessDB.connect();
            const result = await accessDB.query("SELECT COUNT(*) as total FROM Members");
            console.log(`✅ Sistema OK - ${result[0]?.total || 0} membros no banco`);
            return true;
        } catch (error) {
            console.log('❌ Sistema com problemas:', error.message);
            return false;
        }
    }

    async repairSystem() {
        console.log('🔧 TENTANDO REPARAR O SISTEMA...');
        console.log('='.repeat(40));

        try {
            // Tentar inicialização completa
            const repaired = await this.initializer.initialize();
            
            if (repaired) {
                console.log('✅ Sistema reparado com sucesso!');
                return await this.quickCheck();
            } else {
                console.log('❌ Falha no reparo automático');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro durante reparo:', error);
            return false;
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const healthChecker = new SystemHealthCheck();
    const args = process.argv.slice(2);
    const command = args[0] || 'full';

    async function runCommand() {
        switch (command) {
            case 'quick':
                const quick = await healthChecker.quickCheck();
                process.exit(quick ? 0 : 1);
                break;
                
            case 'repair':
                const repaired = await healthChecker.repairSystem();
                process.exit(repaired ? 0 : 1);
                break;
                
            default:
                const results = await healthChecker.runCompleteCheck();
                process.exit(results.overall ? 0 : 1);
        }
    }

    runCommand().catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
}

module.exports = SystemHealthCheck;