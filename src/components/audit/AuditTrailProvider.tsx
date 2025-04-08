import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuditEvent } from './types';
import { useAuditReport } from './hooks/useAuditReport';
import { Industry } from '@/utils/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { AuditTrailContext } from './context/AuditTrailContext';

interface AuditTrailProviderProps {
  children: React.ReactNode;
  documentName: string;
  industry?: Industry;
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({ children, documentName, industry }) => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { isGeneratingReport, downloadAuditReport } = useAuditReport(documentName, auditEvents, industry);

  // Load initial events or mock events based on documentName
  useEffect(() => {
    setLoadingEvents(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      const initialEvents = generateMockAuditEvents(documentName);
      setAuditEvents(initialEvents);
      setLoadingEvents(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [documentName]);

  // Effect to add new audit events based on activity
  useEffect(() => {
    if (!user) {
      console.warn('User context not available, cannot generate audit events.');
      return;
    }
    
    const newEvent = generateAuditEvent(lastActivity, user.email);
    setAuditEvents(prevEvents => [newEvent, ...prevEvents]);
  }, [lastActivity, user]);

  // Function to generate a single audit event
  const generateAuditEvent = (timestamp: Date, user: string): AuditEvent => {
    return {
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      action: `Document analyzed`,
      user: user,
      status: 'completed',
      icon: undefined,
    };
  };

  // Mock function to generate initial audit events
  const generateMockAuditEvents = (docName: string): AuditEvent[] => {
    return [
      {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        action: `Initial scan of "${docName}"`,
        user: 'system',
        status: 'completed',
        icon: undefined,
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'Document uploaded',
        user: 'user@example.com',
        status: 'completed',
        icon: undefined,
      },
    ];
  };

  // Create the context value object
  const value = {
    auditEvents,
    setLastActivity,
    downloadAuditReport,
    isGeneratingReport,
    loadingEvents,
    documentName, // Added documentName to the context
    industry
  };

  return (
    <AuditTrailContext.Provider value={value}>
      {children}
    </AuditTrailContext.Provider>
  );
};
