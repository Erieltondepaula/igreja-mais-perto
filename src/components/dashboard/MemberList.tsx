import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, formatStatus, getStatusColor, isBirthdayInMonth, isBirthdayToday } from '@/utils/memberUtils';
import { exportToExcel } from '@/utils/excelUtils';
import { Download, FileText, Users, Gift, Calendar } from 'lucide-react';

interface MemberListProps {
  members: Member[];
  filters?: MemberFilters;
  title?: string;
}

export const MemberList = ({ members, filters, title }: MemberListProps) => {
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
    exportToExcel(members, 'lista-membros');
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
          <h1>${title}</h1>
          <p>Total de registros: ${members.length}</p>
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
              ${members.map(member => `
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isAniversariantes ? (
              <>
                <Gift className="h-5 w-5 text-accent" />
                {displayTitle}
                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                  {members.length}
                </Badge>
              </>
            ) : (
              <>
                <Users className="h-5 w-5" />
                {displayTitle}
                <Badge variant="secondary">{members.length}</Badge>
              </>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <FileText className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                {isAniversariantes && (
                  <>
                    <TableHead>Data de Nascimento</TableHead>
                    <TableHead>Idade Atual</TableHead>
                    <TableHead>Próximo Aniversário</TableHead>
                  </>
                )}
                {!isAniversariantes && (
                  <>
                    <TableHead>Idade</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Bairro</TableHead>
                  </>
                )}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.sort((a, b) => a.nome.localeCompare(b.nome)).map((member) => (
                <TableRow key={member.id} className={isAniversariantes && isBirthdayToday(member.dataNascimento) ? 'bg-accent/20' : ''}>
                  <TableCell className="font-medium">
                    {member.nome}
                    {isAniversariantes && isBirthdayToday(member.dataNascimento) && (
                      <Gift className="inline h-4 w-4 ml-2 text-accent" />
                    )}
                  </TableCell>
                  {isAniversariantes && (
                    <>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatBirthDate(member.dataNascimento)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{calculateAge(member.dataNascimento)} anos</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isBirthdayToday(member.dataNascimento) ? "default" : "outline"}>
                          {getDaysToNext(member.dataNascimento)}
                        </Badge>
                      </TableCell>
                    </>
                  )}
                  {!isAniversariantes && (
                    <>
                      <TableCell>{calculateAge(member.dataNascimento)} anos</TableCell>
                      <TableCell>{member.sexo === 'M' ? 'Masculino' : 'Feminino'}</TableCell>
                      <TableCell>{member.telefone}</TableCell>
                      <TableCell>{member.bairro}</TableCell>
                    </>
                  )}
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ color: getStatusColor(member.status) }}
                    >
                      {formatStatus(member.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {members.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum membro encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
};