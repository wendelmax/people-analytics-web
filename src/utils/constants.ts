export const API_ENDPOINTS = {
  HEALTH: '/health',
  EMPLOYEES: '/employee',
  DEPARTMENTS: '/departments',
  POSITIONS: '/positions',
  SKILLS: '/skills',
  SKILL_PROFICIENCY: '/skill-proficiency',
  PROJECTS: '/projects',
  TRAININGS: '/trainings',
  PERFORMANCE: '/performance',
  GOALS: '/goals',
  FEEDBACK: '/feedback',
  ANALYTICS: '/analytics',
  INSIGHTS: '/insights',
  PERFORMANCE_INSIGHTS: '/performance-insights',
  CAREER: '/career',
  MENTORING: '/mentoring',
  NOTIFICATIONS: '/notifications',
  KNOWLEDGE_BASE: '/knowledge-base',
  CHATBOT: '/chatbot',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  DEPARTMENTS: '/departments',
  POSITIONS: '/positions',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  TRAININGS: '/trainings',
  GOALS: '/goals',
  PERFORMANCE: '/performance',
  FEEDBACK: '/feedback',
  ANALYTICS: '/analytics',
} as const;

