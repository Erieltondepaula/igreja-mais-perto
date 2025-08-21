import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';
import { Member } from '@/types/member';
import { getGenderChartData } from '@/utils/memberUtils';
import { Users } from 'lucide-react';
import React from 'react';

interface GenderChartProps {
  members: Member[];
  onSegmentClick?: (sexo: 'M' | 'F') => void;
}

interface GenderData {
  name: string;
  value: number;
  fill?: string;
}

export const GenderChart = ({ members, onSegmentClick }: GenderChartProps) => {
  const activeMembers = members.filter(m => m.status === 'ativo');
  const data: GenderData[] = getGenderChartData(activeMembers);

  const COLORS = {
    Masculino: '#3B82F6', // Azul
    Feminino: '#EC4899',   // Rosa
  };

  const handleClick = (data: GenderData) => {
    if (onSegmentClick) {
      const sexo = data.name === 'Masculino' ? 'M' : 'F';
      onSegmentClick(sexo);
    }
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const total = activeMembers.length > 0 ? activeMembers.length : 1;
      const percentage = ((item.value! / total) * 100).toFixed(1);
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{item.name}</p>
          <p className="text-primary">{item.value} pessoas ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Distribuição por Sexo (Ativos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                onClick={(payload) => handleClick(payload)}
                className="cursor-pointer"
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              onClick={() => handleClick(item)}
            >
              <div className="text-2xl font-bold" style={{ color: COLORS[item.name as keyof typeof COLORS] }}>
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};