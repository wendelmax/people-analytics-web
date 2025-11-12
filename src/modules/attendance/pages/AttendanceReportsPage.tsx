import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { AttendanceReports } from '../../../components/attendance/AttendanceReports';
import { AttendanceExport } from '../../../components/attendance/AttendanceExport';
import { useMyAttendance } from '../../../hooks/useAttendance';
import { PageHeader } from '../../../components/common/PageHeader';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';

export const AttendanceReportsPage: React.FC = () => {
  const { attendance, loading } = useMyAttendance();
  const { user } = useAuth();
  const [selectedMonth] = useState(new Date());

  const monthAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date + 'T00:00:00');
    return recordDate >= startOfMonth(selectedMonth) && recordDate <= endOfMonth(selectedMonth);
  });

  return (
    <ModuleLayout moduleId="attendance">
      <div className="space-y-6">
        <PageHeader
          title="Relatórios e Análises"
          subtitle="Análises comparativas e exportação de dados"
        />

        <AttendanceReports attendanceRecords={attendance} />
        
        <AttendanceExport 
          attendanceRecords={monthAttendance}
          employeeName={user?.name}
        />
      </div>
    </ModuleLayout>
  );
};

