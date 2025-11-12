import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Attendance } from '../../types';

interface AttendanceExportProps {
  attendanceRecords: Attendance[];
  employeeName?: string;
}

export const AttendanceExport: React.FC<AttendanceExportProps> = ({
  attendanceRecords,
  employeeName = 'Funcionário',
}) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    setExporting(true);
    
    const headers = ['Data', 'Dia da Semana', 'Entrada', 'Saída', 'Horas Trabalhadas', 'Status', 'Observações'];
    const rows = attendanceRecords.map((record) => [
      record.date,
      format(new Date(record.date + 'T00:00:00'), 'EEEE'),
      record.checkIn || '-',
      record.checkOut || '-',
      record.workHours ? `${record.workHours.toFixed(2)}h` : '-',
      record.status,
      record.notes || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${employeeName}_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };

  const exportToJSON = () => {
    setExporting(true);
    
    const jsonContent = JSON.stringify(attendanceRecords, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${employeeName}_${selectedMonth}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };

  const exportToExcel = () => {
    setExporting(true);
    
    const headers = ['Data', 'Dia da Semana', 'Entrada', 'Saída', 'Horas Trabalhadas', 'Status', 'Observações'];
    const rows = attendanceRecords.map((record) => [
      record.date,
      format(new Date(record.date + 'T00:00:00'), 'EEEE'),
      record.checkIn || '-',
      record.checkOut || '-',
      record.workHours || '-',
      record.status,
      record.notes || '-',
    ]);

    const htmlTable = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h2>Relatório de Presença - ${employeeName}</h2>
          <p>Período: ${selectedMonth}</p>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${employeeName}_${selectedMonth}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Exportar Relatórios
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Mês
            </label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={format(new Date(), 'yyyy-MM')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={exportToCSV}
              disabled={exporting || attendanceRecords.length === 0}
              variant="outline"
              className="w-full"
            >
              <span className="mr-2">📊</span>
              Exportar CSV
            </Button>
            
            <Button
              onClick={exportToExcel}
              disabled={exporting || attendanceRecords.length === 0}
              variant="outline"
              className="w-full"
            >
              <span className="mr-2">📈</span>
              Exportar Excel
            </Button>
            
            <Button
              onClick={exportToJSON}
              disabled={exporting || attendanceRecords.length === 0}
              variant="outline"
              className="w-full"
            >
              <span className="mr-2">📋</span>
              Exportar JSON
            </Button>
          </div>

          {attendanceRecords.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum registro disponível para exportação no período selecionado
            </p>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Os arquivos exportados incluem todos os registros de presença do período selecionado.
              Use o formato CSV ou Excel para análise em planilhas, e JSON para integração com outros sistemas.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

