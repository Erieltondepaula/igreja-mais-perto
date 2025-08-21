import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAge } from '@/utils/memberUtils';

interface SummaryCardsProps {
  members: Member[];
}

export const SummaryCards = ({ members }: SummaryCardsProps) => {
  // CORREÇÃO: Cálculos agora usam a lista completa de membros para consistência.
  const ages = members.map(m => calculateAge(m.dataNascimento));

  // CORREÇÃO: Faixas etárias ajustadas para corresponder às suas regras.
  const stats = {
    totalHomens: members.filter(m => m.sexo === 'M').length,
    totalMulheres: members.filter(m => m.sexo === 'F').length,
    totalInfancia: ages.filter(age => age <= 6).length,
    totalCriancas: ages.filter(age => age >= 7 && age <= 10).length,
    totalAdolescentes: ages.filter(age => age >= 11 && age <= 17).length,
    totalJovens: ages.filter(age => age >= 18 && age <= 35).length,
    totalAdultos: ages.filter(age => age >= 36 && age <= 59).length,
    totalIdosos: ages.filter(age => age >= 60).length,
    totalBatizados: members.filter(m => m.batizado).length,
    totalNaoBatizados: members.length - members.filter(m => m.batizado).length,
    semFuncao: members.filter(m => !m.lider && !m.professorEBQ).length,
  };

  const percentualBatizados = members.length > 0
    ? ((stats.totalBatizados / members.length) * 100).toFixed(1)
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

      {/* Cards de faixa etária atualizados */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Infância</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalInfancia}</div><p className="text-xs text-muted-foreground">0-6 anos</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Crianças</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalCriancas}</div><p className="text-xs text-muted-foreground">7-10 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Adolescentes</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalAdolescentes}</div><p className="text-xs text-muted-foreground">11-17 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Jovens</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalJovens}</div><p className="text-xs text-muted-foreground">18-35 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Adultos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalAdultos}</div><p className="text-xs text-muted-foreground">36-59 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Idosos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{stats.totalIdosos}</div><p className="text-xs text-muted-foreground">60+ anos</p></CardContent>
      </Card>

      {/* Cards de Batismo e Função */}
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