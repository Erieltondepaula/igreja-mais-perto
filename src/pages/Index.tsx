import { useState, useMemo, useRef, useEffect } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { mockMembers } from '@/data/mockMembers';
import { filterMembers } from '@/utils/memberUtils';
import { Header } from '@/components/dashboard/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickStats } from '@/components/dashboard/QuickStats';
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
    if (members.length === 0) {
      console.log("Iniciando com dados mockados pois o localStorage está vazio.");
      setMembers(mockMembers);
    }
  }, []); // Executa apenas uma vez na montagem inicial

  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

  const handleFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
    
    if ((newFilters.aniversariantesDoMes || newFilters.aniversariantesDoDia) && memberListRef.current) {
      setTimeout(() => {
        memberListRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    const newFilters = statusGeral ? { statusGeral } : {};
    setFilters(newFilters);
    
    setTimeout(() => {
      memberListRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    setFilters({ [key]: value });
     setTimeout(() => {
      memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImport = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      ...member,
      id: `imported-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) as Member[];

    setMembers(prevMembers => [...prevMembers, ...newMembers]);
  };

  const handleReplaceAll = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      ...member,
      id: `imported-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) as Member[];

    setMembers(newMembers);
  };

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === updatedMember.id ? { ...updatedMember, updatedAt: new Date().toISOString() } : member
      )
    );
    toast({ title: "Membro atualizado com sucesso!" });
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

        <QuickStats members={members} />

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
          <GenderChart members={members} onSegmentClick={(sexo) => handleChartClick('sexo', sexo)} />
          <AgeChart members={members} onBarClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
        </div>

        <div ref={memberListRef}>
          <MemberList 
            members={filteredMembers} 
            filters={filters} 
            onMemberUpdate={handleMemberUpdate}
          />
        </div>

        <NeighborhoodMap members={members} onNeighborhoodClick={(bairro) => handleChartClick('bairro', bairro)} />
      </div>
    </div>
  );
};

export default Index;