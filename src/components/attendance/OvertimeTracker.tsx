import React from 'react';
import { Card } from '../common/Card';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Attendance } from '../../types';

interface OvertimeTrackerProps {
  attendanceRecords: Attendance[];
  month?: Date;
}

export const OvertimeTracker: React.FC<OvertimeTrackerProps> = ({
  attendanceRecords,
  month = new Date(),
}) => {
  const calculateOvertimeDetails = () => {
    const overtimeRecords = attendanceRecords
      .filter(record => (record.workHours || 0) > 8)
      .map(record => ({
        ...record,
        overtimeHours: (record.workHours || 0) - 8,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalOvertimeHours = overtimeRecords.reduce(
      (sum, record) => sum + record.overtimeHours,
      0
    );

    const totalOvertimeDays = overtimeRecords.length;

    const averageOvertime = totalOvertimeDays > 0 
      ? totalOvertimeHours / totalOvertimeDays 
      : 0;

    return {
      overtimeRecords,
      totalOvertimeHours,
      totalOvertimeDays,
      averageOvertime,
    };
  };

  const overtimeData = calculateOvertimeDetails();
  const overtimeValue = overtimeData.totalOvertimeHours * 25;

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Controle de Horas Extras
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total de Horas</p>
            <p className="text-2xl font-bold text-blue-700">
              {overtimeData.totalOvertimeHours.toFixed(2)}h
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Dias com Extras</p>
            <p className="text-2xl font-bold text-green-700">
              {overtimeData.totalOvertimeDays}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Média por Dia</p>
            <p className="text-2xl font-bold text-purple-700">
              {overtimeData.averageOvertime.toFixed(2)}h
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Valor Estimado</p>
            <p className="text-2xl font-bold text-orange-700">
              R$ {overtimeValue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Base: R$ 25/hora</p>
          </div>
        </div>

        {overtimeData.overtimeRecords.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Histórico de Horas Extras
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overtimeData.overtimeRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(record.date + 'T00:00:00'), 'dd/MM/yyyy - EEEE', { locale: ptBR })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {record.checkIn?.substring(0, 5)} - {record.checkOut?.substring(0, 5)}
                      {' '}({record.workHours?.toFixed(2)}h trabalhadas)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-700">
                      +{record.overtimeHours.toFixed(2)}h
                    </p>
                    <p className="text-xs text-gray-500">
                      R$ {(record.overtimeHours * 25).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma hora extra registrada no período</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> O valor estimado é calculado com base em uma taxa de R$ 25,00 por hora extra. 
            O valor real pode variar de acordo com o contrato e legislação trabalhista aplicável.
          </p>
        </div>
      </div>
    </Card>
  );
};

