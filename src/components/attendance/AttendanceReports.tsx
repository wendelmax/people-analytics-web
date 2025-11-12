import React from 'react';
import { Card } from '../common/Card';
import { Attendance, AttendanceStatus } from '../../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AttendanceReportsProps {
  attendanceRecords: Attendance[];
}

export const AttendanceReports: React.FC<AttendanceReportsProps> = ({
  attendanceRecords,
}) => {
  const calculateWeeklyStats = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: ptBR });
    const weekEnd = endOfWeek(now, { locale: ptBR });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date + 'T00:00:00');
      return recordDate >= weekStart && recordDate <= weekEnd;
    });

    const totalHours = weeklyRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const avgHours = weeklyRecords.length > 0 ? totalHours / weeklyRecords.length : 0;
    const present = weeklyRecords.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;

    return {
      weekDays: weekDays.length,
      present,
      totalHours,
      avgHours,
      attendance: (present / 5) * 100,
    };
  };

  const calculateMonthlyComparison = () => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthRecords = attendanceRecords.filter(
      (record) => new Date(record.date + 'T00:00:00').getMonth() === currentMonth
    );

    const lastMonthRecords = attendanceRecords.filter(
      (record) => new Date(record.date + 'T00:00:00').getMonth() === lastMonth
    );

    const currentMonthHours = currentMonthRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const lastMonthHours = lastMonthRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);

    const currentMonthPresent = currentMonthRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE
    ).length;

    const lastMonthPresent = lastMonthRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE
    ).length;

    return {
      currentMonth: {
        hours: currentMonthHours,
        present: currentMonthPresent,
        records: currentMonthRecords.length,
      },
      lastMonth: {
        hours: lastMonthHours,
        present: lastMonthPresent,
        records: lastMonthRecords.length,
      },
      hoursChange: lastMonthHours > 0 ? ((currentMonthHours - lastMonthHours) / lastMonthHours) * 100 : 0,
      attendanceChange: lastMonthPresent > 0 ? ((currentMonthPresent - lastMonthPresent) / lastMonthPresent) * 100 : 0,
    };
  };

  const weeklyStats = calculateWeeklyStats();
  const monthlyComparison = calculateMonthlyComparison();

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Relatório Semanal
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Dias Úteis</p>
              <p className="text-2xl font-bold text-blue-700">{weeklyStats.weekDays}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Presenças</p>
              <p className="text-2xl font-bold text-green-700">{weeklyStats.present}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Total de Horas</p>
              <p className="text-2xl font-bold text-purple-700">
                {weeklyStats.totalHours.toFixed(1)}h
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Média Diária</p>
              <p className="text-2xl font-bold text-orange-700">
                {weeklyStats.avgHours.toFixed(1)}h
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Presença Semanal</span>
              <span className="text-sm font-semibold text-gray-900">
                {weeklyStats.attendance.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${weeklyStats.attendance}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparação Mensal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Mês Atual</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Horas Trabalhadas</span>
                  <span className="font-bold text-blue-700">
                    {monthlyComparison.currentMonth.hours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Dias Presentes</span>
                  <span className="font-bold text-green-700">
                    {monthlyComparison.currentMonth.present}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Mês Anterior</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Horas Trabalhadas</span>
                  <span className="font-bold text-gray-700">
                    {monthlyComparison.lastMonth.hours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Dias Presentes</span>
                  <span className="font-bold text-gray-700">
                    {monthlyComparison.lastMonth.present}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${monthlyComparison.hoursChange >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-700 mb-1">Variação em Horas</p>
              <p className={`text-2xl font-bold ${monthlyComparison.hoursChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {monthlyComparison.hoursChange >= 0 ? '+' : ''}
                {monthlyComparison.hoursChange.toFixed(1)}%
              </p>
            </div>

            <div className={`p-4 rounded-lg ${monthlyComparison.attendanceChange >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-700 mb-1">Variação em Presença</p>
              <p className={`text-2xl font-bold ${monthlyComparison.attendanceChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {monthlyComparison.attendanceChange >= 0 ? '+' : ''}
                {monthlyComparison.attendanceChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

