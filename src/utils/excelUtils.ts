import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Member } from '@/types/member';

export const parseBoolean = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  const val = String(value).trim().toLowerCase();
  return val === 'sim' || val === 's' || val === 'true' || val === '1' || val === 'yes' || val === 'y';
};

export const exportToExcel = (members: Member[], filename: string = 'membros') => {
  const exportData = members.map(member => ({
    'Nome': member.nome,
    'Data de Nascimento': member.dataNascimento,
    'Sexo': member.sexo === 'M' ? 'Masculino' : 'Feminino',
    'Telefone': member.telefone,
    'Email': member.email,
    'Endereço': member.endereco,
    'Bairro': member.bairro,
    'Cidade': member.cidade,
    'CEP': member.cep,
    'Status': member.status,
    'Data Batismo': member.dataBatismo || '',
    'Data Membresia': member.dataMembresia || '',
    'Data Desligamento': member.dataDesligamento || '',
    'Observações': member.observacoes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membros');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(data, `${filename}.xlsx`);
};

// Função para normalizar cabeçalhos
const normalizeHeader = (header: string): string => {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\?/g, '') // remove interrogação
    .replace(/\s+/g, '') // remove espaços
    .trim()
    .toLowerCase();
};

// Função para validar valores booleanos
const validateBooleanValue = (value: any, columnName: string, rowIndex: number): boolean => {
  if (value === undefined || value === null || value === '') return false;
  
  const val = String(value).trim().toLowerCase();
  const validValues = ['sim', 's', 'não', 'nao', 'n', 'true', 'false', '1', '0', 'yes', 'y', 'no'];
  
  if (!validValues.includes(val)) {
    throw new Error(`Erro na linha ${rowIndex + 2}: Valor inválido na coluna '${columnName}'. Use apenas 'Sim' ou 'Não'. Valor encontrado: '${value}'`);
  }
  
  return parseBoolean(value);
};

// Função para validar status
const validateStatusValue = (value: any, rowIndex: number): Member['status'] => {
  if (!value) return 'ativo';
  
  const val = String(value).trim().toLowerCase();
  const validStatuses = ['ativo', 'desligado'];
  
  if (!validStatuses.some(status => val.includes(status))) {
    throw new Error(`Erro na linha ${rowIndex + 2}: Valor inválido na coluna 'Situação Atual'. Use apenas 'Ativo' ou 'Desligado'. Valor encontrado: '${value}'`);
  }
  
  return val.includes('desligado') ? 'desligado' : 'ativo';
};

export const importFromExcel = (file: File): Promise<Partial<Member>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          reject(new Error('O arquivo está vazio ou não contém dados válidos.'));
          return;
        }
        
        // Mapear cabeçalhos normalizados
        const firstRow = jsonData[0] as any;
        const headerMap: Record<string, string> = {};
        
        Object.keys(firstRow).forEach(originalKey => {
          headerMap[normalizeHeader(originalKey)] = originalKey;
        });
        
        // Validar colunas obrigatórias
        const requiredColumns = [
          { normalized: 'batizado', original: ['Batizado?', 'Batizado ?', 'batizado'] },
          { normalized: 'membro', original: ['Membro?', 'Membro ?', 'membro'] },
          { normalized: 'situacaoatual', original: ['Situação Atual', 'Situacao Atual', 'situacaoAtual'] }
        ];
        
        const missingColumns: string[] = [];
        
        requiredColumns.forEach(({ normalized, original }) => {
          if (!headerMap[normalized]) {
            missingColumns.push(original[0]);
          }
        });
        
        if (missingColumns.length > 0) {
          reject(new Error(`Erro: As seguintes colunas obrigatórias não foram encontradas no arquivo: ${missingColumns.join(', ')}. Verifique se os nomes estão escritos exatamente assim.`));
          return;
        }
        
        const members: Partial<Member>[] = jsonData.map((row: any, index: number) => {
          // Função para buscar valor por cabeçalho normalizado
          const findValueByNormalizedKey = (normalizedKey: string): any => {
            const originalKey = headerMap[normalizedKey];
            return originalKey ? row[originalKey] : undefined;
          };
          
          // Função para buscar valor com múltiplas variações
          const findCell = (variations: string[]): any => {
            for (const variation of variations) {
              const normalizedVariation = normalizeHeader(variation);
              const value = findValueByNormalizedKey(normalizedVariation);
              if (value !== undefined) return value;
            }
            return undefined;
          };
          
          // Função para converter data do Excel
          const convertExcelDate = (excelDate: any): string => {
            if (!excelDate) return '';
            if (typeof excelDate === 'string') return excelDate;
            if (typeof excelDate === 'number') {
              // Excel date serial number
              const date = new Date((excelDate - 25569) * 86400 * 1000);
              return date.toISOString().split('T')[0];
            }
            return '';
          };
          
          // Validar e converter campos obrigatórios
          const batizadoValue = findCell(['Batizado?', 'Batizado ?', 'batizado', 'Batizado']);
          const membroValue = findCell(['Membro?', 'Membro ?', 'membro', 'Membro']);
          const statusValue = findCell(['Situação Atual', 'Situacao Atual', 'situacaoAtual']);
          
          const batizado = validateBooleanValue(batizadoValue, 'Batizado?', index);
          const membro = validateBooleanValue(membroValue, 'Membro?', index);
          const status = validateStatusValue(statusValue, index);
          
          // Validar outros campos booleanos opcionais
          const liderValue = findCell(['É lider ?', 'É líder ?', 'É líder?', 'É lider?', 'lider', 'Lider']);
          const professorEBQValue = findCell(['É Professor EBQ ?', 'É Professor EBQ?', 'professorEBQ', 'Professor EBQ']);
          const pequenoGrupoValue = findCell(['Está em um pequeno grupo ?', 'Está em um pequeno grupo?', 'pequeno_grupo', 'Pequeno Grupo']);
          
          let lider = false;
          let professorEBQ = false;
          let pequenoGrupo = false;
          
          if (liderValue !== undefined && liderValue !== '') {
            lider = validateBooleanValue(liderValue, 'É líder?', index);
          }
          
          if (professorEBQValue !== undefined && professorEBQValue !== '') {
            professorEBQ = validateBooleanValue(professorEBQValue, 'É Professor EBQ?', index);
          }
          
          if (pequenoGrupoValue !== undefined && pequenoGrupoValue !== '') {
            pequenoGrupo = validateBooleanValue(pequenoGrupoValue, 'Está em um pequeno grupo?', index);
          }
          
          // Sexo (M/F) robusto
          const sexoRaw = findCell(['Sexo', 'sexo', 'SEXO']);
          const sexoStr = String(sexoRaw ?? '').toLowerCase();
          const sexo: Member['sexo'] = sexoStr.startsWith('m') || sexoStr.includes('masc') ? 'M' : 'F';
          
          return {
            nome: findCell(['NOME', 'NOME ', 'Nome', 'nome']) || '',
            nomeCompleto: findCell(['Nome Completo', 'nomeCompleto', 'NOME COMPLETO']) || '',
            dataNascimento: convertExcelDate(findCell(['Data de Nascimento', 'dataNascimento', 'DATA DE NASCIMENTO'])) || '',
            idade: findCell(['Idade', 'idade', 'IDADE']) || undefined,
            mes: findCell(['Mês', 'mes', 'MES', 'Mes']) || '',
            sexo,
            telefone: findCell(['Telefone', 'telefone', 'TELEFONE']) || '',
            email: findCell(['Email', 'email', 'EMAIL', 'E-mail']) || '',
            endereco: (() => {
              const rua = findCell(['Rua', 'rua', 'RUA', 'Endereço', 'endereco', 'ENDERECO']) || '';
              const numero = findCell(['Nº', 'numero', 'NUMERO', 'Numero', 'N°', 'No']) || '';
              return numero ? `${rua}, ${numero}` : rua;
            })(),
            numero: findCell(['Nº', 'numero', 'NUMERO', 'Numero', 'N°', 'No']) || '',
            bairro: findCell(['Bairro', 'bairro', 'BAIRRO']) || '',
            cidade: findCell(['Cidade', 'cidade', 'CIDADE']) || '',
            estado: findCell(['Estado', 'estado', 'ESTADO', 'UF', 'uf']) || '',
            cep: findCell(['CEP', 'Cep', 'cep', 'CEP ']) || '',
            status,
            statusCivil: findCell(['Status Civil', 'statusCivil', 'STATUS CIVIL', 'Estado Civil']) || '',
            conjuge: findCell(['Nome do Conjuge (Caso seja casado(a) caso não seja, não precisa preencher)', 'conjuge', 'Conjuge', 'CONJUGE']) || '',
            parentesco: findCell(['Parentesco ( Pai ou Mãe caso seja menor de idade )', 'parentesco', 'Parentesco', 'PARENTESCO']) || '',
            batizado,
            membro,
            situacaoAtual: statusValue || '',
            lider,
            professorEBQ,
            faixaEtaria: findCell(['Faixa Etária', 'faixaEtaria', 'FAIXA ETARIA', 'Faixa Etaria']) || '',
            pequeno_grupo: pequenoGrupo,
            grupo: findCell(['Em que grupo está ?', 'grupo', 'Grupo', 'GRUPO']) || '',
            numero_domes: findCell(['Numerodomes', 'numero_domes', 'NUMERO_DOMES', 'Numero Domes']) || undefined,
            observacoes: findCell(['Observações', 'observacoes', 'OBSERVACOES', 'Observacao']) || undefined
          };
        });
        
        resolve(members);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsArrayBuffer(file);
  });
};