
import { useState, useEffect, useCallback } from 'react';
import { ServiceScanHistory } from '@/components/audit/types';
import { ComplianceReport } from '@/utils/types';

// In a real app, this would be persisted to localStorage or a database
let serviceHistory: ServiceScanHistory[] = [];

export const useServiceHistoryStore = () => {
  const [history, setHistory] = useState<ServiceScanHistory[]>(serviceHistory);

  // Initialize from state
  useEffect(() => {
    // Populate with some sample data if empty
    if (serviceHistory.length === 0) {
      const mockData: ServiceScanHistory[] = [
        {
          serviceId: 'drive-1',
          serviceName: 'Google Drive',
          documentName: 'XYZ Manufacturing Quality.pdf',
          scanDate: new Date('2025-03-27T15:25:06').toISOString(),
          itemsScanned: 23,
          violationsFound: 2,
          report: {
            documentName: 'XYZ Manufacturing Quality.pdf',
            timestamp: new Date('2025-03-27T15:25:06').toISOString(),
            overallScore: 78,
            gdprScore: 85,
            hipaaScore: 72,
            soc2Score: 80,
            risks: [
              { severity: 'medium', regulation: 'GDPR', description: 'Missing data retention policy: Document does not specify data retention period.' },
              { severity: 'low', regulation: 'SOC2', description: 'Access control: Insufficient detail on access permissions.' }
            ],
            summary: 'Manufacturing quality documentation with minor compliance issues in data retention and access control specifications.'
          }
        },
        {
          serviceId: 'drive-1',
          serviceName: 'Google Drive',
          documentName: 'XYZ University Student Privacy.pdf',
          scanDate: new Date('2025-03-27T15:22:21').toISOString(),
          itemsScanned: 55,
          violationsFound: 0,
          report: {
            documentName: 'XYZ University Student Privacy.pdf',
            timestamp: new Date('2025-03-27T15:22:21').toISOString(),
            overallScore: 96,
            gdprScore: 98,
            hipaaScore: 95,
            soc2Score: 94,
            risks: [],
            summary: 'Well-structured student privacy policy fully compliant with relevant regulations.'
          }
        },
        {
          serviceId: 'drive-1',
          serviceName: 'Google Drive',
          documentName: 'XYZ Bank Anti.pdf',
          scanDate: new Date('2025-03-27T15:20:54').toISOString(),
          itemsScanned: 44,
          violationsFound: 4,
          report: {
            documentName: 'XYZ Bank Anti.pdf',
            timestamp: new Date('2025-03-27T15:20:54').toISOString(),
            overallScore: 65,
            gdprScore: 62,
            hipaaScore: 70,
            soc2Score: 64,
            risks: [
              { severity: 'high', regulation: 'GDPR', description: 'Data breach notification: No clear process for notifying users of data breaches.' },
              { severity: 'medium', regulation: 'GDPR', description: 'Cross-border data transfer: Missing safeguards for international data transfers.' },
              { severity: 'medium', regulation: 'SOC2', description: 'Monitoring controls: Insufficient regular monitoring processes.' },
              { severity: 'low', regulation: 'HIPAA', description: 'Documentation: Minor inconsistencies in documentation format.' }
            ],
            summary: 'Anti-money laundering documentation with several compliance issues, particularly around data breach notification and cross-border transfers.'
          }
        }
      ];
      
      serviceHistory = mockData;
      setHistory(mockData);
    } else {
      setHistory(serviceHistory);
    }
  }, []);

  const addScanHistory = useCallback((scan: ServiceScanHistory) => {
    const newHistory = [scan, ...serviceHistory];
    // Limit history to most recent 50 items
    serviceHistory = newHistory.slice(0, 50);
    setHistory(serviceHistory);
  }, []);

  const clearHistory = useCallback(() => {
    serviceHistory = [];
    setHistory([]);
  }, []);

  const getServiceHistory = useCallback((serviceId?: string) => {
    if (!serviceId) return serviceHistory;
    return serviceHistory.filter(item => item.serviceId === serviceId);
  }, []);

  return {
    scanHistory: history,
    addScanHistory,
    clearHistory,
    getServiceHistory
  };
};
