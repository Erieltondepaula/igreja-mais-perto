import { useState, useEffect } from 'react';
import { Member } from '@/types/member';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemberEditProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
}

export const MemberEdit = ({ member, isOpen, onClose, onSave }: MemberEditProps) => {
  const [editedMember, setEditedMember] = useState<Member | null>(member);
  const { toast } = useToast();

  // Sincroniza editedMember se prop member mudar
  useEffect(() => {
    setEditedMember(member);
  }, [member]);

  if (!member || !editedMember) return null;

  const handleSave = () => {
    onSave({ ...editedMember, updatedAt: new Date().toISOString() });
    toast({
      title: "Membro atualizado",
      description: "Os dados do membro foram atualizados com sucesso."
    });
    onClose();
  };

  const updateField = (field: keyof Member, value: unknown) => {
    setEditedMember(prev => {
      if (!prev) return null;
      let updated = { ...prev, [field]: value };

      // Se alterar status para 'desligado', limpar vínculos automaticamente
      if (field === 'status' && value === 'desligado') {
        updated = {
          ...updated,
          membro: false,
          batizado: false,
          lider: false,
          professorEBQ: false,
        };
      }

      // Se desmarcar 'membro', batizado deve ser falso automaticamente
      if (field === 'membro' && value === false) {
        updated.batizado = false;
      }

      return updated;
    });
  };

  const isDesligado = editedMember.status === 'desligado';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-md">
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="photo">Foto do Membro</Label>
            <div className="flex items-center gap-4">
              {editedMember.photoUrl ? (
                <img
                  src={editedMember.photoUrl}
                  alt="Foto do Membro"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event: ProgressEvent<FileReader>) => {
                      const result = event.target?.result as string;
                      updateField('photoUrl', result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={editedMember.nome}
              onChange={(e) => updateField('nome', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nomeCompleto">Nome Completo</Label>
            <Input
              id="nomeCompleto"
              value={editedMember.nomeCompleto || ''}
              onChange={(e) => updateField('nomeCompleto', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={editedMember.dataNascimento || ''}
              onChange={(e) => updateField('dataNascimento', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sexo">Sexo</Label>
            <Select value={editedMember.sexo || ''} onValueChange={(value) => updateField('sexo', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={editedMember.telefone || ''}
              onChange={(e) => updateField('telefone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editedMember.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={editedMember.endereco || ''}
              onChange={(e) => updateField('endereco', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              value={editedMember.bairro || ''}
              onChange={(e) => updateField('bairro', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={editedMember.cidade || ''}
              onChange={(e) => updateField('cidade', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={editedMember.cep || ''}
              onChange={(e) => updateField('cep', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={editedMember.status || ''} onValueChange={(value) => updateField('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="batizado">Batizado</SelectItem>
                <SelectItem value="membro">Membro</SelectItem>
                <SelectItem value="desligado">Desligado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="statusCivil">Status Civil</Label>
            <Input
              id="statusCivil"
              value={editedMember.statusCivil || ''}
              onChange={(e) => updateField('statusCivil', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={editedMember.observacoes || ''}
              onChange={(e) => updateField('observacoes', e.target.value)}
              placeholder="Digite observações sobre o membro..."
            />
          </div>

          {!isDesligado && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="membro"
                  checked={editedMember.membro || false}
                  onCheckedChange={(checked) => updateField('membro', checked)}
                />
                <Label htmlFor="membro">Membro</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="batizado"
                  checked={editedMember.batizado || false}
                  onCheckedChange={(checked) => updateField('batizado', checked)}
                  disabled={!editedMember.membro}
                />
                <Label htmlFor="batizado">Batizado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lider"
                  checked={editedMember.lider || false}
                  onCheckedChange={(checked) => updateField('lider', checked)}
                />
                <Label htmlFor="lider">Líder</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="professorEBQ"
                  checked={editedMember.professorEBQ || false}
                  onCheckedChange={(checked) => updateField('professorEBQ', checked)}
                />
                <Label htmlFor="professorEBQ">Professor EBQ</Label>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
