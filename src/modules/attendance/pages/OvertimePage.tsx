import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { OvertimeTracker } from '../../../components/attendance/OvertimeTracker';
import { useMyAttendance } from '../../../hooks/useAttendance';
import { PageHeader } from '../../../components/common/PageHeader';

export const OvertimePage: React.FC = () => {
  const { attendance, loading } = useMyAttendance();
  const [selectedMonth] = useState(new Date());

  return (
    <ModuleLayout moduleId="attendance">
      <div className="space-y-6">
        <PageHeader
          title="Controle de Horas Extras"
          subtitle="Acompanhamento e valoração de horas extras trabalhadas"
        />

        <OvertimeTracker
          attendanceRecords={attendance}
          month={selectedMonth}
        />
      </div>
    </ModuleLayout>
  );
};

