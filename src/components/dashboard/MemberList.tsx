import { useState } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit, Download, Users, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { getStatusColor } from '@/utils/memberUtils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface MemberListProps {
  members: Member[];
  filters: MemberFilters;
  onMemberUpdate: (member: Member) => void;
}

export const MemberList = ({ members, filters, onMemberUpdate }: MemberListProps) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(members.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const exportToExcel = (exportSelected = false) => {
    const membersToExport = exportSelected 
      ? members.filter(m => selectedMembers.includes(m.id))
      : members;

    const exportData = membersToExport.map(member => ({
      Nome: member.nome,
      'Nome Completo': member.nomeCompleto || '',
      'Data de Nascimento': member.dataNascimento,
      Idade: member.idade || '',
      Sexo: member.sexo === 'M' ? 'Masculino' : 'Feminino',
      Telefone: member.telefone,
      Email: member.email,
      Endereço: member.endereco,
      Bairro: member.bairro,
      Cidade: member.cidade,
      CEP: member.cep,
      Status: member.status,
      'Status Civil': member.statusCivil || '',
      Batizado: member.batizado ? 'Sim' : 'Não',
      Membro: member.membro ? 'Sim' : 'Não',
      Líder: member.lider ? 'Sim' : 'Não',
      'Professor EBQ': member.professorEBQ ? 'Sim' : 'Não'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Membros');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    const filename = exportSelected 
      ? `membros_selecionados_${selectedMembers.length}.xlsx`
      : 'membros.xlsx';
    
    saveAs(data, filename);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return '🟢';
      case 'desligado': return '⚪';
      case 'batizado': return '🔵';
      case 'membro': return '🔷';
      default: return '🟡';
    }
  };

  const getTipoMembroIcon = (member: Member) => {
    if (member.batizado) return '🔵';
    if (member.membro) return '🔷';
    return '🟡'; // Congregado
  };

  const getTipoMembroText = (member: Member) => {
    if (member.batizado) return 'Batizado';
    if (member.membro) return 'Membro';
    return 'Congregado';
  };



  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users className="h-5 w-5" />
            Lista de Membros ({members.length})
            {selectedMembers.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({selectedMembers.length} selecionados)
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {selectedMembers.length > 0 && (
              <Button onClick={() => exportToExcel(true)} variant="outline" size="sm" className="rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Exportar Selecionados ({selectedMembers.length})
              </Button>
            )}
            <Button onClick={() => exportToExcel(false)} variant="outline" size="sm" className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedMembers.length === members.length && members.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Funções</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{member.nome}</TableCell>
                <TableCell>{member.idade || 'N/A'}</TableCell>
                <TableCell>{member.sexo === 'M' ? 'Masculino' : 'Feminino'}</TableCell>
                <TableCell>{member.telefone}</TableCell>
                <TableCell>{member.bairro}</TableCell>
                <TableCell>
                  <Badge 
                    variant={member.status === 'ativo' ? 'default' : 'destructive'}
                    className="text-white"
                  >
                    {getStatusIcon(member.status)} {member.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="text-white"
                    style={{ 
                      backgroundColor: member.batizado ? '#3b82f6' : member.membro ? '#1e40af' : '#eab308'
                    }}
                  >
                    {getTipoMembroIcon(member)} {getTipoMembroText(member)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {member.lider && (
                      <Badge variant="outline" className="text-xs">
                        Líder
                      </Badge>
                    )}
                    {member.professorEBQ && (
                      <Badge variant="outline" className="text-xs">
                        Prof. EBQ
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMember(member);
                        setIsDetailsOpen(true);
                      }}
                      className="rounded-xl hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingMember(member);
                        setIsEditOpen(true);
                      }}
                      className="rounded-xl hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl rounded-xl shadow-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Membro</DialogTitle>
            </DialogHeader>
            {selectedMember && <MemberDetails member={selectedMember} onMemberUpdate={onMemberUpdate} />}
          </DialogContent>
        </Dialog>

        <MemberEdit
          member={editingMember}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onMemberUpdate}
        />
      </CardContent>
    </Card>
  );
};