// Local do arquivo: src/utils/pdfUtils.ts
// ✅ CÓDIGO CORRIGIDO COM O NOVO LAYOUT

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, getMemberType } from './memberUtils';

const generateReportTitle = (filters: MemberFilters): string => {
  const descriptions: string[] = [];
  const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00Z').toLocaleDateString('pt-BR');

  if (filters.aniversariantesDoDia) return "Relatório de Aniversariantes de Hoje";
  if (filters.aniversariantesDoMes) return "Relatório de Aniversariantes do Mês";
  if (filters.aniversariantesPeriodo?.dataInicial && filters.aniversariantesPeriodo?.dataFinal) {
    return `Aniversariantes de ${formatDate(filters.aniversariantesPeriodo.dataInicial)} a ${formatDate(filters.aniversariantesPeriodo.dataFinal)}`;
  }

  if (filters.statusGeral) descriptions.push(`Membros ${filters.statusGeral}s`);
  if (filters.tipoMembro && filters.tipoMembro.length > 0) {
    const tipos = filters.tipoMembro.map(t => {
        switch(t) {
            case 'membro': return 'Membros';
            case 'batizado_congregado': return 'Batizados (Não Membros)';
            case 'congregado': return 'Congregados';
            default: return '';
        }
    }).join(', ');
    descriptions.push(tipos);
  }
  if(filters.faixaEtaria) descriptions.push(`Faixa Etária: ${filters.faixaEtaria}`);

  if (descriptions.length > 0) {
    return `Relatório de Membros: ${descriptions.join(' | ')}`;
  }

  return "Relatório Geral de Membros";
};

export const exportToPDF = (
  members: Member[], 
  filters: MemberFilters = {},
  logoUrl?: string | null,
  churchName?: string | null,
  filename: string = 'relatorio-membros'
) => {
  const doc = new jsPDF();
  const titulo = generateReportTitle(filters);
  const totalText = `Total de Registros: ${members.length}`;
  const generatedDate = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ✅ NOVO LAYOUT DO CABEÇALHO CONFORME A IMAGEM
  
  // Título principal centralizado no topo
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, pageWidth / 2, 20, { align: 'center' });

  // Adiciona o logo no canto superior esquerdo, abaixo do título
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'PNG', margin, 15, 25, 25); // x (mantém), y (subiu), width, height
    } catch (e) {
      console.error("Erro ao adicionar o logo no PDF:", e);
    }
  }
  
  // Adiciona data e total abaixo do logo
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(generatedDate, margin, 60); // Posição abaixo do logo
  doc.text(totalText, margin, 65);     // Posição abaixo da data

  // Tabela de dados
  const tableData = members.map(member => [
    member.nome,
    member.dataNascimento ? new Date(member.dataNascimento + 'T00:00:00Z').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A',
    calculateAge(member.dataNascimento).toString(),
    getMemberType(member)
  ]);
  
  autoTable(doc, {
    head: [['Nome', 'Data Nascimento', 'Idade', 'Tipo']],
    body: tableData,
    startY: 75, // Nova posição da tabela, mais para baixo
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [22, 115, 222], textColor: 255, fontStyle: 'bold' },
    margin: { left: margin, right: margin }
  });

  doc.save(`${filename}.pdf`);
};