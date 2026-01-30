// Local do arquivo: src/components/dashboard/SummaryCards.tsx
// ✅ CÓDIGO CORRIGIDO - Mapeamento correto das chaves

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AGE_RANGE_COLORS } from '@/constants/chartColors';

interface SummaryCardsProps {
  ageDistribution: Record<string, number>;
  onAgeGroupClick: (ageGroup: string) => void;
}

const ageGroupsConfig = [
  { title: 'Bebês', range: '0-2 anos', key: 'bebes', filter: '0-2' },
  { title: 'Primeira Infância', range: '3-5 anos', key: 'primeiraInfancia', filter: '3-5' },
  { title: 'Infância', range: '6-11 anos', key: 'infancia', filter: '6-11' },
  { title: 'Adolescência', range: '12-17 anos', key: 'adolescencia', filter: '12-17' },
  { title: 'Jovem Adulto', range: '18-29 anos', key: 'jovemAdulto', filter: '18-29' },
  { title: 'Adulto', range: '30-44 anos', key: 'adulto', filter: '30-44' },
  { title: 'Meia-idade', range: '45-59 anos', key: 'meiaIdade', filter: '45-59' },
  { title: 'Idoso', range: '60+ anos', key: 'idoso', filter: '60+' },
];

export const SummaryCards = ({ ageDistribution, onAgeGroupClick }: SummaryCardsProps) => {
  return (
    <div className="w-full flex justify-center mb-2">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 py-4 rounded-xl shadow-lg w-full"
        style={{ background: '#fff', minWidth: 0, paddingLeft: 0, paddingRight: 0, justifyContent: 'center' }}
      >
        {ageGroupsConfig.map(({ title, range, key, filter }) => (
          <Card
            key={title}
            className="hover:shadow-lg hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center w-full h-full"
            style={{
              borderColor: AGE_RANGE_COLORS[filter],
              background: AGE_RANGE_COLORS[filter] + '20',
              boxSizing: 'border-box',
            }}
            onClick={() => onAgeGroupClick(filter)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: AGE_RANGE_COLORS[filter] }}>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-2xl font-bold" style={{ color: AGE_RANGE_COLORS[filter] }}>{ageDistribution[key] || 0}</div>
              <p className="text-xs font-semibold" style={{ color: AGE_RANGE_COLORS[filter] }}>{range}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};