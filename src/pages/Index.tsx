import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MemberFilters as MemberFiltersComponent } from '@/components/dashboard/MemberFilters';
import { MemberList } from '@/components/dashboard/MemberList';
import { ImportExport } from '@/components/dashboard/ImportExport';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Member, MemberFromDB, MemberFilters } from '@/types/member';
import { filterMembers, calculateAge, getMemberType } from '@/utils/memberUtils';
import { mockMembers } from '@/data/mockMembers';
import { useAppContext } from '@/contexts/useAppContext';

const API_URL = 'http://localhost:5001/api/members';

const Index = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('church-members', []);
  const { filters, onFiltersChange } = useAppContext(); // ✅ Usar filtros do contexto
  const [sortField, setSortField] = useState<keyof Member | 'idade' | 'tipo' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const memberListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Backend não disponível');
        const data: MemberFromDB[] = await response.json();
        const formattedData: Member[] = data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setMembers(formattedData);
      } catch (error) {
        console.error('Backend não disponível, usando dados locais/mock:', error);
        // Se não há dados no localStorage, usa dados mock
        if (members.length === 0) {
          setMembers(mockMembers);
        }
      }
    };
    fetchMembers();
  }, [setMembers, members.length]);

  const activeMembers = useMemo(() => {
    return members.filter(m => m.status !== 'desligado');
  }, [members]);

  const ageDistribution = useMemo(() => {
    const distribution = { infancia: 0, criancas: 0, adolescentes: 0, jovens: 0, adultos: 0, idosos: 0 };
    activeMembers.forEach(m => {
      const age = calculateAge(m.dataNascimento);
      if (age <= 6) distribution.infancia++;
      else if (age <= 10) distribution.criancas++;
      else if (age <= 17) distribution.adolescentes++;
      else if (age <= 35) distribution.jovens++;
      else if (age <= 59) distribution.adultos++;
      else distribution.idosos++;
    });
    return distribution;
  }, [activeMembers]);

  // ✅ CORRIGIDO: Agora filtra de TODOS os membros, não apenas dos ativos
  const filteredMembers = useMemo(() => {
    return filterMembers(members, filters);
  }, [members, filters]);

  // ✅ MEMBROS ORDENADOS - Aplica ordenação aos membros filtrados
  const sortedAndFilteredMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    
    return [...filteredMembers].sort((a, b) => {
      // ✅ ORDENAÇÃO ESPECIAL POR DATA DE NASCIMENTO
      if (sortField === 'dataNascimento') {
        // Regra: Primeiro pelo DIA (menor para maior), depois pelo MÊS (se dia igual), ignora ANO
        const dateA = new Date(a.dataNascimento || '1900-01-01');
        const dateB = new Date(b.dataNascimento || '1900-01-01');
        
        const dayA = dateA.getUTCDate();
        const dayB = dateB.getUTCDate();
        const monthA = dateA.getUTCMonth(); // 0-11
        const monthB = dateB.getUTCMonth();
        
        // Compara pelo dia primeiro
        if (dayA !== dayB) {
          return sortDirection === 'asc' ? dayA - dayB : dayB - dayA;
        }
        // Se o dia for igual, compara pelo mês
        return sortDirection === 'asc' ? monthA - monthB : monthB - monthA;
      }
      
      // Ordenação para outros campos
      let valueA: string | number | boolean | undefined;
      let valueB: string | number | boolean | undefined;
      
      if (sortField === 'idade') {
        valueA = calculateAge(a.dataNascimento);
        valueB = calculateAge(b.dataNascimento);
      } else if (sortField === 'tipo') {
        valueA = getMemberType(a);
        valueB = getMemberType(b);
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Ordenação
      if (valueA === valueB) return 0;
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [filteredMembers, sortField, sortDirection]);

  const handleSort = (field: keyof Member | 'idade' | 'tipo') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await fetch(API_URL);
      const data: MemberFromDB[] = await response.json();
      const formattedData: Member[] = data.map((item) => ({
        ...item,
        id: item._id || '',
      }));
      setMembers(formattedData);
      toast({ title: 'Dados atualizados com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleFiltersChange = (newFilters: MemberFilters) => {
    onFiltersChange(newFilters);
  };

  const handleCardClick = (statusGeral?: 'ativo' | 'desligado') => {
    const newFilters = statusGeral ? { statusGeral } : {};
    onFiltersChange(newFilters);
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Lógica para gráficos e mapas
  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
    memberListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImport = (importedMembers: Partial<Member>[]) => {
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
    setMembers(prevMembers => [...prevMembers, ...newMembers]);
    toast({ title: "Membros adicionados com sucesso!" });
  };

  const handleReplaceAll = (importedMembers: Partial<Member>[]) => {
    console.log('🔄 Substituindo todos os membros. Total importado:', importedMembers.length);
    
    const newMembers: Member[] = importedMembers.map((member, index) => {
      const fullMember: Member = {
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
      };
      return fullMember;
    });
    
    console.log('✅ Membros processados:', newMembers.length);
    console.log('📊 Primeiros 3 membros processados:', newMembers.slice(0, 3));
    
    setMembers(newMembers);
    toast({ 
      title: "Base de dados substituída com sucesso!", 
      description: `${newMembers.length} membros carregados`
    });
  };

  const handleMemberUpdate = (updatedMember: Member) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            Sistema de gestão e controle de cadastro de membros
          </p>
        </div>
        <SummaryCards ageDistribution={ageDistribution} onAgeGroupClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
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
        <div ref={memberListRef} data-member-list>
          <MemberList 
            members={sortedAndFilteredMembers} 
            onMemberUpdate={handleMemberUpdate}
            onRefresh={handleRefresh}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
