import React, { useState, useRef, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface DatePickerProps {
  label?: string;
  value?: Date | string;
  onChange?: (date: Date | null) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder = 'dd/mm/aaaa',
  disabled = false,
  minDate,
  maxDate,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? parse(value, 'dd/MM/yyyy', new Date()) : value;
      if (isValid(date)) {
        setSelectedDate(date);
        setInputValue(format(date, 'dd/MM/yyyy', { locale: ptBR }));
      }
    } else {
      setSelectedDate(null);
      setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;

    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (value.length > 4) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    }

    setInputValue(formatted);

    if (formatted.length === 10) {
      const parsed = parse(formatted, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        setSelectedDate(parsed);
        onChange?.(parsed);
      }
    } else {
      setSelectedDate(null);
      onChange?.(null);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    setSelectedDate(date);
    setInputValue(format(date, 'dd/MM/yyyy', { locale: ptBR }));
    onChange?.(date);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = selectedDate?.getFullYear() || today.getFullYear();
    const month = selectedDate?.getMonth() || today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const datePickerId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${datePickerId}-error` : undefined;
  const helperId = helperText ? `${datePickerId}-helper` : undefined;

  const currentDate = selectedDate || new Date();
  const calendarDays = generateCalendarDays();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className={`w-full ${className}`} ref={datePickerRef}>
      {label && (
        <label htmlFor={datePickerId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={datePickerId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
            error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label="Abrir calendário"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[320px]">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Mês anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Próximo mês"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled}
                    className={`
                      aspect-square rounded transition-colors text-sm
                      ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : isToday
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }
                      ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        {error && (
          <p id={errorId} className="text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

