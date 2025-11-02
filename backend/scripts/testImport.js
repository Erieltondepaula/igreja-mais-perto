// Script para testar importação de dados via API
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
    },
    {
        nome: 'Ana Paula Ferreira',
        dataNascimento: '1992-05-18',
        sexo: 'F',
        telefone: '(11) 95432-1098',
        email: 'ana.paula@email.com',
        endereco: 'Rua das Palmeiras, 321',
        bairro: 'Vila Nova',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '08003-000',
        status: 'ativo',
        batizado: true,
        membro: true
    },
    {
        nome: 'Carlos Eduardo Lima',
        dataNascimento: '1988-09-25',
        sexo: 'M',
        telefone: '(11) 94321-0987',
        email: 'carlos.lima@email.com',
        endereco: 'Av. Central, 654',
        bairro: 'Jardim Europa',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '08004-000',
        status: 'ativo',
        batizado: false,
        membro: false
    }
];

async function testImport() {
    try {
        console.log('🔄 Testando importação via API...');
        
        const response = await fetch('http://localhost:5001/api/members/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                members: members, 
                replaceAll: true 
            }),
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Importação bem-sucedida!');
            console.log('📊 Resultado:', result);
        } else {
            console.error('❌ Erro na importação:', result);
        }
        
        // Verificar membros importados
        const checkResponse = await fetch('http://localhost:5001/api/members');
        const importedMembers = await checkResponse.json();
        console.log(`\n🎯 Total de membros no banco: ${importedMembers.length}`);
        
    } catch (error) {
        console.error('❌ Erro ao testar importação:', error);
    }
}

testImport();