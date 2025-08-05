import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Member } from '@/types/member';

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
        
        const members: Partial<Member>[] = jsonData.map((row: any) => ({
          nome: row['Nome'] || row['nome'] || '',
          dataNascimento: row['Data de Nascimento'] || row['dataNascimento'] || '',
          sexo: (row['Sexo'] === 'Masculino' || row['sexo'] === 'M') ? 'M' : 'F',
          telefone: row['Telefone'] || row['telefone'] || '',
          email: row['Email'] || row['email'] || '',
          endereco: row['Endereço'] || row['endereco'] || '',
          bairro: row['Bairro'] || row['bairro'] || '',
          cidade: row['Cidade'] || row['cidade'] || '',
          cep: row['CEP'] || row['cep'] || '',
          status: (row['Status'] || row['status'] || 'ativo') as Member['status'],
          dataBatismo: row['Data Batismo'] || row['dataBatismo'] || undefined,
          dataMembresia: row['Data Membresia'] || row['dataMembresia'] || undefined,
          dataDesligamento: row['Data Desligamento'] || row['dataDesligamento'] || undefined,
          observacoes: row['Observações'] || row['observacoes'] || undefined
        }));
        
        resolve(members);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsArrayBuffer(file);
  });
};