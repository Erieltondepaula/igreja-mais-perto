// Local do arquivo: src/pages/Analytics.tsx
// ✅ CÓDIGO FINAL E CORRETO

import { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { MemberFilters } from '@/types/member';
import { GenderChart } from '@/components/dashboard/GenderChart';
import { AgeChart } from '@/components/dashboard/AgeChart';
import { NeighborhoodMap } from '@/components/dashboard/NeighborhoodMap';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { useAppContext } from '@/contexts/useAppContext';

const Analytics = () => {
  const { members, onFiltersChange } = useAppContext();
  const navigate = useNavigate();

  const activeMembers = useMemo(() => members.filter(m => m.status === 'ativo'), [members]);

  // Função para os gráficos de Pizza, Barra e Mapa
  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    onFiltersChange({ [key]: value, statusGeral: 'ativo' });
    navigate('/');
  };

  // ✅ ESTA É A FUNÇÃO QUE ESTAVA FALTANDO E QUE CORRIGE O ERRO.
  // Ela será chamada quando você clicar em "Líderes" ou "Professores".
  const handleFunctionClick = (func: 'lider' | 'professorEBQ') => {
    onFiltersChange({ [func]: true, statusGeral: 'ativo' });
    navigate('/');
  }

  return (
    <div className="space-y-6">
       {/* A chamada abaixo agora funciona porque a função handleFunctionClick existe */}
       <AnalyticsSummary members={activeMembers} onFunctionClick={handleFunctionClick} />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart members={activeMembers} onSegmentClick={(sexo) => handleChartClick('sexo', sexo as 'M' | 'F')} />
        <AgeChart members={activeMembers} onBarClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
      </div>
      <NeighborhoodMap members={activeMembers} onNeighborhoodClick={(bairro) => handleChartClick('bairro', bairro)} />
    </div>
  );
};

export default Analytics;