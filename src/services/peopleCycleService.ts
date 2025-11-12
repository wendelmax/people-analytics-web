import { PeopleCycle, CycleTemplate, CYCLE_TEMPLATES } from '../types/peopleCycle';

// Mock Data inicial
let mockCycles: PeopleCycle[] = [
  {
    id: 'c1',
    title: 'Ciclo de Avaliação 2024 - H1',
    year: 2024,
    status: 'ACTIVE',
    model: 'AMBEV_AB_INBEV',
    progress: 65,
    participantsCount: 145,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    stages: [
      {
        id: 's1',
        name: 'Definição de Metas',
        description: 'Definição de KPIs',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'COMPLETED',
        type: 'SELF_EVAL'
      },
      {
        id: 's2',
        name: 'Avaliação LCM & Resultados',
        description: 'Avaliação 360 e Gestor',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        status: 'IN_PROGRESS',
        type: 'MANAGER_EVAL'
      },
      {
        id: 's3',
        name: 'OPR (Calibração)',
        description: 'Reunião de Calibração',
        startDate: '2024-06-16',
        endDate: '2024-06-25',
        status: 'PENDING',
        type: 'CALIBRATION_OPR'
      }
    ]
  }
];

export const peopleCycleService = {
  getTemplates: async (): Promise<CycleTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(CYCLE_TEMPLATES), 500);
    });
  },

  getAllCycles: async (): Promise<PeopleCycle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCycles), 800);
    });
  },

  getCycleById: async (id: string): Promise<PeopleCycle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCycles.find(c => c.id === id)), 500);
    });
  },

  createCycle: async (data: { title: string; model: string }): Promise<PeopleCycle> => {
    return new Promise((resolve) => {
      const template = CYCLE_TEMPLATES.find(t => t.id === data.model);
      const newCycle: PeopleCycle = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        year: new Date().getFullYear(),
        status: 'DRAFT',
        model: data.model,
        progress: 0,
        participantsCount: 0,
        startDate: data.startDate,
        endDate: data.endDate,
        stages: template?.defaultStages.map((s, index) => ({
          id: `stage-${index}`,
          ...s,
          startDate: '',
          endDate: '',
          status: 'PENDING'
        })) || []
      };
      mockCycles = [...mockCycles, newCycle];
      setTimeout(() => resolve(newCycle), 800);
    });
  }
};

