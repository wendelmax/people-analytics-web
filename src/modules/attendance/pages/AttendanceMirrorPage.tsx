import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { MonthlyAttendanceMirror } from '../../../components/attendance/MonthlyAttendanceMirror';
import { useMyAttendance } from '../../../hooks/useAttendance';
import { PageHeader } from '../../../components/common/PageHeader';
import { Button } from '../../../components/common/Button';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';

export const AttendanceMirrorPage: React.FC = () => {
  const { attendance, loading } = useMyAttendance();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date + 'T00:00:00');
    return recordDate >= startOfMonth(selectedMonth) && recordDate <= endOfMonth(selectedMonth);
  });

  return (
    <ModuleLayout moduleId="attendance">
      <div className="space-y-6">
        <PageHeader
          title="Espelho de Ponto"
          subtitle="Relatório oficial mensal com assinatura digital"
        />

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
          >
            ← Mês Anterior
          </Button>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {format(selectedMonth, 'MMMM yyyy')}
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedMonth(new Date())}
          >
            Mês Atual
          </Button>
        </div>
        
        <MonthlyAttendanceMirror
          attendanceRecords={monthAttendance}
          month={selectedMonth}
          employeeName={user?.name || 'Funcionário'}
          loading={loading}
        />
      </div>
    </ModuleLayout>
  );
};

