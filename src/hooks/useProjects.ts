import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const data = await projectService.getAll();
    setProjects(data);
    setLoading(false);
  };

  const createProject = async (data: CreateProjectDto) => {
    const newProject = await projectService.create(data);
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, data: UpdateProjectDto) => {
    const updated = await projectService.update(id, data);
    setProjects(projects.map((proj) => (proj.id === id ? updated : proj)));
    return updated;
  };

  const deleteProject = async (id: string) => {
    await projectService.delete(id);
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};


