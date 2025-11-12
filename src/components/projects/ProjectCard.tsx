import React from 'react';
import { Project } from '../../types';
import { Card } from '../common/Card';
import { formatDate, formatCurrency, formatProjectStatus } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>Início: {formatDate(project.startDate)}</span>
            {project.endDate && <span>Término: {formatDate(project.endDate)}</span>}
            {project.budget && <span>Orçamento: {formatCurrency(project.budget)}</span>}
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            project.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : project.status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {formatProjectStatus(project.status)}
        </span>
      </div>
    </Card>
  );
};

