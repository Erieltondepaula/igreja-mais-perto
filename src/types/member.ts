export interface Member {
  id: string;
  nome: string;
  nomeCompleto?: string;
  dataNascimento: string;
  idade?: number;
  mes?: string;
  sexo: 'M' | 'F';
  telefone: string;
  email: string;
  endereco: string;
  numero?: string;
  bairro: string;
  cidade: string;
  estado?: string;
  cep: string;
  status: 'ativo' | 'batizado' | 'membro' | 'desligado';
  statusCivil?: string;
  conjuge?: string;
  parentesco?: string;
  batizado?: boolean;
  membro?: boolean;
  situacaoAtual?: string;
  lider?: boolean;
  professorEBQ?: boolean;
  faixaEtaria?: string;
  pequeno_grupo?: boolean;
  grupo?: string;
  numero_domes?: number;
  dataBatismo?: string;
  dataMembresia?: string;
  dataDesligamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFilters {
  statusGeral?: 'ativo' | 'desligado';
  tipoMembro?: string[];
  sexo?: string;
  bairro?: string;
  faixaEtaria?: string;
  anoNascimento?: string;
  aniversariantesDoMes?: boolean;
  aniversariantesDoDia?: boolean;
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
  fill?: string;
}

export interface NeighborhoodData {
  bairro: string;
  quantidade: number;
  latitude?: number;
  longitude?: number;
}