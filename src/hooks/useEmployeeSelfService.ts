import { useState, useEffect } from 'react';
import { employeeSelfService } from '../services/employeeSelfService';
import { analyticsService } from '../services/analyticsService';
import { policyService } from '../services/policyService';
import { EmployeeProfile, LeaveRequest, AttendanceSummary, PolicyDocument, PolicyAcknowledgment, Payroll } from '../types';
import { useToastContext } from '../contexts/ToastContext';

export const useEmployeeSelfService = () => {
  const toast = useToastContext();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<PolicyAcknowledgment[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSelfServiceData();
  }, []);

  const loadSelfServiceData = async () => {
    setLoading(true);
    
    // Carregar Payrolls independentemente para garantir exibição
    try {
      const payrollsData = await employeeSelfService.getMyPayrolls();
      console.log('✅ Payrolls recebidos da API:', payrollsData);
      setPayrolls(payrollsData || []);
      console.log('✅ Estado payrolls atualizado');
    } catch (error) {
      console.error('❌ Erro ao carregar payrolls:', error);
    }

    try {
      const [profileData, leavesData, attendanceData, policiesData, acknowledgmentsData] = await Promise.all([
        employeeSelfService.getMyProfile(),
        employeeSelfService.getMyLeaves(),
        employeeSelfService.getMyAttendanceSummary(),
        policyService.getAll(),
        policyService.getMyAcknowledgments(),
      ]);

      setProfile(profileData);
      setLeaves(leavesData || []);
      setAttendanceSummary(attendanceData);
      setPolicies(policiesData || []);
      setAcknowledgments(acknowledgmentsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados gerais do self-service:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<EmployeeProfile>) => {
    const updated = await employeeSelfService.updateMyProfile(data);
    setProfile(updated);
    return updated;
  };

  const requestDocument = async (documentType: string) => {
    try {
      await employeeSelfService.requestDocument(documentType);
      
      const docNames: Record<string, string> = {
        payslip: 'Holerite',
        certificate: 'Atestado',
        declaration: 'Declaração',
        income_report: 'Informe de Rendimentos'
      };

      toast.success(`Seu pedido de ${docNames[documentType] || 'documento'} foi recebido com sucesso.`);
    } catch (error) {
      console.error('Erro ao solicitar documento:', error);
      toast.error('Não foi possível solicitar o documento. Tente novamente.');
    }
  };

  const acknowledgePolicy = async (policyId: string) => {
    const acknowledgment = await policyService.acknowledgePolicy(policyId);
    setAcknowledgments([...acknowledgments, acknowledgment]);

    // Remover da lista de políticas pendentes se necessário
    setPolicies(policies.map(policy =>
      policy.id === policyId
        ? { ...policy, requiresAcknowledgment: false }
        : policy
    ));
  };

  return {
    profile,
    leaves,
    attendanceSummary,
    policies,
    acknowledgments,
    payrolls,
    loading,
    updateProfile,
    requestDocument,
    acknowledgePolicy,
    refetch: loadSelfServiceData
  };
};
