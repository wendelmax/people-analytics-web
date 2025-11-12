import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Attendance, AttendanceStatus } from '../../types';
import { Badge } from '../common/Badge';

interface AttendanceCalendarProps {
  attendanceRecords: Attendance[];
  onDateClick?: (date: Date) => void;
}

const getStatusColor = (status: AttendanceStatus): string => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'bg-green-100 border-green-300 text-green-800';
    case AttendanceStatus.ABSENT:
      return 'bg-red-100 border-red-300 text-red-800';
    case AttendanceStatus.LATE:
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case AttendanceStatus.HALF_DAY:
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case AttendanceStatus.ON_LEAVE:
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case AttendanceStatus.HOLIDAY:
      return 'bg-gray-100 border-gray-300 text-gray-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-600';
  }
};

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceRecords,
  onDateClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAttendanceForDay = (day: Date) => {
    return attendanceRecords.find((record) => 
      isSameDay(new Date(record.date + 'T00:00:00'), day)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Calendário de Presença
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              →
            </Button>
          </div>
        </div>

        <div className="text-center mb-4">
          <h4 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h4>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            const attendance = getAttendanceForDay(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, new Date());
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={index}
                onClick={() => onDateClick && onDateClick(day)}
                className={`
                  min-h-20 p-2 border rounded-lg cursor-pointer transition-all
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-50'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${attendance ? getStatusColor(attendance.status) : 'border-gray-200'}
                  ${isWeekend && !attendance ? 'bg-gray-50' : ''}
                  hover:shadow-md
                `}
              >
                <div className="text-sm font-semibold mb-1">
                  {format(day, 'd')}
                </div>
                {attendance && (
                  <div className="text-xs space-y-1">
                    {attendance.checkIn && (
                      <div className="truncate">
                        {attendance.checkIn.substring(0, 5)}
                      </div>
                    )}
                    {attendance.checkOut && (
                      <div className="truncate">
                        {attendance.checkOut.substring(0, 5)}
                      </div>
                    )}
                    {attendance.workHours && (
                      <div className="font-semibold">
                        {attendance.workHours.toFixed(1)}h
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span>Presente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span>Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span>Ausente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span>Meio Período</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
            <span>Licença</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
            <span>Feriado</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

