// Local do arquivo: src/components/dashboard/MemberFilters.tsx
// ✅ CÓDIGO FINAL E DEFINITIVO (SEM 'any' E COM TIPAGEM CORRETA)

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Member, MemberFilters as MemberFiltersType } from '@/types/member';
import { Search, RotateCcw, CheckSquare, Gift, CalendarDays } from 'lucide-react';

interface MemberFiltersProps {
  members: Member[];
  filters: MemberFiltersType;
  onFiltersChange: (filters: MemberFiltersType) => void;
}

export const MemberFilters = ({ members, filters, onFiltersChange }: MemberFiltersProps) => {
  const [dataInicial, setDataInicial] = useState(filters.aniversariantesPeriodo?.dataInicial || '');
  const [dataFinal, setDataFinal] = useState(filters.aniversariantesPeriodo?.dataFinal || '');

  const uniqueBairros = Array.from(new Set(members.map(m => m.bairro).filter(Boolean))).sort();

  useEffect(() => {
    if (!filters.aniversariantesPeriodo) {
      setDataInicial('');
      setDataFinal('');
    }
  }, [filters.aniversariantesPeriodo]);

  // ✅ CORREÇÃO FINAL: Função genérica e segura que o TypeScript entende.
  const handleFilterChange = <K extends keyof MemberFiltersType>(
    key: K,
    value: MemberFiltersType[K]
  ) => {
    const newFilters = { ...filters };
    
    const isValueEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);

    if (isValueEmpty) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };
  
  // ✅ NOVA FUNÇÃO: Lida com a mudança no intervalo de idades
  const handleAgeRangeChange = (field: 'min' | 'max', value: string) => {
    const newRange = { ...filters.idadeRange, [field]: value };
    if (!newRange.min && !newRange.max) {
      handleFilterChange('idadeRange', undefined);
    } else {
      handleFilterChange('idadeRange', newRange);
    }
  };
  
  const handleTipoMembroChange = (tipo: string, checked: boolean) => {
    const currentTipos = filters.tipoMembro || [];
    const newTipos = checked ? [...currentTipos, tipo] : currentTipos.filter(t => t !== tipo);
    handleFilterChange('tipoMembro', newTipos);
  };
  
  // ✅ COLE ESTA NOVA FUNÇÃO NO LUGAR DA ANTIGA
const handleBirthdayFilterChange = (
  type: 'aniversariantesDoMes' | 'aniversariantesDoDia',
  isChecked: boolean
) => {
  const newFilters: MemberFiltersType = { ...filters };

  // Limpa todos os filtros de aniversário para evitar conflitos
  delete newFilters.aniversariantesPeriodo;
  delete newFilters.aniversariantesDoMes;
  delete newFilters.aniversariantesDoDia;

  // Se o checkbox foi marcado, aplica o filtro correspondente
  if (isChecked) {
    newFilters[type] = true;
  }

  onFiltersChange(newFilters);
};

  const handleSearchByPeriod = () => {
    if (dataInicial && dataFinal) {
      onFiltersChange({
        ...filters,
        aniversariantesDoMes: undefined,
        aniversariantesDoDia: undefined,
        aniversariantesPeriodo: { dataInicial, dataFinal },
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Search /> Filtros</CardTitle>
        <Button variant="outline" onClick={clearAllFilters} size="sm">
          <RotateCcw className="h-4 w-4 mr-2" /> Limpar Tudo
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Input placeholder="Pesquisar por nome..." value={filters.search || ''} onChange={e => handleFilterChange('search', e.target.value || undefined)} className="md:col-span-2" />
          {/* ✅ Por padrão mostra apenas ATIVOS, usuário pode selecionar Desligados explicitamente */}
          <Select value={filters.statusGeral || 'all'} onValueChange={value => handleFilterChange('statusGeral', value === 'all' ? undefined : value as 'ativo' | 'desligado')}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Apenas Ativos</SelectItem><SelectItem value="ativo">Ativos</SelectItem><SelectItem value="desligado">Desligados</SelectItem></SelectContent>
          </Select>
          <Select value={filters.sexo || 'all'} onValueChange={value => handleFilterChange('sexo', value === 'all' ? undefined : value)}>
            <SelectTrigger><SelectValue placeholder="Sexo" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Ambos os Sexos</SelectItem><SelectItem value="M">Masculino</SelectItem><SelectItem value="F">Feminino</SelectItem></SelectContent>
          </Select>
          <Select value={filters.bairro || 'all'} onValueChange={value => handleFilterChange('bairro', value === 'all' ? undefined : value)}>
            <SelectTrigger><SelectValue placeholder="Bairro" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos os Bairros</SelectItem>{uniqueBairros.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          {/* ✅ ALTERADO: Dois campos para o intervalo de idade */}
          <div className="flex items-center gap-2">
            <Input type="number" placeholder="Idade Mín." value={filters.idadeRange?.min || ''} onChange={e => handleAgeRangeChange('min', e.target.value)} />
            <span className="text-muted-foreground">-</span>
            <Input type="number" placeholder="Idade Máx." value={filters.idadeRange?.max || ''} onChange={e => handleAgeRangeChange('max', e.target.value)} />
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <Label className="flex items-center gap-2 font-semibold"><CheckSquare />Filtrar por Tipo de Membro</Label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {['membro', 'batizado_congregado', 'congregado'].map(tipo => (
              <div key={tipo} className="flex items-center space-x-2">
                <Checkbox id={tipo} checked={filters.tipoMembro?.includes(tipo) || false} onCheckedChange={checked => handleTipoMembroChange(tipo, !!checked)} />
                <Label htmlFor={tipo} className="capitalize">{tipo.replace('_', ' ')}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
           <Label className="flex items-center gap-2 font-semibold"><Gift />Filtrar por Aniversariantes</Label>
           <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex items-center space-x-2 pt-5">
                {/* ✅ COLE ESTA LINHA NO LUGAR DA ANTIGA */}
<Checkbox id="aniversariantesDoMes" checked={!!filters.aniversariantesDoMes} onCheckedChange={checked => handleBirthdayFilterChange('aniversariantesDoMes', !!checked)} />
                <Label htmlFor="aniversariantesDoMes">Do Mês</Label>
              </div>
              <div className="flex items-center space-x-2 pt-5">
               {/* ✅ COLE ESTA LINHA NO LUGAR DO CHECKBOX "DE HOJE" */}
<Checkbox id="aniversariantesDoDia" checked={!!filters.aniversariantesDoDia} onCheckedChange={checked => handleBirthdayFilterChange('aniversariantesDoDia', !!checked)} />
                <Label htmlFor="aniversariantesDoDia">De Hoje</Label>
              </div>
              <div className="flex items-end gap-2 flex-grow">
                <div className="w-full"><Label htmlFor="dataInicial">Data Inicial</Label><Input type="date" id="dataInicial" value={dataInicial} onChange={e => setDataInicial(e.target.value)} /></div>
                <div className="w-full"><Label htmlFor="dataFinal">Data Final</Label><Input type="date" id="dataFinal" value={dataFinal} onChange={e => setDataFinal(e.target.value)} /></div>
                <Button onClick={handleSearchByPeriod}><CalendarDays className="h-4 w-4 md:mr-2"/> <span className="hidden md:inline">Pesquisar Período</span></Button>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};