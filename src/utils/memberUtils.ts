// Local do arquivo: src/utils/memberUtils.ts
// ✅ CÓDIGO FINAL E DEFINITIVO (COM FUSO HORÁRIO DE BRASÍLIA GARANTIDO)

import { Member, MemberFilters, ChartData, AgeGroupData, NeighborhoodData } from '@/types/member';

// --- FUNÇÕES DE DATA COM FUSO HORÁRIO DE BRASÍLIA (UTC-3) ---

const TIME_ZONE = 'America/Sao_Paulo';

/**
 * Pega a data e hora atuais, formatadas especificamente para o fuso horário de Brasília.
 * Retorna um objeto com as partes da data para comparações seguras.
 */
const getTodayInBrasilia = () => {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(today);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0', 10);
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0', 10); // Mês é 1-12
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);

  return { year, month, day };
};

/**
 * Analisa uma string de data 'YYYY-MM-DD' e retorna suas partes numéricas.
 */
const parseDateString = (dateString: string): { year: number; month: number; day: number } | null => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day }; // Mês é 1-12
};

export const calculateAge = (birthDate: string): number => {
  const birth = parseDateString(birthDate);
  if (!birth) return 0;

  const today = getTodayInBrasilia();
  let age = today.year - birth.year;
  
  // Se ainda não chegou o aniversário este ano, subtrai 1
  if (today.month < birth.month || (today.month === birth.month && today.day < birth.day)) {
    age--;
  }
  return age < 0 ? 0 : age;
};

// ✅ LÓGICA DE ANIVERSARIANTES CORRIGIDA E SIMPLIFICADA
export const isBirthdayInMonth = (birthDate: string): boolean => {
  const birth = parseDateString(birthDate);
  if (!birth) return false;
  
  const today = getTodayInBrasilia();
  return birth.month === today.month;
};

export const isBirthdayToday = (birthDate: string): boolean => {
  const birth = parseDateString(birthDate);
  if (!birth) return false;

  const today = getTodayInBrasilia();
  return birth.day === today.day && birth.month === today.month;
};

export const isBirthdayInPeriod = (birthDate: string, startDate?: string, endDate?: string): boolean => {
    if (!birthDate || !startDate || !endDate) return false;

    const birth = parseDateString(birthDate);
    const start = parseDateString(startDate);
    const end = parseDateString(endDate);

    if (!birth || !start || !end) return false;
    
    const currentYear = getTodayInBrasilia().year;

    // Cria datas de aniversário para este ano e o próximo para comparações
    // Usar UTC na criação evita que o fuso horário da máquina mude o dia
    const birthThisYear = new Date(Date.UTC(currentYear, birth.month - 1, birth.day));
    const birthNextYear = new Date(Date.UTC(currentYear + 1, birth.month - 1, birth.day));
    
    const startUTC = new Date(Date.UTC(start.year, start.month - 1, start.day));
    const endUTC = new Date(Date.UTC(end.year, end.month - 1, end.day));

    // Se o período cruza o ano (ex: Dezembro a Janeiro)
    if (startUTC > endUTC) {
      return birthThisYear >= startUTC || birthNextYear <= endUTC;
    }

    return birthThisYear >= startUTC && birthThisYear <= endUTC;
};

// ✅ COLE ESTA NOVA FUNÇÃO NO LUGAR DA ANTIGA
export const getAgeGroup = (age: number): string => {
    if (age <= 6) return 'Infância';
    if (age <= 10) return 'Crianças';
    if (age <= 17) return 'Adolescentes';
    if (age <= 35) return 'Jovens';
    if (age <= 59) return 'Adultos';
    return 'Idosos';
};

export const getMemberType = (member: Member): 'Membro' | 'Batizado Congregado' | 'Congregado' | 'Desligado' => {
    if (member.status === 'desligado') return 'Desligado';
    if (member.membro) return 'Membro';
    if (member.batizado) return 'Batizado Congregado';
    return 'Congregado';
};

// --- FUNÇÃO DE FILTRO COMPLETA (sem alterações) ---
export const filterMembers = (members: Member[], filters: MemberFilters): Member[] => {
  return members.filter(member => {
    if (!member.dataNascimento) return false; // Garante que membros sem data não quebrem o filtro
    if (filters.search && !member.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.statusGeral && member.status !== filters.statusGeral) return false;
    if (filters.faixaEtaria && getAgeGroup(calculateAge(member.dataNascimento)) !== filters.faixaEtaria) return false;
    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.aniversariantesDoMes && !isBirthdayInMonth(member.dataNascimento)) return false;
    if (filters.aniversariantesDoDia && !isBirthdayToday(member.dataNascimento)) return false;
    if (filters.aniversariantesPeriodo?.dataInicial && filters.aniversariantesPeriodo?.dataFinal) {
      if (!isBirthdayInPeriod(member.dataNascimento, filters.aniversariantesPeriodo.dataInicial, filters.aniversariantesPeriodo.dataFinal)) {
        return false;
      }
    }
    if (filters.tipoMembro && filters.tipoMembro.length > 0) {
        if (member.status === 'desligado') return false;
        const tipoMembro = getMemberType(member);
        const typeMatch = filters.tipoMembro.some(tipo => {
            if (tipo === 'membro' && tipoMembro === 'Membro') return true;
            if (tipo === 'congregado' && tipoMembro === 'Congregado') return true;
            if (tipo === 'batizado_congregado' && tipoMembro === 'Batizado Congregado') return true;
            return false;
        });
        if (!typeMatch) return false;
    }
    return true;
  });
};


// --- FUNÇÕES PARA GRÁFICOS E UI (sem alterações) ---
export const getStatusColor = (status?: 'ativo' | 'desligado'): string => status === 'ativo' ? '#22C55E' : '#9CA3AF';
export const getGenderChartData = (members: Member[]): ChartData[] => {
  const genderCount = members.reduce((acc, member) => {
    if (member.sexo === 'M') acc.Masculino = (acc.Masculino || 0) + 1;
    else if (member.sexo === 'F') acc.Feminino = (acc.Feminino || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(genderCount).map(key => ({ name: key, value: genderCount[key] }));
};
export const getAgeGroupChartData = (members: Member[]): AgeGroupData[] => {
  const ageGroups: Record<string, number> = { 'Infância': 0, 'Criança': 0, 'Adolescente': 0, 'Jovem': 0, 'Adulto': 0, 'Idoso': 0 };
  members.forEach(member => {
    const group = getAgeGroup(calculateAge(member.dataNascimento));
    if (ageGroups[group] !== undefined) ageGroups[group]++;
  });
  const fills: Record<string, string> = { 'Infância': '#A78BFA', 'Criança': '#FBBF24', 'Adolescente': '#60A5FA', 'Jovem': '#34D399', 'Adulto': '#F87171', 'Idoso': '#9CA3AF' };
  return Object.keys(ageGroups).map(key => ({ faixaEtaria: key, quantidade: ageGroups[key], fill: fills[key] || '#8884d8' }));
};
export const getNeighborhoodData = (members: Member[]): NeighborhoodData[] => {
  const neighborhoodCount = members.reduce((acc, member) => {
    const bairro = member.bairro || 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(neighborhoodCount).map(bairro => ({ bairro, quantidade: neighborhoodCount[bairro] })).sort((a, b) => b.quantidade - a.quantidade);
};