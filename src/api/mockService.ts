import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { mockData, mockPayrolls, mockSeparations, mockContractors, mockContractLabor, mockContractLaborAttendance, mockServiceRequests, mockServiceProposals, mockServiceBookings, mockJobs, mockCandidates, mockApplications, MockJob, MockCandidate, MockApplication } from './mockData';
import {
  Employee,
  Department,
  Position,
  Skill,
  Project,
  Training,
  Goal,
  PerformanceReview,
  Feedback,
  LeaveRequest,
  LeaveType,
  LeaveBalance,
  Attendance,
  AttendanceSummary,
  Notification,
  AnalyticsOverview,
  PerformanceTrend,
  DashboardData,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  CreateLeaveRequestDto,
  LeaveRequestStatus,
  AttendanceStatus,
  Separation,
} from '../types';
import { ProjectAllocation, AllocationStatus, CreateProjectAllocationDto } from '../types/allocation';
import { mockAllocationData, mockMentoringRelationships } from './mockData';
import { MentoringRelationship, MentoringStatus, CreateMentoringDto } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateDelay = async () => {
  await delay(300 + Math.random() * 200);
};

const findById = <T extends { id: string }>(items: T[], id: string): T | undefined => {
  return items.find((item) => item.id === id);
};

const filterByQuery = <T>(items: T[], query: string, searchFields: (keyof T)[]): T[] => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(lowerQuery);
    })
  );
};

export const mockService = {
  async request<T = Record<string, unknown>>(config: AxiosRequestConfig): Promise<T> {
    await simulateDelay();

    const { method, url, data, params } = config;
    // Remove baseURL if present and leading slashes
    let path = url || '';
    if (path.includes('://')) {
      const urlObj = new URL(path);
      path = urlObj.pathname;
    }
    path = path.replace(/^\/+/, '');
    const pathParts = path.split('/').filter(Boolean);

    try {
      const methodUpper = method?.toUpperCase();
      if (methodUpper === 'GET') {
        return this.handleGet<T>(pathParts, params);
      } else if (methodUpper === 'POST') {
        return this.handlePost<T>(pathParts, data);
      } else if (methodUpper === 'PATCH') {
        return this.handlePatch<T>(pathParts, data);
      } else if (methodUpper === 'DELETE') {
        return this.handleDelete<T>(pathParts);
      }
      throw new Error(`Method ${method} not implemented`);
    } catch (error: unknown) {
      // Convert errors to Axios-like error format
      const axiosError: Error = new Error(error instanceof Error ? error.message : 'Request failed');
      axiosError.response = {
        status: error.response?.status || 400,
        data: error.response?.data || { message: error.message || 'Request failed' },
      };
      throw axiosError;
    }
  },

  handleGet<T>(pathParts: string[], params?: Record<string, unknown>): T {
    const [resource, id, action, subAction] = pathParts;

    if (resource === 'employee' && id === 'me') {
      if (action === 'profile') {
        return mockData.dashboardData.profile as T;
      }
      if (action === 'dashboard') {
        return mockData.dashboardData as T;
      }
      if (action === 'leaves') {
        const status = params?.status;
        let leaves = [...mockData.leaveRequests];
        if (status) {
          leaves = leaves.filter((l) => l.status === status);
        }
        return leaves as T;
      }
      if (action === 'leave-balances') {
        return mockData.leaveBalances as T;
      }
      if (action === 'attendance') {
        // Handle /employee/me/attendance/summary
        if (pathParts[3] === 'summary') {
          return mockData.attendanceSummary as T;
        }
        // Handle /employee/me/attendance with params
        return mockData.attendance as T;
      }
      if (action === 'goals') {
        return mockData.goals as T;
      }
      if (action === 'trainings') {
        return mockData.trainings as T;
      }
      if (action === 'performance-reviews') {
        return [] as T;
      }
      if (action === 'payrolls') {
        let payrolls = [...mockPayrolls];
        if (params?.year) {
          const year = String(params.year);
          payrolls = payrolls.filter(p => p.period.startsWith(year));
        }
        // Ordenar por período decrescente
        return payrolls.sort((a, b) => b.period.localeCompare(a.period)) as T;
      }
    }

    if (resource === 'employee') {
      if (id) {
        const employee = findById(mockData.employees, id);
        if (!employee) throw new Error('Employee not found');
        return employee as T;
      }
      return mockData.employees as T;
    }

    if (resource === 'departments') {
      if (id) {
        const dept = findById(mockData.departments, id);
        if (!dept) throw new Error('Department not found');
        return dept as T;
      }
      return mockData.departments as T;
    }

    if (resource === 'departments' && id && action === 'employees') {
      const employees = mockData.employees.filter((e) => e.departmentId === id);
      return employees as T;
    }

    if (resource === 'positions') {
      if (id) {
        const pos = findById(mockData.positions, id);
        if (!pos) throw new Error('Position not found');
        return pos as T;
      }
      return mockData.positions as T;
    }

    if (resource === 'skills') {
      if (id) {
        const skill = findById(mockData.skills, id);
        if (!skill) throw new Error('Skill not found');
        return skill as T;
      }
      return mockData.skills as T;
    }

    if (resource === 'projects') {
      if (id) {
        const project = findById(mockData.projects, id);
        if (!project) throw new Error('Project not found');
        return project as T;
      }
      return mockData.projects as T;
    }

    if (resource === 'trainings') {
      if (id) {
        const training = findById(mockData.trainings, id);
        if (!training) throw new Error('Training not found');
        return training as T;
      }
      return mockData.trainings as T;
    }

    if (resource === 'goals') {
      if (id) {
        const goal = findById(mockData.goals, id);
        if (!goal) throw new Error('Goal not found');
        return goal as T;
      }
      return mockData.goals as T;
    }

    if (resource === 'leaves') {
      if (action === 'types') {
        if (id) {
          const type = findById(mockData.leaveTypes, id);
          if (!type) throw new Error('Leave type not found');
          return type as T;
        }
        return mockData.leaveTypes as T;
      }
      if (action === 'requests') {
        if (id) {
          const request = findById(mockData.leaveRequests, id);
          if (!request) throw new Error('Leave request not found');
          return request as T;
        }
        return mockData.leaveRequests as T;
      }
      if (action === 'balances' && id) {
        const balances = mockData.leaveBalances.filter((b) => b.employeeId === id);
        return balances as T;
      }
    }

    if (resource === 'policies') {
      if (id === 'my' && action === 'acknowledgments') {
        return mockData.policyAcknowledgments as T;
      }
      if (id) {
        const policy = findById(mockData.policies, id);
        if (!policy) throw new Error('Policy not found');
        return policy as T;
      }
      if (action === 'acknowledgments') {
        return mockData.policyAcknowledgments as T;
      }
      return mockData.policies as T;
    }

    if (resource === 'separations') {
      if (id) {
        const separation = findById(mockData.separations, id);
        if (!separation) throw new Error('Separation not found');
        const employee = findById(mockData.employees, separation.employeeId);
        return { ...separation, employee } as T;
      }
      const separationsWithEmployees = mockData.separations.map(sep => {
        const employee = findById(mockData.employees, sep.employeeId);
        return { ...sep, employee };
      });
      return separationsWithEmployees as T;
    }

    if (resource === 'leaves') {
      if (action === 'types') {
        if (id) {
          const type = findById(mockData.leaveTypes, id);
          if (!type) throw new Error('Leave type not found');
          return type as T;
        }
        return mockData.leaveTypes as T;
      }
    }

    if (resource === 'attendance') {
      if (id && action === 'summary') {
        return mockData.attendanceSummary as T;
      }
      if (id) {
        const attendance = findById(mockData.attendance, id);
        if (!attendance) throw new Error('Attendance not found');
        return attendance as T;
      }
      if (action === 'summary') {
        return mockData.attendanceSummary as T;
      }
      if (action === 'work-schedules') {
        return [] as T;
      }
      return mockData.attendance as T;
    }

    if (resource === 'notifications') {
      // Handle /notifications/user/{userId}/unread
      if (id === 'user' && pathParts[2] && pathParts[3] === 'unread') {
        const userId = pathParts[2];
        const unread = mockData.notifications.filter(
          (n) => n.userId === userId && n.status === 'UNREAD'
        );
        return unread as T;
      }
      if (id) {
        const notification = findById(mockData.notifications, id);
        if (!notification) throw new Error('Notification not found');
        return notification as T;
      }
      return mockData.notifications as T;
    }

    // Payroll Management Routes
    if (resource === 'payroll') {
      // /payroll/cycles - Lista de ciclos de folha
      if (id === 'cycles') {
        return mockData.payrollCycles as T;
      }

      // /payroll/cycles/:id
      if (action === 'cycles') {
        const cycle = findById(mockData.payrollCycles, id);
        if (!cycle) throw new Error('Payroll cycle not found');

        // /payroll/cycles/:id/departments
        if (pathParts[3] === 'departments') {
          return mockData.departmentPayrollSummaries.filter((d: any) => d.payrollCycleId === id) as T;
        }

        // /payroll/cycles/:id/cost-centers
        if (pathParts[3] === 'cost-centers') {
          return [] as T; // TODO: Implementar depois
        }

        // /payroll/cycles/:id/employees
        if (pathParts[3] === 'employees') {
          // Filtrar detalhes de funcionários baseado no ciclo
          const cycle = findById(mockData.payrollCycles, id);
          if (!cycle) return [] as T;
          
          // Retornar detalhes dos funcionários para o ciclo atual
          return mockData.employeePayrollDetails.filter((detail: any) => {
            // Filtrar por período do ciclo (simplificado - todos os funcionários ativos)
            return true;
          }) as T;
        }

        // /payroll/cycles/:id/approvals
        if (pathParts[3] === 'approvals') {
          return mockData.payrollApprovals.filter((a: any) => a.payrollCycleId === id) as T;
        }

        // /payroll/cycles/:id/notifications
        if (pathParts[3] === 'notifications') {
          return mockData.payrollNotifications.filter((n: any) => n.payrollCycleId === id) as T;
        }

        // /payroll/cycles/:id/reports
        if (pathParts[3] === 'reports') {
          return mockData.payrollReports.filter((r: any) => r.payrollCycleId === id) as T;
        }

        return cycle as T;
      }

      // /payroll/dashboard/stats
      if (id === 'dashboard' && action === 'stats') {
        const currentCycle = mockData.payrollCycles[0];
        return {
          currentCycle,
          totalEmployees: mockData.employees.length,
          pendingApprovals: mockData.payrollApprovals.filter((a: any) => a.status === 'PENDING').length,
          thisMonthGross: currentCycle.totalGross,
          thisMonthNet: currentCycle.totalNet,
        } as T;
      }

      // /payroll/my/payslips - PARA FUNCIONÁRIOS
      if (id === 'my' && action === 'payslips') {
        return mockData.payrolls.filter((p: any) => p.employeeId === '1') as T;
      }

      // /payroll/reports/:id/download
      if (id === 'reports' && action) {
        const reportId = action;
        if (pathParts[3] === 'download') {
          const report = findById(mockData.payrollReports, reportId);
          if (!report) throw new Error('Report not found');
          // Retornar um blob simulado (na prática seria um arquivo real)
          return new Blob(['Mock file content'], { type: 'application/pdf' }) as T;
        }
      }
    }

    if (resource === 'benefits') {
      // /benefits/my - Meus benefícios disponíveis
      if (id === 'my') {
        if (action === 'enrollments') {
          // /benefits/my/enrollments - Minhas inscrições
          return mockData.enrollments.filter((e: any) => e.employeeId === '1') as T;
        }
        // /benefits/my - Todos os benefícios (para o funcionário escolher)
        return mockData.benefits as T;
      }

      // /benefits/enrollments - Lista de inscrições (admin)
      if (action === 'enrollments') {
        if (id) {
          // /benefits/enrollments/:id - Inscrição específica
          const enrollment = findById(mockData.enrollments, id);
          if (!enrollment) throw new Error('Enrollment not found');
          return enrollment as T;
        }
        return mockData.enrollments as T;
      }

      // /benefits/enroll - Endpoint de inscrição (tratado no POST)
      
      // /benefits/:id - Benefício específico
      if (id) {
        const benefit = findById(mockData.benefits, id);
        if (!benefit) throw new Error('Benefit not found');
        return benefit as T;
      }

      // /benefits - Todos os benefícios
      return mockData.benefits as T;
    }

    if (resource === 'analytics') {
      if (action === 'overview') {
        return mockData.analyticsOverview as T;
      }
      if (action === 'performance-trend') {
        return mockData.performanceTrends as T;
      }
      if (action === 'employee' && id) {
        return {
          employee: findById(mockData.employees, id),
          performance: mockData.performanceTrends,
        } as T;
      }
    }

    if (resource === 'feedback') {
      if (id) {
        const feedback = findById(mockData.feedback, id);
        if (!feedback) throw new Error('Feedback not found');
        return feedback as T;
      }
      return mockData.feedback as T;
    }

    if (resource === 'performance-reviews' || resource === 'performance') {
      if (id) {
        const review = findById(mockData.performanceReviews, id);
        if (!review) throw new Error('Performance review not found');
        return review as T;
      }
      return mockData.performanceReviews as T;
    }

    if (resource === 'knowledge-base') {
      return [] as T;
    }

    if (resource === 'mentoring') {
      if (id) {
        const relationship = mockMentoringRelationships.find((r) => r.id === id);
        if (!relationship) throw new Error('Mentoring relationship not found');
        return relationship as T;
      }
      return mockMentoringRelationships as T;
    }

    if (resource === 'chatbot') {
      if (action === 'chat') {
        return { response: 'Esta é uma resposta mockada do chatbot.' } as T;
      }
    }

    if (resource === 'insights') {
      return [] as T;
    }

    if (resource === 'recruitment') {
      if (id === 'jobs') {
        if (action) {
          const job = findById(mockJobs, action);
          if (!job) throw new Error('Job not found');
          return job as T;
        }
        return mockJobs as T;
      }

      if (id === 'candidates') {
        if (action) {
          const candidate = findById(mockCandidates, action);
          if (!candidate) throw new Error('Candidate not found');
          return candidate as T;
        }
        if (params?.jobId) {
          return mockCandidates.filter((c) => c.jobId === params.jobId) as T;
        }
        return mockCandidates as T;
      }

      if (id === 'applications') {
        if (params?.jobId) {
          return mockApplications.filter((a) => a.jobId === params.jobId) as T;
        }
        return mockApplications as T;
      }

      if (id === 'my' && action === 'applications') {
        return mockApplications.filter((a) => a.candidateId === '1') as T;
      }

      if (id === 'pipeline') {
        if (action === 'configs') {
          if (pathParts[3]) {
            const configId = pathParts[3];
            const defaultConfig = {
              id: 'default',
              name: 'Pipeline Padrão',
              description: 'Configuração padrão do pipeline de recrutamento',
              stages: [
                {
                  id: 'new',
                  name: 'Novos',
                  description: 'Candidatos que acabaram de se inscrever',
                  order: 1,
                  color: 'bg-blue-100 border-blue-300',
                  isActive: true,
                },
                {
                  id: 'screening',
                  name: 'Triagem',
                  description: 'Análise inicial de currículos',
                  order: 2,
                  color: 'bg-yellow-100 border-yellow-300',
                  isActive: true,
                },
                {
                  id: 'interview',
                  name: 'Entrevista',
                  description: 'Entrevistas técnicas e comportamentais',
                  order: 3,
                  color: 'bg-purple-100 border-purple-300',
                  isActive: true,
                },
                {
                  id: 'offer',
                  name: 'Oferta',
                  description: 'Proposta enviada ao candidato',
                  order: 4,
                  color: 'bg-green-100 border-green-300',
                  isActive: true,
                },
                {
                  id: 'hired',
                  name: 'Contratado',
                  description: 'Candidato aceitou a oferta',
                  order: 5,
                  color: 'bg-emerald-100 border-emerald-300',
                  isActive: true,
                },
              ],
              defaultStages: ['new', 'screening', 'interview', 'offer', 'hired'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return defaultConfig as T;
          }
          return [
            {
              id: 'default',
              name: 'Pipeline Padrão',
              description: 'Configuração padrão do pipeline de recrutamento',
              stages: [],
              defaultStages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ] as T;
        }

        if (action === 'initialize') {
          return { success: true, message: 'Pipeline inicializado com sucesso' } as T;
        }

        const pipeline: Record<string, any> = {
          new: mockCandidates.filter((c) => c.status === 'NEW'),
          screening: mockCandidates.filter((c) => c.status === 'SCREENING'),
          interview: mockCandidates.filter((c) => c.status === 'INTERVIEW'),
          offer: mockCandidates.filter((c) => c.status === 'OFFER'),
          hired: mockCandidates.filter((c) => c.status === 'HIRED'),
        };

        if (params?.jobId) {
          Object.keys(pipeline).forEach((key) => {
            pipeline[key] = pipeline[key].filter((c: MockCandidate) => c.jobId === params.jobId);
          });
        }

        return pipeline as T;
      }
    }

    // Handle allocations - /allocations/projects
    if (resource === 'allocations' && id === 'projects') {
      return mockAllocationData.projectAllocations as T;
    }

    // Handle allocations - /projects/{id}/allocations
    if (resource === 'projects' && id && action === 'allocations') {
      const allocations = mockAllocationData.projectAllocations.filter(
        (a) => a.projectId === id
      );
      return allocations as T;
    }

    // Handle allocations - /employees/{id}/project-allocations
    if (resource === 'employees' && id && action === 'project-allocations') {
      const allocations = mockAllocationData.projectAllocations.filter(
        (a) => a.employeeId === id
      );
      return allocations as T;
    }

    // Contract Labor routes
    if (resource === 'contract-labor') {
      // /contract-labor/contractors
      if (id === 'contractors') {
        if (action) {
          const contractor = findById(mockContractors, action);
          if (!contractor) throw new Error('Contractor not found');
          return contractor as T;
        }
        return mockContractors as T;
      }
      
      // /contract-labor/:id/attendance
      if (id && action === 'attendance') {
        const attendance = mockContractLaborAttendance.filter(a => a.laborId === id);
        return attendance as T;
      }
      
      // /contract-labor/:id
      if (id) {
        const labor = findById(mockContractLabor, id);
        if (!labor) throw new Error('Contract labor not found');
        return labor as T;
      }
      
      // /contract-labor
      return mockContractLabor as T;
    }

    throw new Error(`Route not found: ${pathParts.join('/')}`);
  },

  async handlePost<T>(pathParts: string[], data?: Record<string, unknown>): Promise<T> {
    const [resource, id, action] = pathParts;

    // Handle auth routes - /auth/login
    if (resource === 'auth' && id === 'login') {
      localStorage.setItem('authToken', 'mock-token-123');
      return {
        accessToken: 'mock-token-123',
        token: 'mock-token-123',
        user: mockData.employees[0],
      } as T;
    }

    if (resource === 'employee' && id === 'me' && pathParts[2] === 'documents' && pathParts[3] === 'request') {
      await simulateDelay();
      return { success: true, message: 'Documento solicitado com sucesso' } as T;
    }

    if (resource === 'employee') {
      const newEmployee: Employee = {
        id: mockData.generateId(),
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.employees.push(newEmployee);
      return newEmployee as T;
    }

    if (resource === 'departments') {
      const newDept: Department = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.departments.push(newDept);
      return newDept as T;
    }

    if (resource === 'positions') {
      const newPos: Position = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.positions.push(newPos);
      return newPos as T;
    }

    if (resource === 'skills') {
      const newSkill: Skill = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.skills.push(newSkill);
      return newSkill as T;
    }

    // Payroll Management POST routes
    if (resource === 'payroll' && action === 'cycles') {
      // /payroll/cycles/:id/calculate
      if (pathParts[3] === 'calculate') {
        const cycle = mockData.payrollCycles.find((c: any) => c.id === id);
        if (cycle) {
          cycle.status = 'CALCULATED';
          cycle.calculatedAt = new Date().toISOString();
          cycle.updatedAt = new Date().toISOString();
        }
        return cycle as T;
      }

      // /payroll/cycles/:id/approve
      if (pathParts[3] === 'approve') {
        const cycle = mockData.payrollCycles.find((c: any) => c.id === id);
        if (cycle) {
          cycle.status = 'APPROVED';
          cycle.approvedAt = new Date().toISOString();
          cycle.approvedBy = '1';
          cycle.updatedAt = new Date().toISOString();
        }
        return cycle as T;
      }

      // /payroll/cycles/:id/process
      if (pathParts[3] === 'process') {
        const cycle = mockData.payrollCycles.find((c: any) => c.id === id);
        if (cycle) {
          cycle.status = 'PROCESSED';
          cycle.processedAt = new Date().toISOString();
          cycle.updatedAt = new Date().toISOString();
        }
        return cycle as T;
      }

      // /payroll/cycles/:id/close
      if (pathParts[3] === 'close') {
        const cycle = mockData.payrollCycles.find((c: any) => c.id === id);
        if (cycle) {
          cycle.status = 'CLOSED';
          cycle.updatedAt = new Date().toISOString();
        }
        return cycle as T;
      }

      // /payroll/cycles/:id/notify-finance
      if (pathParts[3] === 'notify-finance') {
        const notification: any = {
          id: mockData.generateId(),
          payrollCycleId: id,
          recipientType: 'FINANCE',
          subject: 'Folha de Pagamento - Pronta para Pagamento',
          message: data?.message || 'A folha de pagamento foi aprovada e está pronta para pagamento.',
          createdAt: new Date().toISOString(),
        };
        mockData.payrollNotifications.push(notification);
        return notification as T;
      }

      // /payroll/cycles/:id/notify-controllers
      if (pathParts[3] === 'notify-controllers') {
        const notification: any = {
          id: mockData.generateId(),
          payrollCycleId: id,
          recipientType: 'CONTROLLER',
          subject: 'Folha de Pagamento - Aguardando Revisão',
          message: 'A folha de pagamento está aguardando revisão e aprovação.',
          createdAt: new Date().toISOString(),
        };
        mockData.payrollNotifications.push(notification);
        return [notification] as T;
      }

      // /payroll/cycles/:id/approvals - Request approval
      if (pathParts[3] === 'approvals') {
        const approval: any = {
          id: mockData.generateId(),
          payrollCycleId: id,
          approverId: data?.approverId || '1',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        mockData.payrollApprovals.push(approval);
        return approval as T;
      }

      // /payroll/cycles/:id/reports
      if (pathParts[3] === 'reports') {
        const report: any = {
          id: mockData.generateId(),
          payrollCycleId: id,
          reportType: data?.reportType || 'SUMMARY',
          format: data?.format || 'PDF',
          generatedAt: new Date().toISOString(),
          generatedBy: '1',
        };
        mockData.payrollReports.push(report);
        return report as T;
      }
    }

    // /payroll/cycles - Criar novo ciclo
    if (resource === 'payroll' && id === 'cycles') {
      const newCycle: any = {
        id: mockData.generateId(),
        ...data,
        status: 'DRAFT',
        totalEmployees: mockData.employees.length,
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.payrollCycles.unshift(newCycle);
      return newCycle as T;
    }

    // /benefits/enroll - Inscrever em benefício
    if (resource === 'benefits' && id === 'enroll') {
      const enrollment: any = {
        id: mockData.generateId(),
        employeeId: '1',
        ...data,
        status: 'PENDING',
        enrolledAt: new Date().toISOString(),
        dependents: [],
      };
      
      // Buscar o benefício para incluir na resposta
      const benefit = mockData.benefits.find((b: any) => b.id === data?.benefitId);
      if (benefit) {
        enrollment.benefit = benefit;
      }
      
      mockData.enrollments.push(enrollment);
      return enrollment as T;
    }

    // /benefits/enrollments/:id/dependents - Adicionar dependente
    if (resource === 'benefits' && action === 'enrollments' && pathParts[3] === 'dependents') {
      const enrollmentId = id;
      const enrollment = mockData.enrollments.find((e: any) => e.id === enrollmentId);
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const dependent: any = {
        id: mockData.generateId(),
        ...data,
      };

      if (!enrollment.dependents) {
        enrollment.dependents = [];
      }
      enrollment.dependents.push(dependent);

      return enrollment as T;
    }

    if (resource === 'projects') {
      const newProject: Project = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.projects.push(newProject);
      return newProject as T;
    }

    if (resource === 'trainings') {
      const newTraining: Training = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.trainings.push(newTraining);
      return newTraining as T;
    }

    if (resource === 'goals') {
      const newGoal: Goal = {
        id: mockData.generateId(),
        ...data,
        progress: data.progress || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.goals.push(newGoal);
      return newGoal as T;
    }

    if (resource === 'feedback') {
      const newFeedback: Feedback = {
        id: mockData.generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.feedback.push(newFeedback);
      return newFeedback as T;
    }

    if (resource === 'notifications' && id && action === 'read') {
      const notification = findById(mockData.notifications, id);
      if (notification) {
        notification.status = 'READ';
        notification.readAt = new Date().toISOString();
      }
      return notification as T;
    }

    if (resource === 'leaves' && action === 'requests') {
      const leaveType = findById(mockData.leaveTypes, data.leaveTypeId);
      if (!leaveType) throw new Error('Leave type not found');

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const newRequest: LeaveRequest = {
        id: mockData.generateId(),
        employeeId: '1',
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        days,
        reason: data.reason,
        status: LeaveRequestStatus.PENDING,
        leaveType,
        employee: mockData.employees[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.leaveRequests.push(newRequest);
      return newRequest as T;
    }

    if (resource === 'leaves' && action === 'requests' && id && pathParts[3] === 'approve') {
      const request = findById(mockData.leaveRequests, id);
      if (!request) throw new Error('Leave request not found');
      request.status = LeaveRequestStatus.APPROVED;
      request.approvedAt = new Date().toISOString();
      return request as T;
    }

    if (resource === 'leaves' && action === 'requests' && id && pathParts[3] === 'reject') {
      const request = findById(mockData.leaveRequests, id);
      if (!request) throw new Error('Leave request not found');
      request.status = LeaveRequestStatus.REJECTED;
      request.rejectedReason = data.rejectedReason;
      return request as T;
    }

    if (resource === 'leaves' && action === 'requests' && id && pathParts[3] === 'cancel') {
      const request = findById(mockData.leaveRequests, id);
      if (!request) throw new Error('Leave request not found');
      request.status = LeaveRequestStatus.CANCELLED;
      return undefined as T;
    }

    if (resource === 'attendance' && action === 'check-in') {
      const today = new Date().toISOString().split('T')[0];
      const existing = mockData.attendance.find((a) => a.date === today);
      if (existing) {
        existing.checkIn = new Date().toTimeString().split(' ')[0];
        existing.status = AttendanceStatus.PRESENT;
        return existing as T;
      }

      const newAttendance: Attendance = {
        id: mockData.generateId(),
        employeeId: '1',
        date: today,
        checkIn: new Date().toTimeString().split(' ')[0],
        status: AttendanceStatus.PRESENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.attendance.push(newAttendance);
      return newAttendance as T;
    }

    if (resource === 'attendance' && action === 'check-out') {
      const today = new Date().toISOString().split('T')[0];
      const existing = mockData.attendance.find((a) => a.date === today);
      if (existing) {
        existing.checkOut = new Date().toTimeString().split(' ')[0];
        if (existing.checkIn) {
          const checkInTime = new Date(`${today}T${existing.checkIn}`);
          const checkOutTime = new Date(`${today}T${existing.checkOut}`);
          existing.workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        }
        return existing as T;
      }
      throw new Error('No check-in found for today');
    }

    if (resource === 'mentoring') {
      const startDateStr =
        typeof data.startDate === 'string'
          ? data.startDate
          : data.startDate instanceof Date
          ? data.startDate.toISOString().split('T')[0]
          : String(data.startDate);
      const endDateStr = data.endDate
        ? typeof data.endDate === 'string'
          ? data.endDate
          : data.endDate instanceof Date
          ? data.endDate.toISOString().split('T')[0]
          : String(data.endDate)
        : undefined;

      const newRelationship: MentoringRelationship = {
        id: mockData.generateId(),
        mentorId: data.mentorId,
        menteeId: data.menteeId,
        status: data.status || MentoringStatus.ACTIVE,
        startDate: startDateStr,
        endDate: endDateStr,
        mentor: mockData.employees.find((e) => e.id === data.mentorId),
        mentee: mockData.employees.find((e) => e.id === data.menteeId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMentoringRelationships.push(newRelationship);
      return newRelationship as T;
    }

    if (resource === 'recruitment') {
      if (id === 'jobs') {
        const newJob: MockJob = {
          id: mockData.generateId(),
          ...(data || {}),
          status: (data?.status as string) || 'DRAFT',
          postedAt: new Date().toISOString(),
        } as MockJob;
        mockJobs.push(newJob);
        return newJob as T;
      }

      if (id === 'candidates') {
        const newCandidate: MockCandidate = {
          id: mockData.generateId(),
          ...(data || {}),
          status: 'NEW',
          appliedAt: new Date().toISOString(),
        } as MockCandidate;
        mockCandidates.push(newCandidate);
        return newCandidate as T;
      }

      if (id && action === 'apply') {
        const job = findById(mockJobs, id);
        if (!job) throw new Error('Job not found');

        const newApplication: MockApplication = {
          id: mockData.generateId(),
          candidateId: '1',
          jobId: id,
          status: 'PENDING',
          appliedAt: new Date().toISOString(),
          ...(data || {}),
        };
        mockApplications.push(newApplication);

        const newCandidate: MockCandidate = {
          id: mockData.generateId(),
          name: 'Usuário Atual',
          email: 'usuario@example.com',
          jobId: id,
          status: 'NEW',
          appliedAt: new Date().toISOString(),
        };
        mockCandidates.push(newCandidate);

        return newApplication as T;
      }

      if (id === 'pipeline' && action === 'configs') {
        const newConfig = {
          id: mockData.generateId(),
          ...(data || {}),
          stages: (data?.stages as any[]) || [],
          defaultStages: (data?.defaultStages as string[]) || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newConfig as T;
      }

      if (id === 'pipeline' && action === 'initialize') {
        return { success: true, message: 'Pipeline inicializado com sucesso' } as T;
      }
    }

    // Contract Labor routes
    if (resource === 'contract-labor') {
      // /contract-labor/contractors
      if (id === 'contractors') {
        const newContractor: any = {
          id: mockData.generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockContractors.push(newContractor);
        return newContractor as T;
      }
      
      // /contract-labor/:id/attendance
      if (id && action === 'attendance') {
        const newAttendance: any = {
          id: mockData.generateId(),
          laborId: id,
          ...data,
        };
        mockContractLaborAttendance.push(newAttendance);
        return newAttendance as T;
      }
      
      // /contract-labor
      const contractor = findById(mockContractors, data.contractorId);
      const project = data.projectId ? findById(mockData.projects, data.projectId) : undefined;
      
      const newLabor: any = {
        id: mockData.generateId(),
        ...data,
        contractor,
        project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockContractLabor.push(newLabor);
      return newLabor as T;
    }

    throw new Error(`POST route not implemented: ${pathParts.join('/')}`);
  },

  handlePatch<T>(pathParts: string[], data?: Record<string, unknown>): T {
    const [resource, id, action] = pathParts;

    if (resource === 'employee' && id === 'me' && pathParts[2] === 'profile') {
      const employee = mockData.employees[0];
      Object.assign(employee, data);
      employee.updatedAt = new Date().toISOString();
      return employee as T;
    }

    if (resource === 'employee' && id) {
      const employee = findById(mockData.employees, id);
      if (!employee) throw new Error('Employee not found');
      Object.assign(employee, data);
      employee.updatedAt = new Date().toISOString();
      return employee as T;
    }

    if (resource === 'leaves' && pathParts[1] === 'requests' && id) {
      const request = findById(mockData.leaveRequests, id);
      if (!request) throw new Error('Leave request not found');
      Object.assign(request, data);
      request.updatedAt = new Date().toISOString();
      return request as T;
    }

    if (resource === 'departments' && id) {
      const dept = findById(mockData.departments, id);
      if (!dept) throw new Error('Department not found');
      Object.assign(dept, data);
      dept.updatedAt = new Date().toISOString();
      return dept as T;
    }

    if (resource === 'positions' && id) {
      const pos = findById(mockData.positions, id);
      if (!pos) throw new Error('Position not found');
      Object.assign(pos, data);
      pos.updatedAt = new Date().toISOString();
      return pos as T;
    }

    if (resource === 'skills' && id) {
      const skill = findById(mockData.skills, id);
      if (!skill) throw new Error('Skill not found');
      Object.assign(skill, data);
      skill.updatedAt = new Date().toISOString();
      return skill as T;
    }

    if (resource === 'projects' && id) {
      const project = findById(mockData.projects, id);
      if (!project) throw new Error('Project not found');
      Object.assign(project, data);
      project.updatedAt = new Date().toISOString();
      return project as T;
    }

    if (resource === 'trainings' && id) {
      const training = findById(mockData.trainings, id);
      if (!training) throw new Error('Training not found');
      Object.assign(training, data);
      training.updatedAt = new Date().toISOString();
      return training as T;
    }

    if (resource === 'goals' && id) {
      const goal = findById(mockData.goals, id);
      if (!goal) throw new Error('Goal not found');
      Object.assign(goal, data);
      goal.updatedAt = new Date().toISOString();
      return goal as T;
    }

    if (resource === 'attendance' && id) {
      const attendance = findById(mockData.attendance, id);
      if (!attendance) throw new Error('Attendance not found');
      Object.assign(attendance, data);
      attendance.updatedAt = new Date().toISOString();
      return attendance as T;
    }

    if (resource === 'allocations' && pathParts[1] === 'projects' && id) {
      const allocation = mockAllocationData.projectAllocations.find((a) => a.id === id);
      if (!allocation) throw new Error('Allocation not found');
      Object.assign(allocation, data);
      allocation.updatedAt = new Date().toISOString();
      return allocation as T;
    }

    if (resource === 'separations' && id) {
      const separation = findById(mockData.separations, id);
      if (!separation) throw new Error('Separation not found');
      Object.assign(separation, data);
      separation.updatedAt = new Date().toISOString();
      return separation as T;
    }

    if (resource === 'mentoring' && id) {
      const relationship = mockMentoringRelationships.find((r) => r.id === id);
      if (!relationship) throw new Error('Mentoring relationship not found');
      Object.assign(relationship, {
        ...data,
        startDate: data.startDate ? (typeof data.startDate === 'string' ? data.startDate : data.startDate.toISOString().split('T')[0]) : relationship.startDate,
        endDate: data.endDate ? (typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString().split('T')[0]) : relationship.endDate,
      });
      relationship.updatedAt = new Date().toISOString();
      return relationship as T;
    }

    if (resource === 'recruitment') {
      if (id === 'jobs' && action) {
        const job = findById(mockJobs, action);
        if (!job) throw new Error('Job not found');
        if (data) {
          Object.assign(job, data);
        }
        return job as T;
      }

      if (id === 'candidates' && action) {
        const candidate = findById(mockCandidates, action);
        if (!candidate) throw new Error('Candidate not found');
        if (data) {
          Object.assign(candidate, data);
        }
        return candidate as T;
      }

      if (id === 'pipeline' && action === 'configs' && pathParts[3]) {
        const configId = pathParts[3];
        return {
          id: configId,
          ...(data || {}),
          updatedAt: new Date().toISOString(),
        } as T;
      }
    }

    // Contract Labor routes
    if (resource === 'contract-labor') {
      // /contract-labor/contractors/:id
      if (pathParts[1] === 'contractors' && id) {
        const contractor = findById(mockContractors, id);
        if (!contractor) throw new Error('Contractor not found');
        Object.assign(contractor, data);
        contractor.updatedAt = new Date().toISOString();
        return contractor as T;
      }
      
      // /contract-labor/:id
      if (id) {
        const labor = findById(mockContractLabor, id);
        if (!labor) throw new Error('Contract labor not found');
        
        if (data.contractorId) {
          labor.contractor = findById(mockContractors, data.contractorId);
        }
        if (data.projectId) {
          labor.project = findById(mockData.projects, data.projectId);
        }
        
        Object.assign(labor, data);
        labor.updatedAt = new Date().toISOString();
        return labor as T;
      }
    }

    throw new Error(`PATCH route not implemented: ${pathParts.join('/')}`);
  },

  handleDelete<T>(pathParts: string[]): T {
    const [resource, id] = pathParts;

    if (resource === 'employee' && id) {
      const index = mockData.employees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      mockData.employees.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'departments' && id) {
      const index = mockData.departments.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Department not found');
      mockData.departments.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'positions' && id) {
      const index = mockData.positions.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Position not found');
      mockData.positions.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'skills' && id) {
      const index = mockData.skills.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Skill not found');
      mockData.skills.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'projects' && id) {
      const index = mockData.projects.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Project not found');
      mockData.projects.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'trainings' && id) {
      const index = mockData.trainings.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Training not found');
      mockData.trainings.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'goals' && id) {
      const index = mockData.goals.findIndex((g) => g.id === id);
      if (index === -1) throw new Error('Goal not found');
      mockData.goals.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'attendance' && id) {
      const index = mockData.attendance.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Attendance not found');
      mockData.attendance.splice(index, 1);
      return undefined as T;
    }

    // /benefits/enrollments/:id - Cancelar inscrição
    if (resource === 'benefits' && action === 'enrollments' && id) {
      // Verificar se é remoção de dependente
      if (pathParts[3] === 'dependents' && pathParts[4]) {
        const enrollmentId = id;
        const dependentId = pathParts[4];
        
        const enrollment = mockData.enrollments.find((e: any) => e.id === enrollmentId);
        if (!enrollment) {
          throw new Error('Enrollment not found');
        }

        if (enrollment.dependents) {
          const depIndex = enrollment.dependents.findIndex((d: any) => d.id === dependentId);
          if (depIndex !== -1) {
            enrollment.dependents.splice(depIndex, 1);
          }
        }

        return enrollment as T;
      }

      // Cancelamento de inscrição
      const enrollment = mockData.enrollments.find((e: any) => e.id === id);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }
      
      enrollment.status = 'CANCELLED';
      enrollment.endDate = new Date().toISOString();
      
      return enrollment as T;
    }

    if (resource === 'allocations' && pathParts[1] === 'projects' && id) {
      const index = mockAllocationData.projectAllocations.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Allocation not found');
      mockAllocationData.projectAllocations.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'mentoring' && id) {
      const index = mockMentoringRelationships.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Mentoring relationship not found');
      mockMentoringRelationships.splice(index, 1);
      return undefined as T;
    }

    if (resource === 'recruitment') {
      if (id === 'jobs') {
        const jobId = pathParts[2];
        if (jobId) {
          const index = mockJobs.findIndex((j) => j.id === jobId);
          if (index === -1) throw new Error('Job not found');
          mockJobs.splice(index, 1);
          return undefined as T;
        }
      }

      if (id === 'pipeline' && action === 'configs' && pathParts[3]) {
        return undefined as T;
      }
    }

    // Contract Labor routes
    if (resource === 'contract-labor') {
      // /contract-labor/contractors/:id
      if (pathParts[1] === 'contractors' && id) {
        const index = mockContractors.findIndex((c) => c.id === id);
        if (index === -1) throw new Error('Contractor not found');
        mockContractors.splice(index, 1);
        return undefined as T;
      }
      
      // /contract-labor/:id
      if (id) {
        const index = mockContractLabor.findIndex((l) => l.id === id);
        if (index === -1) throw new Error('Contract labor not found');
        mockContractLabor.splice(index, 1);
        return undefined as T;
      }
    }

    throw new Error(`DELETE route not implemented: ${pathParts.join('/')}`);
  },
};

