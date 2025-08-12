import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Member } from '@/types/member';
import { getAgeGroupChartData } from '@/utils/memberUtils';
import { TrendingUp } from 'lucide-react';
import React from 'react';

interface AgeChartProps {
  members: Member[];
  onBarClick?: (faixaEtaria: string) => void;
}

interface AgeGroupData {
  faixaEtaria: string;
  quantidade: number;
}

export const AgeChart = ({ members, onBarClick }: AgeChartProps) => {
  const data: AgeGroupData[] = getAgeGroupChartData(members);

  const handleClick = (data: AgeGroupData) => {
    if (onBarClick) {
      onBarClick(data.faixaEtaria);
    }
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value ?? 0;
      const percentage = ((value / members.length) * 100).toFixed(1);
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label} anos</p>
          <p className="text-primary">
            {value} pessoas ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Distribuição por Faixa Etária
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faixaEtaria" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="quantidade"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                onClick={handleClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-6 gap-2 mt-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              onClick={() => handleClick(item)}
            >
              <div className="text-lg font-bold text-primary">{item.quantidade}</div>
              <div className="text-xs text-muted-foreground">{item.faixaEtaria}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
