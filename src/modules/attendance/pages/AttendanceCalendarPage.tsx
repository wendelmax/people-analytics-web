import React from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { AttendanceCalendar } from '../../../components/attendance/AttendanceCalendar';
import { JustificationModal } from '../../../components/attendance/JustificationModal';
import { useMyAttendance } from '../../../hooks/useAttendance';
import { attendanceService } from '../../../services/attendanceService';
import { PageHeader } from '../../../components/common/PageHeader';
import { format } from 'date-fns';
import { Attendance, AttendanceStatus } from '../../../types';
import { useToast } from '../../../hooks/useToast';

export const AttendanceCalendarPage: React.FC = () => {
  const { attendance, loading, error, refetch } = useMyAttendance();
  const { showToast } = useToast();
  const [selectedAttendance, setSelectedAttendance] = React.useState<Attendance | null>(null);
  const [isJustificationModalOpen, setIsJustificationModalOpen] = React.useState(false);

  const handleDateClick = (date: Date) => {
    const record = attendance.find((r) => 
      format(new Date(r.date + 'T00:00:00'), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    if (record && (record.status === AttendanceStatus.ABSENT || record.status === AttendanceStatus.LATE)) {
      setSelectedAttendance(record);
      setIsJustificationModalOpen(true);
    }
  };

  const handleJustificationSubmit = async (attendanceId: string, justification: string, attachment?: File) => {
    try {
      await attendanceService.addJustification(attendanceId, justification, attachment);
      showToast('Justificativa enviada com sucesso!', 'success');
      refetch();
    } catch (err) {
      showToast('Erro ao enviar justificativa', 'error');
      throw err;
    }
  };

  return (
    <ModuleLayout moduleId="attendance">
      <div className="space-y-6">
        <PageHeader
          title="Calendário de Presença"
          subtitle="Visualização mensal dos registros de ponto"
        />

        <AttendanceCalendar
          attendanceRecords={attendance}
          onDateClick={handleDateClick}
        />

        <JustificationModal
          isOpen={isJustificationModalOpen}
          onClose={() => {
            setIsJustificationModalOpen(false);
            setSelectedAttendance(null);
          }}
          attendance={selectedAttendance}
          onSubmit={handleJustificationSubmit}
        />
      </div>
    </ModuleLayout>
  );
};

