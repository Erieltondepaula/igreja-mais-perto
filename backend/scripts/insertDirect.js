// Script para inserir dados diretamente no Access sem prepared statements
const db = require('../config/database');

const members = [
    {
        nome: 'João Silva Santos',
        dataNascimento: '1985-03-15',
        sexo: 'M',
        telefone: '(11) 98765-4321',
        email: 'joao.silva@email.com',
        endereco: 'Rua das Flores, 123',
        bairro: 'Vila Palestina',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '08000-000',
        status: 'ativo',
        batizado: true,
        membro: true
    },
    {
        nome: 'Maria Oliveira Costa',
        dataNascimento: '1990-07-22',
        sexo: 'F',
        telefone: '(11) 97654-3210',
        email: 'maria.costa@email.com',
        endereco: 'Av. Principal, 456',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '08001-000',
        status: 'ativo',
        batizado: true,
        membro: true
    },
    {
        nome: 'Pedro Almeida Junior',
        dataNascimento: '1978-12-03',
        sexo: 'M',
        telefone: '(11) 96543-2109',
        email: 'pedro.almeida@email.com',
        endereco: 'Rua da Paz, 789',
        bairro: 'Jardim São Paulo',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '08002-000',
        status: 'ativo',
        batizado: true,
        membro: false
    }
];

async function insertDirectly() {
    try {
        console.log('🔄 Conectando ao Access...');
        await db.connect();
        
        console.log('🧹 Limpando dados anteriores...');
        await db.query('DELETE FROM Membros');
        
        console.log('📊 Inserindo novos dados...');
        
        for (const member of members) {
            const sql = `
                INSERT INTO Membros (
                    Nome, DataNascimento, Sexo, Telefone, Email, Endereco, 
                    Bairro, Cidade, Estado, CEP, Status, Batizado, Membro, DataCriacao, DataAtualizacao
                ) VALUES (
                    '${member.nome}', '${member.dataNascimento}', '${member.sexo}', '${member.telefone}',
                    '${member.email}', '${member.endereco}', '${member.bairro}', '${member.cidade}',
                    '${member.estado}', '${member.cep}', '${member.status}', ${member.batizado},
                    ${member.membro}, Now(), Now()
                )
            `;
            
            await db.query(sql);
            console.log(`✅ Inserido: ${member.nome}`);
        }
        
        // Verificar resultado
        const result = await db.query('SELECT COUNT(*) as total FROM Membros');
        console.log(`\n🎉 Total de membros no banco: ${result[0].total}`);
        
        // Mostrar todos os membros
        const allMembers = await db.query('SELECT ID, Nome, Sexo, Status, Batizado, Membro FROM Membros');
        console.log('\n📋 Membros inseridos:');
        allMembers.forEach(m => {
            console.log(`  ${m.ID} - ${m.Nome} (${m.Sexo}) - ${m.Status} - Batizado: ${m.Batizado} - Membro: ${m.Membro}`);
        });
        
        console.log('\n✅ Dados inseridos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error.message);
    }
}

insertDirectly();