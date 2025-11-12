import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { SkeletonCard } from '../common/Skeleton';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const ProjectList: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        message="Comece criando seu primeiro projeto"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => navigate(`/projects/${project.id}`)}
        />
      ))}
    </div>
  );
};

