import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '../../../components/layout/ModuleLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { payrollManagementService } from '../../../services/payrollManagementService';
import { PayrollCycle, PayrollReport, DepartmentPayrollSummary } from '../../../types/payroll';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToastContext } from '../../../contexts/ToastContext';

export const PayrollReports: React.FC = () => {
  const toast = useToastContext();
  
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<PayrollCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PayrollCycle | null>(null);
  const [reports, setReports] = useState<PayrollReport[]>([]);
  const [departments, setDepartments] = useState<DepartmentPayrollSummary[]>([]);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<'SUMMARY' | 'BY_DEPARTMENT' | 'BY_COST_CENTER' | 'TAX_REPORT' | 'BANK_FILE'>('SUMMARY');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'EXCEL' | 'CSV' | 'TXT'>('PDF');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCycle) {
      loadCycleReports(selectedCycle.id);
      loadDepartments(selectedCycle.id);
    }
  }, [selectedCycle]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await payrollManagementService.getAllCycles();
      setCycles(data);
      if (data.length > 0) {
        setSelectedCycle(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar ciclos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCycleReports = async (cycleId: string) => {
    try {
      const data = await payrollManagementService.getReports(cycleId);
      setReports(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  };

  const loadDepartments = async (cycleId: string) => {
    try {
      const data = await payrollManagementService.getDepartmentSummary(cycleId);
      setDepartments(data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCycle) return;
    try {
      setGenerating(true);
      await payrollManagementService.generateReport(selectedCycle.id, reportType, reportFormat);
      toast.success('Relatório gerado com sucesso!');
      loadCycleReports(selectedCycle.id);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const blob = await payrollManagementService.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${reportId}.${reportFormat.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Relatório baixado!');
    } catch (error) {
      toast.error('Erro ao baixar relatório');
      console.error(error);
    }
  };

  const getReportTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      SUMMARY: 'Resumo Geral',
      BY_DEPARTMENT: 'Por Departamento',
      BY_COST_CENTER: 'Por Centro de Custo',
      TAX_REPORT: 'Relatório Fiscal',
      BANK_FILE: 'Arquivo Bancário',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <ModuleLayout moduleId="payroll">
        <div className="space-y-6">
          <PageHeader title="Relatórios de Folha" subtitle="Carregando..." />
          <SkeletonCard />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleId="payroll">
      <div className="space-y-6">
        <PageHeader
          title="Relatórios de Folha"
          subtitle="Gere relatórios gerenciais, contábeis e fiscais"
        />

        {/* Seletor de Ciclo */}
        <Card>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Ciclo de Folha
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCycle?.id || ''}
              onChange={(e) => {
                const cycle = cycles.find(c => c.id === e.target.value);
                setSelectedCycle(cycle || null);
              }}
            >
              <option value="">Selecione um ciclo...</option>
              {cycles.map(cycle => (
                <option key={cycle.id} value={cycle.id}>
                  {new Date(cycle.referenceMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - {cycle.status}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {selectedCycle && (
          <>
            {/* Gerador de Relatórios */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar Novo Relatório</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Relatório
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                    >
                      <option value="SUMMARY">Resumo Geral</option>
                      <option value="BY_DEPARTMENT">Por Departamento</option>
                      <option value="BY_COST_CENTER">Por Centro de Custo</option>
                      <option value="TAX_REPORT">Relatório Fiscal</option>
                      <option value="BANK_FILE">Arquivo Bancário</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reportFormat}
                      onChange={(e) => setReportFormat(e.target.value as any)}
                    >
                      <option value="PDF">PDF</option>
                      <option value="EXCEL">Excel (XLSX)</option>
                      <option value="CSV">CSV</option>
                      <option value="TXT">TXT</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  variant="primary"
                  className="w-full"
                >
                  {generating ? 'Gerando...' : '📄 Gerar Relatório'}
                </Button>
              </div>
            </Card>

            {/* Relatórios Gerados */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Gerados</h3>
              {reports.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">Nenhum relatório gerado para este ciclo.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id} className="hover:shadow-lg transition-shadow">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {getReportTypeLabel(report.reportType)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Gerado em {report.generatedAt ? formatDate(report.generatedAt) : 'N/A'} • {report.format}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            📥 Baixar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Resumo por Departamento (Preview) */}
            {departments.length > 0 && reportType === 'BY_DEPARTMENT' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview - Resumo por Departamento</h3>
                <Card>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Funcionários</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Bruto</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Descontos</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Líquido</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {departments.map((dept) => (
                            <tr key={dept.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {dept.departmentName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                                {dept.employeeCount}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                                {formatCurrency(dept.totalGross)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600">
                                {formatCurrency(dept.totalDeductions)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-green-600">
                                {formatCurrency(dept.totalNet)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                              {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                              {formatCurrency(departments.reduce((sum, d) => sum + d.totalGross, 0))}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                              {formatCurrency(departments.reduce((sum, d) => sum + d.totalDeductions, 0))}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                              {formatCurrency(departments.reduce((sum, d) => sum + d.totalNet, 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </ModuleLayout>
  );
};

