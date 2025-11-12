import React from 'react';
import { Payroll } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface PayslipModalProps {
  payroll: Payroll | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payroll, onClose }) => {
  if (!payroll) return null;

  const earnings = payroll.items.filter(i => i.type === 'EARNING');
  const deductions = payroll.items.filter(i => i.type === 'DEDUCTION');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:max-h-none">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 print:border-none">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Demonstrativo de Pagamento</h2>
            <p className="text-sm text-gray-500 mt-1">People Analytics Inc.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 print:hidden"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 font-mono text-sm">
          {/* Info Header */}
          <div className="grid grid-cols-2 gap-8 border p-4 rounded-lg bg-gray-50 print:bg-white print:border-gray-300">
            <div>
              <p className="text-gray-500 text-xs uppercase">Funcionário</p>
              <p className="font-bold text-lg">{payroll.employeeId} - {payroll.employee?.name || 'João Silva'}</p>
              <p className="text-gray-600 mt-1">Departamento: Tecnologia</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs uppercase">Referência</p>
              <p className="font-bold text-lg">{new Date(payroll.period + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</p>
              <p className="text-gray-600 mt-1">Pagamento: {formatDate(payroll.paidAt || '')}</p>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b print:bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Descrição</th>
                  <th className="py-2 px-4 text-center font-semibold text-gray-700 w-24">Ref.</th>
                  <th className="py-2 px-4 text-right font-semibold text-green-700 w-32">Vencimentos</th>
                  <th className="py-2 px-4 text-right font-semibold text-red-700 w-32">Descontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.map(item => (
                  <tr key={item.id}>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-center text-gray-500">30d</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(item.amount)}</td>
                    <td className="py-2 px-4 text-right text-gray-300">-</td>
                  </tr>
                ))}
                {deductions.map(item => (
                  <tr key={item.id}>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-center text-gray-500">{item.name.includes('IRRF') ? '27.5%' : item.name.includes('INSS') ? '14%' : '-'}</td>
                    <td className="py-2 px-4 text-right text-gray-300">-</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                {/* Linhas vazias para preencher visualmente */}
                {Array.from({ length: Math.max(0, 8 - (earnings.length + deductions.length)) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="py-2 px-4 text-transparent">.</td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t font-bold print:bg-gray-100">
                <tr>
                  <td className="py-3 px-4 text-right" colSpan={2}>Totais</td>
                  <td className="py-3 px-4 text-right text-green-700">{formatCurrency(payroll.grossSalary)}</td>
                  <td className="py-3 px-4 text-right text-red-700">{formatCurrency(payroll.totalDeductions)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Net Pay */}
          <div className="flex justify-end">
            <div className="bg-gray-100 p-4 rounded-lg border w-64 print:bg-white print:border-2 print:border-gray-800">
              <p className="text-gray-500 text-xs uppercase mb-1">Valor Líquido a Receber</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(payroll.netSalary)}</p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-gray-400 text-xs mt-8 pt-8 border-t border-dashed">
            <p>Demonstrativo gerado eletronicamente. Válido como comprovante de renda.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 print:hidden">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <span>🖨️</span> Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

