import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member } from '@/types/member';
import { calculateAge, getMemberType } from './memberUtils';

export const exportToPDF = (
  members: Member[], 
  filters: any = {},
  filename: string = 'relatorio-membros'
) => {
  const doc = new jsPDF();
  
  // Determinar o título do relatório baseado nos filtros
  let titulo = 'Relatório de Membros da Igreja Batista em Vila Palestina';
  
  if (filters.statusGeral === 'desligado') {
    titulo = 'Relatório de Membros Desligados da Igreja Batista em Vila Palestina';
  } else if (filters.tipoMembro?.includes('congregado') && !filters.tipoMembro?.includes('membro')) {
    titulo = 'Relatório de Congregados da Igreja Batista em Vila Palestina';
  }
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Quebrar o título em múltiplas linhas se necessário
  const splitTitle = doc.splitTextToSize(titulo, 180);
  let yPosition = 20;
  
  splitTitle.forEach((line: string) => {
    doc.text(line, doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
    yPosition += 7;
  });
  
  // Data de geração
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, doc.internal.pageSize.getWidth() / 2, yPosition + 5, { align: 'center' });
  
  // Preparar dados da tabela
  const tableData = members.map(member => [
    member.nome,
    new Date(member.dataNascimento).toLocaleDateString('pt-BR'),
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
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 30, left: 10, right: 10 }
  });
  
  // Adicionar rodapé
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Total de registros: ${members.length} | Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Salvar o arquivo
  doc.save(`${filename}.pdf`);
};
