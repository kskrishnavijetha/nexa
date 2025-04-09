
import { useState, useEffect, useRef } from 'react';
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
  const timerRef = useRef<number | null>(null);
  
  // Cleanup function for timers
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Initialize auditEvents if not provided
  useEffect(() => {
    if (!initialEvents || initialEvents.length === 0) {
      setAuditEvents(generateMockAuditTrail(documentName));
      setLastActivity(new Date());
    }
  }, [documentName, initialEvents]);

  // Real-time updates simulation with performance optimizations
  useEffect(() => {
    // Cleanup previous timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    
    // Create a function that will add a new event occasionally
    const addRealTimeEvent = () => {
      const newEvent = generateRealTimeEvent(documentName);
      setAuditEvents(prev => [newEvent, ...prev]);
      notifyNewActivity(newEvent); // Show notification with the enhanced function
    };

    // Set up interval for real-time updates
    const timeSinceLastActivity = new Date().getTime() - lastActivity.getTime();
    
    // Keep updates flowing for 30 minutes after last activity
    if (timeSinceLastActivity < 30 * 60 * 1000) {
      // Use a longer delay to reduce UI pressure
      const delay = 5000 + Math.random() * 10000;
      timerRef.current = window.setTimeout(() => {
        // 30% chance to add a real-time event
        if (Math.random() < 0.3) {
          addRealTimeEvent();
        }
      }, delay);
      
      return () => {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [auditEvents, documentName, lastActivity]);

  // Trigger an immediate real-time event when the component mounts
  useEffect(() => {
    // Only add event if we're using generated events (not initial events)
    if (!initialEvents || initialEvents.length === 0) {
      const timer = setTimeout(() => {
        const newEvent = generateInitialRealTimeEvent(documentName);
        setAuditEvents(prev => [newEvent, ...prev]);
        
        // Use the enhanced notification with rich formatting
        toast.info('Real-time monitoring active', {
          description: 'Audit events will appear automatically',
          icon: <span className="animate-pulse">🔄</span>,
          duration: 3000,
        });
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
