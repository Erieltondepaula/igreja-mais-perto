// Local do arquivo: src/components/dashboard/SummaryCards.tsx
// ✅ CÓDIGO CORRIGIDO - Mapeamento correto das chaves

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
  ageDistribution: Record<string, number>;
  onAgeGroupClick: (ageGroup: string) => void;
}

const ageGroupsConfig = [
  { title: 'Infância', range: '0-6 anos', key: 'infancia' },
  { title: 'Crianças', range: '7-10 anos', key: 'criancas' },
  { title: 'Adolescentes', range: '11-17 anos', key: 'adolescentes' },
  { title: 'Jovens', range: '18-35 anos', key: 'jovens' },
  { title: 'Adultos', range: '36-59 anos', key: 'adultos' },
  { title: 'Idosos', range: '60+ anos', key: 'idosos' },
];

export const SummaryCards = ({ ageDistribution, onAgeGroupClick }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {ageGroupsConfig.map(({ title, range, key }) => (
        <Card 
          key={title} 
          className="hover:shadow-lg hover:border-primary transition-all cursor-pointer"
          onClick={() => onAgeGroupClick(title)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ageDistribution[key] || 0}</div>
            <p className="text-xs text-muted-foreground">{range}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};