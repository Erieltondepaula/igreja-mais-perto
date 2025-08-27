// Local do arquivo: src/utils/excelUtils.ts

import * as XLSX from 'xlsx';
import { Member } from '@/types/member';
import { calculateAge, getMemberType, getAgeGroup } from './memberUtils';
import { saveAs } from 'file-saver';

const normalizeHeader = (header: string): string => {
  if (!header) return '';
  return header.trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

const REQUIRED_COLUMNS_MAP: Record<string, string[]> = {
  nome: ['nome'],
  dataNascimento: ['data_de_nascimento', 'data_nascimento'],
  sexo: ['sexo'],
  status: ['situacao_atual', 'status'],
  batizado: ['batizado_?','batizado'],
  membro: ['membro'],
  lider: ['e_lider_?'],
  professorEBQ: ['e_professor_ebq_?'],
  telefone: ['telefone'],
  bairro: ['bairro'],
};

const ESSENTIAL_KEYS: Array<keyof typeof REQUIRED_COLUMNS_MAP> = ['nome', 'dataNascimento', 'sexo'];

const isYes = (value: unknown): boolean => {
  const str = String(value || '').trim().toLowerCase();
  return ['sim', 's', 'true', '1', 'yes', 'y'].includes(str);
};

const parseDate = (value: unknown): string => {
  if (!value) return '';

  if (typeof value === 'number' && value > 1) {
    const date = XLSX.SSF.parse_date_code(value);
    if (date && date.y && date.m && date.d) {
        const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
        return jsDate.toISOString().split('T')[0];
    }
  }

  if (typeof value === 'string') {
    const dateStr = value.trim();
    
    // CORREÇÃO: Adicionada a capacidade de ler o formato YYYY-MM-DD
    const isoMatch = dateStr.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
    if (isoMatch) {
      const [_, year, month, day] = isoMatch;
      if (parseInt(year) > 1900 && parseInt(month) <= 12 && parseInt(day) <= 31) {
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    const ptMatch = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (ptMatch) {
      const [_, day, month, year] = ptMatch;
      if (parseInt(year) > 1900 && parseInt(month) <= 12 && parseInt(day) <= 31) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }
  
  return '';
};


export const importFromExcel = (file: File): Promise<Partial<Member>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        
        if (jsonData.length === 0) return reject(new Error('A planilha está vazia.'));

        const headerMap: Map<string, string> = new Map();
        Object.keys(jsonData[0]).forEach(originalKey => headerMap.set(normalizeHeader(originalKey), originalKey));
        
        const missingColumns = ESSENTIAL_KEYS.filter(key => !REQUIRED_COLUMNS_MAP[key].some(alias => headerMap.has(alias)));
        if (missingColumns.length > 0) {
          const missingColumnNames = missingColumns.map(key => REQUIRED_COLUMNS_MAP[key][0].replace(/_/g, ' '));
          return reject(new Error(`Colunas obrigatórias não encontradas: ${missingColumnNames.join(', ')}.`));
        }

        const members: Partial<Member>[] = jsonData.map((row, index): Partial<Member> => {
            const getValue = (key: keyof typeof REQUIRED_COLUMNS_MAP): unknown => {
                for (const alias of REQUIRED_COLUMNS_MAP[key]) {
                    if (headerMap.has(alias)) return row[headerMap.get(alias)!];
                }
                return undefined;
            };

            const dataNascimento = parseDate(getValue('dataNascimento'));
            if (!dataNascimento) {
              throw new Error(`Linha ${index + 2}: Data de Nascimento inválida ou em branco. Use o formato DD/MM/YYYY ou YYYY-MM-DD.`);
            }
            
            const idade = calculateAge(dataNascimento);
            const sexoRaw = String(getValue('sexo') || '').toLowerCase();
            const sexo = sexoRaw.startsWith('masc') ? 'M' : 'F';

            return {
                nome: String(getValue('nome') || ''),
                dataNascimento,
                idade: idade,
                faixaEtaria: getAgeGroup(idade),
                sexo,
                status: String(getValue('status') || 'ativo').toLowerCase() as 'ativo' | 'desligado',
                batizado: isYes(getValue('batizado')),
                membro: isYes(getValue('membro')),
                lider: isYes(getValue('lider')),
                professorEBQ: isYes(getValue('professorEBQ')),
                telefone: String(getValue('telefone') || ''),
                bairro: String(getValue('bairro') || ''),
            };
        });
        resolve(members);
      } catch (error) {
        reject(error as Error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (members: Member[], filename: string = 'membros-exportados') => {
  const dataToExport = members.map(member => ({
    'Nome': member.nome,
    'Data de Nascimento': member.dataNascimento ? new Date(member.dataNascimento + 'T00:00:00Z').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '',
    'Idade': calculateAge(member.dataNascimento),
    'Faixa Etária': member.faixaEtaria,
    'Sexo': member.sexo === 'M' ? 'Masculino' : 'Feminino',
    'Telefone': member.telefone,
    'Bairro': member.bairro,
    'Status': member.status === 'ativo' ? 'Ativo' : 'Desligado',
    'Tipo': getMemberType(member),
    'Batizado': member.batizado ? 'Sim' : 'Não',
    'Membro': member.membro ? 'Sim' : 'Não',
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');

  const colWidths = Object.keys(dataToExport[0] || {}).map(key => {
    type RowData = typeof dataToExport[0];
    const maxLength = Math.max(...dataToExport.map(row => String(row[key as keyof RowData] ?? '').length));
    return { wch: Math.max(key.length, maxLength) + 2 };
  });
  worksheet['!cols'] = colWidths;

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, `${filename}.xlsx`);
};