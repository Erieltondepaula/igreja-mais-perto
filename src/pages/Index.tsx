import { useState, useMemo } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { mockMembers } from '@/data/mockMembers';
import { filterMembers } from '@/utils/memberUtils';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { GenderChart } from '@/components/dashboard/GenderChart';
import { AgeChart } from '@/components/dashboard/AgeChart';
import { NeighborhoodMap } from '@/components/dashboard/NeighborhoodMap';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [filters, setFilters] = useState<MemberFilters>({});
  const { toast } = useToast();

  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

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
        <StatsCards members={filteredMembers} />

        {/* Import/Export */}
        <ImportExport members={members} onImport={handleImport} onReplaceAll={handleReplaceAll} />

        {/* Filters */}
        <MemberFiltersComponent 
          members={members} 
          filters={filters} 
          onFiltersChange={setFilters} 
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenderChart members={filteredMembers} />
          <AgeChart members={filteredMembers} />
        </div>

        {/* Neighborhood Map */}
        <NeighborhoodMap members={filteredMembers} />

        {/* Member List */}
        <MemberList members={filteredMembers} />
      </div>
    </div>
  );
};

export default Index;