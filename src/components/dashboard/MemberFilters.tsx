import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MemberFilters as MemberFiltersType, Member } from '@/types/member';
import { Calendar, Gift, RotateCcw, Search, HelpCircle, CheckSquare } from 'lucide-react';

interface MemberFiltersProps {
  members: Member[];
  filters: MemberFiltersType;
  onFiltersChange: (filters: MemberFiltersType) => void;
}

export const MemberFilters = ({ members, filters, onFiltersChange }: MemberFiltersProps) => {
  const uniqueBairros = Array.from(new Set(members.map(m => m.bairro).filter(Boolean))).sort();
  const uniqueYears = Array.from(
    new Set(
      members
        .map(m => (m.dataNascimento ? new Date(m.dataNascimento).getFullYear() : null))
        .filter((y): y is number => y !== null)
    )
  ).sort((a, b) => b - a);

  const handleFilterChange = (
    key: keyof MemberFiltersType,
    value: MemberFiltersType[keyof MemberFiltersType]
  ) => {
    const newValue = value === 'all' ? undefined : value;
    onFiltersChange({ ...filters, [key]: newValue });
  };

  const handleTipoMembroChange = (tipo: string, checked: boolean) => {
    const currentTipos = filters.tipoMembro || [];
    let newTipos;

    if (checked) {
      newTipos = currentTipos.includes(tipo) ? currentTipos : [...currentTipos, tipo];
    } else {
      newTipos = currentTipos.filter(t => t !== tipo);
    }

    onFiltersChange({ ...filters, tipoMembro: newTipos.length > 0 ? newTipos : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getCheckboxState = (tipo: string) => {
    const tipoMembro = filters.tipoMembro || [];
    return tipoMembro.includes(tipo);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            title="Ajuda sobre filtros"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>🔍 Buscar por Nome</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite o nome do membro..."
              value={filters.search || ''}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Status Geral
            </Label>
            <Select
              value={filters.statusGeral || 'all'}
              onValueChange={value => handleFilterChange('statusGeral', value as 'ativo' | 'desligado')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">🟢 Ativos</SelectItem>
                <SelectItem value="desligado">⚪ Desligados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sexo</Label>
            <Select
              value={filters.sexo || 'all'}
              onValueChange={value => handleFilterChange('sexo', value)}
            >
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
            <Select
              value={filters.bairro || 'all'}
              onValueChange={value => handleFilterChange('bairro', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {uniqueBairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ano de Nascimento</Label>
            <Select
              value={filters.anoNascimento || 'all'}
              onValueChange={value => handleFilterChange('anoNascimento', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              🧹 Limpar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            Tipo de Membro (múltipla escolha)
          </Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipoBatizado"
                checked={getCheckboxState('batizado')}
                onCheckedChange={checked => handleTipoMembroChange('batizado', checked as boolean)}
              />
              <Label htmlFor="tipoBatizado" className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>🔵 Batizados
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipoMembro"
                checked={getCheckboxState('membro')}
                onCheckedChange={checked => handleTipoMembroChange('membro', checked as boolean)}
              />
              <Label htmlFor="tipoMembro" className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-700 rounded-full"></span>🔷 Membros
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipoCongregado"
                checked={getCheckboxState('congregado')}
                onCheckedChange={checked => handleTipoMembroChange('congregado', checked as boolean)}
              />
              <Label htmlFor="tipoCongregado" className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>🟡 Congregados
              </Label>
            </div>
          </div>
        </div>

        {/* SEÇÃO RESTAURADA ABAIXO */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            Aniversariantes
          </Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="aniversariantesDoMes"
                checked={filters.aniversariantesDoMes || false}
                onCheckedChange={checked => handleFilterChange('aniversariantesDoMes', Boolean(checked))}
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
                onCheckedChange={checked => handleFilterChange('aniversariantesDoDia', Boolean(checked))}
              />
              <Label htmlFor="aniversariantesDoDia" className="flex items-center gap-1">
                <Gift className="h-4 w-4" />
                Aniversariantes de hoje
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};