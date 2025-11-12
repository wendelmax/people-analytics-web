import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getModuleConfig, ModuleId } from '../../types/modules';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentModule = (): ModuleId | null => {
    const path = location.pathname;
    if (path.startsWith('/employees')) return 'employees';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/leaves')) return 'leaves';
    if (path.startsWith('/attendance')) return 'attendance';
    if (path.startsWith('/performance')) return 'performance';
    if (path.startsWith('/development')) return 'development';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/recruitment')) return 'recruitment';
    if (path.startsWith('/benefits')) return 'benefits';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/policies')) return 'policies';
    if (path.startsWith('/separation')) return 'separation';
    if (path.startsWith('/expenses')) return 'expenses';
    if (path.startsWith('/payroll')) return 'payroll';
    if (path.startsWith('/facilities')) return 'facilities';
    if (path.startsWith('/travel')) return 'travel';
    if (path.startsWith('/surveys')) return 'surveys';
    if (path.startsWith('/contract-labor')) return 'contract-labor';
    return null;
  };

  const getModuleGroup = (moduleId: ModuleId): string => {
    const groupMap: Record<string, string> = {
      recruitment: 'Recrutamento',
      employees: 'Gestão de Pessoas',
      leaves: 'Gestão de Pessoas',
      attendance: 'Gestão de Pessoas',
      performance: 'Desenvolvimento',
      development: 'Desenvolvimento',
      'people-cycles': 'Desenvolvimento',
      projects: 'Projetos',
      analytics: 'Relatórios',
      benefits: 'Gestão de Pessoas',
      settings: 'Configurações',
      policies: 'Gestão de Pessoas',
      separation: 'Gestão de Pessoas',
      expenses: 'Financeiro',
      payroll: 'Financeiro',
      facilities: 'Operações',
      travel: 'Operações',
      surveys: 'Gestão de Pessoas',
      'contract-labor': 'Operações'
    };
    return groupMap[moduleId];
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    const currentModuleId = getCurrentModule();
    const isInModule = currentModuleId !== null;
    const isAdminRoute = location.pathname.includes('/admin');

    if (isInModule) {
      const module = getModuleConfig(currentModuleId);
      const group = getModuleGroup(currentModuleId);

      breadcrumbs.push({ label: 'Módulos', path: '/modules', icon: '📦' });
      
      if (group) {
        breadcrumbs.push({ label: group, path: undefined });
      }
      
      if (paths.length === 1) {
        breadcrumbs.push({ 
          label: module.name, 
          path: undefined,
          icon: module.icon 
        });
      } else {
        breadcrumbs.push({ 
          label: module.name, 
          path: isAdminRoute ? module.adminRoute : module.route,
          icon: module.icon 
        });
      }
    } else if (location.pathname !== '/modules') {
      breadcrumbs.push({ label: 'Módulos', path: '/modules', icon: '📦' });
    }

    if (isInModule && paths.length > 1) {
      const module = getModuleConfig(currentModuleId);
      const remainingPaths = paths.slice(1);
      let currentPath = `/${paths[0]}`;

      const featureLabels: Record<string, string> = {
        admin: 'Administração',
        'admin/management': 'Gestão',
        'admin/table': 'Tabela',
        'admin/allocations': 'Alocações',
        'admin/departments': 'Departamentos',
        'admin/positions': 'Posições',
        'admin/skills': 'Habilidades',
        'admin/reviews': 'Avaliações',
        'admin/goals': 'Objetivos',
        'admin/trainings': 'Treinamentos',
        'admin/mentoring': 'Mentoria',
        'admin/content': 'Base de Conhecimento',
        'admin/schedules': 'Horários',
        'admin/policies': 'Políticas',
        'admin/checklists': 'Checklists',
        'admin/contractors': 'Contratados',
        'admin/labor': 'Mão de Obra',
        'admin/billing': 'Faturamento',
        'admin/rooms': 'Salas',
        'admin/bookings': 'Reservas',
        'admin/processing': 'Processamento',
        'admin/enrollments': 'Inscrições',
        'admin/compensation': 'Compensação',
        'admin/results': 'Resultados',
        'admin/jobs': 'Vagas',
        'admin/candidates': 'Candidatos',
        'admin/pipeline': 'Pipeline',
        'admin/documents': 'Documentos',
        'admin/orgchart': 'Organograma',
        'admin/system': 'Sistema',
        'admin/integrations': 'Integrações',
        'project-allocations': 'Alocações de Projeto',
        'my-trainings-achievements': 'Meus Treinamentos e Conquistas',
        'knowledge-base': 'Base de Conhecimento',
        'reviews': 'Avaliações',
        'reports': 'Relatórios',
        'my': 'Minhas Solicitações',
        'submit': 'Solicitar',
        'enrollment': 'Inscrição',
        'request': 'Solicitar',
        'book': 'Reservar',
        trainings: 'Treinamentos',
        goals: 'Objetivos',
        feedback: 'Feedback',
        insights: 'Insights',
        career: 'Carreira',
        mentoring: 'Mentoria',
        allocations: 'Alocações',
        dashboard: 'Dashboard',
        profile: 'Perfil',
        calendar: 'Calendário',
        pipeline: 'Pipeline',
        applications: 'Candidaturas',
        jobs: 'Vagas',
        candidates: 'Candidatos',
      };

      remainingPaths.forEach((path, index) => {
        currentPath += `/${path}`;
        const isLast = index === remainingPaths.length - 1;
        const pathKey = remainingPaths.slice(0, index + 1).join('/');

        let label = featureLabels[pathKey] || featureLabels[path];
        
        if (!label) {
          if (path.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            label = 'Detalhes';
          } else {
            label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
          }
        }

        breadcrumbs.push({
          label,
          path: isLast ? undefined : currentPath,
        });
      });
    } else if (!isInModule && paths.length > 0 && location.pathname !== '/modules') {
      const simpleLabels: Record<string, string> = {
        modules: 'Módulos',
        dashboard: 'Dashboard',
        employee: 'Meu Dashboard',
        chatbot: 'Chatbot',
        notifications: 'Notificações',
      };

      let currentPath = '';
      paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const isLast = index === paths.length - 1;
        const label = simpleLabels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        breadcrumbs.push({
          label,
          path: isLast ? undefined : currentPath,
        });
      });
    }

    if (breadcrumbs.length === 0) {
      breadcrumbs.push({ label: 'Módulos', path: undefined, icon: '📦' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <button
        onClick={() => navigate('/modules')}
        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
        aria-label="Módulos"
        title="Módulos"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {isLast || !item.path ? (
              <span className="text-gray-900 font-medium flex items-center gap-1">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(item.path!)}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

