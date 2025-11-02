<<<<<<< HEAD
// Local do arquivo: src/components/dashboard/MemberList.tsx

import { useState } from 'react';
import { Member } from '@/types/member';
=======
import { useState, useMemo } from 'react';
import { Member, MemberFilters } from '@/types/member';
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Edit, RefreshCw } from 'lucide-react';
=======
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { calculateAge, getMemberType } from '@/utils/memberUtils';

<<<<<<< HEAD
// ✅ NOVAS PROPRIEDADES PARA RECEBER O ESTADO DA ORDENAÇÃO
interface MemberListProps {
  members: Member[];
  onMemberUpdate: (member: Member) => void;
  onRefresh: () => void;
  sortField: keyof Member | 'idade' | 'tipo' | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Member | 'idade' | 'tipo') => void;
}

const MemberTypeBadge = ({ type }: { type: string }) => {
  const getVariantClass = () => {
    switch (type) {
      case 'Membro':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'Batizado Congregado':
        return 'text-blue-600 font-semibold';
      case 'Congregado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      case 'Desligado':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  if (type === 'Batizado Congregado') {
    return <span className={getVariantClass()}>{type}</span>
  }
  
  return <Badge className={getVariantClass()}>{type}</Badge>;
};

export const MemberList = ({ members, onMemberUpdate, onRefresh, sortField, sortDirection, onSort }: MemberListProps) => {
=======
interface MemberListProps {
  members: Member[];
  filters: MemberFilters;
  onMemberUpdate: (member: Member) => void;
}

export const MemberList = ({ members, filters, onMemberUpdate }: MemberListProps) => {
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
<<<<<<< HEAD

  // ❌ LÓGICA DE ORDENAÇÃO E ESTADO REMOVIDOS DESTE COMPONENTE
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
<<<<<<< HEAD
=======

  const handleSelectAll = (checked: boolean) => {
    setSelectedMembers(checked ? sortedMembers.map(m => m.id) : []);
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    setSelectedMembers(prev => 
      checked ? [...prev, memberId] : prev.filter(id => id !== memberId)
    );
  };
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  
  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setIsDetailsOpen(true);
  };
<<<<<<< HEAD

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setIsEditOpen(true);
  };
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  
  const handleSaveEdit = (updatedMember: Member) => {
    onMemberUpdate(updatedMember);
    setIsEditOpen(false);
<<<<<<< HEAD
    setEditingMember(null);
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  };

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
<<<<<<< HEAD
            {/* ✅ USA O NÚMERO DE MEMBROS DA LISTA JÁ ORDENADA */}
            Lista de Membros ({members.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className={'h-4 w-4 mr-2'} />
            Atualizar Lista
          </Button>
=======
            Lista de Membros ({sortedMembers.length})
          </CardTitle>
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
<<<<<<< HEAD
                 {/* ✅ CABEÇALHOS AGORA CHAMAM A FUNÇÃO 'onSort' DO COMPONENTE PAI */}
                <TableHead className="cursor-pointer" onClick={() => onSort('nome')}>
                  <div className="flex items-center gap-1">Nome {getSortIcon('nome')}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('dataNascimento')}>
                  <div className="flex items-center gap-1">Data de Nascimento {getSortIcon('dataNascimento')}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('idade')}>
                  <div className="flex items-center gap-1">Idade {getSortIcon('idade')}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('tipo')}>
                  <div className="flex items-center gap-1">Tipo {getSortIcon('tipo')}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('status')}>
                  <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ✅ MAPEIA A LISTA JÁ ORDENADA QUE VEIO DO COMPONENTE PAI */}
              {members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.nome}
                        className="w-8 h-8 rounded-full object-cover mr-2 inline-block"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 inline-block flex items-center justify-center text-gray-400">
                        <span className="text-xs">?</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.nome || 'N/A'}</TableCell>
                  <TableCell>{member.dataNascimento ? new Date(member.dataNascimento + 'T00:00:00Z').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</TableCell>
                  <TableCell>{calculateAge(member.dataNascimento)} anos</TableCell>
                  <TableCell><MemberTypeBadge type={getMemberType(member)} /></TableCell>
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
                  <TableCell>
                    <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>
                      {member.status === 'ativo' ? 'Ativo' : 'Desligado'}
                    </Badge>
                  </TableCell>
<<<<<<< HEAD
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(member)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(member)}><Edit className="h-4 w-4" /></Button>
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
<<<<<<< HEAD
        {members.length === 0 && (<div className="text-center py-8 text-muted-foreground">Nenhum membro encontrado com os filtros aplicados.</div>)}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>Detalhes do Membro</DialogTitle></DialogHeader>
            {selectedMember && <MemberDetails member={selectedMember} onMemberUpdate={onMemberUpdate} />}
          </DialogContent>
        </Dialog>
        <MemberEdit member={editingMember} isOpen={isEditOpen} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />
=======

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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
      </CardContent>
    </Card>
  );
};