// Local do arquivo: src/contexts/AppContext.tsx
// ✅ CÓDIGO FINAL COM LÓGICA DE IMPORTAÇÃO CORRIGIDA

import { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Member, MemberFilters } from '@/types/member';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [storedMembers, setStoredMembers] = useLocalStorage<Member[]>('members-data', []);
  const [members, setMembers] = useState<Member[]>(storedMembers);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMembers(storedMembers);
  }, [storedMembers]);

  const onFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const onRefresh = () => {
    setMembers(storedMembers);
    toast({ title: "Dados Recarregados", description: "A lista de membros foi recarregada do armazenamento local." });
  };
  
  const onMemberUpdate = async (updatedMember: Member): Promise<void> => {
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setStoredMembers(updatedMembers);
    toast({ title: "Membro atualizado com sucesso!" });
  };

  // ✅ LÓGICA CORRIGIDA: Esta função agora SUBSTITUI os dados, agindo como a onReplaceAll.
  const onImport = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    const newMembers = importedMembers.map((m, index) => ({
        ...m,
        id: `member-${Date.now()}-${index}`, // Gera um ID único para cada membro
    })) as Member[];
    
    setStoredMembers(newMembers); // Substitui a lista antiga pela nova
    toast({ title: "Planilha importada com sucesso!", description: "Os dados anteriores foram substituídos." });
    return true;
  };

  // Mantemos a função onReplaceAll por consistência, fazendo a mesma coisa.
  const onReplaceAll = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
     const newMembers = importedMembers.map((m, index) => ({
        ...m,
        id: `member-${Date.now()}-${index}`,
    })) as Member[];
    setStoredMembers(newMembers);
    toast({ title: "Base de dados substituída com sucesso!" });
    return true;
  };

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