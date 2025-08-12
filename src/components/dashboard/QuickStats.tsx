import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Crown, GraduationCap } from 'lucide-react';
import { calculateAge } from '@/utils/memberUtils';

interface QuickStatsProps {
  members: Member[];
}

export const QuickStats = ({ members }: QuickStatsProps) => {
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status !== 'desligado').length;
  const inactiveMembers = members.filter(m => m.status === 'desligado').length;
  const baptizedMembers = members.filter(m => m.batizado).length;
  const notBaptizedMembers = members.filter(m => !m.batizado).length;
  const membersWithRole = members.filter(m => m.lider || m.professorEBQ).length;
  const membersWithoutRole = members.filter(m => !m.lider && !m.professorEBQ).length;
  
  const men = members.filter(m => m.sexo === 'M').length;
  const women = members.filter(m => m.sexo === 'F').length;
  
  const children = members.filter(m => {
    const age = calculateAge(m.dataNascimento);
    return age >= 0 && age <= 12;
  }).length;
  
  const youth = members.filter(m => {
    const age = calculateAge(m.dataNascimento);
    return age >= 13 && age <= 17;
  }).length;
  
  const adults = members.filter(m => {
    const age = calculateAge(m.dataNascimento);
    return age >= 18 && age <= 59;
  }).length;
  
  const elderly = members.filter(m => {
    const age = calculateAge(m.dataNascimento);
    return age >= 60;
  }).length;

  const baptizedPercentage = totalMembers > 0 ? Math.round((baptizedMembers / totalMembers) * 100) : 0;
  const activePercentage = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Membros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              👨 {men} Homens
            </Badge>
            <Badge variant="outline" className="text-xs">
              👩 {women} Mulheres
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Status Ativo/Desligado */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status dos Membros</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activePercentage}% Ativos</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-green-500">
              🟢 {activeMembers} Ativos
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ⚪ {inactiveMembers} Desligados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Batizados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Situação Batismal</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{baptizedPercentage}% Batizados</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-blue-500">
              🔵 {baptizedMembers} Batizados
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⚫ {notBaptizedMembers} Não Batizados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Funções */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Funções na Igreja</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{membersWithRole}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-purple-500">
              👑 {membersWithRole} Com Função
            </Badge>
            <Badge variant="outline" className="text-xs">
              👤 {membersWithoutRole} Sem Função
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faixas Etárias */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Distribuição por Faixa Etária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{children}</div>
              <div className="text-xs text-muted-foreground">👶 Crianças (0-12)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{youth}</div>
              <div className="text-xs text-muted-foreground">🧑 Jovens (13-17)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{adults}</div>
              <div className="text-xs text-muted-foreground">👨 Adultos (18-59)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">{elderly}</div>
              <div className="text-xs text-muted-foreground">👴 Idosos (60+)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};