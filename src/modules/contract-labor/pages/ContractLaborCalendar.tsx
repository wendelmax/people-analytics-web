import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { useContractLabor } from '../../../hooks/useContractLabor';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { formatDate } from '../../../utils/formatters';
import { ContractLaborStatus } from '../../../types';

export const ContractLaborCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { labor, loading, error } = useContractLabor();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  }, [currentMonth]);

  const monthEnd = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  }, [currentMonth]);

  const getDaysInMonth = useMemo(() => {
    const days: Date[] = [];
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }, [monthStart]);

  const getLaborForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return labor.filter((item) => {
      const start = new Date(item.startDate);
      const end = item.endDate ? new Date(item.endDate) : null;
      
      if (end) {
        return date >= start && date <= end;
      }
      return date >= start;
    });
  };

  const getStatusColor = (status: ContractLaborStatus) => {
    switch (status) {
      case ContractLaborStatus.ACTIVE:
        return 'bg-green-500';
      case ContractLaborStatus.INACTIVE:
        return 'bg-gray-500';
      case ContractLaborStatus.TERMINATED:
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const todayLabor = selectedDate ? getLaborForDate(selectedDate) : [];

  if (loading) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleId="contract-labor">
        <ErrorMessage message={error} />
      </ModuleLayout>
    );
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <ModuleLayout moduleId="contract-labor">
      <div className="space-y-6">
        <PageHeader
          title="Calendário de Contratos"
          subtitle="Visualize alocações e vencimentos de contratos"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={previousMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ←
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    →
                  </button>
                </div>

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
                  {getDaysInMonth.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const dateLabor = getLaborForDate(date);
                    const activeCount = dateLabor.filter(l => l.status === ContractLaborStatus.ACTIVE).length;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`min-h-[80px] p-1 border border-gray-200 rounded-lg text-left transition-all hover:bg-blue-50 ${
                          !isCurrentMonth ? 'opacity-30 bg-gray-50' : 'bg-white'
                        } ${isToday ? 'ring-2 ring-blue-500' : ''} ${
                          isSelected ? 'bg-blue-100 border-blue-500' : ''
                        }`}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                        {activeCount > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {dateLabor.slice(0, 2).map((item) => (
                              <div
                                key={item.id}
                                className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}
                                title={item.name}
                              />
                            ))}
                            {activeCount > 2 && (
                              <div className="text-xs text-gray-500">+{activeCount - 2}</div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-700">Inativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">Terminado</span>
                </div>
              </div>
            </Card>

            {selectedDate && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contratos em {formatDate(selectedDate.toISOString())}
                </h3>
                {todayLabor.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum contrato ativo nesta data</p>
                ) : (
                  <div className="space-y-3">
                    {todayLabor.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/contract-labor/${item.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{item.skill}</p>
                            {item.project && (
                              <p className="text-xs text-gray-500 mt-1">📁 {item.project.name}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === ContractLaborStatus.ACTIVE
                                ? 'bg-green-100 text-green-800'
                                : item.status === ContractLaborStatus.INACTIVE
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status === ContractLaborStatus.ACTIVE
                              ? 'Ativo'
                              : item.status === ContractLaborStatus.INACTIVE
                              ? 'Inativo'
                              : 'Terminado'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Mês</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Contratos Ativos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {labor.filter(l => l.status === ContractLaborStatus.ACTIVE).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Contratos Vencendo em 30 dias</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {labor.filter((l) => {
                      if (!l.endDate) return false;
                      const end = new Date(l.endDate);
                      const today = new Date();
                      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return diff <= 30 && diff > 0 && l.status === ContractLaborStatus.ACTIVE;
                    }).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total de Contratos</div>
                  <div className="text-2xl font-bold text-blue-600">{labor.length}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

