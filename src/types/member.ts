<<<<<<< HEAD
// Local do arquivo: src/types/member.ts

=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
export interface Member {
  id: string;
  nome: string;
  nomeCompleto?: string;
<<<<<<< HEAD
  avatar_url?: string; // Caminho da foto/avatar do membro
=======
  photoUrl?: string;
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  dataNascimento: string;
  idade: number;
  mes: string;
  sexo: 'M' | 'F';
  telefone: string;
  email?: string;
  endereco: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  status: 'ativo' | 'desligado';
  statusCivil?: string;
  conjuge?: string;
  parentesco?: string;
  batizado: boolean;
  membro: boolean;
  lider: boolean;
  professorEBQ: boolean;
  faixaEtaria: string;
  pequeno_grupo: boolean;
  grupo?: string;
  numero_domes?: number;
  dataBatismo?: string;
  dataMembresia?: string;
  dataDesligamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< HEAD
export type MemberFromDB = Omit<Member, 'id'> & { _id: string; };

=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
export interface MemberFilters {
  statusGeral?: 'ativo' | 'desligado';
  tipoMembro?: string[];
  sexo?: string;
  bairro?: string;
  faixaEtaria?: string;
  anoNascimento?: string;
<<<<<<< HEAD
  idadeRange?: { min?: string; max?: string; };
  aniversariantesDoMes?: boolean;
  aniversariantesDoDia?: boolean;
  lider?: boolean;
  professorEBQ?: boolean;
  aniversariantesPeriodo?: { dataInicial?: string; dataFinal?: string; };
=======
  aniversariantesDoMes?: boolean;
  aniversariantesDoDia?: boolean;
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  search?: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface AgeGroupData {
  faixaEtaria: string;
  quantidade: number;
<<<<<<< HEAD
  fill?: string;
=======
  fill?: string; // A cor é opcional, pois é adicionada depois
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
}

export interface NeighborhoodData {
  bairro: string;
  quantidade: number;
<<<<<<< HEAD
}

// ✅ ATUALIZADO: Adicionamos 'color' e 'task'
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  type: 'birthday' | 'event' | 'task';
  description?: string;
  color?: string;
=======
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
}