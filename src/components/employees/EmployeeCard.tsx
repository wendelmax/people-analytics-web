import React from 'react';
import { Employee } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatters';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.email}</p>
          {employee.phone && <p className="text-sm text-gray-600">{employee.phone}</p>}
          {employee.department && (
            <p className="text-sm text-gray-500 mt-1">
              {employee.department.name}
              {employee.position && ` • ${employee.position.title}`}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Contratado em: {formatDate(employee.hireDate)}
          </p>
        </div>
      </div>
    </Card>
  );
};

