// Local do arquivo: src/components/dashboard/AnalyticsSummary.tsx
// ✅ CARDS DE LÍDERES E PROFESSORES EBQ

import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, GraduationCap } from 'lucide-react';

interface AnalyticsSummaryProps {
  members: Member[];
  onFunctionClick: (func: 'lider' | 'professorEBQ') => void;
}

export const AnalyticsSummary = ({ members, onFunctionClick }: AnalyticsSummaryProps) => {
  const activeMembers = members.filter(m => m.status === 'ativo');
  const totalMembers = activeMembers.length;

  const stats = {
    totalLideres: activeMembers.filter(m => m.lider).length,
    totalProfessores: activeMembers.filter(m => m.professorEBQ).length,
  };

  const percentLideres = totalMembers > 0 ? ((stats.totalLideres / totalMembers) * 100).toFixed(0) : 0;
  const percentProfessores = totalMembers > 0 ? ((stats.totalProfessores / totalMembers) * 100).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card Líderes */}
      <Card 
        className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-500"
        onClick={() => onFunctionClick('lider')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Líderes
            </span>
            <Crown className="h-5 w-5 text-yellow-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.totalLideres}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {percentLideres}% do total
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                Clique p/ filtrar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Professores EBQ */}
      <Card 
        className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500"
        onClick={() => onFunctionClick('professorEBQ')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-500" />
              Professores EBQ
            </span>
            <GraduationCap className="h-5 w-5 text-green-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {stats.totalProfessores}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {percentProfessores}% do total
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                Clique p/ filtrar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};