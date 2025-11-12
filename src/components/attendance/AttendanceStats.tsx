import React from 'react';
import { Card } from '../common/Card';
import { Attendance, AttendanceStatus } from '../../types';

interface AttendanceStatsProps {
  attendanceRecords: Attendance[];
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  attendanceRecords,
}) => {
  const calculateStats = () => {
    const totalRecords = attendanceRecords.length;
    const present = attendanceRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE
    ).length;
    const absent = attendanceRecords.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const late = attendanceRecords.filter((r) => r.status === AttendanceStatus.LATE).length;
    const onLeave = attendanceRecords.filter((r) => r.status === AttendanceStatus.ON_LEAVE).length;
    const halfDay = attendanceRecords.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;

    const totalWorkHours = attendanceRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const avgWorkHours = totalRecords > 0 ? totalWorkHours / totalRecords : 0;

    const totalLateMinutes = attendanceRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);
    const avgLateMinutes = late > 0 ? totalLateMinutes / late : 0;

    const presentPercentage = totalRecords > 0 ? (present / totalRecords) * 100 : 0;
    const punctualityRate = totalRecords > 0 ? ((present - late) / totalRecords) * 100 : 0;

    return {
      totalRecords,
      present,
      absent,
      late,
      onLeave,
      halfDay,
      totalWorkHours,
      avgWorkHours,
      totalLateMinutes,
      avgLateMinutes,
      presentPercentage,
      punctualityRate,
    };
  };

  const stats = calculateStats();

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Estatísticas de Presença
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Total de Dias</p>
            <p className="text-3xl font-bold text-blue-700">{stats.totalRecords}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Presenças</p>
            <p className="text-3xl font-bold text-green-700">{stats.present}</p>
            <p className="text-xs text-green-600 mt-1">
              {stats.presentPercentage.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Ausências</p>
            <p className="text-3xl font-bold text-red-700">{stats.absent}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-600 mb-1">Atrasos</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.late}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Total de Horas</p>
            <p className="text-3xl font-bold text-purple-700">
              {stats.totalWorkHours.toFixed(0)}h
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Média Diária</p>
            <p className="text-3xl font-bold text-indigo-700">
              {stats.avgWorkHours.toFixed(1)}h
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
            <p className="text-sm text-pink-600 mb-1">Licenças</p>
            <p className="text-3xl font-bold text-pink-700">{stats.onLeave}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p className="text-sm text-orange-600 mb-1">Taxa de Pontualidade</p>
            <p className="text-3xl font-bold text-orange-700">
              {stats.punctualityRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {stats.late > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Tempo Total em Atraso
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats.totalLateMinutes} minutos
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-700">Média por Atraso</p>
                <p className="text-xl font-bold text-yellow-900">
                  {stats.avgLateMinutes.toFixed(0)} min
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Taxa de Presença</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats.presentPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.presentPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Taxa de Pontualidade</span>
            <span className="text-sm font-semibold text-gray-900">
              {stats.punctualityRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.punctualityRate}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

