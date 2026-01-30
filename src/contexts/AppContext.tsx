// Local do arquivo: src/contexts/AppContext.tsx
// ✅ ATUALIZADO - Agora usa Supabase Cloud em vez de API local

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { useSupabaseMembers } from '@/hooks/useSupabaseMembers';

export interface AppContextType {
  members: Member[];
  filters: MemberFilters;
  isLoading: boolean;
  onFiltersChange: (filters: MemberFilters) => void;
  onImport: (members: Partial<Member>[]) => Promise<boolean>;
  onReplaceAll: (members: Partial<Member>[]) => Promise<boolean>;
  onMemberUpdate: (member: Member) => Promise<void>;
  onMemberAdd: (member: Partial<Member>) => Promise<Member | null>;
  onMemberDelete: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<MemberFilters>({});
  
  const {
    members,
    isLoading,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    importMembers,
    replaceAllMembers
  } = useSupabaseMembers();

  // Buscar dados do Supabase ao iniciar
  useEffect(() => {
    // Limpar cache antigo
    localStorage.removeItem('church-members');
    fetchMembers();
  }, [fetchMembers]);

  const onFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const onRefresh = () => {
    fetchMembers();
  };
  
  const onMemberUpdate = async (updatedMember: Member): Promise<void> => {
    await updateMember(updatedMember);
  };

  const onMemberAdd = async (member: Partial<Member>): Promise<Member | null> => {
    return await addMember(member);
  };

  const onMemberDelete = async (id: string): Promise<boolean> => {
    return await deleteMember(id);
  };

  const onImport = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    return await importMembers(importedMembers);
  };

  const onReplaceAll = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    return await replaceAllMembers(importedMembers);
  };

  const value = {
    members,
    filters,
    isLoading,
    onFiltersChange,
    onImport,
    onReplaceAll,
    onMemberUpdate,
    onMemberAdd,
    onMemberDelete,
    onRefresh
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
