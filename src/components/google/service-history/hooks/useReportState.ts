
import { useState, useCallback } from 'react';
import { ComplianceReport } from '@/utils/types';
import { getUserHistoricalReports } from '@/utils/historyService';

interface ScanHistoryItem {
  serviceId: string;
  serviceName: string;
  scanDate: string;
  itemsScanned: number;
  violationsFound: number;
  documentName?: string;
  fileName?: string;
  report?: ComplianceReport;
  industry?: string;
  organization?: string;
  regulations?: string[];
}

export const useReportState = (
  user: any,
  scanHistory: ScanHistoryItem[]
) => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);

  const loadReports = useCallback(() => {
    if (user) {
      const userReports = getUserHistoricalReports(user.id);
      
      // Only update if there's an actual change
      if (userReports.length !== reports.length) {
        console.log('ServiceHistory: Refreshing reports, found:', userReports.length);
        setReports(userReports);
      }
    } else if (scanHistory.length > 0 && reports.length !== scanHistory.length) {
      // For anonymous users, refresh from the store
      console.log('Anonymous history updated, refreshing view');
      // Add missing required properties for each anonymous report
      const completeReports = scanHistory.map((item: any) => ({
        documentId: item.serviceId,
        documentName: item.documentName || 'Anonymous Scan',
        scanDate: item.scanDate,
        timestamp: item.scanDate,
        industry: 'Global' as const,
        overallScore: 85,
        gdprScore: 80,
        hipaaScore: 75,
        soc2Score: 90,
        summary: item.fileName ? `Scan of ${item.fileName}` : 'Anonymous scan',
        risks: [],
        complianceStatus: 'Compliant',
        regulations: ['GDPR']
      }));
      
      setReports(completeReports);
    }
  }, [user, reports.length, scanHistory]);

  return { reports, setReports, loadReports };
};
