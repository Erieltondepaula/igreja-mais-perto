// Local do arquivo: src/pages/Index.tsx

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Outlet } from "react-router-dom";
import { Member, MemberFilters, MemberFromDB } from '@/types/member';
import { filterMembers, calculateAge } from '@/utils/memberUtils';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:5001/api/members';

const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<MemberFilters>({});
  const memberListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do servidor. O back-end está rodando?');
      }
      const data: MemberFromDB[] = await response.json();
      const formattedData: Member[] = data.map((item) => ({
        ...item,
        id: item._id, 
      }));
      setMembers(formattedData);
    } catch (error: unknown) { // << CORREÇÃO: Usando 'unknown' em vez de 'any'
      const errorMessage = error instanceof Error ? error.message : "Não foi possível carregar os dados.";
      console.error("Erro ao buscar membros:", error);
      toast({ 
        title: "Erro de Conexão",
        description: errorMessage,
        variant: "destructive" 
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => filterMembers(members, filters), [members, filters]);

  const ageDistribution = useMemo(() => {
    const distribution = { infancia: 0, criancas: 0, adolescentes: 0, jovens: 0, adultos: 0, idosos: 0 };
    members.forEach(m => {
      const age = calculateAge(m.dataNascimento);
      if (age <= 6) distribution.infancia++;
      else if (age <= 10) distribution.criancas++;
      else if (age <= 17) distribution.adolescentes++;
      else if (age <= 35) distribution.jovens++;
      else if (age <= 59) distribution.adultos++;
      else distribution.idosos++;
    });
    return distribution;
  }, [members]);

  const handleFiltersChange = (newFilters: MemberFilters) => setFilters(newFilters);

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    setFilters({ statusGeral });
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBatchUpdate = async (importedMembers: Partial<Member>[], replaceAll: boolean) => {
    try {
      const response = await fetch(`${API_URL}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: importedMembers, replaceAll }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar dados no servidor');
      }
      await fetchMembers();
      return true;
    } catch (error: unknown) { // << CORREÇÃO: Usando 'unknown' em vez de 'any'
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar dados importados";
      toast({ title: "Erro na Importação", description: errorMessage, variant: "destructive" });
      return false;
    }
  };

  const handleImport = async (importedMembers: Partial<Member>[]) => {
    const success = await handleBatchUpdate(importedMembers, false);
    if (success) toast({ title: "Membros adicionados com sucesso!" });
  };

  const handleReplaceAll = async (importedMembers: Partial<Member>[]) => {
    const success = await handleBatchUpdate(importedMembers, true);
    if (success) toast({ title: "Base de dados substituída com sucesso!" });
  };

  const handleMemberUpdate = async (updatedMember: Member) => {
     try {
        const response = await fetch(`${API_URL}/${updatedMember.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMember),
        });
        if (!response.ok) throw new Error('Falha ao atualizar membro');
        await fetchMembers();
     } catch(error: unknown) { // << CORREÇÃO: Usando 'unknown'
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        toast({ title: "Erro ao atualizar membro", description: errorMessage, variant: "destructive" });
     }
  };

  const context = { members };

  return (
    <div className="space-y-6">
      <StatsCards members={members} onCardClick={handleCardClick} />
      {/* << CORREÇÃO: Removida a propriedade 'members' que causava o erro */}
      <SummaryCards ageDistribution={ageDistribution} />
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
          onRefresh={fetchMembers}
        />
      </div>
      <Outlet context={context} /> 
    </div>
  );
};

export default Index;
