// Local do arquivo: src/components/dashboard/AnalyticsSummary.tsx
// ✅ CÓDIGO FINAL E CORRETO

import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, GraduationCap } from 'lucide-react';

interface AnalyticsSummaryProps {
  members: Member[];
  onFunctionClick: (func: 'lider' | 'professorEBQ') => void;
}

export const AnalyticsSummary = ({ members, onFunctionClick }: AnalyticsSummaryProps) => {
  const activeMembers = members.filter(m => m.status === 'ativo');

  const stats = {
    totalHomens: activeMembers.filter(m => m.sexo === 'M').length,
    totalMulheres: activeMembers.filter(m => m.sexo === 'F').length,
    totalLideres: activeMembers.filter(m => m.lider).length,
    totalProfessores: activeMembers.filter(m => m.professorEBQ).length,
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
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Funções Atribuídas (Ativos)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around items-center pt-2">
          {/* A correção está aqui: onClick usa "onFunctionClick" */}
          <div 
            className="text-center p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onFunctionClick('lider')}
          >
            <Crown className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.totalLideres}</div>
            <p className="text-xs text-muted-foreground">Líderes</p>
          </div>
          {/* E aqui também: onClick usa "onFunctionClick" */}
          <div 
            className="text-center p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onFunctionClick('professorEBQ')}
          >
            <GraduationCap className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.totalProfessores}</div>
            <p className="text-xs text-muted-foreground">Professores EBQ</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};