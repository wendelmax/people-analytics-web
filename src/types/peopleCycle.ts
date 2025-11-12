export type CycleStatus = 'DRAFT' | 'ACTIVE' | 'CALIBRATION' | 'FINISHED';

export type EvaluationModelType = 
  | 'AMBEV_AB_INBEV' // Foco em Meritocracia (LCM + Metas)
  | 'AGILE_IBM'      // Foco em Checkpoints e Feedback Contínuo
  | 'QUALITY_BOSCH'  // Foco em Competência Técnica e Qualidade
  | 'STANDARD_9BOX'; // Modelo Padrão de Mercado

export interface CycleStage {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  type: 'SELF_EVAL' | 'MANAGER_EVAL' | 'CALIBRATION_OPR' | 'FEEDBACK';
}

export interface CycleTemplate {
  id: EvaluationModelType;
  name: string;
  description: string;
  methodology: string;
  defaultStages: {
    name: string;
    type: CycleStage['type'];
    description: string;
  }[];
}

export interface PeopleCycle {
  id: string;
  title: string;
  year: number;
  status: CycleStatus;
  model: EvaluationModelType;
  progress: number;
  stages: CycleStage[];
  participantsCount: number;
  startDate: string;
  endDate: string;
}

export const CYCLE_TEMPLATES: CycleTemplate[] = [
  {
    id: 'AMBEV_AB_INBEV',
    name: 'Modelo Meritocracia (Estilo AB InBev)',
    description: 'Ciclo focado em alta performance, avaliando O QUE (Metas) e COMO (LCM - Leadership Competencies Model).',
    methodology: 'Matriz 9-Box baseada em Resultados vs. Competências. Inclui etapa forte de OPR (Organization & People Review).',
    defaultStages: [
      { name: 'Definição de Metas', type: 'SELF_EVAL', description: 'Definição de KPIs financeiros e operacionais.' },
      { name: 'Avaliação LCM & Resultados', type: 'MANAGER_EVAL', description: 'Avaliação de competências de liderança e atingimento de metas.' },
      { name: 'OPR (Calibração)', type: 'CALIBRATION_OPR', description: 'Reunião de calibração para definir posições no 9-Box e sucessão.' },
      { name: 'Feedback & PDI', type: 'FEEDBACK', description: 'Retorno formal e plano de desenvolvimento.' }
    ]
  },
  {
    id: 'AGILE_IBM',
    name: 'Modelo Checkpoint (Estilo IBM)',
    description: 'Foco em feedback contínuo e objetivos de curto prazo (Agile). Menos burocracia, mais conversas.',
    methodology: 'Avaliação baseada em 5 dimensões de impacto. Ciclos mais curtos (Trimestrais).',
    defaultStages: [
      { name: 'Checkpoint de Metas', type: 'SELF_EVAL', description: 'Reflexão sobre entregas do trimestre.' },
      { name: 'Avaliação de Impacto', type: 'MANAGER_EVAL', description: 'Gestor avalia impacto no negócio e no time.' },
      { name: 'Conversa de Desenvolvimento', type: 'FEEDBACK', description: 'Feedback focado em crescimento futuro.' }
    ]
  },
  {
    id: 'QUALITY_BOSCH',
    name: 'Modelo Competência & Qualidade (Estilo Bosch)',
    description: 'Estruturado e focado em profundidade técnica e qualidade de entrega.',
    methodology: 'Matriz de Competências Técnicas e Comportamentais.',
    defaultStages: [
      { name: 'Auto-avaliação Técnica', type: 'SELF_EVAL', description: 'Avaliação profunda de skills técnicos.' },
      { name: 'Avaliação Funcional', type: 'MANAGER_EVAL', description: 'Validação técnica e comportamental.' },
      { name: 'Comitê de Carreira', type: 'CALIBRATION_OPR', description: 'Definição de promoções e movimentos laterais.' },
      { name: 'Planejamento de Carreira', type: 'FEEDBACK', description: 'Definição de próximos passos na carreira.' }
    ]
  }
];

