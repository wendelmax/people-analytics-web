export enum AllocationStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ProjectAllocation {
  id: string;
  employeeId: string;
  projectId: string;
  role?: string;
  allocationPercentage: number; // 0-100
  startDate: string;
  endDate?: string;
  status: AllocationStatus;
  notes?: string;
  employee?: import('./index').Employee;
  project?: import('./index').Project;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAllocation {
  id: string;
  employeeId: string;
  taskId: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate: string;
  dueDate?: string;
  status: AllocationStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
  employee?: import('./index').Employee;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectAllocationDto {
  employeeId: string;
  projectId: string;
  role?: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface UpdateProjectAllocationDto extends Partial<CreateProjectAllocationDto> {
  status?: AllocationStatus;
}

export interface CreateTaskAllocationDto {
  employeeId: string;
  taskId: string;
  projectId?: string;
  estimatedHours?: number;
  startDate: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
}

export interface UpdateTaskAllocationDto extends Partial<CreateTaskAllocationDto> {
  status?: AllocationStatus;
  actualHours?: number;
}

