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
  LeaveRequestStatus,
  AttendanceStatus,
  ProjectStatus,
  TrainingStatus,
  TrainingType,
  GoalStatus,
  PerformanceReviewStatus,
  Achievement,
  AchievementType,
  MentoringRelationship,
  MentoringStatus,
  SkillType,
  SkillCategory,
  SkillLevel,
  EmployeeProfile,
  PolicyDocument,
  PolicyAcknowledgment,
  PolicyStatus,
  PolicyCategory,
  Payroll,
  PayrollStatus,
} from '../types';
import { ProjectAllocation, AllocationStatus } from '../types/allocation';

const generateId = () => Math.random().toString(36).substring(2, 15);

// ... (rest of the imports and existing mocks) ...

// Vou apenas adicionar o mockPayrolls no final e atualizar o mockData via replace
// Mas para evitar erro de referência, vou colocar mockPayrolls antes de mockData.

// ... (mockAchievements) ...

const mockPayrolls: Payroll[] = [
  {
    id: '1',
    employeeId: '1',
    period: '2024-02',
    baseSalary: 12000,
    grossSalary: 12500,
    totalDeductions: 2500,
    netSalary: 10000,
    status: PayrollStatus.PAID,
    paidAt: '2024-02-28T10:00:00Z',
    items: [
      { id: '1', name: 'Salário Base', type: 'EARNING', amount: 12000, taxable: true },
      { id: '2', name: 'Hora Extra', type: 'EARNING', amount: 500, taxable: true },
      { id: '3', name: 'INSS', type: 'DEDUCTION', amount: 1000, taxable: false },
      { id: '4', name: 'IRRF', type: 'DEDUCTION', amount: 1500, taxable: false },
    ],
    createdAt: '2024-02-25',
    updatedAt: '2024-02-28'
  },
  {
    id: '2',
    employeeId: '1',
    period: '2024-01',
    baseSalary: 12000,
    grossSalary: 12000,
    totalDeductions: 2400,
    netSalary: 9600,
    status: PayrollStatus.PAID,
    paidAt: '2024-01-30T10:00:00Z',
    items: [
      { id: '1', name: 'Salário Base', type: 'EARNING', amount: 12000, taxable: true },
      { id: '2', name: 'INSS', type: 'DEDUCTION', amount: 1000, taxable: false },
      { id: '3', name: 'IRRF', type: 'DEDUCTION', amount: 1400, taxable: false },
    ],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-30'
  },
  // Adiantamento 13º
  {
    id: '3',
    employeeId: '1',
    period: '2023-11',
    baseSalary: 12000,
    grossSalary: 6000,
    totalDeductions: 0,
    netSalary: 6000,
    status: PayrollStatus.PAID,
    paidAt: '2023-11-30T10:00:00Z',
    items: [
      { id: '1', name: '1ª Parcela 13º Salário', type: 'EARNING', amount: 6000, taxable: true }
    ],
    createdAt: '2023-11-25',
    updatedAt: '2023-11-30'
  },
  // PLR
  {
    id: '4',
    employeeId: '1',
    period: '2024-03',
    baseSalary: 12000,
    grossSalary: 25000,
    totalDeductions: 5000,
    netSalary: 20000,
    status: PayrollStatus.PROCESSED,
    paidAt: '2024-03-15T10:00:00Z',
    items: [
      { id: '1', name: 'PLR 2023', type: 'EARNING', amount: 25000, taxable: true },
      { id: '2', name: 'IRRF S/ PLR', type: 'DEDUCTION', amount: 5000, taxable: false }
    ],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  }
];

const mockDashboardData: DashboardData = {
  totalEmployees: 0,
  activeProjects: 0,
  pendingLeaves: 0,
  upcomingReviews: 0,
  recentActivities: [],
  performanceTrends: [],
};
