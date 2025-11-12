import { CycleTemplate, PerformanceCycle } from '../types/performanceCycle';

// Templates baseados em benchmarking real
export const CYCLE_TEMPLATES: CycleTemplate[] = [
  {
    id: 'ambev-style',
    name: 'Ciclo de Alta Performance (PDCA)',
    description: 'Modelo focado em meritocracia, calibração organizacional e alinhamento cultural. Ideal para culturas orientadas a resultados.',
    companyReference: 'Inspirado em Ambev / AB InBev',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-800',
    stages: [
      { name: 'Definição de Metas', type: 'GOAL_SETTING', description: 'Definição de metas financeiras e comportamentais.' },
      { name: 'Avaliação de Competências', type: 'SELF_REVIEW', description: 'Autoavaliação baseada em competências de liderança e comportamentais.' },
      { name: 'Avaliação do Gestor', type: 'MANAGER_REVIEW', description: 'Gestor avalia entregas e aderência à cultura.' },
      { name: 'Calibração Organizacional', type: 'CALIBRATION', description: 'Reunião de calibração para definição do 9-Box e sucessão.' },
      { name: 'Feedback & PDI', type: 'FEEDBACK', description: 'Devolutiva final e plano de desenvolvimento individual.' }
    ]
  },
  {
    id: 'tech-agile',
    name: 'Checkpoint Contínuo',
    description: 'Ciclos curtos com foco em desenvolvimento, feedback entre pares e growth mindset. Menos burocracia, mais conversas.',
    companyReference: 'Inspirado em IBM / Google',
    icon: '💻',
    color: 'bg-blue-100 text-blue-800',
    stages: [
      { name: 'Check-in de Metas (OKRs)', type: 'GOAL_SETTING', description: 'Alinhamento trimestral de objetivos.' },
      { name: 'Peer Review (360)', type: 'PEER_REVIEW', description: 'Coleta de feedback de pares e stakeholders.' },
      { name: 'Reflexão de Crescimento', type: 'SELF_REVIEW', description: 'Reflexão sobre skills e badges adquiridos.' },
      { name: 'Conversa de Carreira', type: 'FEEDBACK', description: 'Foco no futuro e desenvolvimento.' }
    ]
  },
  {
    id: 'traditional',
    name: 'Ciclo Anual Padrão',
    description: 'Modelo tradicional estruturado com avaliação de meio de ano e fim de ano. Equilíbrio entre estabilidade e avaliação.',
    companyReference: 'Inspirado em Bosch / GE',
    icon: '🏭',
    color: 'bg-gray-100 text-gray-800',
    stages: [
      { name: 'Planejamento Anual', type: 'GOAL_SETTING', description: 'Definição de metas anuais.' },
      { name: 'Revisão Mid-Year', type: 'MANAGER_REVIEW', description: 'Acompanhamento parcial de meio de ano.' },
      { name: 'Avaliação Final', type: 'MANAGER_REVIEW', description: 'Avaliação conclusiva do ano.' },
      { name: 'Feedback Formal', type: 'FEEDBACK', description: 'Reunião formal de feedback e bônus.' }
    ]
  }
];

// Mock Data para Ciclos Existentes
const mockCycles: PerformanceCycle[] = [
  {
    id: '1',
    name: 'Ciclo 2024 - Liderança',
    status: 'COMPLETED',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    templateId: 'ambev-style',
    progress: 100,
    participantsCount: 150,
    review180360: {
      enabled: true,
      mode: 'BOTH',
      seniorLevelThreshold: 'Senior',
    },
    stages: [
      { id: 's1', name: 'Definição de Metas', type: 'GOAL_SETTING', startDate: '2024-01-01', endDate: '2024-02-28', status: 'COMPLETED' },
      { id: 's2', name: 'Avaliação de Competências', type: 'SELF_REVIEW', startDate: '2024-06-01', endDate: '2024-06-30', status: 'COMPLETED' },
      { id: 's2b', name: 'Avaliação 180/360', type: 'REVIEW_180_360', startDate: '2024-07-01', endDate: '2024-07-31', status: 'COMPLETED', description: 'Avaliação 180° para cargos abaixo de Senior e 360° para Senior e acima' },
      { id: 's3', name: 'Calibração Organizacional', type: 'CALIBRATION', startDate: '2024-11-01', endDate: '2024-11-30', status: 'COMPLETED' },
      { id: 's4', name: 'Feedback Final', type: 'FEEDBACK', startDate: '2024-12-01', endDate: '2024-12-20', status: 'COMPLETED' }
    ]
  },
  {
    id: '2',
    name: 'Ciclo 2025 - Liderança',
    status: 'ACTIVE',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    templateId: 'ambev-style',
    progress: 45,
    participantsCount: 160,
    review180360: {
      enabled: true,
      mode: 'BOTH',
      seniorLevelThreshold: 'Senior',
    },
    stages: [
      { id: 's1-2025', name: 'Definição de Metas', type: 'GOAL_SETTING', startDate: '2025-01-01', endDate: '2025-02-28', status: 'COMPLETED' },
      { id: 's2-2025', name: 'Avaliação de Competências', type: 'SELF_REVIEW', startDate: '2025-06-01', endDate: '2025-06-30', status: 'COMPLETED' },
      { id: 's2b-2025', name: 'Avaliação 180/360', type: 'REVIEW_180_360', startDate: '2025-07-01', endDate: '2025-07-31', status: 'IN_PROGRESS', description: 'Avaliação 180° para cargos abaixo de Senior e 360° para Senior e acima' },
      { id: 's3-2025', name: 'Calibração Organizacional', type: 'CALIBRATION', startDate: '2025-11-01', endDate: '2025-11-30', status: 'PENDING' },
      { id: 's4-2025', name: 'Feedback Final', type: 'FEEDBACK', startDate: '2025-12-01', endDate: '2025-12-20', status: 'PENDING' }
    ]
  }
];

export const performanceCycleService = {
  getTemplates: async (): Promise<CycleTemplate[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(CYCLE_TEMPLATES), 500));
  },

  getAllCycles: async (): Promise<PerformanceCycle[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockCycles), 500));
  },

  getCycleById: async (id: string): Promise<PerformanceCycle> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cycle = mockCycles.find(c => c.id === id);
        if (cycle) {
          resolve(cycle);
        } else {
          reject(new Error(`Cycle with id ${id} not found`));
        }
      }, 500);
    });
  },

  createCycle: async (cycle: Partial<PerformanceCycle>): Promise<PerformanceCycle> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCycle = {
          ...cycle,
          id: Math.random().toString(36).substr(2, 9),
          status: 'DRAFT',
          progress: 0,
        } as PerformanceCycle;
        mockCycles.push(newCycle);
        resolve(newCycle);
      }, 800);
    });
  }
};

