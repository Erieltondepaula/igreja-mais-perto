import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Member, MemberFromDB, MemberFilters } from '@/types/member';
import { filterMembers, calculateAge } from '@/utils/memberUtils';
import { mockMembers } from '@/data/mockMembers';

const API_URL = 'http://localhost:5001/api/members';

const Index = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('church-members', []);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [sortField, setSortField] = useState<keyof Member | 'idade' | 'tipo' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const memberListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Backend não disponível');
        const data: MemberFromDB[] = await response.json();
        const formattedData: Member[] = data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setMembers(formattedData);
      } catch (error) {
        console.error('Backend não disponível, usando dados locais/mock:', error);
        // Se não há dados no localStorage, usa dados mock
        if (members.length === 0) {
          setMembers(mockMembers);
        }
      }
    };
    fetchMembers();
  }, [setMembers, members.length]);

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

  const filteredMembers = useMemo(() => {
    return filterMembers(activeMembers, filters);
  }, [activeMembers, filters]);

  const handleSort = (field: keyof Member | 'idade' | 'tipo') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await fetch(API_URL);
      const data: MemberFromDB[] = await response.json();
      const formattedData: Member[] = data.map((item) => ({
        ...item,
        id: item._id || '',
      }));
      setMembers(formattedData);
      toast({ title: 'Dados atualizados com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    const newFilters = statusGeral ? { statusGeral } : {};
    setFilters(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Lógica para gráficos e mapas
  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImport = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      ...member,
      id: `imported-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) as Member[];
    setMembers(prevMembers => [...prevMembers, ...newMembers]);
    toast({ title: "Membros adicionados com sucesso!" });
  };

  const handleReplaceAll = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      ...member,
      id: `imported-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) as Member[];
    setMembers(newMembers);
    toast({ title: "Base de dados substituída com sucesso!" });
  };

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
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
          onImport={handleImport} 
          onReplaceAll={handleReplaceAll} 
        />
        <MemberFiltersComponent 
          members={members} 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />
        <div ref={memberListRef}>
          <MemberList 
            members={filteredMembers} 
            onMemberUpdate={handleMemberUpdate}
            onRefresh={handleRefresh}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
