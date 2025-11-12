import * as yup from 'yup';

export const emailSchema = yup.string().email('Email inválido').required('Email é obrigatório');

export const employeeSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: emailSchema,
  phone: yup.string().optional(),
  hireDate: yup.date().required('Data de contratação é obrigatória'),
  departmentId: yup.string().required('Departamento é obrigatório'),
  positionId: yup.string().required('Posição é obrigatória'),
  skillIds: yup.array().of(yup.string()).optional(),
});

export const departmentSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: yup.string().optional(),
});

export const positionSchema = yup.object({
  title: yup.string().required('Título é obrigatório').min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: yup.string().optional(),
  level: yup.string().optional(),
  departmentId: yup.string().optional(),
});

export const skillSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: yup.string().optional(),
  type: yup.string().oneOf(['HARD', 'SOFT']).required('Tipo é obrigatório'),
  category: yup
    .string()
    .oneOf(['TECHNICAL', 'SOFT', 'LEADERSHIP', 'DOMAIN', 'CORE'])
    .required('Categoria é obrigatória'),
  defaultLevel: yup
    .string()
    .oneOf(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
    .optional(),
});

export const projectSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: yup.string().optional(),
  startDate: yup.date().required('Data de início é obrigatória'),
  endDate: yup.date().optional().min(yup.ref('startDate'), 'Data de término deve ser após a data de início'),
  status: yup
    .string()
    .oneOf(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
    .required('Status é obrigatório'),
  budget: yup.number().positive('Orçamento deve ser positivo').optional(),
  ownerId: yup.string().optional(),
});

export const goalSchema = yup.object({
  employeeId: yup.string().required('Funcionário é obrigatório'),
  title: yup.string().required('Título é obrigatório').min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: yup.string().optional(),
  type: yup
    .string()
    .oneOf(['PERFORMANCE', 'DEVELOPMENT', 'PROJECT', 'CAREER', 'ORGANIZATIONAL'])
    .required('Tipo é obrigatório'),
  priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).required('Prioridade é obrigatória'),
  status: yup
    .string()
    .oneOf(['NOT_STARTED', 'IN_PROGRESS', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'CANCELLED'])
    .required('Status é obrigatório'),
  startDate: yup.date().required('Data de início é obrigatória'),
  targetDate: yup.date().required('Data alvo é obrigatória').min(yup.ref('startDate'), 'Data alvo deve ser após a data de início'),
  progress: yup.number().min(0).max(1).optional(),
});

