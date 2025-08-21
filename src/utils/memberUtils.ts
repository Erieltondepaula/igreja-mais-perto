import { Member, MemberFilters, ChartData, AgeGroupData, NeighborhoodData } from '@/types/member';

// CORREÇÃO: Função de cálculo de idade mais precisa para evitar erros de fuso horário.
export const calculateAge = (birthDate: string): number => {
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return 0;
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  // Usar UTC para evitar problemas de fuso horário
  const birth = new Date(Date.UTC(year, month - 1, day));
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birth.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birth.getUTCDate())) {
    age--;
  }
  return age;
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

// Função de filtro
export const filterMembers = (members: Member[], filters: MemberFilters): Member[] => {
  return members.filter(member => {
    if (filters.search && !member.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.statusGeral && member.status !== filters.statusGeral) return false;
    if (filters.tipoMembro && filters.tipoMembro.length > 0) {
        const isCongregado = !member.batizado && !member.membro;
        const typeMatch = filters.tipoMembro.some(tipo => 
            (tipo === 'batizado' && member.batizado) ||
            (tipo === 'membro' && member.membro) ||
            (tipo === 'congregado' && isCongregado)
        );
        if (!typeMatch) return false;
    }
    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.anoNascimento && new Date(member.dataNascimento).getFullYear().toString() !== filters.anoNascimento) return false;
    if (filters.aniversariantesDoMes && !isBirthdayInMonth(member.dataNascimento)) return false;
    if (filters.aniversariantesDoDia && !isBirthdayToday(member.dataNascimento)) return false;
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
  
  // Adicionando a lógica de cores de volta
  return Object.entries(ageGroups).map(([faixaEtaria, quantidade], index) => ({
    faixaEtaria,
    quantidade,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`
  }));
};

// *** FUNÇÃO RESTAURADA ***
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

// Define o "tipo" de membro para exibição
export const getMemberType = (member: Member): string => {
    if (member.status === 'desligado') return 'Desligado';
    if (member.membro) return 'Membro';
    if (member.batizado) return 'Batizado';
    return 'Congregado';
};

// *** FUNÇÃO RESTAURADA ***
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ativo': return 'hsl(var(--success))';
    case 'desligado': return 'hsl(var(--muted-foreground))';
    default: return 'hsl(var(--foreground))';
  }
};