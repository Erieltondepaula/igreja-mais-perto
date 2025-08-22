import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, getMemberType } from './memberUtils';

// Função para criar um título dinâmico com base nos filtros
const generateReportTitle = (filters: MemberFilters): string => {
  const baseTitle = "Relatório de Membros";
  const descriptions: string[] = [];

  // Adiciona o status (Ativo/Desligado)
  if (filters.statusGeral) {
    descriptions.push(filters.statusGeral === 'ativo' ? 'Ativos' : 'Desligados');
  }

  // Adiciona os tipos de membro selecionados
  if (filters.tipoMembro && filters.tipoMembro.length > 0) {
    const tipos = filters.tipoMembro.map(t => {
        switch(t) {
            case 'membro': return 'Membros';
            case 'batizado_congregado': return 'Batizados (Congregados)';
            case 'congregado': return 'Congregados';
            default: return '';
        }
    }).filter(Boolean).join(', ');
    if (tipos) descriptions.push(tipos);
  }

  // Adiciona os filtros de aniversariantes
  if (filters.aniversariantesDoMes) {
    descriptions.push("Aniversariantes do Mês");
  }
  if (filters.aniversariantesDoDia) {
    descriptions.push("Aniversariantes de Hoje");
  }

  // Se algum filtro foi aplicado, monta o título com a descrição
  if (descriptions.length > 0) {
    return `${baseTitle}: ${descriptions.join(' e ')}`;
  }

  // Título padrão se nenhum filtro for aplicado
  return `${baseTitle} - Listagem Geral`;
};


export const exportToPDF = (
  members: Member[], 
  filters: MemberFilters = {}, 
  filename: string = 'relatorio-membros'
) => {
  const doc = new jsPDF();
  
  const titulo = generateReportTitle(filters);
  const totalText = `Total de Registros: ${members.length}`;
  const generatedDate = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Título principal (Centralizado)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const splitTitle = doc.splitTextToSize(titulo, pageWidth - margin * 2);
  let yPosition = 20;
  doc.text(splitTitle, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += (splitTitle.length * 7);
  
  // Informações do relatório (Alinhado à esquerda)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(generatedDate, margin, yPosition);
  doc.text(totalText, margin, yPosition + 5);
  
  // Preparar dados da tabela
  const tableData = members.map(member => [
    member.nome,
    member.dataNascimento ? new Date(member.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A',
    calculateAge(member.dataNascimento).toString(),
    member.status === 'ativo' ? 'Ativo' : 'Desligado',
    getMemberType(member)
  ]);
  
  // Configurar tabela
  autoTable(doc, {
    head: [['Nome', 'Data Nascimento', 'Idade', 'Status', 'Tipo']],
    body: tableData,
    startY: yPosition + 15, 
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Azul
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Cinza claro
    },
    margin: { top: 30, left: 10, right: 10 }
  });

  doc.save(`${filename}.pdf`);
};