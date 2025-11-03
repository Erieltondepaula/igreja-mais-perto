import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';
import { Member, MemberFilters } from '@/types/member';
import { filterMembers, calculateAge, getMemberType } from '@/utils/memberUtils';
import { useAppContext } from '@/contexts/useAppContext';

const Index = () => {
  const { members, filters, onFiltersChange, onRefresh, onImport, onReplaceAll, onMemberUpdate } = useAppContext();
  const [sortField, setSortField] = useState<keyof Member | 'idade' | 'tipo' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const memberListRef = useRef<HTMLDivElement>(null);

  const activeMembers = useMemo(() => {
    return members.filter(m => m.status !== 'desligado');
  }, [members]);

  const ageDistribution = useMemo(() => {
    const distribution = { infancia: 0, criancas: 0, adolescentes: 0, jovens: 0, adultos: 0, idosos: 0 };
    activeMembers.forEach(m => {
      const age = calculateAge(m.dataNascimento);
      if (age <= 6) distribution.infancia++;
      else if (age <= 10) distribution.criancas++;
      else if (age <= 17) distribution.adolescentes++;
      else if (age <= 35) distribution.jovens++;
      else if (age <= 59) distribution.adultos++;
      else distribution.idosos++;
    });
    return distribution;
  }, [activeMembers]);

  // ✅ CORRIGIDO: Agora filtra de TODOS os membros, não apenas dos ativos
  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

  // ✅ MEMBROS ORDENADOS - Aplica ordenação aos membros filtrados
  const sortedAndFilteredMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    
    return [...filteredMembers].sort((a, b) => {
      // ✅ ORDENAÇÃO ESPECIAL POR DATA DE NASCIMENTO
      if (sortField === 'dataNascimento') {
        // Regra: Primeiro pelo MÊS (menor para maior), depois pelo DIA (se mês igual), ignora ANO
        const dateA = new Date(a.dataNascimento || '1900-01-01');
        const dateB = new Date(b.dataNascimento || '1900-01-01');
        
        const dayA = dateA.getUTCDate();
        const dayB = dateB.getUTCDate();
        const monthA = dateA.getUTCMonth(); // 0-11
        const monthB = dateB.getUTCMonth();
        
        // Compara pelo mês primeiro
        if (monthA !== monthB) {
          return sortDirection === 'asc' ? monthA - monthB : monthB - monthA;
        }
        // Se o mês for igual, compara pelo dia
        return sortDirection === 'asc' ? dayA - dayB : dayB - dayA;
      }
      
      // Ordenação para outros campos
      let valueA: string | number | boolean | undefined;
      let valueB: string | number | boolean | undefined;
      
      if (sortField === 'idade') {
        valueA = calculateAge(a.dataNascimento);
        valueB = calculateAge(b.dataNascimento);
      } else if (sortField === 'tipo') {
        valueA = getMemberType(a);
        valueB = getMemberType(b);
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Ordenação
      if (valueA === valueB) return 0;
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [filteredMembers, sortField, sortDirection]);

  const handleSort = (field: keyof Member | 'idade' | 'tipo') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFiltersChange = (newFilters: MemberFilters) => {
    onFiltersChange(newFilters);
  };

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    const newFilters = statusGeral ? { statusGeral } : {};
    onFiltersChange(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Lógica para gráficos e mapas
  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Sistema de gestão e controle de cadastro de membros
          </p>
        </div>
        <SummaryCards ageDistribution={ageDistribution} onAgeGroupClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
        <ImportExport 
          members={members} 
          filteredMembers={filteredMembers}
          filters={filters}
          onImport={onImport} 
          onReplaceAll={onReplaceAll} 
        />
        <MemberFiltersComponent 
          members={members} 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />
        <div ref={memberListRef} data-member-list>
          <MemberList 
            members={sortedAndFilteredMembers} 
            onMemberUpdate={onMemberUpdate}
            onRefresh={onRefresh}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
