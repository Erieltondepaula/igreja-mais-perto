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
    'Infância': 0, // 0-6
    'Criança': 0, // 7-10
    'Adolescente': 0, // 11-17
    'Jovens': 0, // 18-35
    'Adulto': 0, // 36-59
    'Idoso': 0 // 60+
  } as Record<string, number>;
  
  members.forEach(member => {
    const age = calculateAge(member.dataNascimento);
    if (age <= 6) ageGroups['Infância']++;
    else if (age <= 10) ageGroups['Criança']++;
    else if (age <= 17) ageGroups['Adolescente']++;
    else if (age <= 35) ageGroups['Jovens']++;
    else if (age <= 59) ageGroups['Adulto']++;
    else ageGroups['Idoso']++;
  });
  
  return Object.entries(ageGroups).map(([faixaEtaria, quantidade], index) => ({
    faixaEtaria,
    quantidade,
    fill: `hsl(var(--chart-${(index % 6) + 1}))`
  }));
};

export const getAgeRangeFromGroup = (ageGroup: string): [number, number] => {
  switch (ageGroup) {
    case 'Infância': return [0, 6];
    case 'Criança': return [7, 10];
    case 'Adolescente': return [11, 17];
    case 'Jovens': return [18, 35];
    case 'Adulto': return [36, 59];
    case 'Idoso': return [60, 150];
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

export const getMemberType = (member: Member): string => {
  if (member.status === 'desligado') {
    return 'Desligado';
  }
  if (member.batizado && member.membro) {
    return 'Batizado/Membro';
  } else if (member.batizado && !member.membro) {
    return 'Congregado/Batizado';
  } else if (!member.batizado && !member.membro) {
    return 'Congregado/Não Batizado';
  } else {
    return 'Não Batizado/Membro';
  }
};