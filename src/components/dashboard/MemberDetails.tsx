import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types/member';
import { calculateAge, formatStatus, getStatusColor } from '@/utils/memberUtils';
import { User, Phone, MapPin, Calendar, Users, GraduationCap, Heart, Crown } from 'lucide-react';

interface MemberDetailsProps {
  member: Member;
}

export const MemberDetails = ({ member }: MemberDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {member.nomeCompleto || member.nome}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informações Pessoais */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Informações Pessoais
            </h4>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {calculateAge(member.dataNascimento)} anos
                {member.faixaEtaria && (
                  <Badge variant="outline" className="ml-2">
                    {member.faixaEtaria}
                  </Badge>
                )}
              </span>
            </div>
            
            {member.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.telefone}</span>
              </div>
            )}
            
            {member.statusCivil && (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.statusCivil}</span>
                {member.conjuge && (
                  <span className="text-xs text-muted-foreground">({member.conjuge})</span>
                )}
              </div>
            )}
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Endereço
            </h4>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="text-sm">
                <div>{member.endereco}</div>
                <div>{member.bairro}, {member.cidade}</div>
                {member.estado && <div>{member.estado} - {member.cep}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Status e Funções */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Status e Funções
          </h4>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              style={{ color: getStatusColor(member.status) }}
            >
              {formatStatus(member.status)}
            </Badge>
            
            {member.batizado && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Batizado
              </Badge>
            )}
            
            {member.membro && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Users className="h-3 w-3 mr-1" />
                Membro
              </Badge>
            )}
            
            {member.lider && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Crown className="h-3 w-3 mr-1" />
                Líder
              </Badge>
            )}
            
            {member.professorEBQ && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <GraduationCap className="h-3 w-3 mr-1" />
                Professor EBQ
              </Badge>
            )}
          </div>
        </div>

        {/* Pequeno Grupo */}
        {member.pequeno_grupo && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Pequeno Grupo
            </h4>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {member.grupo || 'Sem grupo definido'}
              </span>
            </div>
          </div>
        )}

        {/* Observações */}
        {member.observacoes && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Observações
            </h4>
            <p className="text-sm text-muted-foreground">{member.observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};