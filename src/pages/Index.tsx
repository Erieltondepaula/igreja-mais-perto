import React, { useMemo, useRef, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { useAppContext } from '@/contexts/useAppContext';
import { filterMembers, calculateAge, getAgeGroup, getMemberType } from '@/utils/memberUtils';
import { Member } from '@/types/member';

const Index = () => {
  const { members, filters, onFiltersChange, onMemberUpdate } = useAppContext();
  const [sortField, setSortField] = useState<keyof Member | 'idade' | 'tipo' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const memberListRef = useRef<HTMLDivElement>(null);

  // Filtro final (agora usando todos os membros para permitir filtro de desligados)
  const filteredMembers = useMemo(() => filterMembers(members, filters), [members, filters]);

  // Ordenação dos membros filtrados
  const sortedMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    const sorted = [...filteredMembers];
    sorted.sort((a, b) => {
      // Ordenação especial para data de nascimento: primeiro dia, depois mês (ignorando ano)
      if (sortField === 'dataNascimento') {
        const parse = (dateStr: string) => {
          if (!dateStr) return { day: 0, month: 0 };
          const d = new Date(dateStr);
          return { day: d.getDate(), month: d.getMonth() + 1 };
        };
        const aDate = parse(a.dataNascimento);
        const bDate = parse(b.dataNascimento);
        // Critério: primeiro mês, depois dia
        if (aDate.month !== bDate.month) {
          return sortDirection === 'asc' ? aDate.month - bDate.month : bDate.month - aDate.month;
        }
        if (aDate.day !== bDate.day) {
          return sortDirection === 'asc' ? aDate.day - bDate.day : bDate.day - aDate.day;
        }
        return 0;
      }
      let aValue: string | number = '';
      let bValue: string | number = '';
      if (sortField === 'idade') {
        aValue = calculateAge(a.dataNascimento);
        bValue = calculateAge(b.dataNascimento);
      } else if (sortField === 'tipo') {
        aValue = getMemberType(a);
        bValue = getMemberType(b);
      } else {
        aValue = a[sortField as keyof Member] as string | number;
        bValue = b[sortField as keyof Member] as string | number;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortDirection === 'asc') return aValue.localeCompare(bValue);
        return bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortDirection === 'asc') return aValue - bValue;
        return bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [filteredMembers, sortField, sortDirection]);

  // Handler para ordenação
  const handleSort = (field: keyof Member | 'idade' | 'tipo') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Distribuição por faixa etária
  const ageDistribution = useMemo(() => {
    const dist = {
      bebes: 0,
      primeiraInfancia: 0,
      infancia: 0,
      adolescencia: 0,
      jovemAdulto: 0,
      adulto: 0,
      meiaIdade: 0,
      idoso: 0
    };
    filteredMembers.forEach(m => {
      const group = getAgeGroup(calculateAge(m.dataNascimento));
      if (group === '0-2') dist.bebes++;
      else if (group === '3-5') dist.primeiraInfancia++;
      else if (group === '6-11') dist.infancia++;
      else if (group === '12-17') dist.adolescencia++;
      else if (group === '18-29') dist.jovemAdulto++;
      else if (group === '30-44') dist.adulto++;
      else if (group === '45-59') dist.meiaIdade++;
      else if (group === '60+') dist.idoso++;
    });
    return dist;
  }, [filteredMembers]);

  // Handler para clique nos cards de faixa etária

  // Handler para clique nos cards de faixa etária (toggle)
  const handleChartClick = (faixa: string) => {
    const isSame = filters.faixaEtaria === faixa;
    const newFilters = { ...filters, statusGeral: 'ativo' as 'ativo' };
    if (isSame) {
      delete newFilters.faixaEtaria;
    } else {
      newFilters.faixaEtaria = faixa;
    }
    onFiltersChange(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handler para filtro de sexo por gráfico (caso queira usar)
  const handleSexClick = (sexo: string) => {
    const isSame = filters.sexo === sexo;
    const newFilters = { ...filters, statusGeral: 'ativo' as 'ativo' };
    if (isSame) {
      delete newFilters.sexo;
    } else {
      newFilters.sexo = sexo;
    }
    onFiltersChange(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-6" style={{ pointerEvents: 'auto', opacity: 1 }}>
        <div className="w-full text-center my-6">
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '2.5rem', letterSpacing: '0.01em', fontFamily: 'inherit', textShadow: '0 2px 8px #0008' }}>
            Sistema de gestão e controle de cadastro de membros
          </span>
        </div>
        <div className="w-full mb-8 z-0">
          <SummaryCards ageDistribution={ageDistribution} onAgeGroupClick={handleChartClick} />
        </div>
        <MemberFiltersComponent
          filters={filters}
          onFiltersChange={onFiltersChange}
          members={members}
        />
        <div ref={memberListRef}>
          <MemberList
            members={sortedMembers}
            onMemberUpdate={onMemberUpdate}
            sortField={sortField}
            sortDirection={sortDirection}
            onRefresh={() => {}}
            onSort={handleSort}
            filters={{
              ...filters,
              faixaEtaria: filters.faixaEtaria || undefined,
              sexo: filters.sexo || undefined,
              idadeRange: filters.idadeRange || undefined
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
