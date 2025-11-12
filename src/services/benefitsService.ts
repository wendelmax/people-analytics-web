import apiClient from '../api/client';

export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  cost: number;
  employeeCost?: number; // Custo para o funcionário
  coverage: string;
  eligibility: string[];
  allowsDependents?: boolean; // Permite adicionar dependentes
  enrollmentPeriod?: {
    start: string;
    end: string;
  };
  status: string;
}

export interface Dependent {
  id: string;
  name: string;
  relationship: 'SPOUSE' | 'CHILD' | 'OTHER';
  birthDate: string;
  cpf?: string;
}

export interface Enrollment {
  id: string;
  employeeId: string;
  benefitId: string;
  benefit?: Benefit; // Denormalizado para facilitar
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  enrolledAt: string;
  effectiveDate: string;
  endDate?: string;
  dependents?: Dependent[];
  coverageDetails?: Record<string, unknown>;
}

export interface Compensation {
  id: string;
  employeeId: string;
  baseSalary: number;
  currency: string;
  effectiveDate: string;
  components: {
    type: string;
    amount: number;
    frequency: string;
  }[];
}

export interface CreateBenefitDto {
  name: string;
  description: string;
  category: string;
  type: string;
  cost: number;
  coverage: string;
  eligibility: string[];
  enrollmentPeriod?: {
    start: string;
    end: string;
  };
}

export interface UpdateBenefitDto extends Partial<CreateBenefitDto> {
  status?: string;
}

export interface CreateEnrollmentDto {
  benefitId: string;
  effectiveDate: string;
  coverageDetails?: Record<string, unknown>;
}

export const benefitsService = {
  getAll: async (): Promise<Benefit[]> => {
    return await apiClient.get('/benefits');
  },

  getById: async (id: string): Promise<Benefit> => {
    return await apiClient.get(`/benefits/${id}`);
  },

  create: async (data: CreateBenefitDto): Promise<Benefit> => {
    return await apiClient.post('/benefits', data);
  },

  update: async (id: string, data: UpdateBenefitDto): Promise<Benefit> => {
    return await apiClient.patch(`/benefits/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/benefits/${id}`);
  },

  getMyBenefits: async (): Promise<Benefit[]> => {
    return await apiClient.get('/benefits/my');
  },

  getEnrollments: async (benefitId?: string): Promise<Enrollment[]> => {
    const params = benefitId ? { benefitId } : {};
    return await apiClient.get('/benefits/enrollments', { params });
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    return await apiClient.get('/benefits/my/enrollments');
  },

  enroll: async (data: CreateEnrollmentDto): Promise<Enrollment> => {
    return await apiClient.post('/benefits/enroll', data);
  },

  cancelEnrollment: async (enrollmentId: string): Promise<void> => {
    await apiClient.delete(`/benefits/enrollments/${enrollmentId}`);
  },

  getCompensation: async (employeeId?: string): Promise<Compensation> => {
    const endpoint = employeeId ? `/benefits/compensation/${employeeId}` : '/benefits/my/compensation';
    return await apiClient.get(endpoint);
  },

  updateCompensation: async (employeeId: string, data: Partial<Compensation>): Promise<Compensation> => {
    return await apiClient.patch(`/benefits/compensation/${employeeId}`, data);
  },

  addDependent: async (enrollmentId: string, dependent: Omit<Dependent, 'id'>): Promise<Enrollment> => {
    return await apiClient.post(`/benefits/enrollments/${enrollmentId}/dependents`, dependent);
  },

  removeDependent: async (enrollmentId: string, dependentId: string): Promise<Enrollment> => {
    return await apiClient.delete(`/benefits/enrollments/${enrollmentId}/dependents/${dependentId}`);
  },
};

