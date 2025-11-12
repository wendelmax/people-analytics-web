export enum SkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export enum SkillCategory {
  TECHNICAL = 'TECHNICAL',
  SOFT = 'SOFT',
  LEADERSHIP = 'LEADERSHIP',
  DOMAIN = 'DOMAIN',
  CORE = 'CORE',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR_DIRECTOR = 'HR_DIRECTOR',
  HR_MANAGER = 'HR_MANAGER',
  HR_ANALYST = 'HR_ANALYST',
  EXECUTIVE = 'EXECUTIVE',
  DEPARTMENT_MANAGER = 'DEPARTMENT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  MANAGER = 'MANAGER',
  SENIOR_EMPLOYEE = 'SENIOR_EMPLOYEE',
  EMPLOYEE = 'EMPLOYEE',
  INTERN = 'INTERN',
  MENTOR = 'MENTOR',
  TRAINER = 'TRAINER',
  ANALYST = 'ANALYST',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export enum TrainingType {
  ONLINE_COURSE = 'ONLINE_COURSE',
  WORKSHOP = 'WORKSHOP',
  CONFERENCE = 'CONFERENCE',
  INTERNAL_TRAINING = 'INTERNAL_TRAINING',
  EXTERNAL_COURSE = 'EXTERNAL_COURSE',
}

export enum TrainingStatus {
  ENROLLED = 'ENROLLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export enum PerformanceReviewStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_EMPLOYEE = 'PENDING_EMPLOYEE',
  PENDING_MANAGER = 'PENDING_MANAGER',
  COMPLETED = 'COMPLETED',
}

export enum GoalType {
  PERFORMANCE = 'PERFORMANCE',
  DEVELOPMENT = 'DEVELOPMENT',
  PROJECT = 'PROJECT',
  CAREER = 'CAREER',
  ORGANIZATIONAL = 'ORGANIZATIONAL',
}

export enum GoalPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum FeedbackType {
  PERFORMANCE = 'PERFORMANCE',
  SKILL = 'SKILL',
  BEHAVIOR = 'BEHAVIOR',
  PROJECT = 'PROJECT',
}

export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export enum DevelopmentPlanStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  hireDate: string;
  departmentId: string;
  positionId: string;
  managerId?: string;
  status?: string;
  department?: Department;
  position?: Position;
  manager?: Employee;
  reports?: Employee[];
  skills?: EmployeeSkill[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  positions?: Position[];
  employees?: Employee[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  title: string;
  description?: string;
  level?: string;
  departmentId?: string;
  department?: Department;
  employees?: Employee[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  type: SkillType;
  category: SkillCategory;
  defaultLevel: SkillLevel;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  proficiency: SkillLevel;
  lastEvaluated?: string;
  employee?: Employee;
  skill?: Skill;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  budget?: number;
  ownerId?: string;
  owner?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  name: string;
  description?: string;
  provider?: string;
  type: TrainingType;
  status: TrainingStatus;
  startDate: string;
  endDate?: string;
  difficulty?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AchievementType {
  CERTIFICATION = 'CERTIFICATION',
  BADGE = 'BADGE',
  MILESTONE = 'MILESTONE',
  AWARD = 'AWARD',
  SKILL_MASTERY = 'SKILL_MASTERY',
}

export interface Achievement {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  type: AchievementType;
  icon?: string;
  earnedAt: string;
  issuer?: string;
  certificateUrl?: string;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  periodStart: string;
  periodEnd: string;
  status: PerformanceReviewStatus;
  overallRating?: number;
  strengths: string[];
  improvements: string[];
  comments?: string;
  employee?: Employee;
  reviewer?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  type: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  progress: number;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  authorId: string;
  recipientId: string;
  type: FeedbackType;
  sentiment: SentimentType;
  title: string;
  content: string;
  rating?: number;
  tags?: string[];
  author?: Employee;
  recipient?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone?: string;
  hireDate: string;
  departmentId: string;
  positionId: string;
  skillIds?: string[];
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}

export interface CreatePositionDto {
  title: string;
  description?: string;
  level?: string;
  departmentId?: string;
}

export interface UpdatePositionDto extends Partial<CreatePositionDto> {}

export interface CreateSkillDto {
  name: string;
  description?: string;
  type: SkillType;
  category: SkillCategory;
  defaultLevel?: SkillLevel;
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}

export interface CreateSkillProficiencyDto {
  employeeId: string;
  skillId: string;
  proficiency: SkillLevel;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  budget?: number;
  ownerId?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface CreateTrainingDto {
  name: string;
  description?: string;
  provider?: string;
  type: TrainingType;
  status: TrainingStatus;
  startDate: string;
  endDate?: string;
  difficulty?: string;
  skillIds?: string[];
}

export interface UpdateTrainingDto extends Partial<CreateTrainingDto> {}

export interface CreateGoalDto {
  employeeId: string;
  title: string;
  description?: string;
  type: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  progress?: number;
}

export interface UpdateGoalDto extends Partial<CreateGoalDto> {}

export interface CreateFeedbackDto {
  authorId: string;
  recipientId: string;
  type: FeedbackType;
  sentiment: SentimentType;
  title: string;
  content: string;
  rating?: number;
  tags?: string[];
}

export interface UpdateFeedbackDto extends Partial<CreateFeedbackDto> {}

export interface CreatePerformanceReviewDto {
  employeeId: string;
  reviewerId: string;
  periodStart: string;
  periodEnd: string;
  status: PerformanceReviewStatus;
  overallRating?: number;
  strengths: string[];
  improvements: string[];
  comments?: string;
}

export interface UpdatePerformanceReviewDto extends Partial<CreatePerformanceReviewDto> {}

export interface EmployeeProject {
  id: string;
  employeeId: string;
  projectId: string;
  role: string;
  startDate: string;
  endDate?: string;
  employee?: Employee;
  project?: Project;
}

export interface EmployeeTraining {
  employeeId: string;
  trainingId: string;
  status: TrainingStatus;
  startedAt: string;
  completedAt?: string;
  employee?: Employee;
  training?: Training;
}

export enum MentoringStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MentoringRelationship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentoringStatus;
  startDate: string;
  endDate?: string;
  mentor?: Employee;
  mentee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  readAt?: string;
  user?: Employee;
  createdAt: string;
  updatedAt: string;
}

export enum KnowledgeCategory {
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  GUIDE = 'GUIDE',
  FAQ = 'FAQ',
  TUTORIAL = 'TUTORIAL',
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  departmentId?: string;
  authorId: string;
  publishedAt?: string;
  department?: Department;
  author?: Employee;
  skills?: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentoringDto {
  mentorId: string;
  menteeId: string;
  status: MentoringStatus;
  startDate: string;
  endDate?: string;
}

export interface UpdateMentoringDto extends Partial<CreateMentoringDto> {}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {}

export interface CreateKnowledgeArticleDto {
  title: string;
  content: string;
  category: KnowledgeCategory;
  departmentId?: string;
  authorId: string;
}

export interface UpdateKnowledgeArticleDto extends Partial<CreateKnowledgeArticleDto> {}

export interface ChatbotMessage {
  id: string;
  message: string;
  response: string;
  context?: string;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  activeProjects: number;
  averagePerformance: number;
  recentHires: number;
}

export interface PerformanceTrend {
  period: string;
  averageRating: number;
  totalReviews: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  createdAt: string;
}

export interface FlightRiskEmployee {
  id: string;
  name: string;
  department: string;
  position: string;
  riskScore: number;
  reason: string;
  lastReviewDate?: string;
  engagementScore?: number;
}

export interface HighPerformer {
  id: string;
  name: string;
  department: string;
  position: string;
  performanceScore: number;
  strengths: string[];
  potential: string;
  lastPromotionDate?: string;
}

export interface TurnoverPrediction {
  period: string;
  predictedRate: number;
  description: string;
  factors: string[];
}

export interface PredictiveAnalytics {
  flightRisk: FlightRiskEmployee[];
  highPerformers: HighPerformer[];
  turnoverPrediction: TurnoverPrediction[];
  lastUpdated: string;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

export interface EthnicityDistribution {
  ethnicity: string;
  count: number;
  percentage: number;
}

export interface AgeDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface PayEquity {
  category: string;
  gap: number;
  averageSalary: number;
  benchmark: number;
}

export interface DEIBRecommendation {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedImpact: string;
  category: 'DIVERSITY' | 'EQUITY' | 'INCLUSION' | 'BELONGING';
}

export interface DEIBAnalytics {
  genderDistribution: GenderDistribution[];
  ethnicityDistribution: EthnicityDistribution[];
  ageDistribution: AgeDistribution[];
  payEquity: PayEquity[];
  genderDiversityIndex: number;
  payEquityIndex: number;
  inclusionScore: number;
  diverseLeadership: number;
  recommendations: DEIBRecommendation[];
}

export interface HeadcountTrend {
  month: string;
  count: number;
  change: number;
}

export interface CostTrend {
  month: string;
  totalCost: number;
  averageCost: number;
  change: number;
}

export interface ProductivityMetric {
  department: string;
  productivityScore: number;
  revenue: number;
  efficiency: number;
}

export interface CapacityAnalysis {
  department: string;
  utilization: number;
  capacity: number;
  demand: number;
}

export interface OrganizationalStructure {
  totalDepartments: number;
  totalTeams: number;
  avgTeamSize: number;
  reportingLevels: number;
}

export interface EfficiencyMetrics {
  revenuePerEmployee: number;
  costPerHire: number;
  timeToProductivity: number;
  employeeRetentionRate: number;
}

export interface WorkforceMonitoring {
  totalHeadcount: number;
  headcountChange: number;
  totalCost: number;
  averageProductivity: number;
  averageUtilization: number;
  headcountTrend: HeadcountTrend[];
  costTrend: CostTrend[];
  productivityMetrics: ProductivityMetric[];
  capacityAnalysis: CapacityAnalysis[];
  organizationalStructure: OrganizationalStructure;
  efficiencyMetrics: EfficiencyMetrics;
}

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  maxDays?: number;
  carryForward: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: LeaveRequestStatus;
  approverId?: string;
  approvedAt?: string;
  rejectedReason?: string;
  leaveType: LeaveType;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  balance: number;
  accrued: number;
  used: number;
  year: number;
  leaveType: LeaveType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveRequestDto {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UpdateLeaveRequestDto {
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface CreateLeaveTypeDto {
  name: string;
  code: string;
  maxDays?: number;
  carryForward: boolean;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface UpdateLeaveTypeDto extends Partial<CreateLeaveTypeDto> {}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
  HOLIDAY = 'HOLIDAY',
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  status: AttendanceStatus;
  location?: { lat: number; lng: number };
  notes?: string;
  lateMinutes?: number;
  overtimeHours?: number;
  employee?: Employee;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  averageWorkHours: number;
}

export interface WorkSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration?: number;
  workDays: number[];
  employeeId?: string;
  departmentId?: string;
  positionId?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttendanceDto {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  location?: { lat: number; lng: number };
  notes?: string;
}

export interface UpdateAttendanceDto {
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  location?: { lat: number; lng: number };
  notes?: string;
}

export interface CheckInDto {
  location?: { lat: number; lng: number };
  notes?: string;
}

export interface CheckOutDto {
  location?: { lat: number; lng: number };
  notes?: string;
}

export interface DashboardData {
  profile: Employee;
  leaveBalances: LeaveBalance[];
  recentAttendance: Attendance[];
  goals: Goal[];
  trainings: Training[];
  performanceReviews: PerformanceReview[];
  achievements?: Achievement[];
}

// Re-export allocation types
export * from './allocation';

// ==================== POLICY DOCUMENTS ====================
export enum PolicyStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum PolicyCategory {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'FINANCE',
  LEGAL = 'LEGAL',
  SAFETY = 'SAFETY',
  GENERAL = 'GENERAL',
}

export interface PolicyDocument {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: PolicyCategory;
  version: string;
  status: PolicyStatus;
  departmentId?: string;
  department?: Department;
  requiresAcknowledgment: boolean;
  effectiveDate: string;
  expiryDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAcknowledgment {
  id: string;
  policyId: string;
  employeeId: string;
  acknowledgedAt: string;
  policy?: PolicyDocument;
  employee?: Employee;
}

export interface CreatePolicyDto {
  title: string;
  description?: string;
  content: string;
  category: PolicyCategory;
  departmentId?: string;
  requiresAcknowledgment: boolean;
  effectiveDate: string;
  expiryDate?: string;
}

export interface UpdatePolicyDto extends Partial<CreatePolicyDto> {
  status?: PolicyStatus;
}

// ==================== SEPARATION/OFFBOARDING ====================
export enum SeparationType {
  RESIGNATION = 'RESIGNATION',
  RETIREMENT = 'RETIREMENT',
  TERMINATION = 'TERMINATION',
  END_OF_CONTRACT = 'END_OF_CONTRACT',
  LAYOFF = 'LAYOFF',
}

export enum SeparationStatus {
  INITIATED = 'INITIATED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Separation {
  id: string;
  employeeId: string;
  employee?: Employee;
  type: SeparationType;
  status: SeparationStatus;
  lastWorkingDate: string;
  noticePeriodDays: number;
  reason?: string;
  exitInterviewCompleted: boolean;
  exitInterviewDate?: string;
  exitInterviewNotes?: string;
  checklist: OffboardingChecklistItem[];
  initiatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OffboardingChecklistItem {
  id: string;
  task: string;
  assignedTo?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface CreateSeparationDto {
  employeeId: string;
  type: SeparationType;
  lastWorkingDate: string;
  noticePeriodDays: number;
  reason?: string;
}

export interface UpdateSeparationDto {
  status?: SeparationStatus;
  exitInterviewCompleted?: boolean;
  exitInterviewDate?: string;
  exitInterviewNotes?: string;
  checklist?: OffboardingChecklistItem[];
}

// ==================== REIMBURSEMENTS & EXPENSES ====================
export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export enum ExpenseCategory {
  TRAVEL = 'TRAVEL',
  MEALS = 'MEALS',
  ACCOMMODATION = 'ACCOMMODATION',
  TRANSPORTATION = 'TRANSPORTATION',
  SUPPLIES = 'SUPPLIES',
  TRAINING = 'TRAINING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

export interface Expense {
  id: string;
  employeeId: string;
  employee?: Employee;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  projectId?: string;
  project?: Project;
  travelRequestId?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReport {
  id: string;
  employeeId: string;
  employee?: Employee;
  title: string;
  totalAmount: number;
  currency: string;
  expenses: Expense[];
  status: ExpenseStatus;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  receiptUrl?: string;
  projectId?: string;
  travelRequestId?: string;
}

export interface UpdateExpenseDto {
  category?: ExpenseCategory;
  description?: string;
  amount?: number;
  expenseDate?: string;
  receiptUrl?: string;
  status?: ExpenseStatus;
}

export interface CreateExpenseReportDto {
  title: string;
  expenseIds: string[];
}

// ==================== PAYROLL ====================
export enum PayrollStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
}

export interface PayrollItem {
  id: string;
  name: string;
  type: 'EARNING' | 'DEDUCTION';
  amount: number;
  taxable: boolean;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employee?: Employee;
  period: string; // YYYY-MM
  baseSalary: number;
  items: PayrollItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  processedAt?: string;
  paidAt?: string;
  payslipUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollDto {
  employeeId: string;
  period: string;
  baseSalary: number;
  items: PayrollItem[];
}

export interface UpdatePayrollDto {
  items?: PayrollItem[];
  status?: PayrollStatus;
}

// ==================== CONFERENCE ROOM BOOKING ====================
export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface ConferenceRoom {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  room?: ConferenceRoom;
  employeeId: string;
  employee?: Employee;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  attendees: string[];
  recurring?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    endDate: string;
  };
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomBookingDto {
  roomId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  recurring?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    endDate: string;
  };
}

export interface UpdateRoomBookingDto {
  roomId?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string[];
  status?: BookingStatus;
}

export interface CreateConferenceRoomDto {
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
}

export interface UpdateConferenceRoomDto extends Partial<CreateConferenceRoomDto> {
  isActive?: boolean;
}

// ==================== TRAVEL MANAGEMENT ====================
export enum TravelStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BOOKED = 'BOOKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employee?: Employee;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  currency: string;
  status: TravelStatus;
  projectId?: string;
  project?: Project;
  itinerary?: TravelItineraryItem[];
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  expenses?: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface TravelItineraryItem {
  id: string;
  date: string;
  time?: string;
  activity: string;
  location: string;
  notes?: string;
}

export interface CreateTravelRequestDto {
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  currency: string;
  projectId?: string;
  itinerary?: TravelItineraryItem[];
}

export interface UpdateTravelRequestDto {
  purpose?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  estimatedCost?: number;
  status?: TravelStatus;
  itinerary?: TravelItineraryItem[];
}

// ==================== SURVEY ====================
export enum SurveyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  RATING = 'RATING',
  YES_NO = 'YES_NO',
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  targetAudience: 'ALL' | 'DEPARTMENT' | 'POSITION' | 'CUSTOM';
  targetIds?: string[];
  startDate: string;
  endDate: string;
  anonymous: boolean;
  createdBy: string;
  responses: SurveyResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId?: string;
  employee?: Employee;
  answers: SurveyAnswer[];
  submittedAt: string;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  questions: Omit<SurveyQuestion, 'id'>[];
  targetAudience: 'ALL' | 'DEPARTMENT' | 'POSITION' | 'CUSTOM';
  targetIds?: string[];
  startDate: string;
  endDate: string;
  anonymous: boolean;
}

export interface UpdateSurveyDto {
  title?: string;
  description?: string;
  questions?: Omit<SurveyQuestion, 'id'>[];
  status?: SurveyStatus;
  startDate?: string;
  endDate?: string;
}

export interface SubmitSurveyResponseDto {
  surveyId: string;
  answers: SurveyAnswer[];
}

// ==================== CONTRACT LABOR ====================
export enum ContractLaborStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
}

export interface Contractor {
  id: string;
  name: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  taxId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContractLabor {
  id: string;
  contractorId: string;
  contractor?: Contractor;
  employeeId?: string;
  employee?: Employee;
  name: string;
  skill: string;
  wage: number;
  currency: string;
  status: ContractLaborStatus;
  allocationId?: string;
  projectId?: string;
  project?: Project;
  startDate: string;
  endDate?: string;
  attendance?: ContractLaborAttendance[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractLaborAttendance {
  id: string;
  laborId: string;
  date: string;
  hours: number;
  overtimeHours?: number;
  notes?: string;
}

export interface CreateContractorDto {
  name: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  taxId?: string;
}

export interface UpdateContractorDto extends Partial<CreateContractorDto> {
  isActive?: boolean;
}

export interface CreateContractLaborDto {
  contractorId: string;
  name: string;
  skill: string;
  wage: number;
  currency: string;
  projectId?: string;
  startDate: string;
  endDate?: string;
}

export interface UpdateContractLaborDto {
  name?: string;
  skill?: string;
  wage?: number;
  status?: ContractLaborStatus;
  endDate?: string;
}

export enum ServiceRequestStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceRequestPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ProposalStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum BookingStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  deadline?: string;
  location?: string;
  remote: boolean;
  projectId?: string;
  project?: Project;
  createdBy: string;
  createdByName?: string;
  proposalsCount?: number;
  proposals?: ServiceProposal[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ServiceProposal {
  id: string;
  serviceRequestId: string;
  serviceRequest?: ServiceRequest;
  contractorId: string;
  contractor?: Contractor;
  title: string;
  description: string;
  proposedBudget: number;
  currency: string;
  estimatedDuration: string;
  deliverables: string[];
  status: ProposalStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceBooking {
  id: string;
  serviceRequestId?: string;
  serviceRequest?: ServiceRequest;
  proposalId?: string;
  proposal?: ServiceProposal;
  contractorId: string;
  contractor?: Contractor;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  status: BookingStatus;
  attendees: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestDto {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  priority: ServiceRequestPriority;
  deadline?: string;
  location?: string;
  remote: boolean;
  projectId?: string;
}

export interface CreateServiceProposalDto {
  serviceRequestId: string;
  title: string;
  description: string;
  proposedBudget: number;
  currency: string;
  estimatedDuration: string;
  deliverables: string[];
}

export interface CreateBookingDto {
  serviceRequestId?: string;
  proposalId?: string;
  contractorId: string;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  attendees: string[];
}

