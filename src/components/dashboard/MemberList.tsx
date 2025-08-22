import { useState, useMemo } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { calculateAge, getMemberType } from '@/utils/memberUtils';

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
  const [sortField, setSortField] = useState<string | null>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedMembers = useMemo(() => {
    if (!sortField) return members;

    return [...members].sort((a, b) => {
      const aValue = a[sortField as keyof Member] || '';
      const bValue = b[sortField as keyof Member] || '';

      if (sortField === 'idade') {
        const ageA = calculateAge(a.dataNascimento);
        const ageB = calculateAge(b.dataNascimento);
        return sortDirection === 'asc' ? ageA - ageB : ageB - ageA;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, sortField, sortDirection]);

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMembers(checked ? sortedMembers.map(m => m.id) : []);
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    setSelectedMembers(prev => 
      checked ? [...prev, memberId] : prev.filter(id => id !== memberId)
    );
  };
  
  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setIsDetailsOpen(true);
  };
  
  const handleSaveEdit = (updatedMember: Member) => {
    onMemberUpdate(updatedMember);
    setIsEditOpen(false);
  };

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            Lista de Membros ({sortedMembers.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedMembers.length === sortedMembers.length && sortedMembers.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('nome')}>
                  <div className="flex items-center gap-1">Nome {getSortIcon('nome')}</div>
                </TableHead>
                 <TableHead>Data de Nascimento</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('idade')}>
                  <div className="flex items-center gap-1">Idade {getSortIcon('idade')}</div>
                </TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map(member => (
                <TableRow 
                  key={member.id}
                  // ** AQUI ESTÁ A MUDANÇA **
                  className={calculateAge(member.dataNascimento) < 0 ? 'bg-red-100 dark:bg-red-900/30' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={checked => handleSelectMember(member.id, Boolean(checked))}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{member.nome || 'N/A'}</TableCell>
                  <TableCell>{member.dataNascimento ? new Date(member.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</TableCell>
                  <TableCell>{calculateAge(member.dataNascimento) || 'N/A'} anos</TableCell>
                  <TableCell>
                     <Badge variant="outline">{getMemberType(member)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>
                      {member.status === 'ativo' ? 'Ativo' : 'Desligado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(member)}
                        className="rounded-full h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
                Nenhum membro encontrado com os filtros atuais.
            </div>
        )}

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl rounded-xl shadow-md">
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
          onSave={handleSaveEdit}
        />
      </CardContent>
    </Card>
  );
};