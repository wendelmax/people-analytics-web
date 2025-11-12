import React, { useState, useMemo } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Select } from '../../../components/common/Select';
import { useLeaveRequests } from '../../../hooks/useLeaveRequests';
import { useEmployees } from '../../../hooks/useEmployees';
import { formatDate } from '../../../utils/formatters';
import { LeaveRequest, LeaveRequestStatus } from '../../../types';

export const LeaveCalendar: React.FC = () => {
  const { requests: leaveRequests, loading: leavesLoading } = useLeaveRequests();
  const { employees, loading: employeesLoading } = useEmployees();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const filteredRequests = useMemo(() => {
    if (!leaveRequests) return [];

    let requests = leaveRequests.filter(req => req.status === 'APPROVED');

    if (selectedEmployee !== 'all') {
      requests = requests.filter(req => req.employeeId === selectedEmployee);
    }

    return requests;
  }, [leaveRequests, selectedEmployee]);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const weeks = [];
    let currentWeek = [];
    let currentDateIter = new Date(startDate);

    while (currentDateIter <= endDate) {
      const dayData = {
        date: new Date(currentDateIter),
        isCurrentMonth: currentDateIter.getMonth() === month,
        leaves: filteredRequests.filter(req => {
          const reqDate = new Date(req.startDate);
          return reqDate.toDateString() === currentDateIter.toDateString();
        })
      };

      currentWeek.push(dayData);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return weeks;
  }, [currentDate, filteredRequests]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Férias': return 'bg-blue-100 text-blue-800';
      case 'Licença Médica': return 'bg-red-100 text-red-800';
      case 'Licença Maternidade': return 'bg-pink-100 text-pink-800';
      case 'Licença Paternidade': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (leavesLoading || employeesLoading) {
    return (
      <ModuleLayout moduleId="leaves">
        <div className="space-y-6">
          <PageHeader title="Calendário de Licenças" subtitle="Carregando..." />
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="leaves">
      <div className="space-y-6">
        <PageHeader
          title="Calendário de Licenças"
          subtitle="Visualize todas as licenças aprovadas"
          actions={[
            {
              label: viewMode === 'month' ? 'Ver Semana' : 'Ver Mês',
              onClick: () => setViewMode(viewMode === 'month' ? 'week' : 'month'),
              variant: 'outline',
              icon: viewMode === 'month' ? '📅' : '📆'
            }
          ]}
        />

        {/* Filtros */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Funcionário
            </label>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="all">Todos os Funcionários</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Navegação do Calendário */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              ← Anterior
            </Button>

            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
              })}
            </h2>

            <Button variant="outline" onClick={() => navigateMonth('next')}>
              Próximo →
            </Button>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-700 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.flat().map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-24 p-2 border border-gray-200 rounded-lg
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${day.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="text-sm font-medium mb-1">
                  {day.date.getDate()}
                </div>

                <div className="space-y-1">
                  {day.leaves.map((leave, leaveIndex) => {
                    const employee = employees.find(e => e.id === leave.employeeId);
                    return (
                      <div
                        key={leaveIndex}
                        className="text-xs p-1 rounded truncate"
                        style={{ backgroundColor: leaveIndex % 2 === 0 ? '#dbeafe' : '#bfdbfe' }}
                        title={`${employee?.name}: ${leave.type} (${formatDate(leave.startDate)} - ${formatDate(leave.endDate)})`}
                      >
                        {employee?.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Legenda */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm">Férias</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm">Licença Médica</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-100 rounded"></div>
              <span className="text-sm">Licença Maternidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 rounded"></div>
              <span className="text-sm">Licença Paternidade</span>
            </div>
          </div>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
            <div className="text-sm text-gray-600">Licenças Aprovadas</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredRequests.filter(r => new Date(r.startDate) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Licenças Futuras</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredRequests.map(r => r.employeeId)).size}
            </div>
            <div className="text-sm text-gray-600">Funcionários com Licença</div>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
};
