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
        
        const members: Partial<Member>[] = jsonData.map((row: any) => {
          // Helpers
          const normalize = (s: any): string => {
            if (s === undefined || s === null) return '';
            return String(s)
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, ' ')
              .trim()
              .toLowerCase();
          };

          const findCell = (labels: string[]): any => {
            // Try exact matches first
            for (const label of labels) {
              if (row[label] !== undefined) return row[label];
            }
            // Build normalized map once per row
            const normMap: Record<string, any> = {};
            for (const key of Object.keys(row)) {
              normMap[normalize(key).replace(/[^a-z0-9]/g, '')] = row[key];
            }
            for (const label of labels) {
              const key = normalize(label).replace(/[^a-z0-9]/g, '');
              if (key in normMap) return normMap[key];
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

          // Parse de booleanos e status
          const batizado: boolean = parseBoolean(findCell(['Batizado ?', 'Batizado?', 'batizado', 'Batizado']));
          const membro: boolean = parseBoolean(findCell(['Membro?', 'Membro ?', 'membro', 'Membro']));
          const statusCell = findCell(['Situação Atual', 'Situacao Atual', 'situacaoAtual']) ?? '';
          const statusNormalized = typeof statusCell === 'string' ? statusCell.trim().toLowerCase() : '';
          const status: Member['status'] = statusNormalized.includes('desligado') ? 'desligado' : 'ativo';

          // Sexo (M/F) robusto
          const sexoRaw = findCell(['Sexo', 'sexo']);
          const sexoStr = String(sexoRaw ?? '').toLowerCase();
          const sexo: Member['sexo'] = sexoStr.startsWith('m') ? 'M' : 'F';

          return {
            nome: row['NOME '] || row['Nome'] || row['nome'] || '',
            nomeCompleto: row['Nome Completo'] || row['nomeCompleto'] || '',
            dataNascimento: convertExcelDate(row['Data de Nascimento']) || row['dataNascimento'] || '',
            idade: row['Idade'] || row['idade'] || undefined,
            mes: row['Mês'] || row['mes'] || '',
            sexo,
            telefone: row['Telefone'] || row['telefone'] || '',
            email: row['Email'] || row['email'] || '',
            endereco: (row['Rua'] || row['endereco'] || '') + (row['Nº'] ? `, ${row['Nº']}` : ''),
            numero: row['Nº'] || row['numero'] || '',
            bairro: row['Bairro'] || row['bairro'] || '',
            cidade: row['Cidade'] || row['cidade'] || '',
            estado: row['Estado'] || row['estado'] || '',
            cep: row['Cep'] || row['cep'] || '',
            status,
            statusCivil: row['Status Civil'] || row['statusCivil'] || '',
            conjuge: row['Nome do Conjuge (Caso seja casado(a) caso não seja, não precisa preencher)'] || row['conjuge'] || '',
            parentesco: row['Parentesco ( Pai ou Mãe caso seja menor de idade )'] || row['parentesco'] || '',
            batizado,
            membro,
            situacaoAtual: findCell(['Situação Atual', 'Situacao Atual', 'situacaoAtual']) || '',
            lider: parseBoolean(findCell(['É lider ?', 'É líder ?', 'É líder?', 'É lider?', 'lider'])),
            professorEBQ: parseBoolean(findCell(['É Professor EBQ ?', 'É Professor EBQ?', 'professorEBQ'])),
            faixaEtaria: row['Faixa Etária'] || row['faixaEtaria'] || '',
            pequeno_grupo: parseBoolean(findCell(['Está em um pequeno grupo ?', 'Está em um pequeno grupo?', 'pequeno_grupo'])),
            grupo: row['Em que grupo está ?'] || row['grupo'] || '',
            numero_domes: row['Numerodomes'] || row['numero_domes'] || undefined,
            observacoes: row['Observações'] || row['observacoes'] || undefined
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