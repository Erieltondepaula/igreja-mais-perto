import { useState, useMemo } from 'react';<<<<<<< HEAD

import { Member } from '@/types/member';// Local do arquivo: src/components/dashboard/MemberList.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';import { useState } from 'react';

import { Badge } from '@/components/ui/badge';import { Member } from '@/types/member';

import { Button } from '@/components/ui/button';=======

import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';import { useState, useMemo } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';import { Member, MemberFilters } from '@/types/member';

import { MemberDetails } from './MemberDetails';>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

import { MemberEdit } from './MemberEdit';import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { calculateAge, getMemberType } from '@/utils/memberUtils';import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

interface MemberListProps {import { Button } from '@/components/ui/button';

  members: Member[];<<<<<<< HEAD

  onMemberUpdate: (member: Member) => void;import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Edit, RefreshCw } from 'lucide-react';

}=======

import { Checkbox } from '@/components/ui/checkbox';

export const MemberList = ({ members, onMemberUpdate }: MemberListProps) => {import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

  const [editingMember, setEditingMember] = useState<Member | null>(null);import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);import { MemberDetails } from './MemberDetails';

  const [isEditOpen, setIsEditOpen] = useState(false);import { MemberEdit } from './MemberEdit';

  const [sortField, setSortField] = useState<string | null>('nome');import { calculateAge, getMemberType } from '@/utils/memberUtils';

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

<<<<<<< HEAD

  const handleSort = (field: string) => {// ✅ NOVAS PROPRIEDADES PARA RECEBER O ESTADO DA ORDENAÇÃO

    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';interface MemberListProps {

    setSortField(field);  members: Member[];

    setSortDirection(newDirection);  onMemberUpdate: (member: Member) => void;

  };  onRefresh: () => void;

  sortField: keyof Member | 'idade' | 'tipo' | null;

  const sortedMembers = useMemo(() => {  sortDirection: 'asc' | 'desc';

    if (!sortField) return members;  onSort: (field: keyof Member | 'idade' | 'tipo') => void;

}

    return [...members].sort((a, b) => {

      const aValue = a[sortField as keyof Member] || '';const MemberTypeBadge = ({ type }: { type: string }) => {

      const bValue = b[sortField as keyof Member] || '';  const getVariantClass = () => {

    switch (type) {

      if (sortField === 'idade') {      case 'Membro':

        const ageA = calculateAge(a.dataNascimento);        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';

        const ageB = calculateAge(b.dataNascimento);      case 'Batizado Congregado':

        return sortDirection === 'asc' ? ageA - ageB : ageB - ageA;        return 'text-blue-600 font-semibold';

      }      case 'Congregado':

              return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';

      if (typeof aValue === 'string' && typeof bValue === 'string') {      case 'Desligado':

        return sortDirection === 'asc'         return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';

          ? aValue.localeCompare(bValue)       default:

          : bValue.localeCompare(aValue);        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';

      }    }

  };

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;

      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;  if (type === 'Batizado Congregado') {

      return 0;    return <span className={getVariantClass()}>{type}</span>

    });  }

  }, [members, sortField, sortDirection]);  

  return <Badge className={getVariantClass()}>{type}</Badge>;

  const getSortIcon = (field: string) => {};

    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;

    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;export const MemberList = ({ members, onMemberUpdate, onRefresh, sortField, sortDirection, onSort }: MemberListProps) => {

  };=======

  interface MemberListProps {

  const handleViewDetails = (member: Member) => {  members: Member[];

    setSelectedMember(member);  filters: MemberFilters;

    setIsDetailsOpen(true);  onMemberUpdate: (member: Member) => void;

  };}

  

  const handleSaveEdit = (updatedMember: Member) => {export const MemberList = ({ members, filters, onMemberUpdate }: MemberListProps) => {

    onMemberUpdate(updatedMember);>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

    setIsEditOpen(false);  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    setEditingMember(null);  const [editingMember, setEditingMember] = useState<Member | null>(null);

  };  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  return (<<<<<<< HEAD

    <Card className="rounded-xl shadow-md">

      <CardHeader>  // ❌ LÓGICA DE ORDENAÇÃO E ESTADO REMOVIDOS DESTE COMPONENTE

        <div className="flex justify-between items-center">=======

          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

            Lista de Membros ({sortedMembers.length})  const [sortField, setSortField] = useState<string | null>('nome');

          </CardTitle>  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

        </div>

      </CardHeader>  const handleSort = (field: string) => {

      <CardContent>    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

        <div className="overflow-x-auto">    setSortField(field);

          <Table>    setSortDirection(newDirection);

            <TableHeader>  };

              <TableRow>

                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('nome')}>  const sortedMembers = useMemo(() => {

                  <div className="flex items-center gap-1">Nome {getSortIcon('nome')}</div>    if (!sortField) return members;

                </TableHead>

                <TableHead>Data de Nascimento</TableHead>    return [...members].sort((a, b) => {

                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('idade')}>      const aValue = a[sortField as keyof Member] || '';

                  <div className="flex items-center gap-1">Idade {getSortIcon('idade')}</div>      const bValue = b[sortField as keyof Member] || '';

                </TableHead>

                <TableHead>Tipo</TableHead>      if (sortField === 'idade') {

                <TableHead>Status</TableHead>        const ageA = calculateAge(a.dataNascimento);

                <TableHead>Ações</TableHead>        const ageB = calculateAge(b.dataNascimento);

              </TableRow>        return sortDirection === 'asc' ? ageA - ageB : ageB - ageA;

            </TableHeader>      }

            <TableBody>      

              {sortedMembers.map(member => (      if (typeof aValue === 'string' && typeof bValue === 'string') {

                <TableRow key={member.id}>        return sortDirection === 'asc' 

                  <TableCell className="font-medium">{member.nome || 'N/A'}</TableCell>          ? aValue.localeCompare(bValue) 

                  <TableCell>{member.dataNascimento ? new Date(member.dataNascimento + 'T00:00:00Z').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</TableCell>          : bValue.localeCompare(aValue);

                  <TableCell>{calculateAge(member.dataNascimento)} anos</TableCell>      }

                  <TableCell>

                    <Badge variant="outline">{getMemberType(member)}</Badge>      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;

                  </TableCell>      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

                  <TableCell>      return 0;

                    <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>    });

                      {member.status === 'ativo' ? 'Ativo' : 'Desligado'}  }, [members, sortField, sortDirection]);

                    </Badge>>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

                  </TableCell>

                  <TableCell>  const getSortIcon = (field: string) => {

                    <div className="flex gap-2">    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;

                      <Button    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;

                        variant="ghost"  };

                        size="icon"<<<<<<< HEAD

                        onClick={() => handleViewDetails(member)}=======

                        className="rounded-full h-8 w-8"

                      >  const handleSelectAll = (checked: boolean) => {

                        <Eye className="h-4 w-4" />    setSelectedMembers(checked ? sortedMembers.map(m => m.id) : []);

                      </Button>  };

                    </div>

                  </TableCell>  const handleSelectMember = (memberId: string, checked: boolean) => {

                </TableRow>    setSelectedMembers(prev => 

              ))}      checked ? [...prev, memberId] : prev.filter(id => id !== memberId)

            </TableBody>    );

          </Table>  };

        </div>>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

  

        {sortedMembers.length === 0 && (  const handleViewDetails = (member: Member) => {

          <div className="text-center py-8 text-muted-foreground">    setSelectedMember(member);

            Nenhum membro encontrado com os filtros aplicados.    setIsDetailsOpen(true);

          </div>  };

        )}<<<<<<< HEAD



        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>  const handleEditClick = (member: Member) => {

          <DialogContent className="max-w-3xl rounded-xl shadow-md">    setEditingMember(member);

            <DialogHeader>    setIsEditOpen(true);

              <DialogTitle>Detalhes do Membro</DialogTitle>  };

            </DialogHeader>=======

            {selectedMember && <MemberDetails member={selectedMember} onMemberUpdate={onMemberUpdate} />}>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

          </DialogContent>  

        </Dialog>  const handleSaveEdit = (updatedMember: Member) => {

    onMemberUpdate(updatedMember);

        <MemberEdit    setIsEditOpen(false);

          member={editingMember}<<<<<<< HEAD

          isOpen={isEditOpen}    setEditingMember(null);

          onClose={() => setIsEditOpen(false)}=======

          onSave={handleSaveEdit}>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a

        />  };

      </CardContent>

    </Card>  return (

  );    <Card className="rounded-xl shadow-md">

};      <CardHeader>

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