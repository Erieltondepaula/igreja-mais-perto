import { Member } from '@/types/member';

// Função para gerar dados aleatórios realistas
const generateMockMembers = (): Member[] => {
  const nomes = [
    'João Silva Santos', 'Maria Oliveira Costa', 'Pedro Almeida Junior', 'Ana Paula Ferreira',
    'Carlos Eduardo Lima', 'Fernanda Santos Rocha', 'Roberto Mendes Silva', 'Juliana Costa Barbosa',
    'Marcos Antônio Pereira', 'Luciana Gomes Martins', 'Gabriel Costa Ribeiro', 'Beatriz Alves Souza',
    'Rafael Santos Oliveira', 'Patrícia Lima Ferreira', 'André Luiz Barbosa', 'Camila Rodrigues Silva',
    'Felipe Henrique Costa', 'Mariana Alves Santos', 'Lucas Gabriel Pereira', 'Priscila Santos Lima',
    'Rodrigo Almeida Souza', 'Vanessa Costa Ribeiro', 'Thiago Silva Barbosa', 'Amanda Ferreira Costa',
    'Bruno Henrique Lima', 'Larissa Oliveira Santos', 'Diego Costa Almeida', 'Natália Silva Ferreira',
    'Vinicius Santos Barbosa', 'Isabella Costa Lima', 'Gustavo Almeida Santos', 'Bianca Ferreira Costa',
    'Leonardo Silva Barbosa', 'Gabriela Costa Santos', 'Matheus Almeida Lima', 'Carolina Santos Costa',
    'Daniel Silva Ferreira', 'Fernanda Lima Santos', 'Ricardo Costa Barbosa', 'Jéssica Almeida Silva',
    'Victor Hugo Costa', 'Marina Santos Lima', 'Eduardo Silva Barbosa', 'Renata Costa Ferreira',
    'Henrique Lima Santos', 'Débora Silva Costa', 'Alexandre Santos Barbosa', 'Tatiane Costa Lima',
    'Paulo César Silva', 'Adriana Santos Costa', 'Fábio Lima Barbosa', 'Cristina Costa Santos'
  ];

  const bairros = [
    'Vila Palestina', 'Centro', 'Jardim São Paulo', 'Vila Nova', 'Conjunto Habitacional',
    'Jardim Europa', 'Vila Industrial', 'Parque das Flores', 'Jardim América', 'Vila São José'
  ];

  const telefones = [
    '(11) 98765-4321', '(11) 97654-3210', '(11) 96543-2109', '(11) 95432-1098',
    '(11) 94321-0987', '(11) 93210-9876', '(11) 92109-8765', '(11) 91098-7654',
    '(11) 90987-6543', '(11) 89876-5432'
  ];

  const members: Member[] = [];
  
  // Estatísticas reais conforme solicitado
  let ativosCount = 0;
  let desligadosCount = 0;
  let batizadosCount = 0;
  let naoBatizadosCount = 0;
  let homensCount = 0;
  let mulheresCount = 0;

  for (let i = 0; i < 141; i++) {
    const isAtivo = ativosCount < 134;
    const isBatizado = batizadosCount < 117;
    const isMasculino = homensCount < 58;
    const isMembro = isBatizado && Math.random() > 0.3; // 70% dos batizados são membros
    
    // Gerar data de nascimento aleatória (entre 1940 e 2010)
    const anoNasc = 1940 + Math.floor(Math.random() * 70);
    const mesNasc = 1 + Math.floor(Math.random() * 12);
    const diaNasc = 1 + Math.floor(Math.random() * 28);
    const dataNascimento = `${anoNasc}-${mesNasc.toString().padStart(2, '0')}-${diaNasc.toString().padStart(2, '0')}`;

    const member: Member = {
      id: (i + 1).toString(),
      nome: nomes[i % nomes.length] + (i > nomes.length ? ` ${Math.floor(i / nomes.length) + 1}` : ''),
      dataNascimento,
      sexo: isMasculino ? 'M' : 'F',
      telefone: telefones[i % telefones.length],
      email: `membro${i + 1}@email.com`,
      endereco: `Rua ${i + 1}, ${100 + i}`,
      bairro: bairros[i % bairros.length],
      cidade: 'São Paulo',
      cep: `${(1000 + i).toString().padStart(5, '0')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      status: isAtivo ? 'ativo' : 'desligado',
      batizado: isBatizado,
      membro: isMembro,
      dataBatismo: isBatizado ? `${anoNasc + 18 + Math.floor(Math.random() * 10)}-${mesNasc.toString().padStart(2, '0')}-${diaNasc.toString().padStart(2, '0')}` : undefined,
      dataMembresia: isMembro ? `${anoNasc + 19 + Math.floor(Math.random() * 10)}-${mesNasc.toString().padStart(2, '0')}-${diaNasc.toString().padStart(2, '0')}` : undefined,
      dataDesligamento: !isAtivo ? '2023-08-15' : undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    members.push(member);

    // Atualizar contadores
    if (isAtivo) ativosCount++;
    else desligadosCount++;
    
    if (isBatizado) batizadosCount++;
    else naoBatizadosCount++;
    
    if (isMasculino) homensCount++;
    else mulheresCount++;
  }

  return members;
};

export const mockMembers: Member[] = generateMockMembers();