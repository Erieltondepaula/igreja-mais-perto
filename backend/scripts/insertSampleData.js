// Script para inserir dados de exemplo no Access
const db = require('../config/database');

async function insertSampleData() {
    try {
        console.log('🔄 Conectando ao Access...');
        await db.connect();
        
        // Dados de exemplo com colunas corretas
        const sampleMembers = [
            {
                nome: 'João Silva Santos',
                dataNascimento: '1985-03-15',
                sexo: 'M',
                telefone: '(11) 98765-4321',
                email: 'joao.silva@email.com',
                endereco: 'Rua das Flores, 123',
                bairro: 'Vila Palestina',
                cep: '08000-000',
                cidade: 'São Paulo',
                estado: 'SP',
                status: 'ativo',
                batizado: true,
                membro: true,
                dataBatismo: '2010-05-20',
                dataMembresia: '2011-03-10'
            },
            {
                nome: 'Maria Oliveira Costa',
                dataNascimento: '1990-07-22',
                sexo: 'F',
                telefone: '(11) 97654-3210',
                email: 'maria.costa@email.com',
                endereco: 'Av. Principal, 456',
                bairro: 'Centro',
                cep: '08001-000',
                cidade: 'São Paulo',
                estado: 'SP',
                status: 'ativo',
                batizado: true,
                membro: true,
                dataBatismo: '2015-08-12',
                dataMembresia: '2016-01-15'
            },
            {
                nome: 'Pedro Almeida Junior',
                dataNascimento: '1978-12-03',
                sexo: 'M',
                telefone: '(11) 96543-2109',
                email: 'pedro.almeida@email.com',
                endereco: 'Rua da Paz, 789',
                bairro: 'Jardim São Paulo',
                cep: '08002-000',
                cidade: 'São Paulo',
                estado: 'SP',
                status: 'ativo',
                batizado: true,
                membro: false,
                dataBatismo: '2020-02-25'
            }
        ];

        console.log('📊 Inserindo dados de exemplo...');
        
        for (const member of sampleMembers) {
            const sql = `
                INSERT INTO Membros (
                    Nome, DataNascimento, Sexo, Telefone, Email, Endereco, Bairro, CEP, 
                    Cidade, Estado, Status, Batizado, Membro, DataBatismo, DataMembresia
                ) VALUES (
                    '${member.nome}', '${member.dataNascimento}', '${member.sexo}', '${member.telefone}',
                    '${member.email}', '${member.endereco}', '${member.bairro}', '${member.cep}',
                    '${member.cidade}', '${member.estado}', '${member.status}', ${member.batizado},
                    ${member.membro}, '${member.dataBatismo}', ${member.dataMembresia ? `'${member.dataMembresia}'` : 'NULL'}
                )
            `;
            
            await db.query(sql);
            console.log(`✅ Inserido: ${member.nome}`);
        }
        
        // Verificar dados inseridos
        const result = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`\n🎉 Total de membros no banco: ${result[0].total}`);
        
        console.log('\n✅ Dados de exemplo inseridos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error.message);
    }
}

insertSampleData();