import { Review180360Data, ReviewFinalReport, ReviewSubmission } from '../types/review180360';
import { PerformanceCycle } from '../types/performanceCycle';

const mockReviews: Review180360Data[] = [
  {
    id: 'review-2024-1',
    cycleId: '1',
    employeeId: 'emp-1',
    employeeName: 'João Silva',
    employeePosition: 'Analista Pleno',
    isSenior: false,
    reviewType: '180',
    status: 'COMPLETED',
    selfReview: {
      id: 'self-2024',
      cycleId: '1',
      revieweeId: 'emp-1',
      revieweeName: 'João Silva',
      reviewerId: 'emp-1',
      reviewerName: 'João Silva',
      reviewerType: 'SELF',
      answers: [
        {
          questionId: 'q1',
          answer: 'Acredito que meus principais pontos fortes são a capacidade de análise de dados e comunicação clara com a equipe. Tenho facilidade em identificar padrões e propor soluções práticas.',
        },
        {
          questionId: 'q2',
          answer: 'Preciso desenvolver mais habilidades de liderança e gestão de projetos complexos. Também quero melhorar minha capacidade de apresentação para stakeholders de alto nível.',
        },
        {
          questionId: 'q3',
          answer: 'Sempre busco colaborar ativamente com a equipe, compartilhando conhecimento e apoiando colegas quando necessário. Acredito que o trabalho em equipe é fundamental para o sucesso.',
        },
        {
          questionId: 'q4',
          answer: 'Desenvolvi um dashboard de analytics que reduziu o tempo de análise de relatórios em 40%. Também implementei um processo de revisão de código que melhorou a qualidade das entregas.',
        },
      ],
      overallRating: 4.2,
      submittedAt: '2024-07-15T10:00:00Z',
      status: 'SUBMITTED',
    },
    managerReview: {
      id: 'manager-2024',
      cycleId: '1',
      revieweeId: 'emp-1',
      revieweeName: 'João Silva',
      reviewerId: 'mgr-1',
      reviewerName: 'Maria Santos',
      reviewerType: 'MANAGER',
      answers: [
        {
          questionId: 'q1',
          answer: 'João demonstra excelente capacidade analítica e proatividade. É muito comprometido com as entregas e tem boa comunicação com a equipe.',
        },
        {
          questionId: 'q2',
          answer: 'Áreas para desenvolvimento: liderança de projetos maiores e maior autonomia na tomada de decisões estratégicas. Também pode melhorar a gestão de tempo em projetos simultâneos.',
        },
        {
          questionId: 'q3',
          answer: 'João colabora muito bem com a equipe, sempre disposto a ajudar e compartilhar conhecimento. É um ótimo membro do time.',
        },
        {
          questionId: 'q4',
          answer: 'João foi responsável pelo desenvolvimento do novo sistema de analytics que trouxe ganhos significativos. Também liderou a implementação de melhorias no processo de desenvolvimento.',
        },
      ],
      overallRating: 4.5,
      strengths: 'Análise de dados, comprometimento, colaboração',
      areasForImprovement: 'Liderança estratégica, gestão de múltiplos projetos',
      submittedAt: '2024-07-20T14:30:00Z',
      status: 'SUBMITTED',
    },
    peerReviews: [],
    finalReport: {
      id: 'report-2024-1',
      reviewId: 'review-2024-1',
      overallRating: 4.35,
      aiSummary: 'João Silva demonstrou um desempenho sólido no ciclo de 2024, com destaque para suas habilidades analíticas e capacidade de colaboração. Sua autoavaliação foi consistente com a avaliação do gestor, mostrando autoconhecimento. Os principais pontos fortes identificados foram: capacidade analítica, comprometimento com entregas e colaboração efetiva com a equipe. As áreas de desenvolvimento incluem liderança estratégica e gestão de múltiplos projetos simultâneos. O gestor destacou contribuições significativas, especialmente no desenvolvimento de sistemas de analytics e melhorias de processos.',
      strengths: [
        'Excelente capacidade analítica e proatividade',
        'Alto comprometimento com entregas e qualidade',
        'Boa comunicação e colaboração com a equipe',
        'Capacidade de identificar padrões e propor soluções práticas',
      ],
      areasForImprovement: [
        'Desenvolvimento de habilidades de liderança estratégica',
        'Melhoria na gestão de múltiplos projetos simultâneos',
        'Maior autonomia na tomada de decisões estratégicas',
        'Desenvolvimento de habilidades de apresentação para stakeholders de alto nível',
      ],
      recommendations: [
        'Participar de treinamentos em liderança e gestão de projetos',
        'Assumir projetos de maior complexidade para desenvolver autonomia',
        'Buscar mentoria com líderes seniores da organização',
        'Praticar apresentações para diferentes níveis hierárquicos',
      ],
      managerFeedback: 'João, você teve um excelente desempenho em 2024. Suas contribuições foram fundamentais para o sucesso da equipe. Continue desenvolvendo suas habilidades de liderança e esteja preparado para assumir projetos ainda mais desafiadores em 2025. Estou confiante no seu potencial de crescimento.',
      generatedAt: '2024-07-25T09:00:00Z',
    },
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
  },
  {
    id: 'review-2025-1',
    cycleId: '2',
    employeeId: 'emp-1',
    employeeName: 'João Silva',
    employeePosition: 'Analista Sênior',
    isSenior: true,
    reviewType: '360',
    status: 'IN_PROGRESS',
    selfReview: {
      id: 'self-2025',
      cycleId: '2',
      revieweeId: 'emp-1',
      revieweeName: 'João Silva',
      reviewerId: 'emp-1',
      reviewerName: 'João Silva',
      reviewerType: 'SELF',
      answers: [
        {
          questionId: 'q1',
          answer: 'Em 2025, desenvolvi significativamente minhas habilidades de liderança, assumindo projetos maiores e mentorando novos membros da equipe. Minha capacidade analítica continua sendo um diferencial.',
        },
        {
          questionId: 'q2',
          answer: 'Ainda preciso melhorar na gestão de stakeholders de alto nível e na capacidade de influenciar decisões estratégicas. Também quero desenvolver mais habilidades de negociação.',
        },
        {
          questionId: 'q3',
          answer: 'Tenho trabalhado ativamente para melhorar a colaboração entre equipes, facilitando reuniões e criando espaços para compartilhamento de conhecimento.',
        },
        {
          questionId: 'q4',
          answer: 'Liderei a implementação do novo sistema de gestão de projetos que aumentou a eficiência da equipe em 35%. Também mentorei 3 novos analistas que se integraram com sucesso à equipe.',
        },
      ],
      overallRating: 4.5,
      submittedAt: '2025-07-10T10:00:00Z',
      status: 'SUBMITTED',
    },
    managerReview: undefined,
    peerReviews: [],
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-10T10:00:00Z',
  },
];

const mockPeerReviewAssignments = [
  {
    id: 'assignment-1',
    cycleId: '2',
    reviewerId: 'emp-1',
    reviewerName: 'João Silva',
    revieweeId: 'peer-1',
    revieweeName: 'Pedro Costa',
    revieweePosition: 'Analista Sênior',
    reviewerType: 'PEER_MANAGER_SELECTED' as const,
    status: 'PENDING' as const,
    assignedBy: 'Maria Santos',
    assignedAt: '2025-07-05T00:00:00Z',
  },
  {
    id: 'assignment-2',
    cycleId: '2',
    reviewerId: 'emp-1',
    reviewerName: 'João Silva',
    revieweeId: 'peer-2',
    revieweeName: 'Ana Oliveira',
    revieweePosition: 'Especialista',
    reviewerType: 'PEER_MANAGER_SELECTED' as const,
    status: 'PENDING' as const,
    assignedBy: 'Maria Santos',
    assignedAt: '2025-07-05T00:00:00Z',
  },
  {
    id: 'assignment-3',
    cycleId: '2',
    reviewerId: 'emp-1',
    reviewerName: 'João Silva',
    revieweeId: 'peer-3',
    revieweeName: 'Carlos Mendes',
    revieweePosition: 'Analista Pleno',
    reviewerType: 'PEER_MANAGER_SELECTED' as const,
    status: 'PENDING' as const,
    assignedBy: 'Maria Santos',
    assignedAt: '2025-07-05T00:00:00Z',
  },
];

export const review180360Service = {
  getReviewByCycleId: async (cycleId: string, employeeId: string): Promise<Review180360Data | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const review = mockReviews.find(
          r => r.cycleId === cycleId && r.employeeId === employeeId
        );
        resolve(review || null);
      }, 500);
    });
  },

  getAllReviewsByEmployee: async (employeeId: string): Promise<Review180360Data[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = mockReviews.filter(r => r.employeeId === employeeId);
        resolve(reviews);
      }, 500);
    });
  },

  getPeerReviewAssignments: async (cycleId: string, reviewerId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assignments = mockPeerReviewAssignments.filter(
          a => a.cycleId === cycleId && a.reviewerId === reviewerId
        );
        resolve(assignments);
      }, 500);
    });
  },

  submitPeerReview: async (
    cycleId: string,
    reviewerId: string,
    revieweeId: string,
    answers: Array<{ questionId: string; answer: string }>
  ): Promise<ReviewSubmission> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assignment = mockPeerReviewAssignments.find(
          a => a.cycleId === cycleId && a.reviewerId === reviewerId && a.revieweeId === revieweeId
        );
        
        const submission: ReviewSubmission = {
          id: `submission-${Date.now()}`,
          cycleId,
          revieweeId,
          revieweeName: assignment?.revieweeName || '',
          reviewerId,
          reviewerName: 'João Silva',
          reviewerType: assignment?.reviewerType || 'PEER_MANAGER_SELECTED',
          answers,
          submittedAt: new Date().toISOString(),
          status: 'SUBMITTED',
        };

        const review = mockReviews.find(r => r.cycleId === cycleId && r.employeeId === reviewerId);
        if (review) {
          review.peerReviews.push(submission);
        }

        resolve(submission);
      }, 500);
    });
  },
};

