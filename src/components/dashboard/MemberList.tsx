import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText, Printer, Edit, Search, Users, Gift, Calendar } from "lucide-react";
import { exportToExcel } from "@/utils/excelUtils";
import { MemberDetails } from './MemberDetails';
import { MemberEdit } from './MemberEdit';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, formatStatus, isBirthdayToday } from '@/utils/memberUtils';

interface MemberListProps {
  members: Member[];
  filters?: MemberFilters;
  title?: string;
  onMemberUpdate?: (member: Member) => void;
}

export const MemberList = ({ members, filters, title, onMemberUpdate }: MemberListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filtrar membros por busca
  const filteredMembers = members.filter(member =>
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.nomeCompleto && member.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [filteredMembers]);

  // Detectar se é filtro de aniversariantes
  const isAniversariantes = filters?.aniversariantesDoMes || filters?.aniversariantesDoDia;
  const displayTitle = isAniversariantes 
    ? (filters?.aniversariantesDoDia ? 'Aniversariantes de Hoje' : 'Aniversariantes do Mês')
    : (title || 'Lista de Membros');

  const formatBirthDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysToNext = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYear = today.getFullYear();
    
    // Data do aniversário neste ano
    const nextBirthday = new Date(thisYear, birth.getMonth(), birth.getDate());
    
    // Se já passou este ano, considerar o próximo ano
    if (nextBirthday < today) {
      nextBirthday.setFullYear(thisYear + 1);
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje!';
    if (diffDays === 1) return 'Amanhã';
    return `${diffDays} dias`;
  };

  const handleExport = () => {
    exportToExcel(filteredMembers, 'lista-membros-filtrados');
  };

  const handleMemberEdit = (member: Member) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleMemberSave = (updatedMember: Member) => {
    if (onMemberUpdate) {
      onMemberUpdate(updatedMember);
    }
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'desligado': return 'bg-gray-500';
      case 'batizado': return 'bg-blue-400';
      case 'membro': return 'bg-blue-700';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return '✅';
      case 'desligado': return '❌';
      case 'batizado': return '⛪';
      case 'membro': return '👤';
      default: return '❓';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Membros</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-ativo { background-color: #dcfce7; color: #166534; }
            .status-batizado { background-color: #dbeafe; color: #1e40af; }
            .status-membro { background-color: #e0e7ff; color: #3730a3; }
            .status-desligado { background-color: #f3f4f6; color: #6b7280; }
            @media print {
              body { margin: 0; }
              table { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <h1>${displayTitle}</h1>
          <p>Total de registros: ${sortedMembers.length}</p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Sexo</th>
                <th>Telefone</th>
                <th>Bairro</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${sortedMembers.map(member => `
                <tr>
                  <td>${member.nome}</td>
                  <td>${calculateAge(member.dataNascimento)} anos</td>
                  <td>${member.sexo === 'M' ? 'Masculino' : 'Feminino'}</td>
                  <td>${member.telefone}</td>
                  <td>${member.bairro}</td>
                  <td><span class="status status-${member.status}">${formatStatus(member.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAniversariantes ? (
            <>
              <Gift className="h-5 w-5 text-accent" />
              {displayTitle}
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              {displayTitle}
            </>
          )}
          <Badge variant="secondary">{sortedMembers.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Exportar Filtrados
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                  Nome
                </TableHead>
                {isAniversariantes && (
                  <>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Data de Nascimento
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Idade Atual
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Próximo Aniversário
                    </TableHead>
                  </>
                )}
                {!isAniversariantes && (
                  <>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Idade
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Sexo
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Telefone
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Bairro
                    </TableHead>
                    <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                      Funções
                    </TableHead>
                  </>
                )}
                <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                  Status
                </TableHead>
                <TableHead className="text-left p-3 font-medium text-muted-foreground border-b">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member) => (
                <TableRow key={member.id} className={isAniversariantes && isBirthdayToday(member.dataNascimento) ? 'bg-accent/20' : ''}>
                  <TableCell className="p-3 border-b font-medium">
                    {member.nome}
                    {isAniversariantes && isBirthdayToday(member.dataNascimento) && (
                      <Gift className="inline h-4 w-4 ml-2 text-accent" />
                    )}
                  </TableCell>
                  {isAniversariantes && (
                    <>
                      <TableCell className="p-3 border-b">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatBirthDate(member.dataNascimento)}
                        </div>
                      </TableCell>
                      <TableCell className="p-3 border-b">
                        <span className="font-medium">{calculateAge(member.dataNascimento)} anos</span>
                      </TableCell>
                      <TableCell className="p-3 border-b">
                        <Badge variant={isBirthdayToday(member.dataNascimento) ? "default" : "outline"}>
                          {getDaysToNext(member.dataNascimento)}
                        </Badge>
                      </TableCell>
                    </>
                  )}
                  {!isAniversariantes && (
                    <>
                      <TableCell className="p-3 border-b">{calculateAge(member.dataNascimento)} anos</TableCell>
                      <TableCell className="p-3 border-b">{member.sexo === 'M' ? 'Masculino' : 'Feminino'}</TableCell>
                      <TableCell className="p-3 border-b">{member.telefone}</TableCell>
                      <TableCell className="p-3 border-b">{member.bairro}</TableCell>
                      <TableCell className="p-3 border-b">
                        <div className="flex flex-wrap gap-1">
                          {member.lider && (
                            <Badge variant="secondary" className="text-xs">
                              Líder
                            </Badge>
                          )}
                          {member.professorEBQ && (
                            <Badge variant="secondary" className="text-xs">
                              Professor
                            </Badge>
                          )}
                          {member.batizado && (
                            <Badge variant="outline" className="text-xs">
                              Batizado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                  <TableCell className="p-3 border-b">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs text-white ${getStatusColor(member.status)}`}
                    >
                      {getStatusIcon(member.status)} {formatStatus(member.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3 border-b">
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMember(member)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMemberEdit(member)}
                      >
                        <Edit className="w-4 h-4" />
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
            Nenhum membro encontrado com os filtros aplicados.
          </div>
        )}

        {selectedMember && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Membro</DialogTitle>
            </DialogHeader>
            <MemberDetails member={selectedMember} />
          </DialogContent>
        )}

        <MemberEdit
          member={editingMember}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleMemberSave}
        />
      </CardContent>
    </Card>
  );
};