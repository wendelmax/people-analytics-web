import React from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { EmployeeCard } from './EmployeeCard';
import { SkeletonCard } from '../common/Skeleton';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const EmployeeList: React.FC = () => {
  const { employees, loading, error } = useEmployees();
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

  if (employees.length === 0) {
    return (
      <EmptyState
        title="Nenhum funcionário encontrado"
        message="Comece adicionando seu primeiro funcionário"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onClick={() => navigate(`/employees/${employee.id}`)}
        />
      ))}
    </div>
  );
};

