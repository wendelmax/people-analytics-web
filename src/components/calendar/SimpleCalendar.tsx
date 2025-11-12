import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
  type?: 'leave' | 'training' | 'meeting' | 'holiday' | 'other';
}

interface SimpleCalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  currentDate?: Date;
  showNavigation?: boolean;
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  events = [],
  onDateClick,
  onEventClick,
  currentDate: initialDate,
  showNavigation = true,
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getEventColor = (type?: string) => {
    const colors = {
      leave: 'bg-blue-100 text-blue-800 border-blue-300',
      training: 'bg-green-100 text-green-800 border-green-300',
      meeting: 'bg-purple-100 text-purple-800 border-purple-300',
      holiday: 'bg-red-100 text-red-800 border-red-300',
      other: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card>
      <div className="p-6">
        {showNavigation && (
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              ←
            </Button>
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              →
            </Button>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-200 rounded ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-blue-500' : ''} ${
                  onDateClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } transition-colors`}
                onClick={() => onDateClick?.(day)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday ? 'text-blue-600' : ''}`}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className={`text-xs px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 ${getEventColor(
                        event.type
                      )}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayEvents.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                <span className="text-xs text-gray-600">Licença</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                <span className="text-xs text-gray-600">Treinamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded" />
                <span className="text-xs text-gray-600">Reunião</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                <span className="text-xs text-gray-600">Feriado</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

