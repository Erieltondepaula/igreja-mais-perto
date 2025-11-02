<<<<<<< HEAD
// Local do arquivo: components/dashboard/MemberEdit.tsx

import { useEffect } from 'react';
import { Member } from '@/types/member';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { memberSchema } from '@/lib/validations/member';
=======
import { useState, useEffect } from 'react';
import { Member } from '@/types/member';
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

interface MemberEditProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
}

<<<<<<< HEAD
// O tipo de dados do formulário é inferido a partir do schema
type MemberFormData = z.infer<typeof memberSchema>;

export const MemberEdit = ({ member, isOpen, onClose, onSave }: MemberEditProps) => {
  const { toast } = useToast();

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    // Carrega os valores padrão do membro quando o formulário é aberto
    defaultValues: member || {},
  });

  // Atualiza os valores do formulário se o membro selecionado mudar
  useEffect(() => {
    if (member) {
      form.reset(member);
    }
  }, [member, form]);

  if (!member) return null;

  const handleSave = (data: MemberFormData) => {
    const updatedMember = {
      ...member,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedMember);
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
    toast({
      title: "Membro atualizado",
      description: "Os dados do membro foram atualizados com sucesso."
    });
    onClose();
  };
<<<<<<< HEAD
  
  const status = form.watch('status');
  const isMembro = form.watch('membro');
  const isDesligado = status === 'desligado';
=======

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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-md">
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
        </DialogHeader>
<<<<<<< HEAD
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">

            {/* Campo para foto/avatar com upload */}
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto/Avatar</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        {typeof field.value === 'string' && field.value ? (
                          <img
                            src={field.value}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                            <span className="text-xs">Selecionar</span>
                          </div>
                        )}
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('avatar', file);
                          try {
                            const res = await fetch('/api/upload-avatar', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.avatar_url) {
                              field.onChange(data.avatar_url);
                            }
                          } catch (err) {
                            // TODO: feedback de erro
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nomeCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="endereco" render={({ field }) => (<FormItem><FormLabel>Endereço</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="bairro" render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="cidade" render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="cep" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />

             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="desligado">Desligado</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField control={form.control} name="statusCivil" render={({ field }) => (<FormItem><FormLabel>Status Civil</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            
            <div className="md:col-span-2">
                <FormField control={form.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Digite observações..." /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {!isDesligado && (
              <>
                <FormField
                  control={form.control}
                  name="membro"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Membro</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="batizado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Batizado</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isMembro} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lider"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Líder</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="professorEBQ"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Professor EBQ</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
=======

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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
