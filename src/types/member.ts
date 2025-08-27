// Local do arquivo: src/types/member.ts

export interface Member {
  id: string;
  nome: string;
  nomeCompleto?: string;
  photoUrl?: string;
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

// Tipo que representa o membro como vem do MongoDB (com _id)
export type MemberFromDB = Omit<Member, 'id'> & {
  _id: string;
};

// Interface para os filtros da aplicação
export interface MemberFilters {
  statusGeral?: 'ativo' | 'desligado';
  tipoMembro?: string[];
  sexo?: string;
  bairro?: string;
  faixaEtaria?: string;
  anoNascimento?: string;
  aniversariantesDoMes?: boolean;
  aniversariantesDoDia?: boolean;
  // Campos para o filtro por período de aniversário
  aniversariantesPeriodo?: {
    dataInicial?: string;
    dataFinal?: string;
  };
  search?: string;
}

// Interfaces para os dados dos gráficos
export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface AgeGroupData {
  faixaEtaria: string;
  quantidade: number;
  fill?: string;
}

export interface NeighborhoodData {
  bairro: string;
  quantidade: number;
}