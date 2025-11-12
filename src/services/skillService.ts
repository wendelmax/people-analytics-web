import apiClient from '../api/client';
import { Skill, CreateSkillDto, UpdateSkillDto, EmployeeSkill, CreateSkillProficiencyDto } from '../types';

export const skillService = {
  getAll: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills');
    return response.data;
  },

  getById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get(`/skills/${id}`);
    return response.data;
  },

  create: async (data: CreateSkillDto): Promise<Skill> => {
    const response = await apiClient.post('/skills', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSkillDto): Promise<Skill> => {
    const response = await apiClient.patch(`/skills/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/skills/${id}`);
  },

  updateProficiency: async (data: CreateSkillProficiencyDto): Promise<EmployeeSkill> => {
    const response = await apiClient.post('/skill-proficiency', data);
    return response.data;
  },

  getEmployeeProficiencies: async (employeeId: string): Promise<EmployeeSkill[]> => {
    const response = await apiClient.get(`/skill-proficiency/employee/${employeeId}`);
    return response.data;
  },
};

