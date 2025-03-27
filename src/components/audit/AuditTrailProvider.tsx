
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuditEvent } from './types';
import { toast } from 'sonner';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';

interface AuditTrailContextProps {
  auditEvents: AuditEvent[];
  isLoading: boolean;
  isGeneratingReport: boolean;
  downloadAuditReport: () => Promise<void>;
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
}

const AuditTrailContext = createContext<AuditTrailContextProps | null>(null);

interface AuditTrailProviderProps {
  documentName: string;
  children: React.ReactNode;
}

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({
  documentName,
  children,
}) => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Fetch audit events for the document
  useEffect(() => {
    const fetchAuditEvents = async () => {
      try {
        // In a real app, this would be an API call to fetch data
        // This is a mock implementation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockEvents: AuditEvent[] = [
          {
            id: '1',
            eventType: 'system',
            text: 'Document uploaded for compliance analysis',
            user: 'System',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            status: 'completed',
          },
          {
            id: '2',
            eventType: 'user',
            text: 'Started GDPR compliance check',
            user: 'john.doe@example.com',
            timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
            status: 'in_progress',
          },
          {
            id: '3',
            eventType: 'system',
            text: 'Automatic scan detected 3 potential compliance issues',
            user: 'System',
            timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
            status: 'completed',
            comments: [
              {
                id: '1',
                text: 'Verified these issues, they need to be addressed',
                user: 'sarah.smith@example.com',
                timestamp: new Date(Date.now() - 3600000 * 21).toISOString(),
              },
            ],
          },
          {
            id: '4',
            eventType: 'user',
            text: 'Updated document with required privacy clauses',
            user: 'john.doe@example.com',
            timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
            status: 'completed',
          },
          {
            id: '5',
            eventType: 'system',
            text: 'Final compliance check completed',
            user: 'System',
            timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
            status: 'completed',
          },
        ];
        
        setAuditEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching audit events:', error);
        toast.error('Failed to load audit events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditEvents();
  }, [documentName]);

  const addAuditEvent = useCallback((event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: event.eventType || 'system',
      text: event.text,
      user: event.user || 'System',
      status: event.status || 'completed',
      comments: event.comments || [],
    };

    setAuditEvents((prev) => [newEvent, ...prev]);
    toast.success(`Audit trail updated: ${event.text}`);
  }, []);

  const downloadAuditReport = useCallback(async () => {
    try {
      setIsGeneratingReport(true);
      const reportBlob = await generateAuditReport(documentName, auditEvents);
      
      // Create a download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Audit report downloaded successfully');
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsGeneratingReport(false);
    }
  }, [auditEvents, documentName]);

  const value = {
    auditEvents,
    isLoading,
    isGeneratingReport,
    downloadAuditReport,
    addAuditEvent,
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};
