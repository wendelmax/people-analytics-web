export type CycleStageType = 
  | 'GOAL_SETTING' 
  | 'SELF_REVIEW' 
  | 'MANAGER_REVIEW' 
  | 'PEER_REVIEW' 
  | 'CALIBRATION'
  | 'FEEDBACK' 
  | 'CLOSING'
  | 'REVIEW_180_360';

export type CycleStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface CycleStage {
  id: string;
  name: string;
  type: CycleStageType;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  description?: string;
}

export interface CycleTemplate {
  id: string;
  name: string;
  description: string;
  companyReference?: string; // Ex: "Modelo Estilo Ambev"
  stages: Omit<CycleStage, 'id' | 'startDate' | 'endDate' | 'status'>[];
  icon: string;
  color: string;
}

export type Review180360Mode = '180_ONLY' | '360_ONLY' | 'BOTH';

export interface Review180360Config {
  enabled: boolean;
  mode: Review180360Mode;
  seniorLevelThreshold: string;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  description?: string;
  status: CycleStatus;
  startDate: string;
  endDate: string;
  templateId: string;
  stages: CycleStage[];
  progress: number; // 0-100
  participantsCount: number;
  review180360?: Review180360Config;
}

