import React, { useState } from 'react';
import { useAttendanceSummary } from '../../hooks/useAttendance';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { format, subDays } from 'date-fns';

export const AttendanceSummaryCard: React.FC = () => {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { summary, loading, refetch } = useAttendanceSummary(startDate, endDate);

  const handleUpdate = () => {
    refetch();
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Período</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleUpdate} variant="outline" className="mb-4 w-full">
          Atualizar
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total de Dias</p>
            <p className="text-2xl font-bold text-blue-600">{summary.totalDays}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Presentes</p>
            <p className="text-2xl font-bold text-green-600">{summary.present}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Ausentes</p>
            <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Atrasos</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Horas Trabalhadas</p>
            <p className="text-2xl font-bold text-purple-600">
              {(summary.totalWorkHours || 0).toFixed(1)}h
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Média Diária</p>
            <p className="text-2xl font-bold text-indigo-600">
              {(summary.averageWorkHours || 0).toFixed(1)}h
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

