import apiClient from '../api/client';
import {
  ProjectAllocation,
  TaskAllocation,
  CreateProjectAllocationDto,
  UpdateProjectAllocationDto,
  CreateTaskAllocationDto,
  UpdateTaskAllocationDto,
} from '../types/allocation';

export const allocationService = {
  // Project Allocations
  getProjectAllocations: async (projectId?: string): Promise<ProjectAllocation[]> => {
    if (projectId) {
      return apiClient.get(`/projects/${projectId}/allocations`);
    }
    return apiClient.get('/allocations/projects');
  },

  getEmployeeProjectAllocations: async (employeeId: string): Promise<ProjectAllocation[]> => {
    return apiClient.get(`/employees/${employeeId}/project-allocations`);
  },

  createProjectAllocation: async (
    data: CreateProjectAllocationDto
  ): Promise<ProjectAllocation> => {
    return apiClient.post('/allocations/projects', data);
  },

  updateProjectAllocation: async (
    id: string,
    data: UpdateProjectAllocationDto
  ): Promise<ProjectAllocation> => {
    return apiClient.patch(`/allocations/projects/${id}`, data);
  },

  deleteProjectAllocation: async (id: string): Promise<void> => {
    return apiClient.delete(`/allocations/projects/${id}`);
  },

  // Task Allocations
  getTaskAllocations: async (taskId?: string): Promise<TaskAllocation[]> => {
    if (taskId) {
      return apiClient.get(`/tasks/${taskId}/allocations`);
    }
    return apiClient.get('/allocations/tasks');
  },

  getEmployeeTaskAllocations: async (employeeId: string): Promise<TaskAllocation[]> => {
    return apiClient.get(`/employees/${employeeId}/task-allocations`);
  },

  createTaskAllocation: async (data: CreateTaskAllocationDto): Promise<TaskAllocation> => {
    return apiClient.post('/allocations/tasks', data);
  },

  updateTaskAllocation: async (
    id: string,
    data: UpdateTaskAllocationDto
  ): Promise<TaskAllocation> => {
    return apiClient.patch(`/allocations/tasks/${id}`, data);
  },

  deleteTaskAllocation: async (id: string): Promise<void> => {
    return apiClient.delete(`/allocations/tasks/${id}`);
  },
};

