// Local do arquivo: src/components/dashboard/MemberList.tsx

import { useState, useMemo } from 'react';
import { Member, MemberFilters } from '@/types/member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Edit, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { calculateAge, getMemberType } from '@/utils/memberUtils';
import { exportToPDF } from '@/utils/pdfUtils';

const ITEMS_PER_PAGE = 25;

// ✅ NOVAS PROPRIEDADES PARA RECEBER O ESTADO DA ORDENAÇÃO
interface MemberListProps {
  members: Member[];
  onMemberUpdate: (member: Member) => void;
  onRefresh: () => void;
  sortField: keyof Member | 'idade' | 'tipo' | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Member | 'idade' | 'tipo') => void;
  filters?: MemberFilters; // Adiciona filtros para o PDF
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

export const MemberList = ({ members, onMemberUpdate, onRefresh, sortField, sortDirection, onSort, filters = {} }: MemberListProps) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados para configuração do PDF
  const [isPdfConfigOpen, setIsPdfConfigOpen] = useState(false);
  const [showAge, setShowAge] = useState(true);
  const [showPhoto, setShowPhoto] = useState(true);
  const [showBirthdayWeekday, setShowBirthdayWeekday] = useState(true);
  const [showType, setShowType] = useState(true);

  // Abre o modal de configuração do PDF
  const handleOpenPdfConfig = () => {
    setIsPdfConfigOpen(true);
  };

  // Função para exportar PDF mantendo a ordenação atual
  const handleExportPDF = () => {
    const logoUrlRaw = localStorage.getItem('church-logo');
    const churchNameRaw = localStorage.getItem('church-name');
    const logoUrl = logoUrlRaw ? JSON.parse(logoUrlRaw) : null;
    const churchName = churchNameRaw ? JSON.parse(churchNameRaw) : 'Relatório de Membros';
    
    // ✅ Usa members que já está ordenado
    exportToPDF(members, filters, logoUrl, churchName, 'relatorio-membros', showAge, showPhoto, showBirthdayWeekday, showType);
    setIsPdfConfigOpen(false);
  };

  // ✅ Usa os membros já ordenados que vêm do componente pai
  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);

  // Pega membros da página atual
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return members.slice(startIndex, endIndex);
  }, [members, currentPage]);

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
            Lista de Membros ({members.length} registros) 
            {totalPages > 1 && (
              <span className="text-sm font-normal text-muted-foreground">
                - Página {currentPage} de {totalPages}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleOpenPdfConfig}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar para PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Lista
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* ✅ CABEÇALHO PARA FOTO */}
                <TableHead className="w-12"></TableHead>
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
                  {/* ✅ COLUNA DA FOTO */}
                  <TableCell className="w-16">
                    <div className="flex items-center justify-center">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.nome}
                          className="w-12 h-12 aspect-square rounded-full object-cover object-center shadow-sm border border-gray-200"
                          style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', maxWidth: '48px', maxHeight: '48px' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-12 h-12 aspect-square rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm ${member.avatar_url ? 'hidden' : ''}`}
                        style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', maxWidth: '48px', maxHeight: '48px' }}
                      >
                        <span className="text-lg font-bold">
                          {member.nome?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  {/* ✅ COLUNA DO NOME */}
                  <TableCell className="font-medium">
                    {(member.nomeCompleto || member.nome || 'N/A').toUpperCase()}
                  </TableCell>
                  {/* ✅ COLUNA DA DATA DE NASCIMENTO */}
                  <TableCell>
                    {member.dataNascimento ? (() => {
                      const date = new Date(member.dataNascimento);
                      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('pt-BR');
                    })() : 'N/A'}
                  </TableCell>
                  {/* ✅ COLUNA DA IDADE */}
                  <TableCell>{calculateAge(member.dataNascimento)} anos</TableCell>
                  {/* ✅ COLUNA DO TIPO */}
                  <TableCell><MemberTypeBadge type={getMemberType(member)} /></TableCell>
                  {/* ✅ COLUNA DO STATUS */}
                  <TableCell>
                    <Badge variant={member.status === 'ativo' ? 'default' : 'secondary'}>
                      {member.status === 'ativo' ? 'Ativo' : 'Desligado'}
                    </Badge>
                  </TableCell>
                  {/* ✅ COLUNA DAS AÇÕES */}
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
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, members.length)} de {members.length} registros
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
        
        {/* Modal de Detalhes do Membro */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>Detalhes do Membro</DialogTitle></DialogHeader>
            {selectedMember && <MemberDetails member={selectedMember} onMemberUpdate={onMemberUpdate} />}
          </DialogContent>
        </Dialog>
        
        {/* Modal de Edição do Membro */}
        <MemberEdit member={editingMember} isOpen={isEditOpen} onClose={() => setEditingMember(null)} onSave={handleSaveEdit} />
        
        {/* Modal de Configuração do PDF */}
        <Dialog open={isPdfConfigOpen} onOpenChange={setIsPdfConfigOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configurações de Exportação PDF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-age" 
                  checked={showAge} 
                  onCheckedChange={(checked) => setShowAge(!!checked)}
                />
                <Label htmlFor="show-age" className="cursor-pointer">
                  Incluir coluna de Idade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-photo" 
                  checked={showPhoto} 
                  onCheckedChange={(checked) => setShowPhoto(!!checked)}
                />
                <Label htmlFor="show-photo" className="cursor-pointer">
                  Incluir fotos dos membros
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-birthday-weekday" 
                  checked={showBirthdayWeekday} 
                  onCheckedChange={(checked) => setShowBirthdayWeekday(!!checked)}
                />
                <Label htmlFor="show-birthday-weekday" className="cursor-pointer">
                  Incluir próximo aniversário (dia da semana)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-type" 
                  checked={showType} 
                  onCheckedChange={(checked) => setShowType(!!checked)}
                />
                <Label htmlFor="show-type" className="cursor-pointer">
                  Incluir tipo de membro
                </Label>
              </div>
              <div className="text-sm text-muted-foreground border-t pt-3">
                <p>📊 Total de registros: <strong>{members.length}</strong></p>
                <p>📄 A ordenação atual da lista será mantida no PDF</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPdfConfigOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};