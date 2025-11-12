import React, { useState } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { AttendanceButton } from '../../../components/attendance/AttendanceButton';
import { AttendanceSummaryCard } from '../../../components/attendance/AttendanceSummary';
import { JustificationModal } from '../../../components/attendance/JustificationModal';
import { AttendanceStats } from '../../../components/attendance/AttendanceStats';
import { useMyAttendance } from '../../../hooks/useAttendance';
import { attendanceService } from '../../../services/attendanceService';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { PageHeader } from '../../../components/common/PageHeader';
import { format } from 'date-fns';
import { Badge } from '../../../components/common/Badge';
import { Attendance, AttendanceStatus } from '../../../types';
import { useToast } from '../../../hooks/useToast';

const getStatusVariant = (status: AttendanceStatus): 'success' | 'error' | 'warning' | 'info' | 'secondary' => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'success';
    case AttendanceStatus.ABSENT:
      return 'error';
    case AttendanceStatus.LATE:
      return 'warning';
    case AttendanceStatus.HALF_DAY:
      return 'info';
    case AttendanceStatus.ON_LEAVE:
      return 'info';
    case AttendanceStatus.HOLIDAY:
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'Presente';
    case AttendanceStatus.ABSENT:
      return 'Ausente';
    case AttendanceStatus.LATE:
      return 'Atrasado';
    case AttendanceStatus.HALF_DAY:
      return 'Meio Período';
    case AttendanceStatus.ON_LEAVE:
      return 'Em Licença';
    case AttendanceStatus.HOLIDAY:
      return 'Feriado';
    default:
      return status;
  }
};

export const AttendanceDashboard: React.FC = () => {
  const { attendance, loading, error, refetch } = useMyAttendance();
  const { showToast } = useToast();
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);

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
          title="Meu Registro de Ponto"
          subtitle={`${attendance.length} registros recentes`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceButton />
          <AttendanceSummaryCard />
        </div>

        <AttendanceStats attendanceRecords={attendance} />

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Recente</h3>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="text-red-500 text-center py-8">
                Erro ao carregar registros: {error.message}
              </p>
            ) : attendance.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum registro de presença encontrado
              </p>
            ) : (
              <div className="space-y-3">
                {attendance.slice(0, 10).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {record.date ? format(new Date(record.date + 'T00:00:00'), 'dd/MM/yyyy') : 'Data inválida'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {record.checkIn && (
                            <p className="text-sm text-gray-600">
                              Entrada: {record.checkIn.substring(0, 5)}
                            </p>
                          )}
                          {record.checkOut && (
                            <p className="text-sm text-gray-600">
                              Saída: {record.checkOut.substring(0, 5)}
                            </p>
                          )}
                          {record.workHours && (
                            <p className="text-sm text-gray-600">
                              • {record.workHours.toFixed(2)}h
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                      {(record.status === AttendanceStatus.ABSENT || record.status === AttendanceStatus.LATE) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAttendance(record);
                            setIsJustificationModalOpen(true);
                          }}
                        >
                          Justificar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

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

