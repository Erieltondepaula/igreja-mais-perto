import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/member';
import { useToast } from '@/hooks/use-toast';

type MemberRow = {
  id: string;
  id_externo: string | null;
  nome: string;
  sobrenome: string;
  nome_completo: string | null;
  data_nascimento: string | null;
  idade: number | null;
  mes: string | null;
  telefone: string | null;
  sexo: string | null;
  email: string | null;
  observacoes: string | null;
  status_civil: string | null;
  conjuge: string | null;
  parentesco: string | null;
  rua: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  batizado: boolean | null;
  membro: boolean | null;
  situacao_atual: string | null;
  lider: boolean | null;
  e_professor_ebq: boolean | null;
  faixa_etaria: string | null;
  pequeno_grupo: boolean | null;
  grupo: string | null;
  numero_domes: number | null;
  avatar_url: string | null;
  data_batismo: string | null;
  data_membresia: string | null;
  data_desligamento: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Mapear dados do banco para o formato do frontend
const mapRowToMember = (item: MemberRow): Member => ({
  id: item.id || '',
  idExterno: item.id_externo || undefined,
  nome: item.nome || '',
  sobrenome: item.sobrenome || '',
  nomeCompleto: item.nome_completo || '',
  avatar_url: item.avatar_url || undefined,
  dataNascimento: item.data_nascimento || '',
  idade: item.idade || 0,
  mes: item.mes || '',
  sexo: (item.sexo === 'M' || item.sexo === 'F') ? item.sexo : 'M',
  telefone: item.telefone || '',
  email: item.email || '',
  endereco: `${item.rua || ''}, ${item.numero || ''} - ${item.bairro || ''}`,
  rua: item.rua || '',
  numero: item.numero || '',
  bairro: item.bairro || '',
  cidade: item.cidade || '',
  estado: item.estado || '',
  cep: item.cep || '',
  status: item.situacao_atual === 'ativo' || item.situacao_atual === 'Ativo' ? 'ativo' : 'desligado',
  situacao_atual: item.situacao_atual || 'ativo',
  statusCivil: item.status_civil || '',
  conjuge: item.conjuge || '',
  parentesco: item.parentesco || '',
  batizado: item.batizado === true,
  membro: item.membro === true,
  lider: item.lider === true,
  professorEBQ: item.e_professor_ebq === true,
  faixaEtaria: item.faixa_etaria || '',
  pequeno_grupo: item.pequeno_grupo === true,
  grupo: item.grupo || '',
  numero_domes: item.numero_domes || 0,
  dataBatismo: item.data_batismo || undefined,
  dataMembresia: item.data_membresia || undefined,
  dataDesligamento: item.data_desligamento || undefined,
  observacoes: item.observacoes || '',
  createdAt: item.created_at || '',
  updatedAt: item.updated_at || '',
});

// Mapear dados do frontend para o formato do banco
const mapMemberToRow = (member: Partial<Member>) => ({
  id: member.id,
  id_externo: member.idExterno || null,
  nome: member.nome || '',
  sobrenome: member.sobrenome || member.nome?.split(' ').slice(1).join(' ') || '',
  nome_completo: member.nomeCompleto || `${member.nome} ${member.sobrenome || ''}`.trim(),
  data_nascimento: member.dataNascimento || null,
  idade: member.idade || null,
  mes: member.mes || null,
  telefone: member.telefone || null,
  sexo: member.sexo || null,
  email: member.email || null,
  observacoes: member.observacoes || null,
  status_civil: member.statusCivil || null,
  conjuge: member.conjuge || null,
  parentesco: member.parentesco || null,
  rua: member.rua || null,
  numero: member.numero || null,
  bairro: member.bairro || null,
  cidade: member.cidade || null,
  estado: member.estado || null,
  cep: member.cep || null,
  batizado: member.batizado || false,
  membro: member.membro || false,
  situacao_atual: member.status === 'ativo' ? 'ativo' : member.status === 'desligado' ? 'desligado' : 'ativo',
  lider: member.lider || false,
  e_professor_ebq: member.professorEBQ || false,
  faixa_etaria: member.faixaEtaria || null,
  pequeno_grupo: member.pequeno_grupo || false,
  grupo: member.grupo || null,
  numero_domes: member.numero_domes || null,
  avatar_url: member.avatar_url || null,
  data_batismo: member.dataBatismo || null,
  data_membresia: member.dataMembresia || null,
  data_desligamento: member.dataDesligamento || null,
});

export const useSupabaseMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Buscar todos os membros
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 [Supabase] Carregando membros do banco em nuvem...');
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      const formattedData = (data || []).map(mapRowToMember);
      console.log('✅ [Supabase] Membros carregados:', formattedData.length);
      setMembers(formattedData);
      return formattedData;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao carregar membros:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os membros do banco.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Gerar ID customizado usando a função do banco
  const generateMemberId = async (nome: string, sobrenome: string): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc('generate_member_id', {
        p_nome: nome,
        p_sobrenome: sobrenome
      });
      if (error) throw error;
      return data as string;
    } catch (error) {
      // Fallback: gerar ID localmente
      const primeiraLetra = nome.charAt(0).toUpperCase();
      const segundaLetra = sobrenome.charAt(0).toUpperCase();
      const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
      return `${primeiraLetra}${segundaLetra}${timestamp}`;
    }
  };

  // Adicionar um membro
  const addMember = useCallback(async (member: Partial<Member>): Promise<Member | null> => {
    try {
      const sobrenome = member.sobrenome || member.nome?.split(' ').slice(1).join(' ') || 'X';
      const id = await generateMemberId(member.nome || 'X', sobrenome);
      
      const rowData = mapMemberToRow({ ...member, id });
      
      const { data, error } = await supabase
        .from('membros')
        .insert(rowData)
        .select()
        .single();

      if (error) throw error;

      const newMember = mapRowToMember(data);
      setMembers(prev => [...prev, newMember]);
      toast({ title: 'Membro adicionado com sucesso!' });
      return newMember;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao adicionar membro:', error);
      toast({
        title: 'Erro ao adicionar membro',
        description: String(error),
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);

  // Atualizar um membro
  const updateMember = useCallback(async (member: Member): Promise<boolean> => {
    try {
      const rowData = mapMemberToRow(member);
      
      const { error } = await supabase
        .from('membros')
        .update(rowData)
        .eq('id', member.id);

      if (error) throw error;

      setMembers(prev => prev.map(m => m.id === member.id ? member : m));
      toast({ title: 'Membro atualizado com sucesso!' });
      return true;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao atualizar membro:', error);
      toast({
        title: 'Erro ao atualizar membro',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  // Deletar um membro
  const deleteMember = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Membro removido com sucesso!' });
      return true;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao deletar membro:', error);
      toast({
        title: 'Erro ao remover membro',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  // Importar membros (adiciona aos existentes)
  const importMembers = useCallback(async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('🔄 [Supabase] Importando', importedMembers.length, 'membros...');
      
      const rowsToInsert = await Promise.all(
        importedMembers.map(async (member) => {
          const sobrenome = member.sobrenome || member.nome?.split(' ').slice(1).join(' ') || 'X';
          const id = await generateMemberId(member.nome || 'X', sobrenome);
          return mapMemberToRow({ ...member, id });
        })
      );

      const { data, error } = await supabase
        .from('membros')
        .insert(rowsToInsert)
        .select();

      if (error) throw error;

      const newMembers = (data || []).map(mapRowToMember);
      setMembers(prev => [...prev, ...newMembers]);
      
      toast({
        title: 'Membros importados com sucesso!',
        description: `${newMembers.length} membros adicionados`
      });
      return true;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao importar membros:', error);
      toast({
        title: 'Erro ao importar membros',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Substituir todos os membros
  const replaceAllMembers = useCallback(async (importedMembers: Partial<Member>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('🔄 [Supabase] Substituindo todos os membros...');
      
      // Deletar todos os membros existentes
      const { error: deleteError } = await supabase
        .from('membros')
        .delete()
        .neq('id', ''); // Deleta todos

      if (deleteError) throw deleteError;

      // Inserir novos membros
      const rowsToInsert = await Promise.all(
        importedMembers.map(async (member) => {
          const sobrenome = member.sobrenome || member.nome?.split(' ').slice(1).join(' ') || 'X';
          const id = await generateMemberId(member.nome || 'X', sobrenome);
          return mapMemberToRow({ ...member, id });
        })
      );

      const { data, error } = await supabase
        .from('membros')
        .insert(rowsToInsert)
        .select();

      if (error) throw error;

      const newMembers = (data || []).map(mapRowToMember);
      setMembers(newMembers);
      
      toast({
        title: 'Base de dados substituída!',
        description: `${newMembers.length} membros carregados`
      });
      return true;
    } catch (error) {
      console.error('❌ [Supabase] Erro ao substituir membros:', error);
      toast({
        title: 'Erro ao substituir membros',
        description: String(error),
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    members,
    isLoading,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    importMembers,
    replaceAllMembers
  };
};
