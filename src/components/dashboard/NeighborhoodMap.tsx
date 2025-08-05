import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types/member';
import { getNeighborhoodData } from '@/utils/memberUtils';
import { MapPin } from 'lucide-react';

interface NeighborhoodMapProps {
  members: Member[];
}

export const NeighborhoodMap = ({ members }: NeighborhoodMapProps) => {
  const neighborhoodData = getNeighborhoodData(members);
  const maxCount = Math.max(...neighborhoodData.map(n => n.quantidade));

  const getIntensityColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return 'bg-primary';
    if (intensity > 0.4) return 'bg-info';
    if (intensity > 0.2) return 'bg-warning';
    return 'bg-muted';
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapeamento por Bairro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {neighborhoodData.map((neighborhood, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${getIntensityColor(neighborhood.quantidade)} ${
                  getIntensityColor(neighborhood.quantidade) === 'bg-muted' 
                    ? 'text-muted-foreground' 
                    : 'text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{neighborhood.bairro}</h3>
                  <Badge 
                    variant="outline" 
                    className={`${
                      getIntensityColor(neighborhood.quantidade) === 'bg-muted'
                        ? 'border-muted-foreground text-muted-foreground'
                        : 'border-white text-white'
                    }`}
                  >
                    {neighborhood.quantidade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-6">
            <span>Intensidade:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span>Baixa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span>Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-info rounded"></div>
              <span>Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Muito Alta</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};