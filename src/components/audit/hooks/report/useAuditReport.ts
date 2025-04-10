
import { useState } from 'react';
import { AuditEvent } from '../../types';
import { Industry } from '@/utils/types';
import { useReportDownload } from './useReportDownload';
import { useLogsDownload } from './useLogsDownload';

/**
 * Combined hook for handling audit report and logs generation and download
 */
export function useAuditReport(documentName: string, auditEvents: AuditEvent[], industry?: Industry) {
  const {
    isGeneratingReport,
    downloadAuditReport,
    progressPercent: reportProgress
  } = useReportDownload(documentName, auditEvents, industry);
  
  const {
    isGeneratingLogs,
    downloadAuditLogs,
    progressPercent: logsProgress
  } = useLogsDownload(documentName, auditEvents);
  
  // Calculate combined progress for UI if needed
  const progressPercent = isGeneratingReport ? reportProgress : logsProgress;

  return {
    isGeneratingReport,
    isGeneratingLogs,
    downloadAuditReport,
    downloadAuditLogs,
    progressPercent
  };
}
