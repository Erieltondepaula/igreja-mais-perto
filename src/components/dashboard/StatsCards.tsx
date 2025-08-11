import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Heart, UserX } from 'lucide-react';
import { Member } from '@/types/member';

interface StatsCardsProps {
  members: Member[];
  onCardClick?: (status?: string) => void;
}

export const StatsCards = ({ members, onCardClick }: StatsCardsProps) => {
  const stats = {
    total: members.length,
    ativos: members.filter(m => m.status === 'ativo').length,
    batizados: members.filter(m => m.batizado === true).length,
    membros: members.length, // Total members count
    desligados: members.filter(m => m.status === 'desligado').length
  };

  const cards = [
    {
      title: 'Total de Membros',
      value: stats.total,
      icon: Users,
      color: 'text-primary',
      status: undefined
    },
    {
      title: 'Ativos',
      value: stats.ativos,
      icon: UserCheck,
      color: 'text-success',
      status: 'ativo'
    },
    {
      title: 'Batizados',
      value: stats.batizados,
      icon: Heart,
      color: 'text-info',
      status: 'batizado'
    },
    {
      title: 'Membros',
      value: stats.membros,
      icon: Users,
      color: 'text-primary',
      status: 'membro'
    },
    {
      title: 'Desligados',
      value: stats.desligados,
      icon: UserX,
      color: 'text-muted-foreground',
      status: 'desligado'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onCardClick?.(card.status)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};