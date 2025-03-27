
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AuditEvent } from '../types';
import { useAuditEvents } from './useAuditEvents';

export function useAuditEventManager(documentName: string) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize audit events using the hook
  const {
    auditEvents,
    updateAuditEvents,
    setLastActivity
  } = useAuditEvents({ documentName });

  // Set loading state after initial audit events are loaded
  useEffect(() => {
    if (auditEvents.length > 0) {
      setIsLoading(false);
    }
  }, [auditEvents]);

  const updateTaskStatus = useCallback((eventId: string, status: 'pending' | 'in-progress' | 'completed') => {
    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, status };
      }
      return event;
    });
    
    updateAuditEvents(updatedEvents);
    setLastActivity(new Date());
    toast.success(`Task status updated to: ${status}`);
  }, [auditEvents, updateAuditEvents, setLastActivity]);

  const addAuditEvent = useCallback((event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: event.action,
      documentName: event.documentName || documentName,
      user: event.user || 'System',
      status: event.status || 'completed',
      comments: [],
      icon: event.icon
    };

    updateAuditEvents([newEvent, ...auditEvents]);
    setLastActivity(new Date());
    toast.success(`Audit trail updated: ${event.action}`);
  }, [auditEvents, documentName, updateAuditEvents, setLastActivity]);

  return {
    auditEvents,
    isLoading,
    addAuditEvent,
    updateTaskStatus,
    updateAuditEvents,
    setLastActivity
  };
}
