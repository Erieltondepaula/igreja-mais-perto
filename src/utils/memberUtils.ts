import { Member, MemberFilters, ChartData, AgeGroupData, NeighborhoodData } from '@/types/member';

// **FUNÇÃO DE CÁLCULO DE IDADE CORRIGIDA E À PROVA DE FUTURO**
export const calculateAge = (birthDate: string): number => {
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return 0;
  
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));

  if (birth > today) {
    return 0;
  }

  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birth.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birth.getUTCDate())) {
    age--;
  }
  return age < 0 ? 0 : age; // Garante que nunca retorne negativo
};

// Define a faixa etária com base na idade
export const getAgeGroup = (age: number): string => {
    if (age <= 6) return 'Infância';
    if (age <= 10) return 'Criança';
    if (age <= 17) return 'Adolescente';
    if (age <= 35) return 'Jovem';
    if (age <= 59) return 'Adulto';
    return 'Idoso';
};

export const isBirthdayInMonth = (birthDate: string, month?: number): boolean => {
  if (!birthDate) return false;
  const birth = new Date(birthDate);
  const targetMonth = month ?? new Date().getMonth();
  return birth.getUTCMonth() === targetMonth;
};

export const isBirthdayToday = (birthDate: string): boolean => {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  return birth.getUTCMonth() === today.getUTCMonth() && birth.getUTCDate() === today.getUTCDate();
};

// **Função de filtro ATUALIZADA com a sua nova lógica simplificada**
export const filterMembers = (members: Member[], filters: MemberFilters): Member[] => {
  return members.filter(member => {
    if (filters.search && !member.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    // Filtro principal para Ativo/Desligado
    if (filters.statusGeral && member.status !== filters.statusGeral) return false;
    
    if (filters.tipoMembro && filters.tipoMembro.length > 0) {
        if (member.status === 'desligado') {
            return false;
        }

        const isMembro = member.batizado && member.membro;
        const isCongregado = !member.batizado; // Simplificado: Se não é batizado, é congregado
        const isBatizadoCongregado = member.batizado && !member.membro;

        const typeMatch = filters.tipoMembro.some(tipo => {
            if (tipo === 'membro' && isMembro) return true;
            if (tipo === 'congregado' && isCongregado) return true;
            if (tipo === 'batizado_congregado' && isBatizadoCongregado) return true;
            return false;
        });
        if (!typeMatch) return false;
    }

    if (filters.aniversariantesDoMes) {
        if(member.status !== 'ativo' || !isBirthdayInMonth(member.dataNascimento)) return false;
    }
    if (filters.aniversariantesDoDia) {
        if(member.status !== 'ativo' || !isBirthdayToday(member.dataNascimento)) return false;
    }

    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.anoNascimento && new Date(member.dataNascimento).getFullYear().toString() !== filters.anoNascimento) return false;
    
    return true;
  });
};

// Dados para o gráfico de Gênero
export const getGenderChartData = (members: Member[]): ChartData[] => {
  const activeMembers = members.filter(m => m.status === 'ativo');
  const maleCount = activeMembers.filter(m => m.sexo === 'M').length;
  const femaleCount = activeMembers.filter(m => m.sexo === 'F').length;
  return [
    { name: 'Masculino', value: maleCount },
    { name: 'Feminino', value: femaleCount }
  ];
};

// Dados para o gráfico de Faixa Etária
export const getAgeGroupChartData = (members: Member[]): AgeGroupData[] => {
  const ageGroups: Record<string, number> = {
    'Infância': 0, 'Criança': 0, 'Adolescente': 0, 'Jovem': 0, 'Adulto': 0, 'Idoso': 0
  };
  
  members.forEach(member => {
    const age = calculateAge(member.dataNascimento);
    if (age <= 6) ageGroups['Infância']++;
    else if (age <= 10) ageGroups['Criança']++;
    else if (age <= 17) ageGroups['Adolescente']++;
    else if (age <= 35) ageGroups['Jovem']++;
    else if (age <= 59) ageGroups['Adulto']++;
    else ageGroups['Idoso']++;
  });
  
  return Object.entries(ageGroups).map(([faixaEtaria, quantidade], index) => ({
    faixaEtaria,
    quantidade,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`
  }));
};

// **Função ATUALIZADA para definir o "tipo" de membro para exibição**
export const getMemberType = (member: Member): string => {
    if (member.status === 'desligado') return 'Desligado';
    if (member.batizado && member.membro) return 'Membro';
    if (member.batizado && !member.membro) return 'Batizado Congregado';
    return 'Congregado';
};

// Função para retornar a cor do status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ativo': return 'hsl(var(--success))';
    case 'desligado': return 'hsl(var(--muted-foreground))';
    default: return 'hsl(var(--foreground))';
  }
};

// Função para dados do mapa de bairros
export const getNeighborhoodData = (members: Member[]): NeighborhoodData[] => {
    const activeMembers = members.filter(m => m.status === 'ativo');
    const neighborhoods = new Map<string, number>();
    activeMembers.forEach(member => {
        if (member.bairro) {
            const count = neighborhoods.get(member.bairro) || 0;
            neighborhoods.set(member.bairro, count + 1);
        }
    });
    return Array.from(neighborhoods.entries())
        .map(([bairro, quantidade]) => ({ bairro, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade);
};