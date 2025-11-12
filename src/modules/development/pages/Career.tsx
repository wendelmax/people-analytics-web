import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { useCareer } from '../../../hooks/useCareer';
import { useEmployees } from '../../../hooks/useEmployees';
import { Select } from '../../../components/common/Select';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { Card } from '../../../components/common/Card';

export const Career: React.FC = () => {
  const { getOverview, getProgression, loading, error } = useCareer();
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [progression, setProgression] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (selectedEmployee) {
      loadCareerData();
    }
  }, [selectedEmployee]);

  const loadCareerData = async () => {
    try {
      const [overviewData, progressionData] = await Promise.all([
        getOverview(selectedEmployee),
        getProgression(selectedEmployee),
      ]);
      setOverview(overviewData);
      setProgression(progressionData);
    } catch (err) {
      // Failed to load career data - continue with empty data
    }
  };

  const employeeOptions = [
    { value: '', label: 'Selecione um funcionário' },
    ...employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    })),
  ];

  if (loading) {
    return (
      <ModuleLayout moduleId="development">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="development">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="development">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carreira</h1>
          <p className="text-gray-600">Visualize e gerencie planos de carreira</p>
        </div>

        <Card>
          <div className="p-6">
            <Select
              label="Selecione um Funcionário"
              options={employeeOptions}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            />
          </div>
        </Card>

        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Visão Geral</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Posição Atual:</span>{' '}
                  {overview.currentPosition || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Nível:</span> {overview.level || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Anos na Empresa:</span>{' '}
                  {overview.yearsInCompany || 0}
                </p>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Progressão</h3>
              {progression && progression.length > 0 ? (
                <div className="space-y-2">
                  {progression.map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                      <p className="font-medium">{item.position}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma progressão registrada</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

