import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Member } from '@/types/member';
import { calculateAge, getAgeGroup } from './memberUtils';

// Função para normalizar os cabeçalhos das colunas da planilha
const normalizeHeader = (header: string): string => {
  if (!header) return '';
  // Converte para minúsculas, remove acentos, e substitui espaços/caracteres especiais por _
  return header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// Mapeamento de campos para possíveis nomes de colunas da sua planilha
export const REQUIRED_COLUMNS_MAP: Record<string, string[]> = {
  nome: ['nome'],
  dataNascimento: ['data_de_nascimento'],
  idade: ['idade'],
  mes: ['mes'],
  telefone: ['telefone'],
  sexo: ['sexo'],
  observacoes: ['observacoes'],
  statusCivil: ['status_civil'],
  conjuge: ['nome_do_conjuge_(caso_seja_casado(a)_caso_nao_seja,_nao_precisa_preencher)'],
  parentesco: ['parentesco_(_pai_ou_mae_caso_seja_menor_de_idade_)'],
  rua: ['rua'],
  numero: ['nº'],
  bairro: ['bairro'],
  cidade: ['cidade'],
  estado: ['estado'],
  cep: ['cep'],
  batizado: ['batizado'],
  membro: ['membro'],
  status: ['situacao_atual', 'status'],
  lider: ['e_lider_?'],
  professorEBQ: ['e_professor_ebq_?'],
  faixaEtaria: ['faixa_etaria'],
  pequeno_grupo: ['esta_em_um_pequeno_grupo_?'],
  grupo: ['em_que_grupo_esta_?'],
  numero_domes: ['numerodomes'],
};

// Colunas que consideramos essenciais para um registro ser válido
const ESSENTIAL_KEYS: Array<keyof typeof REQUIRED_COLUMNS_MAP> = ['nome', 'dataNascimento', 'sexo', 'bairro', 'status', 'batizado', 'membro'];


const isYes = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false;
  const str = String(value).trim().toLowerCase();
  return ['sim', 's', 'true', '1', 'yes', 'y'].includes(str);
};

// CORREÇÃO: Função de data ajustada para o formato DD/MM/YYYY da sua planilha
const parseDate = (value: unknown): string => {
  if (!value) return '';
  if (value instanceof Date) {
    // Adiciona 1 dia para corrigir o problema de fuso horário que o XLSX pode causar
    const correctedDate = new Date(value.getTime() + Math.abs(value.getTimezoneOffset() * 60000));
    return correctedDate.toISOString().split('T')[0];
  }
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    const jsDate = new Date(date.y, date.m - 1, date.d, 12); // Usar meio-dia
    return jsDate.toISOString().split('T')[0];
  }
  if (typeof value === 'string') {
    const parts = value.split('/');
    if (parts.length === 3) {
      // Formato DD/MM/YYYY
      const [day, month, yearStr] = parts;
      const year = parseInt(yearStr, 10);
      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(Date.UTC(fullYear, parseInt(month, 10) - 1, parseInt(day, 10)));
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
          workbook = XLSX.read(csvString, { type: 'string' });
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
        
        const missingColumns = ESSENTIAL_KEYS.filter(
          key => !REQUIRED_COLUMNS_MAP[key].some(alias => headerMap.has(alias))
        );

        if (missingColumns.length > 0) {
          const missingColumnNames = missingColumns.map(key => REQUIRED_COLUMNS_MAP[key][0].replace(/_/g, ' '));
          return reject(new Error(`Erro de importação: As seguintes colunas obrigatórias não foram encontradas: ${missingColumnNames.join(', ')}.`));
        }
        
        const members: Partial<Member>[] = jsonData.map((row, index: number): Partial<Member> => {
            const getValue = (key: keyof typeof REQUIRED_COLUMNS_MAP): unknown => {
                for (const alias of REQUIRED_COLUMNS_MAP[key]) {
                    if (headerMap.has(alias)) {
                        return row[headerMap.get(alias)!];
                    }
                }
                return undefined;
            };

            const dataNascimento = parseDate(getValue('dataNascimento'));
            if (!dataNascimento) throw new Error(`Erro na linha ${index + 2}: 'Data de Nascimento' inválida ou vazia.`);

            const idade = Number(getValue('idade')) || calculateAge(dataNascimento);
            
            const sexo = String(getValue('sexo') || '').toLowerCase();
            if (!sexo.startsWith('masc') && !sexo.startsWith('fem')) throw new Error(`Erro na linha ${index + 2}: 'Sexo' deve ser 'Masculino' ou 'Feminino'.`);

            const situacao = String(getValue('status') || 'ativo').toLowerCase();
            if (situacao !== 'ativo' && situacao !== 'desligado') throw new Error(`Erro na linha ${index + 2}: 'Situação Atual' deve ser 'Ativo' ou 'Desligado'.`);

            const rua = String(getValue('rua') || '');
            const numero = String(getValue('numero') || '');

            return {
                nome: String(getValue('nome')), dataNascimento, idade,
                mes: String(getValue('mes') || new Date(dataNascimento).toLocaleString('pt-BR', { month: 'long' })),
                telefone: String(getValue('telefone') || ''),
                sexo: sexo.startsWith('masc') ? 'M' : 'F',
                observacoes: String(getValue('observacoes') || ''),
                statusCivil: String(getValue('statusCivil') || ''),
                conjuge: String(getValue('conjuge') || ''),
                parentesco: String(getValue('parentesco') || ''),
                rua, numero,
                endereco: `${rua}, ${numero}`.replace(/^,|,$/g, '').trim(),
                bairro: String(getValue('bairro')),
                cidade: String(getValue('cidade') || ''),
                estado: String(getValue('estado') || ''),
                cep: String(getValue('cep') || ''),
                batizado: isYes(getValue('batizado')),
                membro: isYes(getValue('membro')),
                status: situacao as 'ativo' | 'desligado',
                lider: isYes(getValue('lider')),
                professorEBQ: isYes(getValue('professorEBQ')),
                faixaEtaria: String(getValue('faixaEtaria') || getAgeGroup(idade)),
                pequeno_grupo: isYes(getValue('pequeno_grupo')),
                grupo: String(getValue('grupo') || ''),
                numero_domes: Number(getValue('numero_domes') || 0),
            };
        });

        resolve(members);
      } catch (error: unknown) {
        if (error instanceof Error) {
            reject(error);
        } else {
            reject(new Error('Ocorreu um erro desconhecido durante a importação.'));
        }
      }
    };
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

export const exportToExcel = (members: Member[], filename: string = 'membros') => {
    const exportData = members.map(member => ({
        'Nome': member.nome,
        'Data de Nascimento': member.dataNascimento,
        'Idade': member.idade,
        'Sexo': member.sexo === 'M' ? 'Masculino' : 'Feminino',
        'Telefone': member.telefone,
        'Bairro': member.bairro,
        'Situação Atual': member.status,
        'Batizado ?': member.batizado ? 'Sim' : 'Não',
        'Membro?': member.membro ? 'Sim' : 'Não',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${filename}.xlsx`);
};