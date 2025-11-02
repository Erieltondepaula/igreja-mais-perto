<<<<<<< HEAD
// Local do arquivo: src/components/dashboard/SummaryCards.tsx
// ✅ CÓDIGO CORRIGIDO

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
  ageDistribution: Record<string, number>;
  // ✅ NOVA PROP: Recebe a função de clique
  onAgeGroupClick: (ageGroup: string) => void;
}

const ageGroupsConfig = [
  { title: 'Infância', range: '0-6 anos' },
  { title: 'Crianças', range: '7-10 anos' },
  { title: 'Adolescentes', range: '11-17 anos' },
  { title: 'Jovens', range: '18-35 anos' },
  { title: 'Adultos', range: '36-59 anos' },
  { title: 'Idosos', range: '60+ anos' },
];

export const SummaryCards = ({ ageDistribution, onAgeGroupClick }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {ageGroupsConfig.map(({ title, range }) => (
        // ✅ CARD AGORA É CLICÁVEL: Adicionamos o onClick e estilos de hover
        <Card 
          key={title} 
          className="hover:shadow-lg hover:border-primary transition-all cursor-pointer"
          onClick={() => onAgeGroupClick(title)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ageDistribution[title] || 0}</div>
            <p className="text-xs text-muted-foreground">{range}</p>
          </CardContent>
        </Card>
      ))}
=======
import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SummaryCardsProps {
  members: Member[]; // Agora recebe apenas membros ativos
  ageDistribution: {
    infancia: number;
    criancas: number;
    adolescentes: number;
    jovens: number;
    adultos: number;
    idosos: number;
  };
}

export const SummaryCards = ({ members, ageDistribution }: SummaryCardsProps) => {
  const stats = {
    totalHomens: members.filter(m => m.sexo === 'M').length,
    totalMulheres: members.filter(m => m.sexo === 'F').length,
    totalBatizados: members.filter(m => m.batizado).length,
    semFuncao: members.filter(m => !m.lider && !m.professorEBQ).length,
  };

  const percentualBatizados = members.length > 0
    ? ((stats.totalBatizados / members.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">👨 Homens</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-blue-600">{stats.totalHomens}</div></CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">👩 Mulheres</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold text-pink-600">{stats.totalMulheres}</div></CardContent>
      </Card>

      {/* Cards de faixa etária agora usam dados pré-calculados */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Infância</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.infancia}</div><p className="text-xs text-muted-foreground">0-6 anos</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Crianças</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.criancas}</div><p className="text-xs text-muted-foreground">7-10 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Adolescentes</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.adolescentes}</div><p className="text-xs text-muted-foreground">11-17 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Jovens</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.jovens}</div><p className="text-xs text-muted-foreground">18-35 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Adultos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.adultos}</div><p className="text-xs text-muted-foreground">36-59 anos</p></CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Idosos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{ageDistribution.idosos}</div><p className="text-xs text-muted-foreground">60+ anos</p></CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">⛪ Batismos (Ativos)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <div className="text-xl font-bold text-blue-600">{stats.totalBatizados}</div>
              <p className="text-xs text-muted-foreground">Batizados</p>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-600">{members.length - stats.totalBatizados}</div>
              <p className="text-xs text-muted-foreground">Não Batizados</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-2">{percentualBatizados}% Batizados</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">❓ Sem Função (Ativos)</CardTitle></CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.semFuncao}</div>
          <p className="text-xs text-muted-foreground">Membros</p>
        </CardContent>
      </Card>
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
    </div>
  );
};