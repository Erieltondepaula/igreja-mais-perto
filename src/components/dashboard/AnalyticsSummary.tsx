// Local do arquivo: src/components/dashboard/AnalyticsSummary.tsx

import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsSummaryProps {
  members: Member[];
}

export const AnalyticsSummary = ({ members }: AnalyticsSummaryProps) => {
  const activeMembers = members.filter(m => m.status === 'ativo');

  const stats = {
    totalHomens: activeMembers.filter(m => m.sexo === 'M').length,
    totalMulheres: activeMembers.filter(m => m.sexo === 'F').length,
    semFuncao: activeMembers.filter(m => !m.lider && !m.professorEBQ).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">👨 Homens (Ativos)</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-blue-600">{stats.totalHomens}</div></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">👩 Mulheres (Ativas)</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-pink-600">{stats.totalMulheres}</div></CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">❓ Sem Função (Ativos)</CardTitle></CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.semFuncao}</div>
        </CardContent>
      </Card>
    </div>
  );
};