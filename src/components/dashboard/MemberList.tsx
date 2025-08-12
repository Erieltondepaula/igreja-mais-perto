import { useState } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Download, Users, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { calculateAge, getMemberType } from '@/utils/memberUtils';
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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  type SortableValue = string | number | Date;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedMembers = () => {
    if (!sortField) return members;

    return [...members].sort((a, b) => {
      let aValue: SortableValue;
      let bValue: SortableValue;

      switch (sortField) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'idade':
          aValue = calculateAge(a.dataNascimento);
          bValue = calculateAge(b.dataNascimento);
          break;
        case 'sexo':
          aValue = a.sexo === 'M' ? 'Masculino' : 'Feminino';
          bValue = b.sexo === 'M' ? 'Masculino' : 'Feminino';
          break;
        case 'telefone':
          aValue = a.telefone || '';
          bValue = b.telefone || '';
          break;
        case 'bairro':
          aValue = a.bairro || '';
          bValue = b.bairro || '';
          break;
        case 'status':
          // Apenas considerar 'ativo' ou 'desligado', ignorar outros valores
          aValue = a.status === 'ativo' ? 'ativo' : 'desligado';
          bValue = b.status === 'ativo' ? 'ativo' : 'desligado';
          break;
        case 'tipo':
          // Ajustado para refletir que membro é sempre batizado
          aValue = getTipoMembroText(a);
          bValue = getTipoMembroText(b);
          break;
        case 'dataNascimento':
          aValue = a.dataNascimento ? new Date(a.dataNascimento) : new Date(0);
          bValue = b.dataNascimento ? new Date(b.dataNascimento) : new Date(0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedMembers = getSortedMembers();

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(sortedMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => (prev.includes(memberId) ? prev : [...prev, memberId]));
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const exportToExcel = (exportSelected = false) => {
    const membersToExport = exportSelected
      ? sortedMembers.filter(m => selectedMembers.includes(m.id))
      : sortedMembers;

    const exportData = membersToExport.map(member => ({
      Nome: member.nome,
      'Nome Completo': member.nomeCompleto || '',
      'Data de Nascimento': member.dataNascimento,
      Idade: calculateAge(member.dataNascimento),
      Sexo: member.sexo === 'M' ? 'Masculino' : 'Feminino',
      Telefone: member.telefone || '',
      Email: member.email || '',
      Endereço: member.endereco || '',
      Bairro: member.bairro || '',
      Cidade: member.cidade || '',
      CEP: member.cep || '',
      Status: member.status === 'ativo' ? 'Ativo' : 'Desligado',
      'Status Civil': member.statusCivil || '',
      Batizado: member.batizado ? 'Sim' : 'Não',
      // Removei 'Membro' pois é redundante com batizado
      Líder: member.lider ? 'Sim' : 'Não',
      'Professor EBQ': member.professorEBQ ? 'Sim' : 'Não',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Membros');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const filename = exportSelected ? `membros_selecionados_${selectedMembers.length}.xlsx` : 'membros.xlsx';

    saveAs(data, filename);
  };

  const getTipoMembroText = (member: Member) => {
    // Agora assume que membro sempre é batizado, só indicamos tipo conforme função
    if (member.status === 'desligado') return 'Desligado';
    if (member.lider) return 'Líder';
    if (member.professorEBQ) return 'Professor EBQ';
    return 'Membro';
  };

  const getTipoMembroIcon = (member: Member) => {
    if (member.status === 'desligado') return '⚪';
    if (member.lider) return '🔷';
    if (member.professorEBQ) return '📚';
    return '🔵';
  };

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users className="h-5 w-5" />
            Lista de Membros ({sortedMembers.length})
            {selectedMembers.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground"> ({selectedMembers.length} selecionados)</span>
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
                  checked={selectedMembers.length === sortedMembers.length && sortedMembers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('nome')}>
                <div className="flex items-center gap-1">Nome {getSortIcon('nome')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('dataNascimento')}>
                <div className="flex items-center gap-1">Data Nascimento {getSortIcon('dataNascimento')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('idade')}>
                <div className="flex items-center gap-1">Idade {getSortIcon('idade')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('sexo')}>
                <div className="flex items-center gap-1">Sexo {getSortIcon('sexo')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('telefone')}>
                <div className="flex items-center gap-1">Telefone {getSortIcon('telefone')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('bairro')}>
                <div className="flex items-center gap-1">Bairro {getSortIcon('bairro')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('tipo')}>
                <div className="flex items-center gap-1">Tipo {getSortIcon('tipo')}</div>
              </TableHead>
              <TableHead>Funções</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={checked => handleSelectMember(member.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{member.nome}</TableCell>
                <TableCell>{new Date(member.dataNascimento).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{calculateAge(member.dataNascimento)} anos</TableCell>
                <TableCell>{member.sexo === 'M' ? 'Masculino' : 'Feminino'}</TableCell>
                <TableCell>{member.telefone || ''}</TableCell>
                <TableCell>{member.bairro || ''}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === 'ativo' ? 'default' : 'destructive'}
                    className="text-white"
                  >
                    {member.status === 'ativo' ? '🟢 Ativo' : '⚪ Desligado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.status !== 'desligado' ? (
                    <Badge
                      variant="secondary"
                      className="text-white"
                      style={{
                        backgroundColor:
                          member.lider
                            ? '#1e40af' // azul escuro para líder
                            : member.professorEBQ
                            ? '#3b82f6' // azul claro para professor EBQ
                            : '#3b82f6', // padrão azul para membro
                      }}
                    >
                      {getTipoMembroIcon(member)} {getTipoMembroText(member)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs">
                      Desligado
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {member.status !== 'desligado' ? (
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
                  ) : (
                    <span className="text-muted-foreground text-xs italic">Nenhuma função</span>
                  )}
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
                    {/* Botão Edit removido */}
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
