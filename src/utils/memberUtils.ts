<<<<<<< HEAD
// Local do arquivo: src/utils/memberUtils.ts
// ✅ CORREÇÃO: Adicionada a lógica de filtro para Líderes e Professores.

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

// ✅ CORREÇÃO APLICADA AQUI: Removidas as vírgulas que causavam o erro.
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
    
    const age = calculateAge(member.dataNascimento);

    if (filters.search && !member.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.statusGeral && member.status !== filters.statusGeral) return false;
    
    // ✅ ALTERADO: Lógica para filtrar por intervalo de idade
    if (filters.idadeRange) {
      const minAge = filters.idadeRange.min ? parseInt(filters.idadeRange.min, 10) : null;
      const maxAge = filters.idadeRange.max ? parseInt(filters.idadeRange.max, 10) : null;
      if (minAge !== null && age < minAge) return false;
      if (maxAge !== null && age > maxAge) return false;
    }

    if (filters.faixaEtaria && getAgeGroup(age) !== filters.faixaEtaria) return false;
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
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
            return false;
        });
        if (!typeMatch) return false;
    }

<<<<<<< HEAD
    // ✅ ADICIONADO: Lógica de filtro para Líderes e Professores
    if (filters.lider && !member.lider) return false;
    if (filters.professorEBQ && !member.professorEBQ) return false;

=======
    if (filters.aniversariantesDoMes) {
        if(member.status !== 'ativo' || !isBirthdayInMonth(member.dataNascimento)) return false;
    }
    if (filters.aniversariantesDoDia) {
        if(member.status !== 'ativo' || !isBirthdayToday(member.dataNascimento)) return false;
    }

    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.anoNascimento && new Date(member.dataNascimento).getFullYear().toString() !== filters.anoNascimento) return false;
    
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
    return true;
  });
};

<<<<<<< HEAD

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

// ✅ CORREÇÃO APLICADA AQUI: As chaves agora estão no plural.
export const getAgeGroupChartData = (members: Member[]): AgeGroupData[] => {
  const ageGroups: Record<string, number> = { 'Infância': 0, 'Crianças': 0, 'Adolescentes': 0, 'Jovens': 0, 'Adultos': 0, 'Idosos': 0 };
  members.forEach(member => {
    const group = getAgeGroup(calculateAge(member.dataNascimento));
    if (ageGroups[group] !== undefined) ageGroups[group]++;
  });
  const fills: Record<string, string> = { 'Infância': '#A78BFA', 'Crianças': '#FBBF24', 'Adolescentes': '#60A5FA', 'Jovens': '#34D399', 'Adultos': '#F87171', 'Idosos': '#9CA3AF' };
  return Object.keys(ageGroups).map(key => ({ faixaEtaria: key, quantidade: ageGroups[key], fill: fills[key] || '#8884d8' }));
};

export const getNeighborhoodData = (members: Member[]): NeighborhoodData[] => {
  const neighborhoodCount = members.reduce((acc, member) => {
    const bairro = member.bairro || 'Não informado';
    acc[bairro] = (acc[bairro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(neighborhoodCount).map(bairro => ({ bairro, quantidade: neighborhoodCount[bairro] })).sort((a, b) => b.quantidade - a.quantidade);
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
};