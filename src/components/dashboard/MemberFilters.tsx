<<<<<<< HEAD
// Local do arquivo: src/components/dashboard/MemberFilters.tsx
// ✅ CÓDIGO FINAL E DEFINITIVO (SEM 'any' E COM TIPAGEM CORRETA)

import { useState, useEffect } from 'react';
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
<<<<<<< HEAD
import { Member, MemberFilters as MemberFiltersType } from '@/types/member';
import { Search, RotateCcw, CheckSquare, Gift, CalendarDays } from 'lucide-react';
=======
import { MemberFilters as MemberFiltersType, Member } from '@/types/member';
import { Calendar, Gift, RotateCcw, Search, HelpCircle, CheckSquare } from 'lucide-react';
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

interface MemberFiltersProps {
  members: Member[];
  filters: MemberFiltersType;
  onFiltersChange: (filters: MemberFiltersType) => void;
}

export const MemberFilters = ({ members, filters, onFiltersChange }: MemberFiltersProps) => {
<<<<<<< HEAD
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
          {/* ✅ CORREÇÃO: Passamos 'undefined' quando o valor for 'all' */}
          <Select value={filters.statusGeral || 'all'} onValueChange={value => handleFilterChange('statusGeral', value === 'all' ? undefined : value as 'ativo' | 'desligado')}>
            <SelectTrigger><SelectValue placeholder="Status Geral" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos Status</SelectItem><SelectItem value="ativo">Ativos</SelectItem><SelectItem value="desligado">Desligados</SelectItem></SelectContent>
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
=======
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

        {/* ** ÁREA DE FILTROS SIMPLIFICADA ** */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            Tipo de Membro (múltipla escolha)
          </Label>
          <div className="flex flex-wrap gap-4">
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
                id="tipoBatizadoCongregado"
                checked={getCheckboxState('batizado_congregado')}
                onCheckedChange={checked => handleTipoMembroChange('batizado_congregado', checked as boolean)}
              />
              <Label htmlFor="tipoBatizadoCongregado" className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>🟢 Batizados (Congregados)
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
        </div>
      </CardContent>
    </Card>
  );
};