import { Department, Employee } from './index';

export enum PayrollCycleStatus {
  DRAFT = 'DRAFT',
  CALCULATING = 'CALCULATING',
  CALCULATED = 'CALCULATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface PayrollCycle {
  id: string;
  referenceMonth: string; // YYYY-MM
  status: PayrollCycleStatus;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  calculatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  processedAt?: string;
  paidAt?: string;
  paymentDate?: string; // Data prevista de pagamento
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface DepartmentPayrollSummary {
  departmentId: string;
  department?: Department;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: PayrollCycleStatus;
}

export interface CostCenterPayrollSummary {
  costCenterId: string;
  costCenterName: string;
  departmentId: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
}

export interface PayrollApproval {
  id: string;
  payrollCycleId: string;
  approverId: string;
  approver?: Employee;
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PayrollNotification {
  id: string;
  payrollCycleId: string;
  recipientType: 'FINANCE' | 'CONTROLLER' | 'HR_DIRECTOR' | 'DEPARTMENT_MANAGER';
  recipientId?: string;
  subject: string;
  message: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface PayrollReport {
  id: string;
  payrollCycleId: string;
  reportType: 'SUMMARY' | 'BY_DEPARTMENT' | 'BY_COST_CENTER' | 'TAX_REPORT' | 'BANK_FILE';
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
  format: 'PDF' | 'EXCEL' | 'CSV' | 'TXT';
}

export interface EmployeePayrollDetail {
  employeeId: string;
  employee?: Employee;
  departmentId: string;
  costCenterId?: string;
  baseSalary: number;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAID';
}

export interface PayrollItem {
  id: string;
  code: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  category: string; // SALARY, BONUS, TAX, INSS, etc
  amount: number;
  taxable: boolean;
  basis?: number; // Base de cálculo
  rate?: number; // Taxa/percentual
}

export interface PayrollBatchAction {
  action: 'CALCULATE' | 'APPROVE' | 'PROCESS' | 'NOTIFY_FINANCE' | 'GENERATE_REPORT';
  payrollCycleId: string;
  performedBy: string;
  performedAt: string;
  result: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  details?: string;
}

// DTOs
export interface CreatePayrollCycleDto {
  referenceMonth: string;
  paymentDate: string;
  notes?: string;
}

export interface ApprovePayrollDto {
  comments?: string;
}

export interface NotifyFinanceDto {
  message?: string;
  includeAttachments?: boolean;
}

