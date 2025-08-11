import { useState } from 'react';
import { Member } from '@/types/member';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Phone, Mail, User, Heart, Award, Upload, Users, GraduationCap, Crown } from 'lucide-react';
import { calculateAge, formatStatus, getStatusColor } from '@/utils/memberUtils';

interface MemberDetailsProps {
  member: Member;
  onMemberUpdate?: (member: Member) => void;
}

export const MemberDetails = ({ member, onMemberUpdate }: MemberDetailsProps) => {
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member>(member);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onMemberUpdate) return;

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isEditing) {
        setEditedMember(prev => ({
          ...prev,
          photoUrl: result
        }));
        setPhotoFile(file);
      } else {
        const updatedMember = { ...member, photoUrl: result, updatedAt: new Date().toISOString() };
        onMemberUpdate(updatedMember);
      }
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (onMemberUpdate) {
      onMemberUpdate({ ...editedMember, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setEditedMember(member);
    setIsEditing(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Informações pessoais */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt="Foto do Membro"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              {onMemberUpdate && (
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 text-white" />
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{member.nome}</h3>
              {member.nomeCompleto && (
                <p className="text-sm text-muted-foreground">{member.nomeCompleto}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Informações Pessoais
            </h4>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(member.dataNascimento).toLocaleDateString('pt-BR')} - {calculateAge(member.dataNascimento)} anos
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

            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
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
        </CardContent>
      </Card>

      {/* Endereço e Status */}
      <Card className="rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="space-y-4">
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

            {/* Status e Funções */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Status e Funções
              </h4>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  style={{ color: getStatusColor(member.status) }}
                  className="rounded-xl"
                >
                  {member.status === 'ativo' ? '🟢 Ativo' : '⚪ Desligado'}
                </Badge>
                
                {member.batizado && (
                  <Badge variant="secondary" className="bg-info/10 text-info rounded-xl">
                    🔵 Batizado
                  </Badge>
                )}
                
                {member.membro && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary rounded-xl">
                    <Users className="h-3 w-3 mr-1" />
                    🔷 Membro
                  </Badge>
                )}
                
                {member.lider && (
                  <Badge variant="secondary" className="bg-warning/10 text-warning-foreground rounded-xl">
                    <Crown className="h-3 w-3 mr-1" />
                    Líder
                  </Badge>
                )}
                
                {member.professorEBQ && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground rounded-xl">
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

            {/* Action Buttons */}
            {onMemberUpdate && (
              <div className="flex gap-2 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                      Salvar
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="rounded-xl">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl">
                    Alterar
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};