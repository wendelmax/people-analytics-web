import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'mock-db.json');

app.use(cors());
app.use(express.json());

interface Database {
  employees: Record<string, unknown>[];
  departments: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  positions: Record<string, unknown>[];
  skills: Record<string, unknown>[];
  leaveTypes: Record<string, unknown>[];
  leaveRequests: Record<string, unknown>[];
  leaveBalances: Record<string, unknown>[];
  attendance: Record<string, unknown>[];
  trainings: Record<string, unknown>[];
  goals: Record<string, unknown>[];
  performanceReviews: Record<string, unknown>[];
  feedback: Record<string, unknown>[];
  notifications: Record<string, unknown>[];
  achievements: Record<string, unknown>[];
  projectAllocations: Record<string, unknown>[];
  mentoringRelationships: Record<string, unknown>[];
  policies: Record<string, unknown>[];
  policyAcknowledgments: Record<string, unknown>[];
  separations: Record<string, unknown>[];
  expenses: Record<string, unknown>[];
  expenseReports: Record<string, unknown>[];
  payrolls: Record<string, unknown>[];
  conferenceRooms: Record<string, unknown>[];
  roomBookings: Record<string, unknown>[];
  travelRequests: Record<string, unknown>[];
  surveys: Record<string, unknown>[];
  surveyResponses: Record<string, unknown>[];
  contractors: Record<string, unknown>[];
  contractLabor: Record<string, unknown>[];
  contractLaborAttendance: Record<string, unknown>[];
}

let db: Database = {
  employees: [],
  departments: [],
  projects: [],
  positions: [],
  skills: [],
  leaveTypes: [],
  leaveRequests: [],
  leaveBalances: [],
  attendance: [],
  trainings: [],
  goals: [],
  performanceReviews: [],
  feedback: [],
  notifications: [],
  achievements: [],
  projectAllocations: [],
  mentoringRelationships: [],
  policies: [],
  policyAcknowledgments: [],
  separations: [],
  expenses: [],
  expenseReports: [],
  payrolls: [],
  conferenceRooms: [],
  roomBookings: [],
  travelRequests: [],
  surveys: [],
  surveyResponses: [],
  contractors: [],
  contractLabor: [],
  contractLaborAttendance: [],
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(data);
      console.log('📦 Database loaded from file');
    } else {
      seedDatabase();
      saveDatabase();
      console.log('✨ New database created and seeded');
    }
  } catch (error) {
    console.error('Error loading database:', error);
    seedDatabase();
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function seedDatabase() {
  db.employees = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@company.com',
      position: 'Desenvolvedor Senior',
      department: 'TI',
      hireDate: '2020-01-15',
      status: 'ACTIVE',
      avatar: '',
      phone: '(11) 99999-9999',
      salary: 8000,
      skills: ['React', 'TypeScript', 'Node.js'],
      createdAt: '2020-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@company.com',
      position: 'Gerente de Projetos',
      department: 'TI',
      hireDate: '2019-03-20',
      status: 'ACTIVE',
      avatar: '',
      phone: '(11) 88888-8888',
      salary: 12000,
      skills: ['Gestão', 'Scrum', 'Agile'],
      createdAt: '2019-03-20',
      updatedAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@company.com',
      position: 'Desenvolvedor Pleno',
      department: 'TI',
      hireDate: '2021-06-10',
      status: 'ACTIVE',
      avatar: '',
      phone: '(11) 77777-7777',
      salary: 6000,
      skills: ['Vue.js', 'Python', 'Django'],
      createdAt: '2021-06-10',
      updatedAt: '2024-01-15',
    },
  ];

  db.departments = [
    {
      id: '1',
      name: 'Tecnologia da Informação',
      description: 'Departamento de TI',
      managerId: '2',
      createdAt: '2020-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Recursos Humanos',
      description: 'Departamento de RH',
      managerId: null,
      createdAt: '2020-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  db.projects = [
    {
      id: '1',
      name: 'Sistema de People Analytics',
      description: 'Plataforma de analytics para gestão de pessoas',
      status: 'IN_PROGRESS',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  db.positions = [
    {
      id: '1',
      title: 'Desenvolvedor Full Stack',
      description: 'Desenvolvedor',
      level: 'PLENO',
      departmentId: '1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Analista de RH',
      description: 'Analista',
      level: 'JUNIOR',
      departmentId: '2',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  db.skills = [
    {
      id: '1',
      name: 'React',
      description: 'Biblioteca JavaScript',
      type: 'HARD',
      category: 'TECHNICAL',
      defaultLevel: 'ADVANCED',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'TypeScript',
      description: 'Superset do JavaScript',
      type: 'HARD',
      category: 'TECHNICAL',
      defaultLevel: 'ADVANCED',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  db.leaveTypes = [
    {
      id: '1',
      name: 'Férias',
      code: 'VACATION',
      maxDays: 30,
      carryForward: true,
      requiresApproval: true,
      isActive: true,
    },
    {
      id: '2',
      name: 'Licença Médica',
      code: 'SICK_LEAVE',
      carryForward: false,
      requiresApproval: true,
      isActive: true,
    },
  ];

  db.leaveRequests = [
    {
      id: '1',
      employeeId: '1',
      leaveTypeId: '1',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 5,
      reason: 'Férias planejadas',
      status: 'PENDING',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ];

  db.leaveBalances = [
    {
      id: '1',
      employeeId: '1',
      leaveTypeId: '1',
      balance: 25,
      accrued: 30,
      used: 5,
      year: 2024,
    },
  ];

  db.trainings = [
    {
      id: '1',
      name: 'React Avançado',
      description: 'Curso de React avançado',
      provider: 'Udemy',
      type: 'ONLINE_COURSE',
      status: 'IN_PROGRESS',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      difficulty: 'ADVANCED',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'TypeScript Fundamentals',
      description: 'Curso completo de TypeScript',
      provider: 'Pluralsight',
      type: 'ONLINE_COURSE',
      status: 'COMPLETED',
      startDate: '2023-11-01',
      endDate: '2023-12-15',
      difficulty: 'INTERMEDIATE',
      createdAt: '2023-11-01',
      updatedAt: '2023-12-15',
    },
  ];

  db.goals = [
    {
      id: '1',
      employeeId: '1',
      title: 'Completar projeto X',
      description: 'Finalizar projeto até junho',
      type: 'PROJECT',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      startDate: '2024-01-01',
      targetDate: '2024-06-30',
      progress: 0.45,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      employeeId: '1',
      title: 'Curso de React Avançado',
      description: 'Completar curso de React avançado na plataforma Udemy',
      type: 'DEVELOPMENT',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      startDate: '2024-01-15',
      targetDate: '2024-03-15',
      progress: 0.75,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ];

  db.attendance = [
    {
      id: '1',
      employeeId: '1',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00:00',
      checkOut: '18:00:00',
      workHours: 8,
      status: 'PRESENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  db.performanceReviews = [
    {
      id: '1',
      employeeId: '1',
      reviewerId: '2',
      periodStart: '2024-01-01',
      periodEnd: '2024-03-31',
      status: 'COMPLETED',
      overallRating: 4.5,
      strengths: ['Bom trabalho em equipe', 'Proativo'],
      improvements: ['Melhorar comunicação'],
      createdAt: '2024-04-01',
      updatedAt: '2024-04-01',
    },
  ];

  db.feedback = [];

  db.notifications = [
    {
      id: '1',
      userId: '1',
      title: 'Nova solicitação de férias',
      message: 'Sua solicitação de férias foi aprovada',
      type: 'LEAVE',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];

  db.achievements = [
    {
      id: '1',
      employeeId: '1',
      title: 'Certificação TypeScript',
      description: 'Certificação oficial em TypeScript pela Microsoft',
      type: 'CERTIFICATION',
      icon: '🏆',
      earnedAt: '2023-12-15',
      issuer: 'Microsoft',
      certificateUrl: 'https://example.com/certificate-ts',
      createdAt: '2023-12-15',
      updatedAt: '2023-12-15',
    },
    {
      id: '2',
      employeeId: '1',
      title: 'Badge de React Expert',
      description: 'Conquistado por completar 10 projetos em React',
      type: 'BADGE',
      icon: '🎖️',
      earnedAt: '2024-01-10',
      issuer: 'Empresa',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: '3',
      employeeId: '1',
      title: 'Funcionário do Mês',
      description: 'Reconhecimento por excelente desempenho em janeiro',
      type: 'AWARD',
      icon: '⭐',
      earnedAt: '2024-02-01',
      issuer: 'Empresa',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
    },
  ];

  db.projectAllocations = [];

  db.mentoringRelationships = [
    {
      id: '1',
      mentorId: '2',
      menteeId: '1',
      status: 'ACTIVE',
      startDate: '2024-01-15',
      endDate: null,
      mentor: db.employees[1],
      mentee: db.employees[0],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      mentorId: '3',
      menteeId: '2',
      status: 'ACTIVE',
      startDate: '2024-02-01',
      endDate: null,
      mentor: db.employees[2],
      mentee: db.employees[1],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
    },
    {
      id: '3',
      mentorId: '2',
      menteeId: '3',
      status: 'COMPLETED',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      mentor: db.employees[1],
      mentee: db.employees[2],
      createdAt: '2023-06-01',
      updatedAt: '2023-12-31',
    },
  ];

  db.policies = [
    {
      id: '1',
      title: 'Política de Código de Conduta',
      description: 'Diretrizes de comportamento profissional',
      content: 'Conteúdo da política...',
      category: 'HR',
      version: '1.0',
      status: 'ACTIVE',
      requiresAcknowledgment: true,
      effectiveDate: '2024-01-01',
      createdBy: '1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Política de Segurança da Informação',
      description: 'Diretrizes de segurança de dados',
      content: 'Conteúdo da política...',
      category: 'IT',
      version: '2.0',
      status: 'ACTIVE',
      requiresAcknowledgment: true,
      effectiveDate: '2024-02-01',
      createdBy: '1',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
    },
  ];

  db.policyAcknowledgments = [];
  db.separations = [];
  db.expenses = [];
  db.expenseReports = [];
  db.payrolls = [];
  db.conferenceRooms = [
    {
      id: '1',
      name: 'Sala de Reunião A',
      capacity: 10,
      location: '1º Andar',
      amenities: ['Projetor', 'Wi-Fi', 'Ar condicionado'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Sala de Reunião B',
      capacity: 20,
      location: '2º Andar',
      amenities: ['Projetor', 'Wi-Fi', 'Ar condicionado', 'Videoconferência'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];
  db.roomBookings = [];
  db.travelRequests = [];
  db.surveys = [];
  db.surveyResponses = [];
  db.contractors = [];
  db.contractLabor = [];
  db.contractLaborAttendance = [];
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

app.get('/employee', (req, res) => {
  res.json(db.employees);
});

app.get('/employees', (req, res) => {
  res.json(db.employees);
});

app.get('/employee/:id', (req, res) => {
  const employee = db.employees.find((e) => e.id === req.params.id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.get('/employees/:id', (req, res) => {
  const employee = db.employees.find((e) => e.id === req.params.id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/employee', (req, res) => {
  const newEmployee = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.employees.push(newEmployee);
  saveDatabase();
  res.status(201).json(newEmployee);
});

app.post('/employees', (req, res) => {
  const newEmployee = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.employees.push(newEmployee);
  saveDatabase();
  res.status(201).json(newEmployee);
});

app.patch('/employee/:id', (req, res) => {
  const employee = db.employees.find((e) => e.id === req.params.id);
  if (employee) {
    Object.assign(employee, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.patch('/employees/:id', (req, res) => {
  const employee = db.employees.find((e) => e.id === req.params.id);
  if (employee) {
    Object.assign(employee, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/employee/:id', (req, res) => {
  const index = db.employees.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.employees.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/employees/:id', (req, res) => {
  const index = db.employees.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.employees.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.get('/departments', (req, res) => {
  res.json(db.departments);
});

app.get('/departments/:id', (req, res) => {
  const department = db.departments.find((d) => d.id === req.params.id);
  if (department) {
    res.json(department);
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
});

app.post('/departments', (req, res) => {
  const newDepartment = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.departments.push(newDepartment);
  saveDatabase();
  res.status(201).json(newDepartment);
});

app.patch('/departments/:id', (req, res) => {
  const department = db.departments.find((d) => d.id === req.params.id);
  if (department) {
    Object.assign(department, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(department);
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
});

app.delete('/departments/:id', (req, res) => {
  const index = db.departments.findIndex((d) => d.id === req.params.id);
  if (index !== -1) {
    db.departments.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
});

app.get('/projects', (req, res) => {
  res.json(db.projects);
});

app.get('/projects/:id', (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/projects', (req, res) => {
  const newProject = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.projects.push(newProject);
  saveDatabase();
  res.status(201).json(newProject);
});

app.patch('/projects/:id', (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (project) {
    Object.assign(project, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/projects/:id', (req, res) => {
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    db.projects.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.get('/mentoring', (req, res) => {
  const relationships = db.mentoringRelationships.map((rel) => ({
    ...rel,
    mentor: db.employees.find((e) => e.id === rel.mentorId),
    mentee: db.employees.find((e) => e.id === rel.menteeId),
  }));
  res.json(relationships);
});

app.get('/mentoring/:id', (req, res) => {
  const relationship = db.mentoringRelationships.find((r) => r.id === req.params.id);
  if (relationship) {
    res.json({
      ...relationship,
      mentor: db.employees.find((e) => e.id === relationship.mentorId),
      mentee: db.employees.find((e) => e.id === relationship.menteeId),
    });
  } else {
    res.status(404).json({ error: 'Mentoring relationship not found' });
  }
});

app.post('/mentoring', (req, res) => {
  const { mentorId, menteeId, status, startDate, endDate } = req.body;
  const newRelationship = {
    id: generateId(),
    mentorId,
    menteeId,
    status: status || 'ACTIVE',
    startDate,
    endDate: endDate || null,
    mentor: db.employees.find((e) => e.id === mentorId),
    mentee: db.employees.find((e) => e.id === menteeId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.mentoringRelationships.push(newRelationship);
  saveDatabase();
  res.status(201).json(newRelationship);
});

app.patch('/mentoring/:id', (req, res) => {
  const relationship = db.mentoringRelationships.find((r) => r.id === req.params.id);
  if (relationship) {
    Object.assign(relationship, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    saveDatabase();
    res.json({
      ...relationship,
      mentor: db.employees.find((e) => e.id === relationship.mentorId),
      mentee: db.employees.find((e) => e.id === relationship.menteeId),
    });
  } else {
    res.status(404).json({ error: 'Mentoring relationship not found' });
  }
});

app.delete('/mentoring/:id', (req, res) => {
  const index = db.mentoringRelationships.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.mentoringRelationships.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Mentoring relationship not found' });
  }
});

app.get('/allocations/projects', (req, res) => {
  res.json(db.projectAllocations);
});

app.get('/allocations/projects/:id', (req, res) => {
  const allocation = db.projectAllocations.find((a) => a.id === req.params.id);
  if (allocation) {
    res.json(allocation);
  } else {
    res.status(404).json({ error: 'Project allocation not found' });
  }
});

app.get('/projects/:projectId/allocations', (req, res) => {
  const allocations = db.projectAllocations.filter((a) => a.projectId === req.params.projectId);
  res.json(allocations);
});

app.get('/employees/:employeeId/project-allocations', (req, res) => {
  const allocations = db.projectAllocations.filter((a) => a.employeeId === req.params.employeeId);
  res.json(allocations);
});

app.get('/allocations/tasks', (req, res) => {
  res.json([]);
});

app.get('/tasks/:taskId/allocations', (req, res) => {
  res.json([]);
});

app.get('/employees/:employeeId/task-allocations', (req, res) => {
  res.json([]);
});

app.post('/allocations/tasks', (req, res) => {
  const newAllocation = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  res.status(201).json(newAllocation);
});

app.patch('/allocations/tasks/:id', (req, res) => {
  const allocation = {
    id: req.params.id,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(allocation);
});

app.delete('/allocations/tasks/:id', (req, res) => {
  res.status(204).send();
});

app.post('/allocations/projects', (req, res) => {
  const newAllocation = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.projectAllocations.push(newAllocation);
  saveDatabase();
  res.status(201).json(newAllocation);
});

app.patch('/allocations/projects/:id', (req, res) => {
  const allocation = db.projectAllocations.find((a) => a.id === req.params.id);
  if (allocation) {
    Object.assign(allocation, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    saveDatabase();
    res.json(allocation);
  } else {
    res.status(404).json({ error: 'Project allocation not found' });
  }
});

app.delete('/allocations/projects/:id', (req, res) => {
  const index = db.projectAllocations.findIndex((a) => a.id === req.params.id);
  if (index !== -1) {
    db.projectAllocations.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Project allocation not found' });
  }
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      accessToken: 'mock-token-123',
      token: 'mock-token-123',
      user: {
        id: '1',
        email,
        name: 'Mock User',
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/notifications', (req, res) => {
  res.json(db.notifications);
});

app.get('/notifications/user/:userId/unread', (req, res) => {
  const unread = db.notifications.filter(
    (n) => n.userId === req.params.userId && !n.read
  );
  res.json(unread);
});

app.get('/notifications/:id', (req, res) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (notification) {
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.post('/notifications', (req, res) => {
  const newNotification = {
    id: generateId(),
    ...req.body,
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.notifications.push(newNotification);
  saveDatabase();
  res.status(201).json(newNotification);
});

app.patch('/notifications/:id', (req, res) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (notification) {
    Object.assign(notification, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.patch('/notifications/:id/read', (req, res) => {
  const notification = db.notifications.find((n) => n.id === req.params.id);
  if (notification) {
    notification.status = 'READ';
    notification.readAt = new Date().toISOString();
    notification.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.delete('/notifications/:id', (req, res) => {
  const index = db.notifications.findIndex((n) => n.id === req.params.id);
  if (index !== -1) {
    db.notifications.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.get('/leaves/balances/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const balances = db.leaveBalances.filter((b) => b.employeeId === employeeId);
  const balancesWithTypes = balances.map((balance) => {
    const leaveType = db.leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
    return {
      ...balance,
      leaveType: leaveType || { id: balance.leaveTypeId, name: 'Tipo Desconhecido' },
    };
  });
  res.json(balancesWithTypes);
});

app.get('/employee/me/attendance/summary', (req, res) => {
  res.json({
    totalDays: 20,
    presentDays: 18,
    absentDays: 2,
    lateDays: 1,
    totalWorkHours: 160,
    averageWorkHours: 8,
  });
});

app.get('/employee/me/attendance', (req, res) => {
  const myAttendance = db.attendance.filter((a) => a.employeeId === '1');
  res.json(myAttendance);
});

app.get('/employee/me/profile', (req, res) => {
  const profile = db.employees.find((e) => e.id === '1');
  if (profile) {
    res.json(profile);
  } else {
    res.status(404).json({ error: 'Profile not found' });
  }
});

app.patch('/employee/me/profile', (req, res) => {
  const profile = db.employees.find((e) => e.id === '1');
  if (profile) {
    Object.assign(profile, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(profile);
  } else {
    res.status(404).json({ error: 'Profile not found' });
  }
});

app.get('/employee/me/leaves', (req, res) => {
  const myLeaves = db.leaveRequests.filter((l) => l.employeeId === '1').map((leave) => {
    const leaveType = db.leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
    return {
      ...leave,
      leaveType: leaveType || { id: leave.leaveTypeId, name: 'Tipo não encontrado' },
    };
  });
  res.json(myLeaves);
});

app.get('/employee/me/leave-balances', (req, res) => {
  const balances = db.leaveBalances.filter((b) => b.employeeId === '1').map((balance) => {
    const leaveType = db.leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
    return {
      ...balance,
      leaveType: leaveType || { id: balance.leaveTypeId, name: 'Tipo não encontrado' },
    };
  });
  res.json(balances);
});

app.get('/employee/me/goals', (req, res) => {
  const goals = db.goals.filter((g) => g.employeeId === '1');
  res.json(goals);
});

app.get('/employee/me/trainings', (req, res) => {
  res.json(db.trainings);
});

app.get('/employee/me/performance-reviews', (req, res) => {
  const reviews = db.performanceReviews.filter((r) => r.employeeId === '1');
  res.json(reviews);
});

app.get('/employee/me/dashboard', (req, res) => {
  const employeeId = '1';
  const profile = db.employees.find((e) => e.id === employeeId);
  
  if (!profile) {
    return res.status(404).json({ error: 'Employee profile not found' });
  }

  res.json({
    profile,
    leaveBalances: db.leaveBalances.filter((b) => b.employeeId === employeeId).map((balance) => {
      const leaveType = db.leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
      return {
        ...balance,
        leaveType: leaveType || { id: balance.leaveTypeId, name: 'Tipo não encontrado' },
      };
    }) || [],
    recentAttendance: db.attendance.filter((a) => a.employeeId === employeeId).slice(0, 5) || [],
    goals: db.goals.filter((g) => g.employeeId === employeeId) || [],
    trainings: db.trainings || [],
    performanceReviews: db.performanceReviews.filter((r) => r.employeeId === employeeId) || [],
    achievements: db.achievements.filter((a) => a.employeeId === employeeId) || [],
  });
});

app.get('/trainings', (req, res) => {
  res.json(db.trainings);
});

app.get('/trainings/:id', (req, res) => {
  const training = db.trainings.find((t) => t.id === req.params.id);
  if (training) {
    res.json(training);
  } else {
    res.status(404).json({ error: 'Training not found' });
  }
});

app.post('/trainings', (req, res) => {
  const newTraining = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.trainings.push(newTraining);
  saveDatabase();
  res.status(201).json(newTraining);
});

app.patch('/trainings/:id', (req, res) => {
  const training = db.trainings.find((t) => t.id === req.params.id);
  if (training) {
    Object.assign(training, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(training);
  } else {
    res.status(404).json({ error: 'Training not found' });
  }
});

app.delete('/trainings/:id', (req, res) => {
  const index = db.trainings.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.trainings.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Training not found' });
  }
});

app.get('/goals', (req, res) => {
  res.json(db.goals);
});

app.get('/goals/:id', (req, res) => {
  const goal = db.goals.find((g) => g.id === req.params.id);
  if (goal) {
    res.json(goal);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.post('/goals', (req, res) => {
  const newGoal = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.goals.push(newGoal);
  saveDatabase();
  res.status(201).json(newGoal);
});

app.patch('/goals/:id', (req, res) => {
  const goal = db.goals.find((g) => g.id === req.params.id);
  if (goal) {
    Object.assign(goal, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(goal);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.delete('/goals/:id', (req, res) => {
  const index = db.goals.findIndex((g) => g.id === req.params.id);
  if (index !== -1) {
    db.goals.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.get('/skills', (req, res) => {
  res.json(db.skills);
});

app.get('/skills/:id', (req, res) => {
  const skill = db.skills.find((s) => s.id === req.params.id);
  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.post('/skills', (req, res) => {
  const newSkill = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.skills.push(newSkill);
  saveDatabase();
  res.status(201).json(newSkill);
});

app.patch('/skills/:id', (req, res) => {
  const skill = db.skills.find((s) => s.id === req.params.id);
  if (skill) {
    Object.assign(skill, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(skill);
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.delete('/skills/:id', (req, res) => {
  const index = db.skills.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.skills.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.get('/positions', (req, res) => {
  res.json(db.positions);
});

app.get('/positions/:id', (req, res) => {
  const position = db.positions.find((p) => p.id === req.params.id);
  if (position) {
    res.json(position);
  } else {
    res.status(404).json({ error: 'Position not found' });
  }
});

app.post('/positions', (req, res) => {
  const newPosition = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.positions.push(newPosition);
  saveDatabase();
  res.status(201).json(newPosition);
});

app.patch('/positions/:id', (req, res) => {
  const position = db.positions.find((p) => p.id === req.params.id);
  if (position) {
    Object.assign(position, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(position);
  } else {
    res.status(404).json({ error: 'Position not found' });
  }
});

app.delete('/positions/:id', (req, res) => {
  const index = db.positions.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    db.positions.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Position not found' });
  }
});

app.get('/leaves/types', (req, res) => {
  res.json(db.leaveTypes);
});

app.get('/leaves/types/:id', (req, res) => {
  const leaveType = db.leaveTypes.find((lt) => lt.id === req.params.id);
  if (leaveType) {
    res.json(leaveType);
  } else {
    res.status(404).json({ error: 'Leave type not found' });
  }
});

app.post('/leaves/types', (req, res) => {
  const newLeaveType = {
    id: generateId(),
    ...req.body,
  };
  db.leaveTypes.push(newLeaveType);
  saveDatabase();
  res.status(201).json(newLeaveType);
});

app.patch('/leaves/types/:id', (req, res) => {
  const leaveType = db.leaveTypes.find((lt) => lt.id === req.params.id);
  if (leaveType) {
    Object.assign(leaveType, req.body);
    saveDatabase();
    res.json(leaveType);
  } else {
    res.status(404).json({ error: 'Leave type not found' });
  }
});

app.delete('/leaves/types/:id', (req, res) => {
  const index = db.leaveTypes.findIndex((lt) => lt.id === req.params.id);
  if (index !== -1) {
    db.leaveTypes.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Leave type not found' });
  }
});

app.get('/leaves/requests', (req, res) => {
  res.json(db.leaveRequests);
});

app.get('/leaves/requests/:id', (req, res) => {
  const request = db.leaveRequests.find((r) => r.id === req.params.id);
  if (request) {
    res.json(request);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/leaves/requests', (req, res) => {
  const newRequest = {
    id: generateId(),
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.leaveRequests.push(newRequest);
  saveDatabase();
  res.status(201).json(newRequest);
});

app.patch('/leaves/requests/:id', (req, res) => {
  const request = db.leaveRequests.find((r) => r.id === req.params.id);
  if (request) {
    Object.assign(request, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(request);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/leaves/requests/:id/approve', (req, res) => {
  const request = db.leaveRequests.find((r) => r.id === req.params.id);
  if (request) {
    request.status = 'APPROVED';
    request.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json(request);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/leaves/requests/:id/reject', (req, res) => {
  const request = db.leaveRequests.find((r) => r.id === req.params.id);
  if (request) {
    request.status = 'REJECTED';
    request.rejectedReason = req.body.rejectedReason;
    request.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json(request);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/leaves/requests/:id/cancel', (req, res) => {
  const request = db.leaveRequests.find((r) => r.id === req.params.id);
  if (request) {
    request.status = 'CANCELLED';
    request.updatedAt = new Date().toISOString();
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/attendance/check-in', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const existing = db.attendance.find((a) => a.date === today && a.employeeId === '1');
  
  if (existing) {
    existing.checkIn = new Date().toTimeString().split(' ')[0];
    existing.status = 'PRESENT';
    existing.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json(existing);
  } else {
    const newAttendance = {
      id: generateId(),
      employeeId: '1',
      date: today,
      checkIn: new Date().toTimeString().split(' ')[0],
      status: 'PRESENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.attendance.push(newAttendance);
    saveDatabase();
    res.status(201).json(newAttendance);
  }
});

app.post('/attendance/check-out', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const existing = db.attendance.find((a) => a.date === today && a.employeeId === '1');
  
  if (existing) {
    existing.checkOut = new Date().toTimeString().split(' ')[0];
    if (existing.checkIn) {
      const checkInTime = new Date(`${today}T${existing.checkIn}`);
      const checkOutTime = new Date(`${today}T${existing.checkOut}`);
      existing.workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    }
    existing.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json(existing);
  } else {
    res.status(400).json({ error: 'No check-in found for today' });
  }
});

app.get('/attendance', (req, res) => {
  res.json(db.attendance);
});

app.get('/attendance/:id', (req, res) => {
  const attendance = db.attendance.find((a) => a.id === req.params.id);
  if (attendance) {
    res.json(attendance);
  } else {
    res.status(404).json({ error: 'Attendance not found' });
  }
});

app.post('/attendance', (req, res) => {
  const newAttendance = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.attendance.push(newAttendance);
  saveDatabase();
  res.status(201).json(newAttendance);
});

app.patch('/attendance/:id', (req, res) => {
  const attendance = db.attendance.find((a) => a.id === req.params.id);
  if (attendance) {
    Object.assign(attendance, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(attendance);
  } else {
    res.status(404).json({ error: 'Attendance not found' });
  }
});

app.delete('/attendance/:id', (req, res) => {
  const index = db.attendance.findIndex((a) => a.id === req.params.id);
  if (index !== -1) {
    db.attendance.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Attendance not found' });
  }
});

app.get('/attendance/summary/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const employeeAttendance = db.attendance.filter((a) => a.employeeId === employeeId);
  const totalDays = employeeAttendance.length;
  const present = employeeAttendance.filter((a) => a.status === 'PRESENT').length;
  const absent = employeeAttendance.filter((a) => a.status === 'ABSENT').length;
  const late = employeeAttendance.filter((a) => a.status === 'LATE').length;
  const onLeave = employeeAttendance.filter((a) => a.status === 'ON_LEAVE').length;
  const totalWorkHours = employeeAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0);
  const totalOvertimeHours = employeeAttendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
  
  res.json({
    totalDays,
    present,
    absent,
    late,
    onLeave,
    totalWorkHours,
    totalOvertimeHours,
    averageWorkHours: totalDays > 0 ? totalWorkHours / totalDays : 0,
  });
});

app.get('/attendance/work-schedules', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Horário Padrão',
      startTime: '09:00',
      endTime: '18:00',
      breakDuration: 60,
      workDays: [1, 2, 3, 4, 5],
      isDefault: true,
    },
  ]);
});

app.get('/attendance/work-schedules/:id', (req, res) => {
  const schedule = {
    id: req.params.id,
    name: 'Horário Padrão',
    startTime: '09:00',
    endTime: '18:00',
    breakDuration: 60,
    workDays: [1, 2, 3, 4, 5],
    isDefault: true,
  };
  res.json(schedule);
});

app.post('/attendance/work-schedules', (req, res) => {
  const newSchedule = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  res.status(201).json(newSchedule);
});

app.patch('/attendance/work-schedules/:id', (req, res) => {
  const schedule = {
    id: req.params.id,
    name: 'Horário Padrão',
    startTime: '09:00',
    endTime: '18:00',
    breakDuration: 60,
    workDays: [1, 2, 3, 4, 5],
    isDefault: true,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(schedule);
});

app.delete('/attendance/work-schedules/:id', (req, res) => {
  res.status(204).send();
});

app.get('/analytics/overview', (req, res) => {
  res.json({
    totalEmployees: db.employees.length,
    totalDepartments: db.departments.length,
    totalProjects: db.projects.length,
    activeProjects: db.projects.filter((p) => p.status === 'IN_PROGRESS').length,
    totalTrainings: db.trainings.length,
    averagePerformance: 4.2,
    recentHires: db.employees.filter((e) => {
      const hireDate = new Date(e.hireDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return hireDate >= sixMonthsAgo;
    }).length,
  });
});

app.get('/analytics/employee/:employeeId', (req, res) => {
  const employeeId = req.params.employeeId;
  const employee = db.employees.find((e) => e.id === employeeId);
  const goals = db.goals.filter((g) => g.employeeId === employeeId);
  const reviews = db.performanceReviews.filter((r) => r.employeeId === employeeId);
  
  res.json({
    employee: employee || null,
    goals: {
      total: goals.length,
      completed: goals.filter((g) => g.status === 'COMPLETED').length,
      inProgress: goals.filter((g) => g.status === 'IN_PROGRESS').length,
    },
    performance: {
      averageRating: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length
        : 0,
      totalReviews: reviews.length,
    },
  });
});

app.get('/analytics/performance-trend', (req, res) => {
  res.json([
    { month: '2024-01', averageRating: 4.0 },
    { month: '2024-02', averageRating: 4.2 },
    { month: '2024-03', averageRating: 4.5 },
  ]);
});

app.get('/analytics/predictive', (req, res) => {
  res.json({
    flightRisk: [
      {
        id: '1',
        name: 'João Silva',
        department: 'TI',
        position: 'Desenvolvedor Senior',
        riskScore: 75,
        reason: 'Baixa satisfação no trabalho, sem promoção há 2 anos',
        lastReviewDate: '2024-01-15',
        engagementScore: 3.2,
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        department: 'TI',
        position: 'Desenvolvedor Pleno',
        riskScore: 65,
        reason: 'Baixa participação em projetos recentes',
        lastReviewDate: '2024-02-01',
        engagementScore: 3.5,
      },
    ],
    highPerformers: [
      {
        id: '2',
        name: 'Maria Santos',
        department: 'TI',
        position: 'Gerente de Projetos',
        performanceScore: 9.2,
        strengths: ['Liderança', 'Comunicação', 'Gestão de equipe'],
        potential: 'Alto potencial para diretoria',
        lastPromotionDate: '2023-06-01',
      },
    ],
    turnoverPrediction: [
      {
        period: 'Próximos 3 meses',
        predictedRate: 12.5,
        description: 'Taxa de rotatividade prevista baseada em tendências históricas',
        factors: ['Baixa satisfação', 'Falta de crescimento', 'Mercado aquecido'],
      },
      {
        period: 'Próximos 6 meses',
        predictedRate: 18.3,
        description: 'Previsão de médio prazo considerando fatores sazonais',
        factors: ['Sazonalidade', 'Ciclo de avaliações', 'Mercado de trabalho'],
      },
    ],
    lastUpdated: new Date().toISOString(),
  });
});

app.get('/analytics/deib', (req, res) => {
  res.json({
    genderDistribution: [
      { gender: 'Masculino', count: 18, percentage: 60 },
      { gender: 'Feminino', count: 12, percentage: 40 },
    ],
    ethnicityDistribution: [
      { ethnicity: 'Branco', count: 20, percentage: 66.7 },
      { ethnicity: 'Pardo', count: 7, percentage: 23.3 },
      { ethnicity: 'Negro', count: 3, percentage: 10 },
    ],
    ageDistribution: [
      { ageGroup: '18-25', count: 5, percentage: 16.7 },
      { ageGroup: '26-35', count: 15, percentage: 50 },
      { ageGroup: '36-45', count: 8, percentage: 26.7 },
      { ageGroup: '46+', count: 2, percentage: 6.6 },
    ],
    payEquity: [
      { category: 'Gênero', gap: 8.5, averageSalary: 8500, benchmark: 9200 },
      { category: 'Etnia', gap: 12.3, averageSalary: 8200, benchmark: 9350 },
      { category: 'Idade', gap: 5.2, averageSalary: 8800, benchmark: 9300 },
    ],
    genderDiversityIndex: 72.5,
    payEquityIndex: 87.5,
    inclusionScore: 7.8,
    diverseLeadership: 35.0,
    recommendations: [
      {
        title: 'Aumentar diversidade de gênero em posições de liderança',
        description: 'Atualmente apenas 35% das posições de liderança são ocupadas por grupos diversos',
        priority: 'HIGH',
        expectedImpact: 'Aumento de 15% na satisfação e retenção',
        category: 'DIVERSITY',
      },
      {
        title: 'Reduzir gap salarial por gênero',
        description: 'Gap de 8.5% identificado entre gêneros para posições similares',
        priority: 'HIGH',
        expectedImpact: 'Melhoria na equidade e compliance',
        category: 'EQUITY',
      },
      {
        title: 'Programa de mentoria para grupos sub-representados',
        description: 'Criar programa estruturado de mentoria para desenvolvimento de carreira',
        priority: 'MEDIUM',
        expectedImpact: 'Aumento de 20% em promoções internas',
        category: 'INCLUSION',
      },
    ],
  });
});

app.get('/analytics/workforce-monitoring', (req, res) => {
  res.json({
    totalHeadcount: 30,
    headcountChange: 3,
    totalCost: 240000,
    averageProductivity: 7.8,
    averageUtilization: 82.5,
    headcountTrend: [
      { month: '2024-01', count: 27, change: 2 },
      { month: '2024-02', count: 28, change: 1 },
      { month: '2024-03', count: 30, change: 2 },
    ],
    costTrend: [
      { month: '2024-01', totalCost: 216000, averageCost: 8000, change: 5000 },
      { month: '2024-02', totalCost: 224000, averageCost: 8000, change: 0 },
      { month: '2024-03', totalCost: 240000, averageCost: 8000, change: 0 },
    ],
    productivityMetrics: [
      { department: 'TI', productivityScore: 8.5, revenue: 500000, efficiency: 85 },
      { department: 'RH', productivityScore: 7.2, revenue: 200000, efficiency: 78 },
      { department: 'Vendas', productivityScore: 8.8, revenue: 1200000, efficiency: 92 },
    ],
    capacityAnalysis: [
      { department: 'TI', utilization: 85, capacity: 100, demand: 90 },
      { department: 'RH', utilization: 75, capacity: 100, demand: 80 },
      { department: 'Vendas', utilization: 90, capacity: 100, demand: 95 },
    ],
    organizationalStructure: {
      totalDepartments: 3,
      totalTeams: 8,
      avgTeamSize: 3.75,
      reportingLevels: 4,
    },
    efficiencyMetrics: {
      revenuePerEmployee: 63333,
      costPerHire: 5000,
      timeToProductivity: 45,
      employeeRetentionRate: 87.5,
    },
  });
});

app.get('/performance', (req, res) => {
  res.json(db.performanceReviews);
});

app.get('/performance/:id', (req, res) => {
  const review = db.performanceReviews.find((r) => r.id === req.params.id);
  if (review) {
    res.json(review);
  } else {
    res.status(404).json({ error: 'Performance review not found' });
  }
});

app.post('/performance', (req, res) => {
  const newReview = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.performanceReviews.push(newReview);
  saveDatabase();
  res.status(201).json(newReview);
});

app.patch('/performance/:id', (req, res) => {
  const review = db.performanceReviews.find((r) => r.id === req.params.id);
  if (review) {
    Object.assign(review, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(review);
  } else {
    res.status(404).json({ error: 'Performance review not found' });
  }
});

app.delete('/performance/:id', (req, res) => {
  const index = db.performanceReviews.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.performanceReviews.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Performance review not found' });
  }
});

app.get('/feedback', (req, res) => {
  res.json(db.feedback);
});

app.get('/feedback/:id', (req, res) => {
  const feedback = db.feedback.find((f) => f.id === req.params.id);
  if (feedback) {
    res.json(feedback);
  } else {
    res.status(404).json({ error: 'Feedback not found' });
  }
});

app.post('/feedback', (req, res) => {
  const newFeedback = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.feedback.push(newFeedback);
  saveDatabase();
  res.status(201).json(newFeedback);
});

app.patch('/feedback/:id', (req, res) => {
  const feedback = db.feedback.find((f) => f.id === req.params.id);
  if (feedback) {
    Object.assign(feedback, { ...req.body, updatedAt: new Date().toISOString() });
    saveDatabase();
    res.json(feedback);
  } else {
    res.status(404).json({ error: 'Feedback not found' });
  }
});

app.delete('/feedback/:id', (req, res) => {
  const index = db.feedback.findIndex((f) => f.id === req.params.id);
  if (index !== -1) {
    db.feedback.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Feedback not found' });
  }
});

app.get('/knowledge-base', (req, res) => {
  res.json([]);
});

app.get('/knowledge-base/:id', (req, res) => {
  res.status(404).json({ error: 'Knowledge article not found' });
});

app.post('/knowledge-base', (req, res) => {
  const newArticle = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  res.status(201).json(newArticle);
});

app.patch('/knowledge-base/:id', (req, res) => {
  res.status(404).json({ error: 'Knowledge article not found' });
});

app.delete('/knowledge-base/:id', (req, res) => {
  res.status(204).send();
});

app.get('/insights', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Alta rotatividade no departamento de TI',
      description: 'Taxa de rotatividade aumentou 15% no último trimestre',
      type: 'WARNING',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Performance acima da média',
      description: 'Equipe de vendas apresentou excelente desempenho',
      type: 'SUCCESS',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
    },
  ]);
});

app.get('/insights/:id', (req, res) => {
  const insight = {
    id: req.params.id,
    title: 'Insight Específico',
    description: 'Descrição detalhada do insight',
    type: 'INFO',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  };
  res.json(insight);
});

app.get('/performance-insights/employee/:employeeId', (req, res) => {
  res.json({
    employeeId: req.params.employeeId,
    insights: [
      {
        id: '1',
        title: 'Performance acima da média',
        description: 'Funcionário apresenta performance consistente',
        type: 'SUCCESS',
        priority: 'MEDIUM',
      },
    ],
    trends: {
      performance: [4.0, 4.2, 4.5, 4.3],
      engagement: [3.5, 3.7, 3.8, 3.9],
    },
  });
});

app.get('/performance-insights/team/:teamId', (req, res) => {
  res.json({
    teamId: req.params.teamId,
    insights: [
      {
        id: '1',
        title: 'Equipe de alta performance',
        description: 'Equipe apresenta resultados consistentes',
        type: 'SUCCESS',
        priority: 'HIGH',
      },
    ],
    metrics: {
      averagePerformance: 4.3,
      teamSize: 5,
      satisfaction: 4.5,
    },
  });
});

app.get('/performance-insights/department/:departmentId', (req, res) => {
  res.json({
    departmentId: req.params.departmentId,
    insights: [
      {
        id: '1',
        title: 'Departamento em crescimento',
        description: 'Departamento apresenta crescimento consistente',
        type: 'SUCCESS',
        priority: 'MEDIUM',
      },
    ],
    metrics: {
      totalEmployees: 10,
      averagePerformance: 4.2,
      retentionRate: 85,
    },
  });
});

app.post('/chatbot/interact', (req, res) => {
  res.json({
    id: generateId(),
    message: req.body.message || '',
    response: 'Esta é uma resposta mockada do chatbot. O mock server está funcionando!',
    context: req.query.context,
    createdAt: new Date().toISOString(),
  });
});

app.post('/chatbot/analyze-performance', (req, res) => {
  res.json({
    employeeId: req.query.employeeId,
    analysis: 'Análise de performance mockada',
    score: 4.5,
    recommendations: ['Melhorar comunicação', 'Desenvolver liderança'],
  });
});

app.get('/career/overview/:employeeId', (req, res) => {
  const employee = db.employees.find((e) => e.id === req.params.employeeId);
  res.json({
    currentPosition: employee?.position || 'Desenvolvedor',
    level: 'SENIOR',
    yearsInCompany: 3,
    nextPositions: ['Tech Lead', 'Arquiteto de Software'],
  });
});

app.get('/career/progression/:employeeId', (req, res) => {
  res.json([
    {
      position: 'Desenvolvedor Júnior',
      date: '2021-01-15',
    },
    {
      position: 'Desenvolvedor Pleno',
      date: '2022-06-01',
    },
    {
      position: 'Desenvolvedor Sênior',
      date: '2023-12-01',
    },
  ]);
});

app.post('/skill-proficiency', (req, res) => {
  const newProficiency = {
    employeeId: req.body.employeeId,
    skillId: req.body.skillId,
    proficiency: req.body.proficiency,
    lastEvaluated: new Date().toISOString(),
  };
  res.status(201).json(newProficiency);
});

app.get('/skill-proficiency/employee/:employeeId', (req, res) => {
  res.json([]);
});

app.get('/policies', (req, res) => {
  res.json(db.policies);
});

app.get('/policies/:id', (req, res) => {
  const policy = db.policies.find((p) => p.id === req.params.id);
  if (policy) {
    res.json(policy);
  } else {
    res.status(404).json({ error: 'Policy not found' });
  }
});

app.post('/policies', (req, res) => {
  const newPolicy = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.policies.push(newPolicy);
  saveDatabase();
  res.status(201).json(newPolicy);
});

app.patch('/policies/:id', (req, res) => {
  const index = db.policies.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    db.policies[index] = { ...db.policies[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.policies[index]);
  } else {
    res.status(404).json({ error: 'Policy not found' });
  }
});

app.delete('/policies/:id', (req, res) => {
  const index = db.policies.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    db.policies.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Policy not found' });
  }
});

app.post('/policies/:id/acknowledge', (req, res) => {
  const acknowledgment = {
    id: generateId(),
    policyId: req.params.id,
    employeeId: 'current-user-id',
    acknowledgedAt: new Date().toISOString(),
  };
  db.policyAcknowledgments.push(acknowledgment);
  saveDatabase();
  res.status(201).json(acknowledgment);
});

app.get('/policies/:id/acknowledgments', (req, res) => {
  const acknowledgments = db.policyAcknowledgments.filter((a) => a.policyId === req.params.id);
  res.json(acknowledgments);
});

app.get('/policies/my/acknowledgments', (req, res) => {
  const acknowledgments = db.policyAcknowledgments.filter((a) => a.employeeId === 'current-user-id');
  res.json(acknowledgments);
});

app.get('/separations', (req, res) => {
  res.json(db.separations);
});

app.get('/separations/:id', (req, res) => {
  const separation = db.separations.find((s) => s.id === req.params.id);
  if (separation) {
    res.json(separation);
  } else {
    res.status(404).json({ error: 'Separation not found' });
  }
});

app.post('/separations', (req, res) => {
  const newSeparation = {
    id: generateId(),
    ...req.body,
    status: 'INITIATED',
    exitInterviewCompleted: false,
    checklist: [],
    initiatedBy: 'current-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.separations.push(newSeparation);
  saveDatabase();
  res.status(201).json(newSeparation);
});

app.patch('/separations/:id', (req, res) => {
  const index = db.separations.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.separations[index] = { ...db.separations[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.separations[index]);
  } else {
    res.status(404).json({ error: 'Separation not found' });
  }
});

app.post('/separations/:id/approve', (req, res) => {
  const index = db.separations.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.separations[index] = {
      ...db.separations[index],
      status: 'APPROVED',
      approvedBy: 'current-user-id',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.separations[index]);
  } else {
    res.status(404).json({ error: 'Separation not found' });
  }
});

app.get('/expenses', (req, res) => {
  res.json(db.expenses);
});

app.get('/expenses/my', (req, res) => {
  const expenses = db.expenses.filter((e) => e.employeeId === 'current-user-id');
  res.json(expenses);
});

app.get('/expenses/:id', (req, res) => {
  const expense = db.expenses.find((e) => e.id === req.params.id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.post('/expenses', (req, res) => {
  const newExpense = {
    id: generateId(),
    ...req.body,
    employeeId: 'current-user-id',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.expenses.push(newExpense);
  saveDatabase();
  res.status(201).json(newExpense);
});

app.patch('/expenses/:id', (req, res) => {
  const index = db.expenses.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.expenses[index] = { ...db.expenses[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.delete('/expenses/:id', (req, res) => {
  const index = db.expenses.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.expenses.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.post('/expenses/:id/approve', (req, res) => {
  const index = db.expenses.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.expenses[index] = {
      ...db.expenses[index],
      status: 'APPROVED',
      approvedBy: 'current-user-id',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.post('/expenses/:id/reject', (req, res) => {
  const index = db.expenses.findIndex((e) => e.id === req.params.id);
  if (index !== -1) {
    db.expenses[index] = {
      ...db.expenses[index],
      status: 'REJECTED',
      rejectedReason: req.body.reason,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.get('/expenses/reports', (req, res) => {
  res.json(db.expenseReports);
});

app.post('/expenses/reports', (req, res) => {
  const newReport = {
    id: generateId(),
    ...req.body,
    employeeId: 'current-user-id',
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.expenseReports.push(newReport);
  saveDatabase();
  res.status(201).json(newReport);
});

app.get('/payroll', (req, res) => {
  res.json(db.payrolls);
});

app.get('/payroll/my/payslips', (req, res) => {
  const payslips = db.payrolls.filter((p) => p.employeeId === 'current-user-id');
  res.json(payslips);
});

app.get('/payroll/:id', (req, res) => {
  const payroll = db.payrolls.find((p) => p.id === req.params.id);
  if (payroll) {
    res.json(payroll);
  } else {
    res.status(404).json({ error: 'Payroll not found' });
  }
});

app.post('/payroll', (req, res) => {
  const newPayroll = {
    id: generateId(),
    ...req.body,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.payrolls.push(newPayroll);
  saveDatabase();
  res.status(201).json(newPayroll);
});

app.post('/payroll/process', (req, res) => {
  const processed = db.employees.map((emp) => ({
    id: generateId(),
    employeeId: emp.id,
    period: req.body.period,
    baseSalary: emp.salary || 5000,
    items: [],
    grossSalary: emp.salary || 5000,
    totalDeductions: 0,
    netSalary: emp.salary || 5000,
    status: 'CALCULATED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  db.payrolls.push(...processed);
  saveDatabase();
  res.json(processed);
});

app.get('/facilities/rooms', (req, res) => {
  res.json(db.conferenceRooms);
});

app.get('/facilities/rooms/:id', (req, res) => {
  const room = db.conferenceRooms.find((r) => r.id === req.params.id);
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.post('/facilities/rooms', (req, res) => {
  const newRoom = {
    id: generateId(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.conferenceRooms.push(newRoom);
  saveDatabase();
  res.status(201).json(newRoom);
});

app.patch('/facilities/rooms/:id', (req, res) => {
  const index = db.conferenceRooms.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.conferenceRooms[index] = { ...db.conferenceRooms[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.conferenceRooms[index]);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.delete('/facilities/rooms/:id', (req, res) => {
  const index = db.conferenceRooms.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.conferenceRooms.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.get('/facilities/bookings', (req, res) => {
  res.json(db.roomBookings);
});

app.get('/facilities/my/bookings', (req, res) => {
  const bookings = db.roomBookings.filter((b) => b.employeeId === 'current-user-id');
  res.json(bookings);
});

app.get('/facilities/bookings/:id', (req, res) => {
  const booking = db.roomBookings.find((b) => b.id === req.params.id);
  if (booking) {
    res.json(booking);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.post('/facilities/bookings', (req, res) => {
  const room = db.conferenceRooms.find((r) => r.id === req.body.roomId);
  const newBooking = {
    id: generateId(),
    ...req.body,
    employeeId: 'current-user-id',
    status: 'PENDING',
    room,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.roomBookings.push(newBooking);
  saveDatabase();
  res.status(201).json(newBooking);
});

app.patch('/facilities/bookings/:id', (req, res) => {
  const index = db.roomBookings.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    db.roomBookings[index] = { ...db.roomBookings[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.roomBookings[index]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.delete('/facilities/bookings/:id', (req, res) => {
  const index = db.roomBookings.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    db.roomBookings.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.post('/facilities/bookings/:id/approve', (req, res) => {
  const index = db.roomBookings.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    db.roomBookings[index] = {
      ...db.roomBookings[index],
      status: 'APPROVED',
      approvedBy: 'current-user-id',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.roomBookings[index]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

app.get('/travel', (req, res) => {
  res.json(db.travelRequests);
});

app.get('/travel/my', (req, res) => {
  const travels = db.travelRequests.filter((t) => t.employeeId === 'current-user-id');
  res.json(travels);
});

app.get('/travel/:id', (req, res) => {
  const travel = db.travelRequests.find((t) => t.id === req.params.id);
  if (travel) {
    res.json(travel);
  } else {
    res.status(404).json({ error: 'Travel request not found' });
  }
});

app.post('/travel', (req, res) => {
  const newTravel = {
    id: generateId(),
    ...req.body,
    employeeId: 'current-user-id',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.travelRequests.push(newTravel);
  saveDatabase();
  res.status(201).json(newTravel);
});

app.patch('/travel/:id', (req, res) => {
  const index = db.travelRequests.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.travelRequests[index] = { ...db.travelRequests[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.travelRequests[index]);
  } else {
    res.status(404).json({ error: 'Travel request not found' });
  }
});

app.delete('/travel/:id', (req, res) => {
  const index = db.travelRequests.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.travelRequests.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Travel request not found' });
  }
});

app.post('/travel/:id/approve', (req, res) => {
  const index = db.travelRequests.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.travelRequests[index] = {
      ...db.travelRequests[index],
      status: 'APPROVED',
      approvedBy: 'current-user-id',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.travelRequests[index]);
  } else {
    res.status(404).json({ error: 'Travel request not found' });
  }
});

app.get('/surveys', (req, res) => {
  res.json(db.surveys);
});

app.get('/surveys/available', (req, res) => {
  const now = new Date().toISOString();
  const available = db.surveys.filter(
    (s) => s.status === 'ACTIVE' && s.startDate <= now && s.endDate >= now
  );
  res.json(available);
});

app.get('/surveys/:id', (req, res) => {
  const survey = db.surveys.find((s) => s.id === req.params.id);
  if (survey) {
    res.json(survey);
  } else {
    res.status(404).json({ error: 'Survey not found' });
  }
});

app.post('/surveys', (req, res) => {
  const newSurvey = {
    id: generateId(),
    ...req.body,
    status: 'DRAFT',
    createdBy: 'current-user-id',
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.surveys.push(newSurvey);
  saveDatabase();
  res.status(201).json(newSurvey);
});

app.patch('/surveys/:id', (req, res) => {
  const index = db.surveys.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.surveys[index] = { ...db.surveys[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.surveys[index]);
  } else {
    res.status(404).json({ error: 'Survey not found' });
  }
});

app.delete('/surveys/:id', (req, res) => {
  const index = db.surveys.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.surveys.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Survey not found' });
  }
});

app.post('/surveys/:id/responses', (req, res) => {
  const newResponse = {
    id: generateId(),
    surveyId: req.params.id,
    ...req.body,
    submittedAt: new Date().toISOString(),
  };
  db.surveyResponses.push(newResponse);
  saveDatabase();
  res.status(201).json(newResponse);
});

app.get('/surveys/my/responses', (req, res) => {
  const responses = db.surveyResponses.filter((r) => r.employeeId === 'current-user-id');
  res.json(responses);
});

app.get('/surveys/:id/results', (req, res) => {
  const responses = db.surveyResponses.filter((r) => r.surveyId === req.params.id);
  res.json({ totalResponses: responses.length, responses });
});

app.get('/contract-labor/contractors', (req, res) => {
  res.json(db.contractors);
});

app.get('/contract-labor/contractors/:id', (req, res) => {
  const contractor = db.contractors.find((c) => c.id === req.params.id);
  if (contractor) {
    res.json(contractor);
  } else {
    res.status(404).json({ error: 'Contractor not found' });
  }
});

app.post('/contract-labor/contractors', (req, res) => {
  const newContractor = {
    id: generateId(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.contractors.push(newContractor);
  saveDatabase();
  res.status(201).json(newContractor);
});

app.patch('/contract-labor/contractors/:id', (req, res) => {
  const index = db.contractors.findIndex((c) => c.id === req.params.id);
  if (index !== -1) {
    db.contractors[index] = { ...db.contractors[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.contractors[index]);
  } else {
    res.status(404).json({ error: 'Contractor not found' });
  }
});

app.delete('/contract-labor/contractors/:id', (req, res) => {
  const index = db.contractors.findIndex((c) => c.id === req.params.id);
  if (index !== -1) {
    db.contractors.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Contractor not found' });
  }
});

app.get('/contract-labor', (req, res) => {
  res.json(db.contractLabor);
});

app.get('/contract-labor/:id', (req, res) => {
  const labor = db.contractLabor.find((l) => l.id === req.params.id);
  if (labor) {
    res.json(labor);
  } else {
    res.status(404).json({ error: 'Contract labor not found' });
  }
});

app.post('/contract-labor', (req, res) => {
  const contractor = db.contractors.find((c) => c.id === req.body.contractorId);
  const newLabor = {
    id: generateId(),
    ...req.body,
    status: 'ACTIVE',
    contractor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.contractLabor.push(newLabor);
  saveDatabase();
  res.status(201).json(newLabor);
});

app.patch('/contract-labor/:id', (req, res) => {
  const index = db.contractLabor.findIndex((l) => l.id === req.params.id);
  if (index !== -1) {
    db.contractLabor[index] = { ...db.contractLabor[index], ...req.body, updatedAt: new Date().toISOString() };
    saveDatabase();
    res.json(db.contractLabor[index]);
  } else {
    res.status(404).json({ error: 'Contract labor not found' });
  }
});

app.delete('/contract-labor/:id', (req, res) => {
  const index = db.contractLabor.findIndex((l) => l.id === req.params.id);
  if (index !== -1) {
    db.contractLabor.splice(index, 1);
    saveDatabase();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Contract labor not found' });
  }
});

app.get('/contract-labor/:id/attendance', (req, res) => {
  const attendance = db.contractLaborAttendance.filter((a) => a.laborId === req.params.id);
  res.json(attendance);
});

app.post('/contract-labor/:id/attendance', (req, res) => {
  const newAttendance = {
    id: generateId(),
    laborId: req.params.id,
    ...req.body,
  };
  db.contractLaborAttendance.push(newAttendance);
  saveDatabase();
  res.status(201).json(newAttendance);
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.path}` });
});

loadDatabase();

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL;

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${DB_PATH}`);
  });
}

const handler = (req: express.Request, res: express.Response) => {
  return app(req, res);
};

export default handler;
