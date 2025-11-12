export type ModuleId =
  | 'recruitment'
  | 'employees'
  | 'leaves'
  | 'attendance'
  | 'performance'
  | 'development'
  | 'projects'
  | 'analytics'
  | 'benefits'
  | 'settings'
  | 'policies'
  | 'separation'
  | 'expenses'
  | 'payroll'
  | 'facilities'
  | 'travel'
  | 'surveys'
  | 'contract-labor'
  | 'people-cycles';

export type Permission = string;

export type Role =
  | 'admin'
  | 'hr_manager'
  | 'manager'
  | 'employee'
  | 'recruiter'
  | 'analyst';

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  adminRoute: string;
  permissions: {
    view: Permission;
    create: Permission;
    update: Permission;
    delete: Permission;
    admin: Permission;
  };
  features: ModuleFeature[];
  adminFeatures: ModuleFeature[];
}

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  route: string;
  icon?: string;
  permissions?: Permission[];
}

export interface ModuleNavigation {
  module: ModuleConfig;
  items: NavigationItem[];
  adminItems: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: number;
  permissions?: Permission[];
  children?: NavigationItem[];
}

export const MODULE_CONFIGS: Record<ModuleId, ModuleConfig> = {
  recruitment: {
    id: 'recruitment',
    name: 'Recrutamento',
    description: 'Gestão de recrutamento e seleção',
    icon: '🎯',
    color: 'blue',
    route: '/recruitment',
    adminRoute: '/recruitment/admin',
    permissions: {
      view: 'recruitment:view',
      create: 'recruitment:create',
      update: 'recruitment:update',
      delete: 'recruitment:delete',
      admin: 'recruitment:admin',
    },
    features: [
      {
        id: 'jobs',
        name: 'Vagas',
        description: 'Visualizar vagas disponíveis',
        route: '/recruitment/jobs',
        icon: '📋',
      },
      {
        id: 'candidates',
        name: 'Candidatos',
        description: 'Visualizar candidatos',
        route: '/recruitment/candidates',
        icon: '👤',
      },
      {
        id: 'pipeline',
        name: 'Pipeline',
        description: 'Visualizar pipeline de recrutamento',
        route: '/recruitment/pipeline',
        icon: '📊',
      },
      {
        id: 'applications',
        name: 'Minhas Candidaturas',
        description: 'Visualizar minhas candidaturas',
        route: '/recruitment/applications',
        icon: '📝',
      },
    ],
    adminFeatures: [
      {
        id: 'job-management',
        name: 'Gestão de Vagas',
        description: 'Gerenciar vagas publicadas',
        route: '/recruitment/admin/jobs',
        icon: '📝',
        permissions: ['recruitment:admin'],
      },
      {
        id: 'candidate-management',
        name: 'Gestão de Candidatos',
        description: 'Gerenciar candidatos',
        route: '/recruitment/admin/candidates',
        icon: '👥',
        permissions: ['recruitment:admin'],
      },
      {
        id: 'pipeline-config',
        name: 'Configuração de Pipeline',
        description: 'Configurar estágios do pipeline',
        route: '/recruitment/admin/pipeline',
        icon: '⚙️',
        permissions: ['recruitment:admin'],
      },
      {
        id: 'initialize-pipeline',
        name: 'Inicializar Pipeline',
        description: 'Inicializar pipeline para uma vaga',
        route: '/recruitment/admin/initialize-pipeline',
        icon: '🚀',
        permissions: ['recruitment:admin'],
      },
    ],
  },
  employees: {
    id: 'employees',
    name: 'Funcionários',
    description: 'Gestão de funcionários',
    icon: '👥',
    color: 'green',
    route: '/employees',
    adminRoute: '/employees/admin',
    permissions: {
      view: 'employees:view',
      create: 'employees:create',
      update: 'employees:update',
      delete: 'employees:delete',
      admin: 'employees:admin',
    },
    features: [
      {
        id: 'list',
        name: 'Lista de Funcionários',
        description: 'Visualizar funcionários',
        route: '/employees',
        icon: '📋',
      },
      {
        id: 'org-chart',
        name: 'Organograma',
        description: 'Estrutura organizacional e hierarquia',
        route: '/employees/org-chart',
        icon: '🌳',
      },
      {
        id: 'self-service',
        name: 'Self Service',
        description: 'Portal do funcionário',
        route: '/employees/self-service',
        icon: '🏠',
      },
      {
        id: 'profile',
        name: 'Meu Perfil',
        description: 'Visualizar meu perfil',
        route: '/employee/dashboard',
        icon: '👤',
      },
      {
        id: 'policies',
        name: 'Políticas da Empresa',
        description: 'Visualizar políticas e compliance',
        route: '/policies',
        icon: '📋',
      },
      {
        id: 'expenses',
        name: 'Meus Reembolsos',
        description: 'Gerenciar reembolsos e despesas',
        route: '/expenses',
        icon: '💰',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Funcionários',
        description: 'Gerenciar funcionários',
        route: '/employees/admin/management',
        icon: '⚙️',
        permissions: ['employees:admin'],
      },
      {
        id: 'documents',
        name: 'Gestão de Documentos',
        description: 'Gerenciar documentos',
        route: '/employees/admin/documents',
        icon: '📄',
        permissions: ['employees:admin'],
      },
      {
        id: 'orgchart',
        name: 'Organograma',
        description: 'Gerenciar organograma',
        route: '/employees/admin/orgchart',
        icon: '🏢',
        permissions: ['employees:admin'],
      },
      {
        id: 'separation',
        name: 'Processos de Desligamento',
        description: 'Gerenciar desligamentos',
        route: '/separation',
        icon: '🚪',
        permissions: ['employees:admin'],
      },
    ],
  },
  leaves: {
    id: 'leaves',
    name: 'Férias e Ausências',
    description: 'Gestão de férias e licenças',
    icon: '📅',
    color: 'purple',
    route: '/leaves',
    adminRoute: '/leaves/admin',
    permissions: {
      view: 'leaves:view',
      create: 'leaves:create',
      update: 'leaves:update',
      delete: 'leaves:delete',
      admin: 'leaves:admin',
    },
    features: [
      {
        id: 'my-leaves',
        name: 'Minhas Licenças',
        description: 'Visualizar minhas solicitações',
        route: '/leaves',
        icon: '📋',
      },
      {
        id: 'calendar',
        name: 'Calendário',
        description: 'Visualizar calendário de ausências',
        route: '/leaves/calendar',
        icon: '📅',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Licenças',
        description: 'Gerenciar solicitações',
        route: '/leaves/admin/management',
        icon: '⚙️',
        permissions: ['leaves:admin'],
      },
      {
        id: 'policies',
        name: 'Políticas',
        description: 'Gerenciar políticas de férias',
        route: '/leaves/admin/policies',
        icon: '📋',
        permissions: ['leaves:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios de ausências',
        route: '/leaves/admin/reports',
        icon: '📊',
        permissions: ['leaves:admin'],
      },
    ],
  },
  attendance: {
    id: 'attendance',
    name: 'Ponto e Presença',
    description: 'Controle de ponto e presença',
    icon: '⏰',
    color: 'orange',
    route: '/attendance',
    adminRoute: '/attendance/admin',
    permissions: {
      view: 'attendance:view',
      create: 'attendance:create',
      update: 'attendance:update',
      delete: 'attendance:delete',
      admin: 'attendance:admin',
    },
    features: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Visão geral e registro de ponto',
        route: '/attendance',
        icon: '📊',
      },
      {
        id: 'calendar',
        name: 'Calendário',
        description: 'Visualização mensal de presença',
        route: '/attendance/calendar',
        icon: '📅',
      },
      {
        id: 'mirror',
        name: 'Espelho de Ponto',
        description: 'Relatório oficial mensal com assinatura',
        route: '/attendance/mirror',
        icon: '📄',
      },
      {
        id: 'overtime',
        name: 'Horas Extras',
        description: 'Controle e valoração de horas extras',
        route: '/attendance/overtime',
        icon: '⏰',
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Análises e exportação de dados',
        route: '/attendance/reports',
        icon: '📈',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Presença',
        description: 'Gerenciar registros',
        route: '/attendance/admin/management',
        icon: '⚙️',
        permissions: ['attendance:admin'],
      },
      {
        id: 'schedules',
        name: 'Horários',
        description: 'Gerenciar horários de trabalho',
        route: '/attendance/admin/schedules',
        icon: '🕐',
        permissions: ['attendance:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios Administrativos',
        description: 'Relatórios gerenciais de presença',
        route: '/attendance/admin/reports',
        icon: '📊',
        permissions: ['attendance:admin'],
      },
    ],
  },
  performance: {
    id: 'performance',
    name: 'Performance',
    description: 'Gestão de performance e avaliações',
    icon: '⭐',
    color: 'yellow',
    route: '/performance',
    adminRoute: '/performance/admin',
    permissions: {
      view: 'performance:view',
      create: 'performance:create',
      update: 'performance:update',
      delete: 'performance:delete',
      admin: 'performance:admin',
    },
    features: [
      {
        id: 'my-performance',
        name: 'Minha Performance',
        description: 'Visualizar minhas avaliações',
        route: '/performance',
        icon: '⭐',
      },
      {
        id: 'goals',
        name: 'Objetivos',
        description: 'Visualizar objetivos',
        route: '/goals',
        icon: '🎯',
      },
      {
        id: 'feedback',
        name: 'Feedback',
        description: 'Visualizar feedback',
        route: '/feedback',
        icon: '💬',
      },
      {
        id: 'reviews',
        name: 'Avaliações',
        description: 'Visualizar avaliações de desempenho',
        route: '/performance/reviews',
        icon: '📊',
      },
    ],
    adminFeatures: [
      {
        id: 'reviews',
        name: 'Gestão de Avaliações',
        description: 'Gerenciar avaliações',
        route: '/performance/admin/reviews',
        icon: '⭐',
        permissions: ['performance:admin'],
      },
      {
        id: 'goals',
        name: 'Gestão de Objetivos',
        description: 'Gerenciar objetivos',
        route: '/performance/admin/goals',
        icon: '🎯',
        permissions: ['performance:admin'],
      },
      {
        id: 'calibration',
        name: 'Calibração',
        description: 'Calibrar avaliações',
        route: '/performance/admin/calibration',
        icon: '⚖️',
        permissions: ['performance:admin'],
      },
    ],
  },
  development: {
    id: 'development',
    name: 'Desenvolvimento',
    description: 'Treinamento e desenvolvimento',
    icon: '🎓',
    color: 'indigo',
    route: '/development',
    adminRoute: '/development/admin',
    permissions: {
      view: 'development:view',
      create: 'development:create',
      update: 'development:update',
      delete: 'development:delete',
      admin: 'development:admin',
    },
    features: [
      {
        id: 'trainings',
        name: 'Treinamentos',
        description: 'Visualizar treinamentos',
        route: '/trainings',
        icon: '📚',
      },
      {
        id: 'mentoring',
        name: 'Mentoria',
        description: 'Visualizar programas de mentoria',
        route: '/mentoring',
        icon: '👨‍🏫',
      },
      {
        id: 'career',
        name: 'Carreira',
        description: 'Visualizar plano de carreira',
        route: '/career',
        icon: '🚀',
      },
      {
        id: 'knowledge',
        name: 'Base de Conhecimento',
        description: 'Acessar base de conhecimento',
        route: '/knowledge-base',
        icon: '📖',
      },
      {
        id: 'my-trainings',
        name: 'Meus Treinamentos',
        description: 'Visualizar meus treinamentos e conquistas',
        route: '/my-trainings-achievements',
        icon: '🎓',
      },
    ],
    adminFeatures: [
      {
        id: 'trainings',
        name: 'Gestão de Treinamentos',
        description: 'Gerenciar treinamentos',
        route: '/development/admin/trainings',
        icon: '📚',
        permissions: ['development:admin'],
      },
      {
        id: 'mentoring',
        name: 'Gestão de Mentoria',
        description: 'Gerenciar programas de mentoria',
        route: '/development/admin/mentoring',
        icon: '👨‍🏫',
        permissions: ['development:admin'],
      },
      {
        id: 'content',
        name: 'Gestão de Conteúdo',
        description: 'Gerenciar conteúdo da base de conhecimento',
        route: '/development/admin/content',
        icon: '📝',
        permissions: ['development:admin'],
      },
    ],
  },
  projects: {
    id: 'projects',
    name: 'Projetos',
    description: 'Gestão de projetos e alocações',
    icon: '📁',
    color: 'teal',
    route: '/projects',
    adminRoute: '/projects/admin',
    permissions: {
      view: 'projects:view',
      create: 'projects:create',
      update: 'projects:update',
      delete: 'projects:delete',
      admin: 'projects:admin',
    },
    features: [
      {
        id: 'list',
        name: 'Projetos',
        description: 'Visualizar projetos',
        route: '/projects',
        icon: '📁',
      },
      {
        id: 'allocations',
        name: 'Alocações',
        description: 'Visualizar alocações',
        route: '/project-allocations',
        icon: '👥',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Projetos',
        description: 'Gerenciar projetos',
        route: '/projects/admin/management',
        icon: '⚙️',
        permissions: ['projects:admin'],
      },
      {
        id: 'allocations',
        name: 'Gestão de Alocações',
        description: 'Gerenciar alocações',
        route: '/projects/admin/allocations',
        icon: '👥',
        permissions: ['projects:admin'],
      },
    ],
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Analytics e insights',
    icon: '📈',
    color: 'pink',
    route: '/analytics',
    adminRoute: '/analytics/admin',
    permissions: {
      view: 'analytics:view',
      create: 'analytics:create',
      update: 'analytics:update',
      delete: 'analytics:delete',
      admin: 'analytics:admin',
    },
    features: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Visualizar analytics',
        route: '/analytics',
        icon: '📊',
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Visualizar relatórios',
        route: '/analytics/reports',
        icon: '📈',
      },
      {
        id: 'predictive',
        name: 'Analytics Preditivos',
        description: 'Previsões de turnover, flight risk e high performers',
        route: '/analytics/predictive',
        icon: '🔮',
      },
      {
        id: 'deib',
        name: 'DEIB Analytics',
        description: 'Diversity, Equity, Inclusion & Belonging',
        route: '/analytics/deib',
        icon: '🌈',
      },
      {
        id: 'workforce',
        name: 'Workforce Monitoring',
        description: 'Monitoramento da força de trabalho',
        route: '/analytics/workforce',
        icon: '👥',
      },
      {
        id: 'insights',
        name: 'Insights',
        description: 'Visualizar insights e recomendações',
        route: '/insights',
        icon: '💡',
      },
    ],
    adminFeatures: [
      {
        id: 'reports',
        name: 'Construtor de Relatórios',
        description: 'Criar relatórios customizados',
        route: '/analytics/admin/reports',
        icon: '📊',
        permissions: ['analytics:admin'],
      },
      {
        id: 'dashboards',
        name: 'Construtor de Dashboards',
        description: 'Criar dashboards customizados',
        route: '/analytics/admin/dashboards',
        icon: '📈',
        permissions: ['analytics:admin'],
      },
      {
        id: 'exports',
        name: 'Exportações',
        description: 'Gerenciar exportações',
        route: '/analytics/admin/exports',
        icon: '📥',
        permissions: ['analytics:admin'],
      },
    ],
  },
  benefits: {
    id: 'benefits',
    name: 'Benefícios',
    description: 'Gestão de benefícios e compensação',
    icon: '💎',
    color: 'emerald',
    route: '/benefits',
    adminRoute: '/benefits/admin',
    permissions: {
      view: 'benefits:view',
      create: 'benefits:create',
      update: 'benefits:update',
      delete: 'benefits:delete',
      admin: 'benefits:admin',
    },
    features: [
      {
        id: 'dashboard',
        name: 'Visão Geral',
        description: 'Dashboard de benefícios',
        route: '/benefits',
        icon: '📊',
      },
      {
        id: 'my-benefits',
        name: 'Meus Benefícios',
        description: 'Gerenciar meus benefícios e dependentes',
        route: '/benefits/my',
        icon: '💎',
      },
      {
        id: 'available',
        name: 'Benefícios Disponíveis',
        description: 'Ver e solicitar benefícios',
        route: '/benefits/my',
        icon: '📝',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Benefícios',
        description: 'Gerenciar benefícios',
        route: '/benefits/admin/management',
        icon: '⚙️',
        permissions: ['benefits:admin'],
      },
      {
        id: 'enrollments',
        name: 'Gestão de Inscrições',
        description: 'Gerenciar inscrições',
        route: '/benefits/admin/enrollments',
        icon: '📋',
        permissions: ['benefits:admin'],
      },
      {
        id: 'compensation',
        name: 'Compensação',
        description: 'Gerenciar compensação',
        route: '/benefits/admin/compensation',
        icon: '💰',
        permissions: ['benefits:admin'],
      },
    ],
  },
  settings: {
    id: 'settings',
    name: 'Configurações',
    description: 'Configurações do sistema',
    icon: '⚙️',
    color: 'gray',
    route: '/settings',
    adminRoute: '/settings/admin',
    permissions: {
      view: 'settings:view',
      create: 'settings:create',
      update: 'settings:update',
      delete: 'settings:delete',
      admin: 'settings:admin',
    },
    features: [
      {
        id: 'profile',
        name: 'Meu Perfil',
        description: 'Configurar meu perfil',
        route: '/settings/profile',
        icon: '👤',
      },
    ],
    adminFeatures: [
      {
        id: 'system',
        name: 'Configurações do Sistema',
        description: 'Configurações gerais',
        route: '/settings/admin/system',
        icon: '⚙️',
        permissions: ['settings:admin'],
      },
      {
        id: 'departments',
        name: 'Departamentos',
        description: 'Gerenciar departamentos',
        route: '/settings/admin/departments',
        icon: '🏢',
        permissions: ['settings:admin'],
      },
      {
        id: 'positions',
        name: 'Posições',
        description: 'Gerenciar posições',
        route: '/settings/admin/positions',
        icon: '💼',
        permissions: ['settings:admin'],
      },
      {
        id: 'skills',
        name: 'Habilidades',
        description: 'Gerenciar habilidades',
        route: '/settings/admin/skills',
        icon: '🎯',
        permissions: ['settings:admin'],
      },
      {
        id: 'permissions',
        name: 'Permissões',
        description: 'Gerenciar permissões',
        route: '/settings/admin/permissions',
        icon: '🔐',
        permissions: ['settings:admin'],
      },
      {
        id: 'integrations',
        name: 'Integrações',
        description: 'Gerenciar integrações',
        route: '/settings/admin/integrations',
        icon: '🔗',
        permissions: ['settings:admin'],
      },
    ],
  },
  policies: {
    id: 'policies',
    name: 'Políticas',
    description: 'Gestão de políticas e documentos da empresa',
    icon: '📋',
    color: 'slate',
    route: '/policies',
    adminRoute: '/policies/admin',
    permissions: {
      view: 'policies:view',
      create: 'policies:create',
      update: 'policies:update',
      delete: 'policies:delete',
      admin: 'policies:admin',
    },
    features: [
      {
        id: 'browser',
        name: 'Biblioteca de Políticas',
        description: 'Visualizar políticas disponíveis',
        route: '/policies',
        icon: '📚',
      },
      {
        id: 'my-acknowledgments',
        name: 'Meus Aceites',
        description: 'Visualizar políticas aceitas',
        route: '/policies/acknowledgments',
        icon: '✅',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Políticas',
        description: 'Gerenciar políticas e documentos',
        route: '/policies/admin/management',
        icon: '⚙️',
        permissions: ['policies:admin'],
      },
      {
        id: 'acknowledgments',
        name: 'Aceites',
        description: 'Visualizar aceites de políticas',
        route: '/policies/admin/acknowledgments',
        icon: '✅',
        permissions: ['policies:admin'],
      },
    ],
  },
  separation: {
    id: 'separation',
    name: 'Desligamento',
    description: 'Gestão de processos de desligamento',
    icon: '🚪',
    color: 'red',
    route: '/separation',
    adminRoute: '/separation/admin',
    permissions: {
      view: 'separation:view',
      create: 'separation:create',
      update: 'separation:update',
      delete: 'separation:delete',
      admin: 'separation:admin',
    },
    features: [
      {
        id: 'my-separation',
        name: 'Meu Desligamento',
        description: 'Visualizar processo de desligamento',
        route: '/separation/my',
        icon: '👤',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Desligamentos',
        description: 'Gerenciar processos de desligamento',
        route: '/separation/admin/management',
        icon: '⚙️',
        permissions: ['separation:admin'],
      },
      {
        id: 'checklists',
        name: 'Checklists',
        description: 'Gerenciar checklists de offboarding',
        route: '/separation/admin/checklists',
        icon: '✅',
        permissions: ['separation:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios de turnover',
        route: '/separation/admin/reports',
        icon: '📊',
        permissions: ['separation:admin'],
      },
    ],
  },
  expenses: {
    id: 'expenses',
    name: 'Reembolsos',
    description: 'Gestão de reembolsos e despesas',
    icon: '💰',
    color: 'emerald',
    route: '/expenses',
    adminRoute: '/expenses/admin',
    permissions: {
      view: 'expenses:view',
      create: 'expenses:create',
      update: 'expenses:update',
      delete: 'expenses:delete',
      admin: 'expenses:admin',
    },
    features: [
      {
        id: 'my-expenses',
        name: 'Minhas Despesas',
        description: 'Visualizar minhas despesas',
        route: '/expenses',
        icon: '💳',
      },
      {
        id: 'submit',
        name: 'Solicitar Reembolso',
        description: 'Solicitar novo reembolso',
        route: '/expenses/submit',
        icon: '➕',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Reembolsos',
        description: 'Aprovar e gerenciar reembolsos',
        route: '/expenses/admin/management',
        icon: '⚙️',
        permissions: ['expenses:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios financeiros',
        route: '/expenses/admin/reports',
        icon: '📊',
        permissions: ['expenses:admin'],
      },
    ],
  },
  payroll: {
    id: 'payroll',
    name: 'Folha de Pagamento',
    description: 'Processamento e gestão de folha de pagamento',
    icon: '💵',
    color: 'green',
    route: '/payroll',
    adminRoute: '/payroll/admin',
    permissions: {
      view: 'payroll:view',
      create: 'payroll:create',
      update: 'payroll:update',
      delete: 'payroll:delete',
      admin: 'payroll:admin',
    },
    features: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Visão geral dos ciclos de folha',
        route: '/payroll',
        icon: '📊',
      },
      {
        id: 'processing',
        name: 'Processamento',
        description: 'Calcular e processar folha mensal',
        route: '/payroll/processing',
        icon: '⚙️',
      },
      {
        id: 'approvals',
        name: 'Aprovações',
        description: 'Aprovar ciclos de folha',
        route: '/payroll/approvals',
        icon: '✅',
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios gerenciais e contábeis',
        route: '/payroll/reports',
        icon: '📈',
      },
      {
        id: 'integrations',
        name: 'Integrações',
        description: 'Banco, contabilidade e impostos',
        route: '/payroll/integrations',
        icon: '🔗',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Folha',
        description: 'Processar folha de pagamento',
        route: '/payroll/admin/management',
        icon: '⚙️',
        permissions: ['payroll:admin'],
      },
      {
        id: 'processing',
        name: 'Processamento',
        description: 'Processar folha mensal',
        route: '/payroll/admin/processing',
        icon: '🔄',
        permissions: ['payroll:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios de folha',
        route: '/payroll/admin/reports',
        icon: '📊',
        permissions: ['payroll:admin'],
      },
    ],
  },
  facilities: {
    id: 'facilities',
    name: 'Instalações',
    description: 'Reserva de salas e espaços',
    icon: '🏢',
    color: 'blue',
    route: '/facilities',
    adminRoute: '/facilities/admin',
    permissions: {
      view: 'facilities:view',
      create: 'facilities:create',
      update: 'facilities:update',
      delete: 'facilities:delete',
      admin: 'facilities:admin',
    },
    features: [
      {
        id: 'bookings',
        name: 'Minhas Reservas',
        description: 'Visualizar minhas reservas',
        route: '/facilities',
        icon: '📅',
      },
      {
        id: 'book-room',
        name: 'Reservar Sala',
        description: 'Fazer nova reserva',
        route: '/facilities/book',
        icon: '➕',
      },
    ],
    adminFeatures: [
      {
        id: 'rooms',
        name: 'Gestão de Salas',
        description: 'Gerenciar salas e espaços',
        route: '/facilities/admin/rooms',
        icon: '🏢',
        permissions: ['facilities:admin'],
      },
      {
        id: 'bookings',
        name: 'Gestão de Reservas',
        description: 'Aprovar e gerenciar reservas',
        route: '/facilities/admin/bookings',
        icon: '📅',
        permissions: ['facilities:admin'],
      },
    ],
  },
  travel: {
    id: 'travel',
    name: 'Viagens',
    description: 'Gestão de viagens corporativas',
    icon: '✈️',
    color: 'cyan',
    route: '/travel',
    adminRoute: '/travel/admin',
    permissions: {
      view: 'travel:view',
      create: 'travel:create',
      update: 'travel:update',
      delete: 'travel:delete',
      admin: 'travel:admin',
    },
    features: [
      {
        id: 'my-travels',
        name: 'Minhas Viagens',
        description: 'Visualizar minhas viagens',
        route: '/travel',
        icon: '✈️',
      },
      {
        id: 'request',
        name: 'Solicitar Viagem',
        description: 'Solicitar nova viagem',
        route: '/travel/request',
        icon: '➕',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Viagens',
        description: 'Aprovar e gerenciar viagens',
        route: '/travel/admin/management',
        icon: '⚙️',
        permissions: ['travel:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios de viagens',
        route: '/travel/admin/reports',
        icon: '📊',
        permissions: ['travel:admin'],
      },
    ],
  },
  surveys: {
    id: 'surveys',
    name: 'Pesquisas',
    description: 'Pesquisas e pesquisas de satisfação',
    icon: '📊',
    color: 'purple',
    route: '/surveys',
    adminRoute: '/surveys/admin',
    permissions: {
      view: 'surveys:view',
      create: 'surveys:create',
      update: 'surveys:update',
      delete: 'surveys:delete',
      admin: 'surveys:admin',
    },
    features: [
      {
        id: 'available',
        name: 'Pesquisas Disponíveis',
        description: 'Visualizar pesquisas disponíveis',
        route: '/surveys',
        icon: '📋',
      },
      {
        id: 'my-responses',
        name: 'Minhas Respostas',
        description: 'Visualizar minhas respostas',
        route: '/surveys/responses',
        icon: '✅',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Pesquisas',
        description: 'Criar e gerenciar pesquisas',
        route: '/surveys/admin/management',
        icon: '⚙️',
        permissions: ['surveys:admin'],
      },
      {
        id: 'results',
        name: 'Resultados',
        description: 'Visualizar resultados das pesquisas',
        route: '/surveys/admin/results',
        icon: '📊',
        permissions: ['surveys:admin'],
      },
    ],
  },
  'contract-labor': {
    id: 'contract-labor',
    name: 'Mão de Obra Terceirizada',
    description: 'Gestão de trabalhadores terceirizados',
    icon: '👷',
    color: 'amber',
    route: '/contract-labor',
    adminRoute: '/contract-labor/admin',
    permissions: {
      view: 'contract-labor:view',
      create: 'contract-labor:create',
      update: 'contract-labor:update',
      delete: 'contract-labor:delete',
      admin: 'contract-labor:admin',
    },
    features: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Visão geral dos trabalhadores',
        route: '/contract-labor',
        icon: '📊',
      },
      {
        id: 'labor',
        name: 'Trabalhadores',
        description: 'Visualizar trabalhadores terceirizados',
        route: '/contract-labor',
        icon: '👷',
      },
      {
        id: 'contractors',
        name: 'Contratados',
        description: 'Visualizar empresas contratadas',
        route: '/contract-labor/contractors',
        icon: '🏢',
      },
      {
        id: 'costs',
        name: 'Análise de Custos',
        description: 'Custos por projeto e contratado',
        route: '/contract-labor/costs',
        icon: '💵',
      },
      {
        id: 'reports',
        name: 'Relatórios',
        description: 'Relatórios e análises',
        route: '/contract-labor/reports',
        icon: '📈',
      },
      {
        id: 'calendar',
        name: 'Calendário',
        description: 'Calendário de alocações e contratos',
        route: '/contract-labor/calendar',
        icon: '📅',
      },
      {
        id: 'marketplace',
        name: 'Mural de Oportunidades',
        description: 'Publique demandas e receba propostas',
        route: '/contract-labor/marketplace',
        icon: '📢',
      },
    ],
    adminFeatures: [
      {
        id: 'contractors',
        name: 'Gestão de Contratados',
        description: 'Gerenciar empresas contratadas',
        route: '/contract-labor/admin/contractors',
        icon: '🏢',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'labor',
        name: 'Gestão de Mão de Obra',
        description: 'Gerenciar trabalhadores',
        route: '/contract-labor/admin/labor',
        icon: '👷',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'attendance',
        name: 'Controle de Presença',
        description: 'Registros de presença e horas',
        route: '/contract-labor/admin/attendance',
        icon: '⏰',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'contracts',
        name: 'Contratos e Documentos',
        description: 'Gerenciar contratos e documentação',
        route: '/contract-labor/admin/contracts',
        icon: '📄',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'billing',
        name: 'Faturamento',
        description: 'Faturamento e pagamentos',
        route: '/contract-labor/admin/billing',
        icon: '💰',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'renewals',
        name: 'Renovações',
        description: 'Contratos próximos ao vencimento',
        route: '/contract-labor/admin/renewals',
        icon: '🔄',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'performance',
        name: 'Avaliações',
        description: 'Avaliações de desempenho',
        route: '/contract-labor/admin/performance',
        icon: '⭐',
        permissions: ['contract-labor:admin'],
      },
      {
        id: 'reports',
        name: 'Relatórios Avançados',
        description: 'Relatórios gerenciais detalhados',
        route: '/contract-labor/admin/reports',
        icon: '📊',
        permissions: ['contract-labor:admin'],
      },
    ],
  },
  'people-cycles': {
    id: 'people-cycles',
    name: 'Ciclos de Gente',
    description: 'Gerenciar ciclos de avaliação, metas e calibração organizacional',
    icon: '🔄',
    color: 'indigo',
    route: '/people-cycles',
    adminRoute: '/people-cycles/admin',
    permissions: {
      view: 'people-cycles:view',
      create: 'people-cycles:create',
      update: 'people-cycles:update',
      delete: 'people-cycles:delete',
      admin: 'people-cycles:admin',
    },
    features: [
      {
        id: 'cycles',
        name: 'Ciclos de Gente',
        description: 'Visualizar e gerenciar ciclos de avaliação',
        route: '/people-cycles',
        icon: '🔄',
      },
      {
        id: 'process',
        name: 'Visualizar Processo',
        description: 'Acompanhar o processo atual do ciclo',
        route: '/people-cycles/process',
        icon: '📋',
      },
      {
        id: 'results',
        name: 'Ver Resultados',
        description: 'Visualizar resultados das avaliações',
        route: '/people-cycles/results',
        icon: '📊',
      },
      {
        id: 'guide',
        name: 'Guia Explicativo',
        description: 'Entender as etapas de cada tipo de ciclo',
        route: '/people-cycles/guide',
        icon: '📖',
      },
      {
        id: 'promotions',
        name: 'Possíveis Promoções',
        description: 'Gerenciar promoções baseadas em avaliação',
        route: '/people-cycles/promotions',
        icon: '⬆️',
      },
      {
        id: 'merits',
        name: 'Méritos',
        description: 'Visualizar e gerenciar méritos',
        route: '/people-cycles/merits',
        icon: '🏆',
      },
      {
        id: 'review-180-360',
        name: 'Avaliação 180/360',
        description: 'Realizar avaliação 180° ou 360°',
        route: '/people-cycles/review-180-360',
        icon: '🔄',
      },
      {
        id: 'review-report',
        name: 'Relatório de Avaliação',
        description: 'Visualizar relatório final com resumo por IA',
        route: '/people-cycles/review-report',
        icon: '📄',
      },
    ],
    adminFeatures: [
      {
        id: 'management',
        name: 'Gestão de Ciclos',
        description: 'Gerenciar ciclos de avaliação e calibração',
        route: '/people-cycles/admin/management',
        icon: '⚙️',
        permissions: ['people-cycles:admin'],
      },
      {
        id: 'data-sources',
        name: 'Configurar Fontes de Dados',
        description: 'Configurar fontes para medir entrega no ano',
        route: '/people-cycles/admin/data-sources',
        icon: '🔗',
        permissions: ['people-cycles:admin'],
      },
      {
        id: 'success-factors',
        name: 'Fatores de Sucesso',
        description: 'Configurar fatores de sucesso para etapas de avaliação',
        route: '/people-cycles/admin/success-factors',
        icon: '✅',
        permissions: ['people-cycles:admin'],
      },
      {
        id: 'compensation',
        name: 'Amarrar Avaliação',
        description: 'Configurar integração com bônus, PLR e compensação',
        route: '/people-cycles/admin/compensation',
        icon: '💰',
        permissions: ['people-cycles:admin'],
      },
      {
        id: 'review-180-360-config',
        name: 'Configurar 180/360',
        description: 'Configurar avaliação 180° e 360°',
        route: '/people-cycles/admin/review-180-360-config',
        icon: '⚙️',
        permissions: ['people-cycles:admin'],
      },
    ],
  },
};

export function getModuleConfig(moduleId: ModuleId): ModuleConfig {
  return MODULE_CONFIGS[moduleId];
}

export function getAllModules(): ModuleConfig[] {
  return Object.values(MODULE_CONFIGS);
}

export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('admin');
}

export function canAccessModule(userPermissions: Permission[], moduleId: ModuleId): boolean {
  const module = MODULE_CONFIGS[moduleId];
  return hasPermission(userPermissions, module.permissions.view);
}

export function canAccessAdmin(userPermissions: Permission[], moduleId: ModuleId): boolean {
  const module = MODULE_CONFIGS[moduleId];
  return hasPermission(userPermissions, module.permissions.admin);
}

