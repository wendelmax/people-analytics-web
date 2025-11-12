import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    const data = await employeeService.getAll();
    setEmployees(data);
    setLoading(false);
  };

  const createEmployee = async (data: CreateEmployeeDto) => {
    const newEmployee = await employeeService.create(data);
    setEmployees([...employees, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = async (id: string, data: UpdateEmployeeDto) => {
    const updated = await employeeService.update(id, data);
    setEmployees(employees.map((emp) => (emp.id === id ? updated : emp)));
    return updated;
  };

  const deleteEmployee = async (id: string) => {
    await employeeService.delete(id);
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};


