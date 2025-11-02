const normalizeHeader = (header: string): string => {
  if (!header) return '';
  return header.trim().toLowerCase().normalize('NFD')
<<<<<<< HEAD
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// ✅ MAPEAMENTO ATUALIZADO: Adicionadas as colunas de função
const REQUIRED_COLUMNS_MAP: Record<string, string[]> = {
  nome: ['nome'],
  dataNascimento: ['data_de_nascimento', 'data_nascimento'],
  sexo: ['sexo'],
  status: ['situacao_atual', 'status'],
  batizado: ['batizado_?','batizado'],
  membro: ['membro'],
  lider: ['e_lider', 'lider', 'e_lider_?'], // Mapeia "e_lider?" e outras variações
  professorEBQ: ['e_professor_ebq', 'professor_ebq', 'e_professor_ebq_?'], // Mapeia "e_professor_ebq?"
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
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
    }
  }
  return '';
};

export const importFromExcel = (file: File): Promise<Partial<Member>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
<<<<<<< HEAD
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
=======
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
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
            const getValue = (key: keyof typeof REQUIRED_COLUMNS_MAP): unknown => {
                for (const alias of REQUIRED_COLUMNS_MAP[key]) {
                    if (headerMap.has(alias)) return row[headerMap.get(alias)!];
                }
                return undefined;
            };
<<<<<<< HEAD

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

// ... o resto do arquivo (exportToExcel) permanece o mesmo
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
    'Líder': member.lider ? 'Sim' : 'Não', // Adicionado para exportação
    'Professor EBQ': member.professorEBQ ? 'Sim' : 'Não', // Adicionado para exportação
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
=======
            const dataNascimento = parseDate(getValue('dataNascimento'));
            if (!dataNascimento) throw new Error(`Erro na linha ${index + 2}: 'Data de Nascimento' (${getValue('dataNascimento')}) inválida ou vazia.`);
            const idade = Number(getValue('idade')) || calculateAge(dataNascimento);
            const sexo = String(getValue('sexo') || '').toLowerCase();
            if (!sexo.startsWith('masc') && !sexo.startsWith('fem')) throw new Error(`Erro na linha ${index + 2}: 'Sexo' deve ser 'Masculino' ou 'Feminino'.`);
            const situacao = String(getValue('status') || 'ativo').toLowerCase();
            if (situacao !== 'ativo' && situacao !== 'desligado') throw new Error(`Erro na linha ${index + 2}: 'Situação Atual' deve ser 'Ativo' ou 'Desligado'.`);
            const rua = String(getValue('rua') || '');
            const numero = String(getValue('numero') || '');
            return {
                nome: String(getValue('nome')), dataNascimento, idade,
                mes: String(getValue('mes') || new Date(dataNascimento).toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' })),
                telefone: String(getValue('telefone') || ''), sexo: sexo.startsWith('masc') ? 'M' : 'F',
                observacoes: String(getValue('observacoes') || ''), statusCivil: String(getValue('statusCivil') || ''),
                conjuge: String(getValue('conjuge') || ''), parentesco: String(getValue('parentesco') || ''),
                rua, numero, endereco: `${rua}, ${numero}`.replace(/^,|,$/g, '').trim(),
                bairro: String(getValue('bairro')), cidade: String(getValue('cidade') || ''),
                estado: String(getValue('estado') || ''), cep: String(getValue('cep') || ''),
                batizado: isYes(getValue('batizado')), membro: isYes(getValue('membro')),
                status: situacao as 'ativo' | 'desligado', lider: isYes(getValue('lider')),
                professorEBQ: isYes(getValue('professorEBQ')), faixaEtaria: String(getValue('faixaEtaria') || getAgeGroup(idade)),
                pequeno_grupo: isYes(getValue('pequeno_grupo')), grupo: String(getValue('grupo') || ''),
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
  // ... (código de exportação mantido)
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
};