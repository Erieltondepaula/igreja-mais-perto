// Local do arquivo: src/utils/pdfUtils.ts
// ✅ CÓDIGO CORRIGIDO COM O NOVO LAYOUT E TÍTULO DINÂMICO

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member, MemberFilters } from '@/types/member';
import { calculateAge, getMemberType } from './memberUtils';

const generateReportTitle = (filters: MemberFilters): string => {
  const descriptions: string[] = [];
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Relatórios de aniversariantes
  if (filters.aniversariantesDoDia) return "Relatório de Aniversariantes de Hoje";
  if (filters.aniversariantesDoMes) return "Relatório de Aniversariantes do Mês";
  if (filters.aniversariantesPeriodo?.dataInicial && filters.aniversariantesPeriodo?.dataFinal) {
    return `Relatório de Aniversariantes: ${formatDate(filters.aniversariantesPeriodo.dataInicial)} a ${formatDate(filters.aniversariantesPeriodo.dataFinal)}`;
  }

  // Relatório de desligados
  if (filters.statusGeral === 'desligado') {
    return "Relatório de Desligados";
  }

  // Relatório de membros batizados ativos
  if (filters.statusGeral === 'ativo' && filters.tipoMembro && filters.tipoMembro.length === 1 && filters.tipoMembro[0] === 'membro') {
    return "Relatório de Membros";
  }

  // Relatório de congregados ativos
  if (filters.statusGeral === 'ativo' && filters.tipoMembro && filters.tipoMembro.length === 1 && filters.tipoMembro[0] === 'congregado') {
    return "Relatório de Congregados";
  }


  // Relatório por faixa etária
  if (filters.faixaEtaria) {
    return `Relatório Faixa Etária de ${filters.faixaEtaria} anos`;
  }

  // Relatório por sexo
  if (filters.sexo) {
    return `Relatório de Membros (${filters.sexo === 'M' ? 'Masculino' : 'Feminino'})`;
  }

  // Relatório por idade mínima/máxima
  if (filters.idadeRange && (filters.idadeRange.min || filters.idadeRange.max)) {
    const { min, max } = filters.idadeRange;
    if (min && max) {
      return `Relatório de Membros (Idade: ${min} a ${max} anos)`;
    } else if (min) {
      return `Relatório de Membros (Idade: A partir de ${min} anos)`;
    } else if (max) {
      return `Relatório de Membros (Idade: Até ${max} anos)`;
    }
  }

  // Relatório geral (todos ativos, sem filtro de tipo)
  if ((!filters.statusGeral || filters.statusGeral === 'ativo') && (!filters.tipoMembro || filters.tipoMembro.length === 0)) {
    return "Relatório Geral de Membros";
  }

  // Relatório personalizado (outros filtros combinados)
  if (filters.statusGeral === 'ativo') {
    descriptions.push('Ativos');
  }
  if (filters.tipoMembro && filters.tipoMembro.length > 0) {
    const tipos = filters.tipoMembro.map(t => {
      switch (t) {
        case 'membro': return 'Membros';
        case 'batizado_congregado': return 'Batizados (Não Membros)';
        case 'congregado': return 'Congregados';
        default: return '';
      }
    }).join(', ');
    descriptions.push(tipos);
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
    return `Relatório de Membros (${descriptions.join(' | ')})`;
  }
  return "Relatório Geral de Membros";
};

// Função auxiliar para calcular próximo aniversário e dia da semana
const getNextBirthdayInfo = (dataNascimento: string): { daysUntil: number; weekday: string } => {
  try {
    const dateStr = dataNascimento.includes('T') ? dataNascimento.split('T')[0] : dataNascimento;
    const [year, month, day] = dateStr.split('-');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    // Se já passou este ano, pegar o próximo
    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day));
    }
    
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const weekday = weekdays[nextBirthday.getDay()];
    
    return { daysUntil, weekday };
  } catch (e) {
    return { daysUntil: 0, weekday: 'N/A' };
  }
};

// Função para gerar avatar com inicial como imagem base64
const generateAvatarImage = (initial: string): string => {
  const canvas = document.createElement('canvas');
  const size = 48;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Criar gradiente azul (mesmo estilo da interface)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#60a5fa'); // from-blue-400
  gradient.addColorStop(1, '#2563eb'); // to-blue-600
  
  // Desenhar círculo com gradiente
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Adicionar texto (inicial)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial.toUpperCase(), size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
};

export const exportToPDF = (
  members: Member[], 
  filters: MemberFilters = {},
  logoUrl?: string | null,
  churchName?: string | null,
  filename: string = 'relatorio-membros',
  showAge: boolean = true, // Nova opção para mostrar/ocultar idade
  showPhoto: boolean = true, // Nova opção para mostrar/ocultar fotos
  showBirthdayWeekday: boolean = true, // Nova opção para mostrar dia da semana do aniversário
  showType: boolean = true // Nova opção para mostrar/ocultar tipo de membro
) => {
  const doc = new jsPDF();
  const titulo = generateReportTitle(filters);
  const totalText = `Total de Registros: ${members.length}`;
  const generatedDate = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const logoHeight = 25;
  const logoWidth = 25;

  // ✅ CABEÇALHO COM LOGO E TÍTULO ALINHADOS
  
  // Adiciona o logo no canto superior esquerdo
  const logoYPosition = 15;
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'PNG', margin, logoYPosition, logoWidth, logoHeight);
    } catch (e) {
      console.error("Erro ao adicionar o logo no PDF:", e);
    }
  }

  // Título com quebra automática de linha, alinhado verticalmente com o centro da logo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  const titleX = margin + logoWidth + 5; // Logo + espaço
  const titleYCenter = logoYPosition + (logoHeight / 2); // Centro vertical da logo
  const maxTitleWidth = pageWidth - titleX - margin - 5;
  
  // Quebrar título em múltiplas linhas se necessário
  const titleLines = doc.splitTextToSize(titulo, maxTitleWidth);
  const lineHeight = 6;
  const totalTitleHeight = titleLines.length * lineHeight;
  const titleYStart = titleYCenter - (totalTitleHeight / 2);
  
  titleLines.forEach((line: string, index: number) => {
    doc.text(line, titleX, titleYStart + (index * lineHeight));
  });
  
  // Adiciona data e total abaixo do logo
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const infoYPosition = logoYPosition + logoHeight + 5;
  doc.text(generatedDate, margin, infoYPosition);
  doc.text(totalText, margin, infoYPosition + 5);

  // Tabela de dados
  const tableData = members.map(member => {
    // Formatar data corretamente
    let dataFormatada = 'N/A';
    if (member.dataNascimento) {
      try {
        // Se está no formato ISO (2022-01-02T03:00:00.000Z), extrair apenas a data
        const dateStr = member.dataNascimento.includes('T') 
          ? member.dataNascimento.split('T')[0] 
          : member.dataNascimento;
        
        const [year, month, day] = dateStr.split('-');
        dataFormatada = `${day}/${month}/${year}`;
      } catch (e) {
        console.error('Erro ao formatar data:', member.dataNascimento, e);
        dataFormatada = 'Inválida';
      }
    }
    
    const row = [
      (member.nomeCompleto || member.nome || 'N/A').toUpperCase(), // Nome em caixa alta
      dataFormatada,
    ];
    
    // Adiciona idade apenas se showAge for true
    if (showAge) {
      row.push(calculateAge(member.dataNascimento).toString());
    }
    
    // Adiciona próximo aniversário se showBirthdayWeekday for true
    if (showBirthdayWeekday && member.dataNascimento) {
      const { daysUntil, weekday } = getNextBirthdayInfo(member.dataNascimento);
      let birthdayText = '';
      if (daysUntil === 0) {
        birthdayText = 'hoje';
      } else if (daysUntil === 1) {
        birthdayText = 'amanhã';
      } else {
        birthdayText = `${weekday}, daqui ${daysUntil} dias`;
      }
      row.push(birthdayText);
    }
    
    // Adiciona tipo apenas se showType for true
    if (showType) {
      row.push(getMemberType(member));
    }
    
    return row;
  });
  
  // Define colunas baseado nas opções
  const tableHeaders = ['Nome', 'Data Nascimento'];
  if (showAge) {
    tableHeaders.push('Idade');
  }
  if (showBirthdayWeekday) {
    tableHeaders.push('Próximo Aniversário');
  }
  if (showType) {
    tableHeaders.push('Tipo');
  }
  
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: infoYPosition + 10,
    styles: { 
      fontSize: 9, 
      cellPadding: { top: 4, right: 2, bottom: 4, left: 2 }, // Aumentado padding vertical
      minCellHeight: showPhoto ? 16 : 10 // Altura mínima maior apenas quando showPhoto=true
    },
    headStyles: { fillColor: [22, 115, 222], textColor: 255, fontStyle: 'bold' },
    margin: { left: margin, right: margin },
    columnStyles: showPhoto ? {
      0: { cellPadding: { top: 4, right: 2, bottom: 4, left: 18 } } // Espaço para avatar (12px + 6px margem)
    } : {},
    // ✅ ADICIONAR FOTOS OU AVATARES COM INICIAIS NA COLUNA NOME
    didDrawCell: (data) => {
      // Apenas processa se showPhoto=true E é a coluna de nome E é o corpo da tabela
      if (!showPhoto || data.section !== 'body' || data.column.index !== 0) {
        return;
      }
      
      const member = members[data.row.index];
      if (!member) return;
      
      try {
        const imgSize = 12; // 12px de diâmetro
        const imgX = data.cell.x + 3; // 3px da borda esquerda
        const imgY = data.cell.y + (data.cell.height - imgSize) / 2; // Centralizado verticalmente
        
        if (member.avatar_url) {
          // Tem foto: usar a foto real
          const avatarUrl = member.avatar_url.startsWith('http') 
            ? member.avatar_url 
            : `http://localhost:5001${member.avatar_url}`;
          
          doc.addImage(avatarUrl, 'JPEG', imgX, imgY, imgSize, imgSize, undefined, 'FAST');
        } else {
          // Não tem foto: gerar avatar com inicial
          const initial = member.nome?.charAt(0) || '?';
          const avatarBase64 = generateAvatarImage(initial);
          
          if (avatarBase64) {
            doc.addImage(avatarBase64, 'PNG', imgX, imgY, imgSize, imgSize);
          }
        }
      } catch (e) {
        // Erro silencioso - continua o PDF sem a foto/avatar
        console.warn('Não foi possível adicionar avatar no PDF:', e);
      }
    }
  });

  doc.save(`${filename}.pdf`);
};