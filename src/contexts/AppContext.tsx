// Local do arquivo: src/contexts/AppContext.tsx
// ✅ CÓDIGO CORRIGIDO - Usando localStorage para persistência

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { useToast } from '@/hooks/use-toast';
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
  const [members, setMembers] = useLocalStorage<Member[]>('church-members', []);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onFiltersChange = (newFilters: MemberFilters) => {
    setFilters(newFilters);
  };

  const onRefresh = () => {
    toast({ title: "Dados Recarregados", description: "A lista de membros foi recarregada." });
  };
  
  const onMemberUpdate = async (updatedMember: Member): Promise<void> => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    toast({ title: "Membro atualizado com sucesso!" });
  };

  const onImport = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newMembers: Member[] = importedMembers.map((member, index) => ({
        ...member,
        id: member.id || `imported-${Date.now()}-${index}`,
        createdAt: member.createdAt || new Date().toISOString(),
        updatedAt: member.updatedAt || new Date().toISOString()
      })) as Member[];
      
      setMembers(prevMembers => [...prevMembers, ...newMembers]);
      toast({ title: "Membros adicionados com sucesso!", description: `${newMembers.length} membros importados` });
      return true;
    } catch (error) {
      toast({ title: 'Erro ao importar membros', description: String(error) });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onReplaceAll = async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newMembers: Member[] = importedMembers.map((member, index) => ({
        id: member.id || `imported-${Date.now()}-${index}`,
        nome: member.nome || '',
        nomeCompleto: member.nomeCompleto,
        avatar_url: member.avatar_url,
        dataNascimento: member.dataNascimento || '',
        idade: member.idade || 0,
        mes: member.mes || '',
        sexo: member.sexo || 'M',
        telefone: member.telefone || '',
        email: member.email,
        endereco: member.endereco || '',
        rua: member.rua || '',
        numero: member.numero || '',
        bairro: member.bairro || '',
        cidade: member.cidade || '',
        estado: member.estado || '',
        cep: member.cep || '',
        status: member.status || 'ativo',
        statusCivil: member.statusCivil,
        conjuge: member.conjuge,
        parentesco: member.parentesco,
        batizado: member.batizado || false,
        membro: member.membro || false,
        lider: member.lider || false,
        professorEBQ: member.professorEBQ || false,
        faixaEtaria: member.faixaEtaria || '',
        pequeno_grupo: member.pequeno_grupo || false,
        grupo: member.grupo,
        numero_domes: member.numero_domes,
        dataBatismo: member.dataBatismo,
        dataMembresia: member.dataMembresia,
        dataDesligamento: member.dataDesligamento,
        observacoes: member.observacoes,
        createdAt: member.createdAt || new Date().toISOString(),
        updatedAt: member.updatedAt || new Date().toISOString()
      }));
      
      setMembers(newMembers);
      toast({ 
        title: "Base de dados substituída com sucesso!", 
        description: `${newMembers.length} membros carregados`
      });
      return true;
    } catch (error) {
      toast({ title: 'Erro ao substituir membros', description: String(error) });
      return false;
    } finally {
      setIsLoading(false);
    }
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