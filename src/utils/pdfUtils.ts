<<<<<<< HEAD
// Local do arquivo: src/utils/pdfUtils.ts
// ✅ CÓDIGO CORRIGIDO COM O NOVO LAYOUT E TÍTULO DINÂMICO

=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, getMemberType } from './memberUtils';

<<<<<<< HEAD
const generateReportTitle = (filters: MemberFilters): string => {
  const descriptions: string[] = [];
  const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00Z').toLocaleDateString('pt-BR');

  // Casos especiais de aniversário que definem o título principal
  if (filters.aniversariantesDoDia) return "Relatório de Aniversariantes de Hoje";
  if (filters.aniversariantesDoMes) return "Relatório de Aniversariantes do Mês";
  if (filters.aniversariantesPeriodo?.dataInicial && filters.aniversariantesPeriodo?.dataFinal) {
    return `Aniversariantes de ${formatDate(filters.aniversariantesPeriodo.dataInicial)} a ${formatDate(filters.aniversariantesPeriodo.dataFinal)}`;
  }

  // Monta um título descritivo com base nos filtros gerais
  if (filters.statusGeral) {
    descriptions.push(`Status: ${filters.statusGeral === 'ativo' ? 'Ativos' : 'Desligados'}`);
  }

=======
// Função para criar um título dinâmico com base nos filtros
const generateReportTitle = (filters: MemberFilters): string => {
  const baseTitle = "Relatório de Membros";
  const descriptions: string[] = [];

  // Adiciona o status (Ativo/Desligado)
  if (filters.statusGeral) {
    descriptions.push(filters.statusGeral === 'ativo' ? 'Ativos' : 'Desligados');
  }

  // Adiciona os tipos de membro selecionados
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  if (filters.tipoMembro && filters.tipoMembro.length > 0) {
    const tipos = filters.tipoMembro.map(t => {
        switch(t) {
            case 'membro': return 'Membros';
<<<<<<< HEAD
            case 'batizado_congregado': return 'Batizados (Não Membros)';
            case 'congregado': return 'Congregados';
            default: return '';
        }
    }).join(', ');
    descriptions.push(`Tipo: ${tipos}`);
  }
  
  if (filters.faixaEtaria) {
    descriptions.push(`Faixa Etária: ${filters.faixaEtaria}`);
  }
  
  if (filters.idadeRange) {
    const { min, max } = filters.idadeRange;
    if (min && max) {
      descriptions.push(`Idade: ${min} a ${max} anos`);
    } else if (min) {
      descriptions.push(`Idade: A partir de ${min} anos`);
    } else if (max) {
      descriptions.push(`Idade: Até ${max} anos`);
    }
  }

  if (filters.sexo) {
    descriptions.push(`Sexo: ${filters.sexo === 'M' ? 'Masculino' : 'Feminino'}`);
  }
  
  if (filters.bairro) {
    descriptions.push(`Bairro: ${filters.bairro}`);
  }

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
=======
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
  
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  const titulo = generateReportTitle(filters);
  const totalText = `Total de Registros: ${members.length}`;
  const generatedDate = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

<<<<<<< HEAD
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
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  });

  doc.save(`${filename}.pdf`);
};