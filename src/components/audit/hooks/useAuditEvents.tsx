
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AuditEvent } from '../types';
import { generateMockAuditTrail } from './mockAuditData';
import { 
  generateRealTimeEvent, 
  generateInitialRealTimeEvent, 
  notifyNewActivity 
} from './realTimeEventGenerator';

interface UseAuditEventsProps {
  documentName: string;
  initialEvents?: AuditEvent[];
}

export function useAuditEvents({ documentName, initialEvents }: UseAuditEventsProps) {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialEvents || []);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Initialize auditEvents if not provided
  useEffect(() => {
    if (!initialEvents || initialEvents.length === 0) {
      setAuditEvents(generateMockAuditTrail(documentName));
      setLastActivity(new Date());
    }
  }, [documentName, initialEvents]);

  // Real-time updates simulation
  useEffect(() => {
    // Create a function that will add a new event occasionally
    const addRealTimeEvent = () => {
      const newEvent = generateRealTimeEvent(documentName);
      setAuditEvents(prev => [newEvent, ...prev]);
      // Force notification display with proper context
      setTimeout(() => {
        notifyNewActivity(newEvent);
      }, 100);
    };

    // Set up interval for real-time updates
    const timeSinceLastActivity = new Date().getTime() - lastActivity.getTime();
    
    // Keep updates flowing for 30 minutes after last activity
    if (timeSinceLastActivity < 30 * 60 * 1000) {
      const timer = setTimeout(() => {
        // 30% chance to add a real-time event every 5-15 seconds
        if (Math.random() < 0.3) {
          addRealTimeEvent();
        }
      }, 5000 + Math.random() * 10000);
      
      return () => clearTimeout(timer);
    }
  }, [auditEvents, documentName, lastActivity]);

  // Trigger an immediate real-time event when the component mounts
  useEffect(() => {
    // Only add event if we're using generated events (not initial events)
    if (!initialEvents || initialEvents.length === 0) {
      const timer = setTimeout(() => {
        const newEvent = generateInitialRealTimeEvent(documentName);
        setAuditEvents(prev => [newEvent, ...prev]);
        
        // Ensure the toast is displayed
        toast.info('Real-time monitoring active', {
          description: 'Audit events will appear automatically',
          icon: <span className="animate-pulse">🔄</span>,
          duration: 5000,
          position: 'top-right',
        });
        
        // Add a second toast to confirm notifications are working
        setTimeout(() => {
          toast.success('Notification system ready', {
            description: 'You will receive alerts for important audit events',
            duration: 3000,
            position: 'top-right',
          });
        }, 1000);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [documentName, initialEvents]);

  const updateAuditEvents = (updatedEvents: AuditEvent[]) => {
    setAuditEvents(updatedEvents);
  };

  return {
    auditEvents,
    updateAuditEvents,
    setLastActivity
  };
}

// Re-export getAuditEventsForDocument for API simulation
export { getAuditEventsForDocument } from './mockAuditData';
