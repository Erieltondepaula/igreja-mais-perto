// Local do arquivo: src/components/dashboard/Header.tsx
// ✅ CÓDIGO FINAL CORRIGIDO

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Church, Edit, Check, Users, UserCheck, UserX, Heart } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Member } from '@/types/member';

interface HeaderProps {
  members: Member[];
  onCardClick: (status?: 'ativo' | 'desligado') => void;
}

export const Header = ({ members, onCardClick }: HeaderProps) => {
  const [logoUrl, setLogoUrl] = useLocalStorage<string>('church-logo', '');
  const [churchName, setChurchName] = useLocalStorage<string>('church-name', 'Dashboard de Membros');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(churchName);

  const activeMembers = members.filter(m => m.status === 'ativo');

  // ✅ Todos os cálculos necessários estão aqui
  const stats = {
    totalMembros: members.length,
    ativos: activeMembers.length,
    desligados: members.length - activeMembers.length,
    homens: activeMembers.filter(m => m.sexo === 'M').length,
    mulheres: activeMembers.filter(m => m.sexo === 'F').length,
    batizados: members.filter(m => m.batizado).length,
  };
  const naoBatizados = stats.totalMembros - stats.batizados;

  const handleNameSave = () => {
    setChurchName(tempName);
    setIsEditingName(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setLogoUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Card className="rounded-xl shadow-md p-4 bg-card">
      <div className="flex items-center justify-between gap-4">
        {/* Logo e Nome da Igreja */}
        <div className="flex items-center gap-4">
          <div className="relative group flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <Church className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <label htmlFor="logo-upload" className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload className="h-4 w-4 text-white" />
              <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input value={tempName} onChange={(e) => setTempName(e.target.value)} className="text-2xl font-bold" onKeyDown={(e) => e.key === 'Enter' && handleNameSave()} />
                <Button size="icon" onClick={handleNameSave}><Check className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h1 className="text-2xl font-bold text-foreground">{churchName}</h1>
                <Button size="icon" variant="ghost" className="opacity-0 group-hover/title:opacity-100 transition-opacity" onClick={() => setIsEditingName(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">Visão geral do corpo de membros</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="flex items-center justify-end gap-3">
          {/* Card de Batismo */}
          <Card className="min-w-[180px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status de Batismo</CardTitle>
              <Heart className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.batizados}</div>
                <p className="text-xs text-muted-foreground">Batizados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{naoBatizados}</div>
                <p className="text-xs text-muted-foreground">Não Batizados</p>
              </div>
            </CardContent>
          </Card>
        
          {/* Card de Gênero */}
          <Card className="min-w-[180px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gênero (Ativos)</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-500">{stats.homens}</div>
                <p className="text-xs text-muted-foreground">Homens</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">{stats.mulheres}</div>
                <p className="text-xs text-muted-foreground">Mulheres</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="border-l h-16 border-border mx-1"></div>

          {/* Cards de Status */}
          <Card onClick={() => onCardClick(undefined)} className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[120px] text-center">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.totalMembros}</div></CardContent>
          </Card>
          <Card onClick={() => onCardClick('ativo')} className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[120px] text-center">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-green-600">Ativos</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-green-600">{stats.ativos}</div></CardContent>
          </Card>
          <Card onClick={() => onCardClick('desligado')} className="cursor-pointer hover:bg-muted/50 transition-colors min-w-[120px] text-center">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-red-600">Desligados</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-red-600">{stats.desligados}</div></CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
};