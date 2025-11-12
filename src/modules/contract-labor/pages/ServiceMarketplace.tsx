import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { ServiceRequestStatus, ServiceRequestPriority } from '../../../types';
import { useServiceRequests } from '../../../hooks/useServiceMarketplace';

export const ServiceMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const { requests, loading, error } = useServiceRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getStatusColor = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.OPEN:
        return 'bg-green-100 text-green-800';
      case ServiceRequestStatus.IN_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case ServiceRequestStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case ServiceRequestStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: ServiceRequestPriority) => {
    switch (priority) {
      case ServiceRequestPriority.URGENT:
        return 'bg-red-500 text-white';
      case ServiceRequestPriority.HIGH:
        return 'bg-orange-500 text-white';
      case ServiceRequestPriority.MEDIUM:
        return 'bg-yellow-500 text-white';
      case ServiceRequestPriority.LOW:
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: ServiceRequestStatus) => {
    const labels = {
      [ServiceRequestStatus.DRAFT]: 'Rascunho',
      [ServiceRequestStatus.OPEN]: 'Aberto',
      [ServiceRequestStatus.IN_REVIEW]: 'Em Análise',
      [ServiceRequestStatus.CLOSED]: 'Fechado',
      [ServiceRequestStatus.CANCELLED]: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: ServiceRequestPriority) => {
    const labels = {
      [ServiceRequestPriority.LOW]: 'Baixa',
      [ServiceRequestPriority.MEDIUM]: 'Média',
      [ServiceRequestPriority.HIGH]: 'Alta',
      [ServiceRequestPriority.URGENT]: 'Urgente',
    };
    return labels[priority] || priority;
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || request.category.toLowerCase().includes(categoryFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openCount = requests.filter(r => r.status === ServiceRequestStatus.OPEN).length;
  const inReviewCount = requests.filter(r => r.status === ServiceRequestStatus.IN_REVIEW).length;
  const totalProposals = requests.reduce((sum, r) => sum + (r.proposalsCount || 0), 0);

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <PageHeader
          title="Mural de Oportunidades"
          subtitle="Publique suas necessidades e receba propostas de prestadores qualificados"
          actions={[
            {
              label: 'Publicar Nova Demanda',
              onClick: () => navigate('/contract-labor/marketplace/new'),
              variant: 'primary',
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{openCount}</div>
              <div className="text-sm text-gray-600 mt-1">Oportunidades Abertas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{inReviewCount}</div>
              <div className="text-sm text-gray-600 mt-1">Em Análise</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalProposals}</div>
              <div className="text-sm text-gray-600 mt-1">Propostas Recebidas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{requests.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total de Demandas</div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4 flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Buscar por título, descrição ou habilidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas Categorias</option>
              <option value="desenvolvimento">Desenvolvimento</option>
              <option value="design">Design</option>
              <option value="infraestrutura">Infraestrutura</option>
              <option value="marketing">Marketing</option>
              <option value="engenharia">Engenharia</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value={ServiceRequestStatus.OPEN}>Aberto</option>
              <option value={ServiceRequestStatus.IN_REVIEW}>Em Análise</option>
              <option value={ServiceRequestStatus.CLOSED}>Fechado</option>
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma oportunidade publicada ainda</h3>
                <p className="text-gray-500 mb-6">Seja o primeiro a publicar uma demanda e receber propostas!</p>
                <Button onClick={() => navigate('/contract-labor/marketplace/new')}>
                  Publicar Primeira Demanda
                </Button>
              </div>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/contract-labor/marketplace/${request.id}`)}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {getPriorityLabel(request.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>📂</span>
                          {request.category}
                        </span>
                        {request.remote ? (
                          <span className="flex items-center gap-1">
                            <span>🌐</span>
                            Remoto
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            {request.location || 'Presencial'}
                          </span>
                        )}
                        {request.budget && (
                          <span className="flex items-center gap-1 font-semibold text-green-600">
                            <span>💰</span>
                            R$ {request.budget.min.toLocaleString()} - R$ {request.budget.max.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                      {request.proposalsCount && request.proposalsCount > 0 && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 font-semibold rounded-full">
                          {request.proposalsCount} proposta{request.proposalsCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {request.skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {request.skills.length > 5 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                        +{request.skills.length - 5} mais
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-xs text-gray-500">
                      Publicado por {request.createdByName} em {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/contract-labor/marketplace/${request.id}`); }}>
                      Ver Detalhes e Enviar Proposta
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

