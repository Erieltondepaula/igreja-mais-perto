import { useState, useMemo, useRef, useEffect } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { mockMembers } from '@/data/mockMembers';
import { filterMembers, calculateAge } from '@/utils/memberUtils';
import { Header } from '@/components/dashboard/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { GenderChart } from '@/components/dashboard/GenderChart';
import { AgeChart } from '@/components/dashboard/AgeChart';
import { NeighborhoodMap } from '@/components/dashboard/NeighborhoodMap';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('church-members', []);
  const [filters, setFilters] = useState<MemberFilters>({});
  const memberListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem('church-members') === null) {
      setMembers(mockMembers);
    }
  }, []);

  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

  const activeMembers = useMemo(() => members.filter(m => m.status === 'ativo'), [members]);

  const ageDistribution = useMemo(() => {
    const distribution = {
      infancia: 0,
      criancas: 0,
      adolescentes: 0,
      jovens: 0,
      adultos: 0,
      idosos: 0,
    };
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


  const handleFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    const newFilters = statusGeral ? { statusGeral } : {};
    setFilters(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // **LÓGICA CORRIGIDA para não apagar outros filtros**
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
        <Header />
        
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Sistema de gestão e controle de cadastro de membros
          </p>
        </div>

        <StatsCards members={members} onCardClick={handleCardClick} />

        <SummaryCards members={activeMembers} ageDistribution={ageDistribution} />

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenderChart members={activeMembers} onSegmentClick={(sexo) => handleChartClick('sexo', sexo)} />
          <AgeChart members={activeMembers} onBarClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
        </div>

        <div ref={memberListRef}>
          <MemberList 
            members={filteredMembers} 
            filters={filters} 
            onMemberUpdate={handleMemberUpdate}
          />
        </div>

        <NeighborhoodMap members={activeMembers} onNeighborhoodClick={(bairro) => handleChartClick('bairro', bairro)} />
      </div>
    </div>
  );
};

export default Index;