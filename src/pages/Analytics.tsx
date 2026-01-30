// Local do arquivo: src/pages/Analytics.tsx
// ✅ MELHORADO COM ANIMAÇÕES CSS

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

  const handleChartClick = (key: keyof MemberFilters, value: string) => {
    onFiltersChange({ [key]: value, statusGeral: 'ativo' });
    navigate('/');
  };

  const handleFunctionClick = (func: 'lider' | 'professorEBQ') => {
    onFiltersChange({ [func]: true, statusGeral: 'ativo' });
    navigate('/');
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cards de resumo com animação escalonada */}
      <div className="animate-slideDown">
        <AnalyticsSummary members={activeMembers} onFunctionClick={handleFunctionClick} />
      </div>
      
      {/* Gráficos com animação escalonada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slideRight" style={{ animationDelay: '0.1s' }}>
          <GenderChart members={activeMembers} onSegmentClick={(sexo) => handleChartClick('sexo', sexo as 'M' | 'F')} />
        </div>
        <div className="animate-slideLeft" style={{ animationDelay: '0.2s' }}>
          <AgeChart members={activeMembers} onBarClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
        </div>
      </div>
      
      {/* Mapa de bairros com animação de subida */}
      <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <NeighborhoodMap members={activeMembers} onNeighborhoodClick={(bairro) => handleChartClick('bairro', bairro)} />
      </div>
    </div>
  );
};

export default Analytics;