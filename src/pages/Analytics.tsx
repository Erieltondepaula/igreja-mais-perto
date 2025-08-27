// Local do arquivo: src/pages/Analytics.tsx

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
    onFiltersChange({ [key]: value });
    navigate('/');
  };

  return (
    <div className="space-y-6">
       <AnalyticsSummary members={members} />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart members={activeMembers} onSegmentClick={(sexo) => handleChartClick('sexo', sexo)} />
        <AgeChart members={members} onBarClick={(faixa) => handleChartClick('faixaEtaria', faixa)} />
      </div>
      <NeighborhoodMap members={activeMembers} onNeighborhoodClick={(bairro) => handleChartClick('bairro', bairro)} />
    </div>
  );
};

export default Analytics;