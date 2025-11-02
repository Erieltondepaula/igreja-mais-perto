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
    </div>
  );
};