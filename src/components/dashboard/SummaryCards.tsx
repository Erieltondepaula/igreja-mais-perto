import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAge } from '@/utils/memberUtils';

interface SummaryCardsProps {
  members: Member[];
}

export const SummaryCards = ({ members }: SummaryCardsProps) => {
  const activeMembers = members.filter(m => m.status !== 'desligado');
  
  const stats = {
    totalHomens: activeMembers.filter(m => m.sexo === 'M').length,
    totalMulheres: activeMembers.filter(m => m.sexo === 'F').length,
    totalCriancas: activeMembers.filter(m => calculateAge(m.dataNascimento) <= 12).length,
    totalJovens: activeMembers.filter(m => {
      const age = calculateAge(m.dataNascimento);
      return age >= 13 && age <= 30;
    }).length,
    totalAdultos: activeMembers.filter(m => {
      const age = calculateAge(m.dataNascimento);
      return age >= 31 && age <= 60;
    }).length,
    totalIdosos: activeMembers.filter(m => calculateAge(m.dataNascimento) > 60).length,
    totalBatizados: activeMembers.filter(m => m.batizado).length,
    totalNaoBatizados: activeMembers.filter(m => !m.batizado).length,
    semFuncao: activeMembers.filter(m => !m.lider && !m.professorEBQ).length,
  };

  const percentualBatizados = activeMembers.length > 0 
    ? ((stats.totalBatizados / activeMembers.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">👨 Homens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalHomens}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">👩 Mulheres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">{stats.totalMulheres}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">👶 Crianças</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.totalCriancas}</div>
          <p className="text-xs text-muted-foreground">0-12 anos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">🧑 Jovens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.totalJovens}</div>
          <p className="text-xs text-muted-foreground">13-30 anos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">👨‍💼 Adultos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalAdultos}</div>
          <p className="text-xs text-muted-foreground">31-60 anos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">👴 Idosos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.totalIdosos}</div>
          <p className="text-xs text-muted-foreground">60+ anos</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">⛪ Batismos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <div className="text-xl font-bold text-blue-600">{stats.totalBatizados}</div>
              <p className="text-xs text-muted-foreground">Batizados</p>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-600">{stats.totalNaoBatizados}</div>
              <p className="text-xs text-muted-foreground">Não Batizados</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-2">
            {percentualBatizados}% Batizados
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">❓ Sem Função</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.semFuncao}</div>
          <p className="text-xs text-muted-foreground">Membros</p>
        </CardContent>
      </Card>
    </div>
  );
};