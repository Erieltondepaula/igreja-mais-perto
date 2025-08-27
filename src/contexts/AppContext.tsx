// Local do arquivo: src/contexts/AppContext.tsx

import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Member, MemberFromDB, MemberFilters } from '@/types/member';

const API_URL = 'http://localhost:5001/api/members';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao buscar dados do servidor. O back-end está rodando?');
      const data: MemberFromDB[] = await response.json();
      const formattedData: Member[] = data.map((item) => ({ ...item, id: item._id }));
      setMembers(formattedData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Não foi possível carregar os dados.";
      toast({ title: "Erro de Conexão", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleBatchUpdate = async (importedMembers: Partial<Member>[], replaceAll: boolean): Promise<boolean> => {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar dados importados";
      toast({ title: "Erro na Importação", description: errorMessage, variant: "destructive" });
      return false;
    }
  };

  const handleImport = async (importedMembers: Partial<Member>[]) => {
    const success = await handleBatchUpdate(importedMembers, false);
    if (success) toast({ title: "Membros adicionados com sucesso!" });
    return success;
  };

  const handleReplaceAll = async (importedMembers: Partial<Member>[]) => {
    const success = await handleBatchUpdate(importedMembers, true);
    if (success) toast({ title: "Base de dados substituída com sucesso!" });
    return success;
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
     } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        toast({ title: "Erro ao atualizar membro", description: errorMessage, variant: "destructive" });
     }
  };
  
  const handleFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const value = {
    members,
    filters,
    isLoading,
    onFiltersChange: handleFiltersChange,
    onImport: handleImport,
    onReplaceAll: handleReplaceAll,
    onMemberUpdate: handleMemberUpdate,
    onRefresh: fetchMembers
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};