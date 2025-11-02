import * as XLSX from 'xlsx';
import { Member, MemberFilters } from '@/types/member';

export function filterMembers(members: Member[], filters: MemberFilters): Member[] {
  return members.filter(member => {
    if (filters.sexo && member.sexo !== filters.sexo) return false;
    if (filters.bairro && member.bairro !== filters.bairro) return false;
    if (filters.faixaEtaria && member.faixaEtaria !== filters.faixaEtaria) return false;
    if (filters.statusGeral && member.status !== filters.statusGeral) return false;
    return true;
  });
}

export function mockMembers(): Member[] {
  return [];
}

export function calculateAge(dateString: string): number {
  if (!dateString) return 0;
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getAgeGroup(age: number): string {
  if (age <= 6) return 'infancia';
  if (age <= 10) return 'criancas';
  if (age <= 17) return 'adolescentes';
  if (age <= 35) return 'jovens';
  if (age <= 59) return 'adultos';
  return 'idosos';
}

const normalizeHeader = (header: string): string => {
  if (!header) return '';
  return header.trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

export const REQUIRED_COLUMNS_MAP: Record<string, string[]> = {
  nome: ['nome'], dataNascimento: ['data_de_nascimento', 'data_nascimento'], idade: ['idade'],
  mes: ['mes'], telefone: ['telefone'], sexo: ['sexo'], observacoes: ['observacoes'],
  statusCivil: ['status_civil'], conjuge: ['nome_do_conjuge_(caso_seja_casado(a)_caso_nao_seja,_nao_precisa_preencher)'],
  parentesco: ['parentesco_(_pai_ou_mae_caso_seja_menor_de_idade_)'], rua: ['rua'], numero: ['nº'],
  bairro: ['bairro'], cidade: ['cidade'], estado: ['estado'], cep: ['cep'], batizado: ['batizado_?', 'batizado'],
  membro: ['membro'], status: ['situacao_atual', 'status'], lider: ['e_lider_?'],
  professorEBQ: ['e_professor_ebq_?'], faixaEtaria: ['faixa_etaria'],
  pequeno_grupo: ['esta_em_um_pequeno_grupo_?'], grupo: ['em_que_grupo_esta_?'], numero_domes: ['numerodomes'],
};

const ESSENTIAL_KEYS: Array<keyof typeof REQUIRED_COLUMNS_MAP> = ['nome', 'dataNascimento', 'sexo', 'bairro', 'status', 'batizado', 'membro'];

const isYes = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false;
  const str = String(value).trim().toLowerCase();
  return ['sim', 's', 'true', '1', 'yes', 'y'].includes(str);
};

// **FUNÇÃO DE DATA TOTALMENTE CORRIGIDA para aceitar múltiplos formatos**
const parseDate = (value: unknown): string => {
  if (!value) return '';
  if (value instanceof Date) {
    const correctedDate = new Date(value.getTime() + Math.abs(value.getTimezoneOffset() * 60000));
    return correctedDate.toISOString().split('T')[0];
  }
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
    return jsDate.toISOString().split('T')[0];
  }
  if (typeof value === 'string') {
    // Tenta formato DD/MM/YYYY
    let parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, yearStr] = parts;
      const year = parseInt(yearStr, 10);
      const fullYear = year < 100 ? (year > 50 ? 1900 + year : 2000 + year) : year;
      const date = new Date(Date.UTC(fullYear, parseInt(month, 10) - 1, parseInt(day, 10)));
      if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    }
    // Tenta formato YYYY-MM-DD
    parts = value.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    }
  }
  return '';
};

export const importFromExcel = (file: File): Promise<Partial<Member>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let workbook;
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const csvString = e.target?.result as string;
          workbook = XLSX.read(csvString, { type: 'string', cellDates: true });
        } else {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          workbook = XLSX.read(data, { type: 'array', cellDates: true });
        }
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
        if (jsonData.length === 0) return reject(new Error('A planilha está vazia.'));
        const headerMap: Map<string, string> = new Map();
        Object.keys(jsonData[0]).forEach(originalKey => headerMap.set(normalizeHeader(originalKey), originalKey));
        const missingColumns = ESSENTIAL_KEYS.filter(key => !REQUIRED_COLUMNS_MAP[key].some(alias => headerMap.has(alias)));
        if (missingColumns.length > 0) {
          const missingColumnNames = missingColumns.map(key => REQUIRED_COLUMNS_MAP[key][0].replace(/_/g, ' '));
          return reject(new Error(`Erro de importação: As seguintes colunas obrigatórias não foram encontradas: ${missingColumnNames.join(', ')}.`));
        }
        const members: Partial<Member>[] = jsonData.map((row, index: number): Partial<Member> => {
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
                // ✅ CORREÇÃO: Lendo os valores de líder e professor
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
  // Implemente a lógica de exportação aqui
  // Exemplo:
  // const ws = XLSX.utils.json_to_sheet(members);
  // const wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'Membros');
  // XLSX.writeFile(wb, `${filename}.xlsx`);
};