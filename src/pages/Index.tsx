import { useState, useMemo, useRef, useEffect } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { mockMembers } from '@/data/mockMembers';
import { filterMembers } from '@/utils/memberUtils';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
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
  const [members, setMembers] = useLocalStorage<Member[]>('church-members', mockMembers);
  const [filters, setFilters] = useState<MemberFilters>({});
  const memberListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with mock data if localStorage is empty
  useEffect(() => {
    if (members.length === 0) {
      setMembers(mockMembers);
    }
  }, []);

  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

  const handleFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
    
    // Se filtro de aniversariantes foi ativado, rolar para a lista
    if ((newFilters.aniversariantesDoMes || newFilters.aniversariantesDoDia) && memberListRef.current) {
      setTimeout(() => {
        memberListRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const handleCardClick = (statusGeral?: string) => {
    const newFilters = statusGeral ? { statusGeral: statusGeral as 'ativo' | 'desligado' } : {};
    setFilters(newFilters);
    
    // Rolar para a lista após filtrar
    setTimeout(() => {
      memberListRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleGenderClick = (sexo: string) => {
    setFilters({ sexo });
    if (memberListRef.current) {
      setTimeout(() => {
        memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleAgeGroupClick = (faixaEtaria: string) => {
    setFilters({ faixaEtaria });
    if (memberListRef.current) {
      setTimeout(() => {
        memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleNeighborhoodClick = (bairro: string) => {
    setFilters({ bairro });
    if (memberListRef.current) {
      setTimeout(() => {
        memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleImport = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      id: `imported-${Date.now()}-${index}`,
      nome: member.nome || '',
      dataNascimento: member.dataNascimento || '',
      sexo: member.sexo || 'M',
      telefone: member.telefone || '',
      email: member.email || '',
      endereco: member.endereco || '',
      bairro: member.bairro || '',
      cidade: member.cidade || '',
      cep: member.cep || '',
      status: member.status || 'ativo',
      dataBatismo: member.dataBatismo,
      dataMembresia: member.dataMembresia,
      dataDesligamento: member.dataDesligamento,
      observacoes: member.observacoes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setMembers(prevMembers => [...prevMembers, ...newMembers]);
  };

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const handleReplaceAll = (importedMembers: Partial<Member>[]) => {
    const newMembers: Member[] = importedMembers.map((member, index) => ({
      id: `imported-${Date.now()}-${index}`,
      nome: member.nome || '',
      dataNascimento: member.dataNascimento || '',
      sexo: member.sexo || 'M',
      telefone: member.telefone || '',
      email: member.email || '',
      endereco: member.endereco || '',
      bairro: member.bairro || '',
      cidade: member.cidade || '',
      cep: member.cep || '',
      status: member.status || 'ativo',
      dataBatismo: member.dataBatismo,
      dataMembresia: member.dataMembresia,
      dataDesligamento: member.dataDesligamento,
      observacoes: member.observacoes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setMembers(newMembers);
    toast({
      title: "Base de dados substituída",
      description: "Todos os dados anteriores foram substituídos pelos dados do arquivo."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Dashboard de Membros</h1>
          <p className="text-xl text-muted-foreground">
            Sistema de gestão e controle de cadastro de membros
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards members={members} onCardClick={handleCardClick} />

        {/* Quick Stats */}
        <QuickStats members={members} />

        {/* Summary Cards */}
        <SummaryCards members={members} />

        {/* Import/Export */}
        <ImportExport members={members} onImport={handleImport} onReplaceAll={handleReplaceAll} />

        {/* Filters */}
        <MemberFiltersComponent 
          members={members} 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenderChart members={members} onSegmentClick={handleGenderClick} />
          <AgeChart members={members} onBarClick={handleAgeGroupClick} />
        </div>

        {/* Neighborhood Map */}
        <NeighborhoodMap members={members} onNeighborhoodClick={handleNeighborhoodClick} />

        {/* Member List */}
        <div ref={memberListRef}>
          <MemberList 
            members={filteredMembers} 
            filters={filters} 
            onMemberUpdate={handleMemberUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;