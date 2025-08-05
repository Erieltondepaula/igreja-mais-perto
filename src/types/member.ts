export interface Member {
  id: string;
  nome: string;
  dataNascimento: string;
  sexo: 'M' | 'F';
  telefone: string;
  email: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  status: 'ativo' | 'batizado' | 'membro' | 'desligado';
  dataBatismo?: string;
  dataMembresia?: string;
  dataDesligamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFilters {
  status?: string;
  sexo?: string;
  bairro?: string;
  aniversariantesDoMes?: boolean;
  aniversariantesDoDia?: boolean;
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