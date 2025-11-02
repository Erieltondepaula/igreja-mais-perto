// Local do arquivo: src/components/dashboard/MemberList.tsx

import { useState, useMemo } from 'react';
import { Member } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Edit, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { calculateAge, getMemberType } from '@/utils/memberUtils';

const ITEMS_PER_PAGE = 50;

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
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Ordena membros alfabeticamente A-Z por padrão
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const nameA = (a.nome || '').toLowerCase();
      const nameB = (b.nome || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [members]);

  // Calcula total de páginas
  const totalPages = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE);

  // Pega membros da página atual
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedMembers.slice(startIndex, endIndex);
  }, [sortedMembers, currentPage]);

  // Reseta para página 1 quando total de páginas muda
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setIsEditOpen(true);
  };
  
  const handleSaveEdit = (updatedMember: Member) => {
    onMemberUpdate(updatedMember);
    setIsEditOpen(false);
    setEditingMember(null);
  };

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            Lista de Membros ({sortedMembers.length} registros) 
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">
                - Página {currentPage} de {totalPages}
              </span>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className={'h-4 w-4 mr-2'} />
            Atualizar Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
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
              {/* ✅ EXIBE APENAS OS MEMBROS DA PÁGINA ATUAL */}
              {paginatedMembers.map(member => (
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
                  <TableCell>
                    <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>
                      {member.status === 'ativo' ? 'Ativo' : 'Desligado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(member)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(member)}><Edit className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* ✅ CONTROLES DE PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, sortedMembers.length)} de {sortedMembers.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {members.length === 0 && (<div className="text-center py-8 text-muted-foreground">Nenhum membro encontrado com os filtros aplicados.</div>)}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>Detalhes do Membro</DialogTitle></DialogHeader>
            {selectedMember && <MemberDetails member={selectedMember} onMemberUpdate={onMemberUpdate} />}
          </DialogContent>
        </Dialog>
        <MemberEdit member={editingMember} isOpen={isEditOpen} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />
      </CardContent>
    </Card>
  );
};