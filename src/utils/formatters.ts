import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    return format(parseISO(date.toString()), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return date.toString();
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    return format(parseISO(date.toString()), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch {
    return date.toString();
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatSkillLevel = (level: string): string => {
  const levels: Record<string, string> = {
    BEGINNER: 'Iniciante',
    INTERMEDIATE: 'Intermediário',
    ADVANCED: 'Avançado',
    EXPERT: 'Especialista',
  };
  return levels[level] || level;
};

export const formatGoalStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    NOT_STARTED: 'Não Iniciado',
    IN_PROGRESS: 'Em Progresso',
    ON_TRACK: 'No Prazo',
    AT_RISK: 'Em Risco',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  };
  return statuses[status] || status;
};

export const formatGoalPriority = (priority: string): string => {
  const priorities: Record<string, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
    CRITICAL: 'Crítica',
  };
  return priorities[priority] || priority;
};

export const formatGoalType = (type: string): string => {
  const types: Record<string, string> = {
    PROJECT: 'Projeto',
    DEVELOPMENT: 'Desenvolvimento',
    PERFORMANCE: 'Performance',
    PERSONAL: 'Pessoal',
  };
  return types[type] || type;
};

export const formatProjectStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    PLANNING: 'Planejamento',
    IN_PROGRESS: 'Em Progresso',
    COMPLETED: 'Concluído',
    ON_HOLD: 'Em Espera',
    CANCELLED: 'Cancelado',
  };
  return statuses[status] || status;
};

export const formatPriority = (priority: string): string => {
  const priorities: Record<string, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
    CRITICAL: 'Crítica',
  };
  return priorities[priority] || priority;
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

