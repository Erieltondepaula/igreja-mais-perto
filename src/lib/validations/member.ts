// Local do arquivo: src/lib/validations/member.ts

import { z } from 'zod';

// Define as regras de validação para cada campo do formulário
export const memberSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  nomeCompleto: z.string().optional(),
  avatar_url: z.string().url({ message: "URL da foto inválida." }).optional().or(z.literal('')),
  dataNascimento: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date' && date, {
    message: "Data de nascimento é obrigatória.",
  }),
  sexo: z.enum(['M', 'F'], { required_error: "Selecione o sexo." }),
  telefone: z.string().optional(),
  email: z.string().email({ message: "Formato de e-mail inválido." }).optional().or(z.literal('')),
  endereco: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  status: z.enum(['ativo', 'desligado']), // << LINHA CORRIGIDA
  statusCivil: z.string().optional(),
  conjuge: z.string().optional(),
  parentesco: z.string().optional(),
  batizado: z.boolean().default(false),
  membro: z.boolean().default(false),
  lider: z.boolean().default(false),
  professorEBQ: z.boolean().default(false),
  pequeno_grupo: z.boolean().default(false),
  grupo: z.string().optional(),
  observacoes: z.string().optional(),
});