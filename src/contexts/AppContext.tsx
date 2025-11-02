// Local do arquivo: src/contexts/AppContext.tsx
// ✅ CÓDIGO FINAL COM LÓGICA DE IMPORTAÇÃO CORRIGIDA

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { useToast } from '@/hooks/use-toast';

export interface AppContextType {
  members: Member[];
  filters: MemberFilters;
  isLoading: boolean;
  onFiltersChange: (filters: MemberFilters) => void;
  onImport: (members: Partial<Member>[]) => Promise<boolean>;
  onReplaceAll: (members: Partial<Member>[]) => Promise<boolean>;
  onMemberUpdate: (member: Member) => Promise<void>;
  onRefresh: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Limpa localStorage ao carregar o contexto
  useEffect(() => {
    localStorage.removeItem('members-data');
  }, []);

  // Buscar membros do backend ao carregar
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        toast({ title: 'Erro ao buscar membros', description: String(error) });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [toast]);

  const onFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const onRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data);
      toast({ title: "Dados Recarregados", description: "A lista de membros foi recarregada do banco de dados." });
    } catch (error) {
      toast({ title: 'Erro ao buscar membros', description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Exemplo: Atualizar membro no backend
  const onMemberUpdate = async (updatedMember: Member): Promise<void> => {
    setIsLoading(true);
    try {
      await fetch(`/api/members/${updatedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember)
      });
      await onRefresh();
      toast({ title: "Membro atualizado com sucesso!" });
    } catch (error) {
      toast({ title: 'Erro ao atualizar membro', description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  // Importação: Envia os membros para o backend
  const onImport = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetch('/api/members/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: importedMembers })
      });
      await onRefresh();
      toast({ title: "Planilha importada com sucesso!", description: "Os dados anteriores foram substituídos." });
      return true;
    } catch (error) {
      toast({ title: 'Erro ao importar membros', description: String(error) });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Substituir todos os membros (igual ao import)
  const onReplaceAll = onImport;

  const value = {
    members,
    filters,
    isLoading,
    onFiltersChange,
    onImport,
    onReplaceAll,
    onMemberUpdate,
    onRefresh
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};