import React, { useState, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Modal } from '../common/Modal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Attendance, AttendanceStatus } from '../../types';
import { Badge } from '../common/Badge';

interface MonthlyAttendanceMirrorProps {
  attendanceRecords: Attendance[];
  month: Date;
  employeeName?: string;
  loading?: boolean;
}

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

export const MonthlyAttendanceMirror: React.FC<MonthlyAttendanceMirrorProps> = ({
  attendanceRecords,
  month,
  employeeName = 'Funcionário',
  loading = false,
}) => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDay = (day: Date) => {
    return attendanceRecords.find((record) => 
      isSameDay(new Date(record.date + 'T00:00:00'), day)
    );
  };

  const calculateTotals = () => {
    const totalDays = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;
    const totalAbsent = attendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const totalLate = attendanceRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const totalHours = attendanceRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const totalOvertimeHours = attendanceRecords.reduce((sum, r) => {
      const overtime = (r.workHours || 0) > 8 ? (r.workHours || 0) - 8 : 0;
      return sum + overtime;
    }, 0);

    return { totalDays, totalPresent, totalAbsent, totalLate, totalHours, totalOvertimeHours };
  };

  const totals = calculateTotals();

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL();
    setSignature(signatureData);
    setIsSigned(true);
    setIsSignatureModalOpen(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6 print:p-8">
          <div className="flex justify-between items-start mb-6 print:mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Espelho de Ponto
              </h2>
              <p className="text-gray-600 mt-1">
                {format(month, 'MMMM yyyy', { locale: ptBR })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Funcionário: <span className="font-semibold">{employeeName}</span>
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button
                onClick={handleExportPDF}
                variant="outline"
              >
                Exportar PDF
              </Button>
              <Button
                onClick={() => setIsSignatureModalOpen(true)}
                variant={isSigned ? 'outline' : 'primary'}
              >
                {isSigned ? 'Assinado' : 'Assinar'}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Dia</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Data</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Entrada</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Saída</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Horas</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody>
                {daysInMonth.map((day) => {
                  const attendance = getAttendanceForDay(day);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  
                  return (
                    <tr key={day.toISOString()} className={isWeekend ? 'bg-gray-50' : ''}>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {format(day, 'EEEEEE', { locale: ptBR })}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {format(day, 'dd/MM/yyyy')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {attendance?.checkIn ? attendance.checkIn.substring(0, 5) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {attendance?.checkOut ? attendance.checkOut.substring(0, 5) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {attendance?.workHours ? `${attendance.workHours.toFixed(2)}h` : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {attendance ? (
                          <Badge variant={getStatusVariant(attendance.status)} size="sm">
                            {getStatusLabel(attendance.status)}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {attendance?.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={4} className="border border-gray-300 px-4 py-2 text-sm">
                    TOTAIS
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {totals.totalHours.toFixed(2)}h
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {totals.totalPresent} dias
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {totals.totalLate} atrasos
                  </td>
                </tr>
                {totals.totalOvertimeHours > 0 && (
                  <tr className="bg-blue-50 font-semibold">
                    <td colSpan={4} className="border border-gray-300 px-4 py-2 text-sm">
                      Horas Extras
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-blue-700">
                      {totals.totalOvertimeHours.toFixed(2)}h
                    </td>
                    <td colSpan={2} className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {signature && (
            <div className="mt-6 flex justify-end items-center gap-4">
              <div className="text-center">
                <div className="mb-2">
                  <img src={signature} alt="Assinatura" className="h-20 border-b-2 border-gray-800" />
                </div>
                <p className="text-sm text-gray-600">Assinatura do Funcionário</p>
                <p className="text-xs text-gray-500">
                  Assinado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        title="Assinar Espelho de Ponto"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Por favor, assine no campo abaixo para confirmar a veracidade das informações do espelho de ponto.
          </p>
          
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full cursor-crosshair bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={clearSignature}>
              Limpar
            </Button>
            <Button variant="outline" onClick={() => setIsSignatureModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSignature}>
              Confirmar Assinatura
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

