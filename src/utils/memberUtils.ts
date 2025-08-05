import { Member, MemberFilters, ChartData, AgeGroupData, NeighborhoodData } from '@/types/member';

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const isBirthdayInMonth = (birthDate: string, month?: number): boolean => {
  const birth = new Date(birthDate);
  const targetMonth = month ?? new Date().getMonth();
  return birth.getMonth() === targetMonth;
};

export const isBirthdayToday = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
};

export const filterMembers = (members: Member[], filters: MemberFilters): Member[] => {
  return members.filter(member => {
    if (filters.status && member.status !== filters.status) return false;
    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.aniversariantesDoMes && !isBirthdayInMonth(member.dataNascimento)) return false;
    if (filters.aniversariantesDoDia && !isBirthdayToday(member.dataNascimento)) return false;
    
    return true;
  });
};

export const getGenderChartData = (members: Member[]): ChartData[] => {
  const maleCount = members.filter(m => m.sexo === 'M').length;
  const femaleCount = members.filter(m => m.sexo === 'F').length;
  
  return [
    { name: 'Masculino', value: maleCount, fill: 'hsl(var(--chart-1))' },
    { name: 'Feminino', value: femaleCount, fill: 'hsl(var(--chart-2))' }
  ];
};

export const getAgeGroupChartData = (members: Member[]): AgeGroupData[] => {
  const ageGroups = {
    '0-17': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    '61+': 0
  };
  
  members.forEach(member => {
    const age = calculateAge(member.dataNascimento);
    if (age <= 17) ageGroups['0-17']++;
    else if (age <= 30) ageGroups['18-30']++;
    else if (age <= 45) ageGroups['31-45']++;
    else if (age <= 60) ageGroups['46-60']++;
    else ageGroups['61+']++;
  });
  
  return Object.entries(ageGroups).map(([faixaEtaria, quantidade], index) => ({
    faixaEtaria,
    quantidade,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`
  }));
};

export const getNeighborhoodData = (members: Member[]): NeighborhoodData[] => {
  const neighborhoods = new Map<string, number>();
  
  members.forEach(member => {
    const count = neighborhoods.get(member.bairro) || 0;
    neighborhoods.set(member.bairro, count + 1);
  });
  
  return Array.from(neighborhoods.entries())
    .map(([bairro, quantidade]) => ({ bairro, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ativo': return 'hsl(var(--success))';
    case 'batizado': return 'hsl(var(--info))';
    case 'membro': return 'hsl(var(--primary))';
    case 'desligado': return 'hsl(var(--muted-foreground))';
    default: return 'hsl(var(--foreground))';
  }
};

export const formatStatus = (status: string): string => {
  switch (status) {
    case 'ativo': return 'Ativo';
    case 'batizado': return 'Batizado';
    case 'membro': return 'Membro';
    case 'desligado': return 'Desligado';
    default: return status;
  }
};