import { useState } from 'react';
import { generateAuditReport, generateAuditLogsPDF, getAuditReportFileName, getAuditLogsFileName } from '@/utils/auditReportService';
import { AuditEvent } from '../types';
import { toast } from 'sonner';
import { Industry } from '@/utils/types';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';
import { useSubscription } from '@/hooks/useSubscription';
import { isFeatureAvailable } from '@/utils/pricingData';

export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingLogs, setIsGeneratingLogs] = useState(false);
  const { subscription } = useSubscription();

  const canExportPdf = subscription && isFeatureAvailable('exportToPdf', subscription.plan);
  const canUseHashVerification = subscription && isFeatureAvailable('hashVerification', subscription.plan);

  const downloadAuditReport = async () => {
    if (isGeneratingReport) return;
    if (!canExportPdf) {
      toast.error('PDF export is only available in Starter, Pro, and Enterprise plans.');
      return;
    }
    setIsGeneratingReport(true);
    const toastId = toast.loading('Generating audit report...', { duration: 30000 });
    try {
      requestAnimationFrame(async () => {
        try {
          let verificationMetadata;
          if (canUseHashVerification) {
            verificationMetadata = await generateVerificationMetadata(auditEvents);
          }
          const reportBlob = await generateAuditReport(documentName, auditEvents, industry);
          const url = window.URL.createObjectURL(reportBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = getAuditReportFileName(documentName);
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.dismiss(toastId);
            toast.success('Audit report downloaded successfully');
            setIsGeneratingReport(false);
          }, 100);
        } catch (error) {
          toast.dismiss(toastId);
          toast.error('Failed to generate audit report');
          setIsGeneratingReport(false);
        }
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to generate audit report');
      setIsGeneratingReport(false);
    }
  };

  const downloadAuditLogs = async () => {
    if (isGeneratingLogs) return;
    if (!canExportPdf) {
      toast.error('PDF export is only available in Starter, Pro, and Enterprise plans.');
      return;
    }
    setIsGeneratingLogs(true);
    const toastId = toast.loading('Generating audit logs PDF...', { duration: 30000 });
    try {
      requestAnimationFrame(async () => {
        try {
          let verificationMetadata;
          if (canUseHashVerification) {
            verificationMetadata = await generateVerificationMetadata(auditEvents);
          }
          const logsBlob = await generateAuditLogsPDF(documentName, auditEvents);
          const url = window.URL.createObjectURL(logsBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = getAuditLogsFileName(documentName);
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.dismiss(toastId);
            toast.success('Audit logs downloaded successfully');
            setIsGeneratingLogs(false);
          }, 100);
        } catch (error) {
          toast.dismiss(toastId);
          toast.error('Failed to generate audit logs PDF');
          setIsGeneratingLogs(false);
        }
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to generate audit logs PDF');
      setIsGeneratingLogs(false);
    }
  };

  return {
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs,
    canExportPdf,
    canUseHashVerification
  };
}
