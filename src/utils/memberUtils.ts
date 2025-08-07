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
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const memberName = member.nome?.toLowerCase() || '';
      const memberFullName = member.nomeCompleto?.toLowerCase() || '';
      if (!memberName.includes(searchTerm) && !memberFullName.includes(searchTerm)) return false;
    }

    // Status Geral filter (mutually exclusive)
    if (filters.statusGeral) {
      if (filters.statusGeral === 'ativo' && member.status === 'desligado') return false;
      if (filters.statusGeral === 'desligado' && member.status !== 'desligado') return false;
    }

    // Tipo de Membro filter (multiple choice)
    if (filters.tipoMembro && filters.tipoMembro.length > 0) {
      const hasAnyType = filters.tipoMembro.some(tipo => {
        switch (tipo) {
          case 'batizado':
            return member.batizado === true;
          case 'membro':
            return member.membro === true;
          case 'congregado':
            return !member.batizado && !member.membro;
          default:
            return false;
        }
      });
      if (!hasAnyType) return false;
    }

    // Gender filter
    if (filters.sexo && member.sexo !== filters.sexo) return false;

    // Neighborhood filter
    if (filters.bairro && member.bairro !== filters.bairro) return false;

    // Age group filter
    if (filters.faixaEtaria) {
      const memberAge = calculateAge(member.dataNascimento);
      const [minAge, maxAge] = getAgeRangeFromGroup(filters.faixaEtaria);
      if (memberAge < minAge || memberAge > maxAge) return false;
    }

    // Birth year filter
    if (filters.anoNascimento) {
      const birthYear = new Date(member.dataNascimento).getFullYear().toString();
      if (birthYear !== filters.anoNascimento) return false;
    }

    // Birthday filters
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
    '0-12': 0,
    '13-17': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    '61+': 0
  };
  
  members.forEach(member => {
    const age = calculateAge(member.dataNascimento);
    if (age <= 12) ageGroups['0-12']++;
    else if (age <= 17) ageGroups['13-17']++;
    else if (age <= 30) ageGroups['18-30']++;
    else if (age <= 45) ageGroups['31-45']++;
    else if (age <= 60) ageGroups['46-60']++;
    else ageGroups['61+']++;
  });
  
  return Object.entries(ageGroups).map(([faixaEtaria, quantidade], index) => ({
    faixaEtaria,
    quantidade,
    fill: `hsl(var(--chart-${(index % 6) + 1}))`
  }));
};

export const getAgeRangeFromGroup = (ageGroup: string): [number, number] => {
  switch (ageGroup) {
    case '0-12': return [0, 12];
    case '13-17': return [13, 17];
    case '18-30': return [18, 30];
    case '31-45': return [31, 45];
    case '46-60': return [46, 60];
    case '61+': return [61, 150];
    default: return [0, 150];
  }
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