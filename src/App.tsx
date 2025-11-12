import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { ModuleRoute } from './components/auth/ModuleRoute';

const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));

const SettingsDashboard = lazy(() => import('./modules/settings/pages/SettingsDashboard').then((m) => ({ default: m.SettingsDashboard })));
const SettingsAdmin = lazy(() => import('./modules/settings/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const DepartmentManagement = lazy(() => import('./modules/settings/admin/DepartmentManagement').then((m) => ({ default: m.DepartmentManagement })));
const PositionManagement = lazy(() => import('./modules/settings/admin/PositionManagement').then((m) => ({ default: m.PositionManagement })));
const SkillManagement = lazy(() => import('./modules/settings/admin/SkillManagement').then((m) => ({ default: m.SkillManagement })));

const EmployeesDashboard = lazy(() => import('./modules/employees/pages/EmployeesDashboard').then((m) => ({ default: m.EmployeesDashboard })));
const EmployeeDetail = lazy(() => import('./modules/employees/pages/EmployeeDetail').then((m) => ({ default: m.EmployeeDetail })));
const EmployeeSelfService = lazy(() => import('./modules/employees/pages/EmployeeSelfService').then((m) => ({ default: m.EmployeeSelfService })));
const OrganizationChart = lazy(() => import('./modules/employees/pages/OrganizationChart').then((m) => ({ default: m.OrganizationChart })));
const EmployeeTableManagement = lazy(() => import('./modules/employees/admin/EmployeeTableManagement').then((m) => ({ default: m.EmployeeTableManagement })));

const LeavesDashboard = lazy(() => import('./modules/leaves/pages/LeavesDashboard').then((m) => ({ default: m.LeavesDashboard })));
const LeaveCalendar = lazy(() => import('./modules/leaves/pages/LeaveCalendar').then((m) => ({ default: m.LeaveCalendar })));
const LeaveManagement = lazy(() => import('./modules/leaves/admin/LeaveManagement').then((m) => ({ default: m.LeaveManagement })));

const AttendanceDashboard = lazy(() => import('./modules/attendance/pages/AttendanceDashboard').then((m) => ({ default: m.AttendanceDashboard })));
const AttendanceCalendarPage = lazy(() => import('./modules/attendance/pages/AttendanceCalendarPage').then((m) => ({ default: m.AttendanceCalendarPage })));
const AttendanceMirrorPage = lazy(() => import('./modules/attendance/pages/AttendanceMirrorPage').then((m) => ({ default: m.AttendanceMirrorPage })));
const OvertimePage = lazy(() => import('./modules/attendance/pages/OvertimePage').then((m) => ({ default: m.OvertimePage })));
const AttendanceReportsPage = lazy(() => import('./modules/attendance/pages/AttendanceReportsPage').then((m) => ({ default: m.AttendanceReportsPage })));

const ProjectsDashboard = lazy(() => import('./modules/projects/pages/ProjectsDashboard').then((m) => ({ default: m.ProjectsDashboard })));
const ProjectAllocations = lazy(() => import('./modules/projects/pages/ProjectAllocations').then((m) => ({ default: m.ProjectAllocations })));
const ProjectDetail = lazy(() => import('./modules/projects/pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })));
const ProjectTableManagement = lazy(() => import('./modules/projects/admin/ProjectTableManagement').then((m) => ({ default: m.ProjectTableManagement })));

const PerformanceDashboard = lazy(() => import('./modules/performance/pages/PerformanceDashboard').then((m) => ({ default: m.PerformanceDashboard })));
const PerformanceAdmin = lazy(() => import('./modules/performance/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const PerformanceReviews = lazy(() => import('./modules/performance/pages/Performance').then((m) => ({ default: m.Performance })));
const PerformanceCycles = lazy(() => import('./modules/performance/pages/PerformanceCycles').then((m) => ({ default: m.PerformanceCycles })));
const CycleCreate = lazy(() => import('./modules/performance/pages/CycleCreate').then((m) => ({ default: m.CycleCreate })));
const CycleProcess = lazy(() => import('./modules/performance/pages/CycleProcess').then((m) => ({ default: m.CycleProcess })));
const CycleResults = lazy(() => import('./modules/performance/pages/CycleResults').then((m) => ({ default: m.CycleResults })));
const CycleGuide = lazy(() => import('./modules/performance/pages/CycleGuide').then((m) => ({ default: m.CycleGuide })));
const CyclePromotions = lazy(() => import('./modules/performance/pages/CyclePromotions').then((m) => ({ default: m.CyclePromotions })));
const CycleMerits = lazy(() => import('./modules/performance/pages/CycleMerits').then((m) => ({ default: m.CycleMerits })));
const Review180360 = lazy(() => import('./modules/performance/pages/Review180360').then((m) => ({ default: m.Review180360 })));
const ReviewReport = lazy(() => import('./modules/performance/pages/ReviewReport').then((m) => ({ default: m.ReviewReport })));
const DataSourcesConfig = lazy(() => import('./modules/performance/admin/DataSourcesConfig').then((m) => ({ default: m.DataSourcesConfig })));
const Review180360Config = lazy(() => import('./modules/performance/admin/Review180360Config').then((m) => ({ default: m.Review180360Config })));
const CycleManagement = lazy(() => import('./modules/performance/admin/CycleManagement').then((m) => ({ default: m.CycleManagement })));
const SuccessFactorsConfig = lazy(() => import('./modules/performance/admin/SuccessFactorsConfig').then((m) => ({ default: m.SuccessFactorsConfig })));
const CompensationConfig = lazy(() => import('./modules/performance/admin/CompensationConfig').then((m) => ({ default: m.CompensationConfig })));
const Goals = lazy(() => import('./modules/performance/pages/Goals').then((m) => ({ default: m.Goals })));
const GoalDetail = lazy(() => import('./modules/performance/pages/GoalDetail').then((m) => ({ default: m.GoalDetail })));
const Feedback = lazy(() => import('./modules/performance/pages/Feedback').then((m) => ({ default: m.Feedback })));

const DevelopmentDashboard = lazy(() => import('./modules/development/pages/DevelopmentDashboard').then((m) => ({ default: m.DevelopmentDashboard })));
const Trainings = lazy(() => import('./modules/development/pages/Trainings').then((m) => ({ default: m.Trainings })));
const Career = lazy(() => import('./modules/development/pages/Career').then((m) => ({ default: m.Career })));
const Mentoring = lazy(() => import('./modules/development/pages/Mentoring').then((m) => ({ default: m.Mentoring })));
const KnowledgeBase = lazy(() => import('./modules/development/pages/KnowledgeBase').then((m) => ({ default: m.KnowledgeBase })));
const MyTrainingsAndAchievements = lazy(() => import('./modules/development/pages/MyTrainingsAndAchievements').then((m) => ({ default: m.MyTrainingsAndAchievements })));
const DevelopmentAdmin = lazy(() => import('./modules/development/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const AnalyticsDashboard = lazy(() => import('./modules/analytics/pages/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard })));
const Analytics = lazy(() => import('./modules/analytics/pages/Analytics').then((m) => ({ default: m.Analytics })));
const PredictiveAnalytics = lazy(() => import('./modules/analytics/pages/PredictiveAnalytics').then((m) => ({ default: m.PredictiveAnalytics })));
const DEIBAnalytics = lazy(() => import('./modules/analytics/pages/DEIBAnalytics').then((m) => ({ default: m.DEIBAnalytics })));
const WorkforceMonitoring = lazy(() => import('./modules/analytics/pages/WorkforceMonitoring').then((m) => ({ default: m.WorkforceMonitoring })));
const Insights = lazy(() => import('./modules/analytics/pages/Insights').then((m) => ({ default: m.Insights })));

const RecruitmentDashboard = lazy(() => import('./modules/recruitment/pages/RecruitmentDashboard').then((m) => ({ default: m.RecruitmentDashboard })));
const RecruitmentJobs = lazy(() => import('./modules/recruitment/pages/Jobs').then((m) => ({ default: m.Jobs })));
const RecruitmentCandidates = lazy(() => import('./modules/recruitment/pages/Candidates').then((m) => ({ default: m.Candidates })));
const RecruitmentPipeline = lazy(() => import('./modules/recruitment/pages/Pipeline').then((m) => ({ default: m.Pipeline })));
const RecruitmentApplications = lazy(() => import('./modules/recruitment/pages/Applications').then((m) => ({ default: m.Applications })));
const RecruitmentAdmin = lazy(() => import('./modules/recruitment/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const RecruitmentJobManagement = lazy(() => import('./modules/recruitment/admin/JobManagement').then((m) => ({ default: m.JobManagement })));
const RecruitmentCandidateManagement = lazy(() => import('./modules/recruitment/admin/CandidateManagement').then((m) => ({ default: m.CandidateManagement })));
const RecruitmentPipelineConfig = lazy(() => import('./modules/recruitment/admin/PipelineConfig').then((m) => ({ default: m.PipelineConfig })));
const RecruitmentInitializePipeline = lazy(() => import('./modules/recruitment/admin/InitializePipeline').then((m) => ({ default: m.InitializePipeline })));

const BenefitsDashboard = lazy(() => import('./modules/benefits/pages/BenefitsDashboard').then((m) => ({ default: m.BenefitsDashboard })));
const MyBenefitsDashboard = lazy(() => import('./modules/benefits/pages/MyBenefitsDashboard').then((m) => ({ default: m.MyBenefitsDashboard })));
const BenefitsAdmin = lazy(() => import('./modules/benefits/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const PoliciesDashboard = lazy(() => import('./modules/policies/pages/PoliciesDashboard').then((m) => ({ default: m.PoliciesDashboard })));
const PoliciesAdmin = lazy(() => import('./modules/policies/admin/AdminDashboard').then((m) => ({ default: m.PoliciesAdminDashboard })));

const SeparationDashboard = lazy(() => import('./modules/separation/pages/SeparationDashboard').then((m) => ({ default: m.SeparationDashboard })));
const SeparationAdmin = lazy(() => import('./modules/separation/admin/AdminDashboard').then((m) => ({ default: m.SeparationAdminDashboard })));

const ExpensesDashboard = lazy(() => import('./modules/expenses/pages/ExpensesDashboard').then((m) => ({ default: m.ExpensesDashboard })));
const ExpensesSubmit = lazy(() => import('./modules/expenses/pages/ExpensesSubmit').then((m) => ({ default: m.ExpensesSubmit })));
const ExpensesAdmin = lazy(() => import('./modules/expenses/admin/AdminDashboard').then((m) => ({ default: m.ExpensesAdminDashboard })));

const PayrollDashboard = lazy(() => import('./modules/payroll/pages/PayrollManagementDashboard').then((m) => ({ default: m.PayrollManagementDashboard })));
const PayrollProcessing = lazy(() => import('./modules/payroll/pages/PayrollProcessing').then((m) => ({ default: m.PayrollProcessing })));
const PayrollApprovals = lazy(() => import('./modules/payroll/pages/PayrollApprovals').then((m) => ({ default: m.PayrollApprovals })));
const PayrollReports = lazy(() => import('./modules/payroll/pages/PayrollReports').then((m) => ({ default: m.PayrollReports })));
const PayrollIntegrations = lazy(() => import('./modules/payroll/pages/PayrollIntegrations').then((m) => ({ default: m.PayrollIntegrations })));
const PayrollAdmin = lazy(() => import('./modules/payroll/admin/AdminDashboard').then((m) => ({ default: m.PayrollAdminDashboard })));

const FacilitiesDashboard = lazy(() => import('./modules/facilities/pages/FacilitiesDashboard').then((m) => ({ default: m.FacilitiesDashboard })));
const FacilitiesAdmin = lazy(() => import('./modules/facilities/admin/AdminDashboard').then((m) => ({ default: m.FacilitiesAdminDashboard })));

const TravelDashboard = lazy(() => import('./modules/travel/pages/TravelDashboard').then((m) => ({ default: m.TravelDashboard })));
const TravelAdmin = lazy(() => import('./modules/travel/admin/AdminDashboard').then((m) => ({ default: m.TravelAdminDashboard })));

const SurveysDashboard = lazy(() => import('./modules/surveys/pages/SurveysDashboard').then((m) => ({ default: m.SurveysDashboard })));
const SurveysAdmin = lazy(() => import('./modules/surveys/admin/AdminDashboard').then((m) => ({ default: m.SurveysAdminDashboard })));

const ContractLaborDashboard = lazy(() => import('./modules/contract-labor/pages/ContractLaborDashboard').then((m) => ({ default: m.ContractLaborDashboard })));
const ContractLaborDetail = lazy(() => import('./modules/contract-labor/pages/ContractLaborDetail').then((m) => ({ default: m.ContractLaborDetail })));
const ContractorsView = lazy(() => import('./modules/contract-labor/pages/ContractorsView').then((m) => ({ default: m.ContractorsView })));
const CostsAnalysis = lazy(() => import('./modules/contract-labor/pages/CostsAnalysis').then((m) => ({ default: m.CostsAnalysis })));
const ContractLaborCalendar = lazy(() => import('./modules/contract-labor/pages/ContractLaborCalendar').then((m) => ({ default: m.ContractLaborCalendar })));
const ContractLaborReports = lazy(() => import('./modules/contract-labor/pages/ContractLaborReports').then((m) => ({ default: m.ContractLaborReports })));
const ServiceMarketplace = lazy(() => import('./modules/contract-labor/pages/ServiceMarketplace').then((m) => ({ default: m.ServiceMarketplace })));
const ContractLaborAdmin = lazy(() => import('./modules/contract-labor/admin/AdminDashboard').then((m) => ({ default: m.ContractLaborAdminDashboard })));
const ContractorManagement = lazy(() => import('./modules/contract-labor/admin/ContractorManagement').then((m) => ({ default: m.ContractorManagement })));
const LaborManagement = lazy(() => import('./modules/contract-labor/admin/LaborManagement').then((m) => ({ default: m.LaborManagement })));

const Chatbot = lazy(() => import('./pages/Chatbot').then((m) => ({ default: m.Chatbot })));
const Notifications = lazy(() =>
  import('./pages/Notifications').then((m) => ({ default: m.Notifications }))
);
const EmployeeDashboard = lazy(() =>
  import('./pages/EmployeeDashboard').then((m) => ({ default: m.EmployeeDashboard }))
);
const ModulesHome = lazy(() =>
  import('./pages/ModulesHome').then((m) => ({ default: m.ModulesHome }))
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/modules"
            element={
              <PrivateRoute>
                <ModulesHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="employees">
                  <EmployeesDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="employees">
                  <EmployeeDetail />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/self-service"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="employees">
                  <EmployeeSelfService />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/org-chart"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="employees">
                  <OrganizationChart />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <DepartmentManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/positions"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <PositionManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <SkillManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects">
                  <ProjectsDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects">
                  <ProjectDetail />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/project-allocations"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects">
                  <ProjectAllocations />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/admin/allocations"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects" requireAdmin>
                  <ProjectAllocations />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/trainings"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <Trainings />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/development"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <DevelopmentDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/development/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development" requireAdmin>
                  <DevelopmentAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/development/admin/trainings"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development" requireAdmin>
                  <DevelopmentAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/development/admin/mentoring"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development" requireAdmin>
                  <DevelopmentAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/development/admin/content"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development" requireAdmin>
                  <DevelopmentAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <PerformanceCycles />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/new"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleCreate />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/process"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleProcess />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/process/:cycleId"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleProcess />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/results"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleResults />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/guide"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleGuide />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/promotions"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CyclePromotions />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/merits"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <CycleMerits />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/admin/data-sources"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles" requireAdmin>
                  <DataSourcesConfig />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/admin/success-factors"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles" requireAdmin>
                  <SuccessFactorsConfig />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/admin/compensation"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles" requireAdmin>
                  <CompensationConfig />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/admin/review-180-360-config"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles" requireAdmin>
                  <Review180360Config />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/admin/management"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles" requireAdmin>
                  <CycleManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/review-180-360"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <Review180360 />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/people-cycles/review-report"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="people-cycles">
                  <ReviewReport />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="performance">
                  <Goals />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/goals/:id"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="performance">
                  <GoalDetail />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="performance">
                  <PerformanceDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/performance/cycles"
            element={<Navigate to="/people-cycles" replace />}
          />
          <Route
            path="/performance/cycles/new"
            element={<Navigate to="/people-cycles/new" replace />}
          />
          <Route
            path="/performance/reviews"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="performance">
                  <PerformanceReviews />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="performance">
                  <Feedback />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <AnalyticsDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/reports"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <Analytics />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/predictive"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <PredictiveAnalytics />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/deib"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <DEIBAnalytics />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/workforce"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <WorkforceMonitoring />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="analytics">
                  <Insights />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PrivateRoute>
                <Chatbot />
              </PrivateRoute>
            }
          />
          <Route
            path="/career"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <Career />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/mentoring"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <Mentoring />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/knowledge-base"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <KnowledgeBase />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="leaves">
                  <LeavesDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves/calendar"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="leaves">
                  <LeaveCalendar />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="attendance">
                  <AttendanceDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/calendar"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="attendance">
                  <AttendanceCalendarPage />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/mirror"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="attendance">
                  <AttendanceMirrorPage />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/overtime"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="attendance">
                  <OvertimePage />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/reports"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="attendance">
                  <AttendanceReportsPage />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-trainings-achievements"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="development">
                  <MyTrainingsAndAchievements />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/project-allocations"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects">
                  <ProjectAllocations />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves/management"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="leaves" requireAdmin>
                  <LeaveManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/admin/table"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="employees" requireAdmin>
                  <EmployeeTableManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/admin/table"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="projects" requireAdmin>
                  <ProjectTableManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings">
                  <SettingsDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <SettingsAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/admin/departments"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <DepartmentManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/admin/positions"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <PositionManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/admin/skills"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="settings" requireAdmin>
                  <SkillManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment">
                  <RecruitmentDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/jobs"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment">
                  <RecruitmentJobs />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/candidates"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment">
                  <RecruitmentCandidates />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/pipeline"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment">
                  <RecruitmentPipeline />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/applications"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment">
                  <RecruitmentApplications />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment" requireAdmin>
                  <RecruitmentAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/admin/jobs"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment" requireAdmin>
                  <RecruitmentJobManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/admin/candidates"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment" requireAdmin>
                  <RecruitmentCandidateManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/admin/pipeline"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment" requireAdmin>
                  <RecruitmentPipelineConfig />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/recruitment/admin/initialize-pipeline"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="recruitment" requireAdmin>
                  <RecruitmentInitializePipeline />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/benefits"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="benefits">
                  <BenefitsDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/benefits/my"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="benefits">
                  <MyBenefitsDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/benefits/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="benefits" requireAdmin>
                  <BenefitsAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/policies"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="policies">
                  <PoliciesDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/policies/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="policies" requireAdmin>
                  <PoliciesAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/separation"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="separation">
                  <SeparationDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/separation/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="separation" requireAdmin>
                  <SeparationAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="expenses">
                  <ExpensesDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses/submit"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="expenses">
                  <ExpensesSubmit />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="expenses" requireAdmin>
                  <ExpensesAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll/processing/:cycleId?"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollProcessing />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll/approvals"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollApprovals />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll/reports"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollReports />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll/integrations"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollIntegrations />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="payroll" requireAdmin>
                  <PayrollAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/facilities"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="facilities">
                  <FacilitiesDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/facilities/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="facilities" requireAdmin>
                  <FacilitiesAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/travel"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="travel">
                  <TravelDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/travel/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="travel" requireAdmin>
                  <TravelAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/surveys"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="surveys">
                  <SurveysDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/surveys/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="surveys" requireAdmin>
                  <SurveysAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ContractLaborDashboard />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/contractors"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ContractorsView />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/costs"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <CostsAnalysis />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/calendar"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ContractLaborCalendar />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/reports"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ContractLaborReports />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/marketplace"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ServiceMarketplace />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/:id"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor">
                  <ContractLaborDetail />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/admin"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor" requireAdmin>
                  <ContractLaborAdmin />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/admin/contractors"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor" requireAdmin>
                  <ContractorManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/contract-labor/admin/labor"
            element={
              <PrivateRoute>
                <ModuleRoute moduleId="contract-labor" requireAdmin>
                  <LaborManagement />
                </ModuleRoute>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/modules" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
