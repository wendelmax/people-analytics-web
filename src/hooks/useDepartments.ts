import { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    const data = await departmentService.getAll();
    setDepartments(data);
    setLoading(false);
  };

  const createDepartment = async (data: CreateDepartmentDto) => {
    const newDepartment = await departmentService.create(data);
    setDepartments([...departments, newDepartment]);
    return newDepartment;
  };

  const updateDepartment = async (id: string, data: UpdateDepartmentDto) => {
    const updated = await departmentService.update(id, data);
    setDepartments(departments.map((dept) => (dept.id === id ? updated : dept)));
    return updated;
  };

  const deleteDepartment = async (id: string) => {
    await departmentService.delete(id);
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};


