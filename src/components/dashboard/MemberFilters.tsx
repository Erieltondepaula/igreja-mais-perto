import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MemberFilters as MemberFiltersType, Member } from '@/types/member';
import { Calendar, Gift, RotateCcw } from 'lucide-react';

interface MemberFiltersProps {
  members: Member[];
  filters: MemberFiltersType;
  onFiltersChange: (filters: MemberFiltersType) => void;
}

export const MemberFilters = ({ members, filters, onFiltersChange }: MemberFiltersProps) => {
  const uniqueBairros = Array.from(new Set(members.map(m => m.bairro))).sort();
  
  const handleFilterChange = (key: keyof MemberFiltersType, value: any) => {
    const newValue = value === 'all' ? undefined : value;
    onFiltersChange({ ...filters, [key]: newValue });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="batizado">Batizado</SelectItem>
                <SelectItem value="membro">Membro</SelectItem>
                <SelectItem value="desligado">Desligado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sexo</Label>
            <Select value={filters.sexo || 'all'} onValueChange={(value) => handleFilterChange('sexo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bairro</Label>
            <Select value={filters.bairro || 'all'} onValueChange={(value) => handleFilterChange('bairro', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os bairros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {uniqueBairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aniversariantesDoMes"
              checked={filters.aniversariantesDoMes || false}
              onCheckedChange={(checked) => handleFilterChange('aniversariantesDoMes', checked)}
            />
            <Label htmlFor="aniversariantesDoMes" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Aniversariantes do mês
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="aniversariantesDoDia"
              checked={filters.aniversariantesDoDia || false}
              onCheckedChange={(checked) => handleFilterChange('aniversariantesDoDia', checked)}
            />
            <Label htmlFor="aniversariantesDoDia" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Aniversariantes de hoje
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};