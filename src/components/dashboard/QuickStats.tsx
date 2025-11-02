import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
import { Users, UserCheck, Crown, GraduationCap } from 'lucide-react';
=======
import { Users, UserCheck, GraduationCap } from 'lucide-react';
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import { calculateAge } from '@/utils/memberUtils';

interface QuickStatsProps {
  members: Member[];
}

export const QuickStats = ({ members }: QuickStatsProps) => {
<<<<<<< HEAD
  // **CORREÇÃO: Todos os cálculos agora são baseados apenas nos membros ativos**
  const activeMembers = members.filter(m => m.status === 'ativo');

  const totalMembers = members.length;
  const activeMembersCount = activeMembers.length;
  const inactiveMembersCount = totalMembers - activeMembersCount;

  const baptizedMembers = activeMembers.filter(m => m.batizado).length;
  const membersWithRole = activeMembers.filter(m => m.lider || m.professorEBQ).length;
  
  const men = activeMembers.filter(m => m.sexo === 'M').length;
  const women = activeMembers.filter(m => m.sexo === 'F').length;

  const infancia = activeMembers.filter(m => calculateAge(m.dataNascimento) <= 6).length;
  const criancas = activeMembers.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 7 && age <= 10; }).length;
  const adolescentes = activeMembers.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 11 && age <= 17; }).length;
  const jovens = activeMembers.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 18 && age <= 35; }).length;
  const adultos = activeMembers.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 36 && age <= 59; }).length;
  const idosos = activeMembers.filter(m => calculateAge(m.dataNascimento) >= 60).length;

  const baptizedPercentage = activeMembersCount > 0 ? Math.round((baptizedMembers / activeMembersCount) * 100) : 0;
  const activePercentage = totalMembers > 0 ? Math.round((activeMembersCount / totalMembers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
=======
  const totalMembers = members.length;
  const activeMembersCount = members.filter(m => m.status === 'ativo').length;
  const inactiveMembersCount = totalMembers - activeMembersCount;
  
  const men = members.filter(m => m.sexo === 'M').length;
  const women = members.filter(m => m.sexo === 'F').length;

  const infancia = members.filter(m => calculateAge(m.dataNascimento) <= 6).length;
  const criancas = members.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 7 && age <= 10; }).length;
  const adolescentes = members.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 11 && age <= 17; }).length;
  const jovens = members.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 18 && age <= 35; }).length;
  const adultos = members.filter(m => { const age = calculateAge(m.dataNascimento); return age >= 36 && age <= 59; }).length;
  const idosos = members.filter(m => calculateAge(m.dataNascimento) >= 60).length;

  const activePercentage = totalMembers > 0 ? Math.round((activeMembersCount / totalMembers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"> {/* Ajustado para 2 colunas */}
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
<<<<<<< HEAD
          <p className="text-xs text-muted-foreground">
            {activeMembersCount} ativos e {inactiveMembersCount} desligados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gênero (Ativos)</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeMembersCount}</div>
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs"> 👨 {men} Homens </Badge>
            <Badge variant="outline" className="text-xs"> 👩 {women} Mulheres </Badge>
          </div>
        </CardContent>
      </Card>
<<<<<<< HEAD
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Batismos (Ativos)</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{baptizedPercentage}%</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-blue-500"> 🔵 {baptizedMembers} Batizados </Badge>
            <Badge variant="outline" className="text-xs"> ⚫ {activeMembersCount - baptizedMembers} Não Batizados </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Funções (Ativos)</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{membersWithRole}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-purple-500"> 👑 {membersWithRole} Com Função </Badge>
            <Badge variant="outline" className="text-xs"> 👤 {activeMembersCount - membersWithRole} Sem Função </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Distribuição por Faixa Etária (Ativos)
=======

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status dos Membros</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activePercentage}% Ativos</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-green-500"> 🟢 {activeMembersCount} Ativos </Badge>
            <Badge variant="secondary" className="text-xs"> ⚪ {inactiveMembersCount} Desligados </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Cards de Batismo e Funções foram removidos */}

      <Card className="md:col-span-2 lg:col-span-2"> {/* Ajustado para ocupar 2 colunas */}
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Distribuição por Faixa Etária (Total)
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center"><div className="text-lg font-bold">{infancia}</div><div className="text-xs text-muted-foreground">Infância (0-6)</div></div>
            <div className="text-center"><div className="text-lg font-bold">{criancas}</div><div className="text-xs text-muted-foreground">Crianças (7-10)</div></div>
            <div className="text-center"><div className="text-lg font-bold">{adolescentes}</div><div className="text-xs text-muted-foreground">Adolescentes (11-17)</div></div>
            <div className="text-center"><div className="text-lg font-bold">{jovens}</div><div className="text-xs text-muted-foreground">Jovens (18-35)</div></div>
            <div className="text-center"><div className="text-lg font-bold">{adultos}</div><div className="text-xs text-muted-foreground">Adultos (36-59)</div></div>
            <div className="text-center"><div className="text-lg font-bold">{idosos}</div><div className="text-xs text-muted-foreground">Idosos (60+)</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};