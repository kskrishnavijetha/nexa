
import { useEffect, useCallback, ReactNode } from 'react';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuditTrail } from '../context/AuditTrailContext';
import { AuditEvent } from '../types';
import { toast } from 'sonner';

// Interval between generating events (in ms)
const EVENT_GENERATION_INTERVAL = 60000; // 1 minute

// Define possible events to randomly generate
const possibleEvents = [
  {
    action: 'Automated compliance check',
    user: 'System',
    status: 'completed' as const,
    getIcon: () => <Eye className="h-4 w-4 text-blue-500" /> as ReactNode
  },
  {
    action: 'Potential compliance violation detected',
    user: 'System',
    status: 'pending' as const,
    getIcon: () => <AlertTriangle className="h-4 w-4 text-orange-500" /> as ReactNode
  },
  {
    action: 'User access verification',
    user: 'System',
    status: 'completed' as const,
    getIcon: () => <CheckCircle className="h-4 w-4 text-green-500" /> as ReactNode
  }
];

// Generate a real-time event for use outside the hook
export function generateRealTimeEvent(documentName: string): AuditEvent {
  const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  
  return {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: randomEvent.action,
    documentName,
    user: randomEvent.user,
    status: randomEvent.status,
    comments: [],
    icon: randomEvent.getIcon()
  };
}

// Generate an initial real-time event when component mounts
export function generateInitialRealTimeEvent(documentName: string): AuditEvent {
  // Use a specific event for the initial notification
  return {
    id: `audit-init-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'Audit trail monitoring started',
    documentName,
    user: 'System',
    status: 'completed',
    comments: [],
    icon: <Eye className="h-4 w-4 text-blue-500" />
  };
}

// Show notification for new activity
export function notifyNewActivity(event: AuditEvent) {
  toast.info(`New activity: ${event.action}`, {
    description: event.status === 'pending' ? 'Attention required' : 'For your information',
    duration: 5000,
  });
}

export function useRealTimeEventGenerator(
  documentName: string,
  enabled: boolean = true,
  intervalOverride?: number
) {
  const { addAuditEvent } = useAuditTrail();
  
  // Function to generate a random event
  const generateRandomEvent = useCallback(() => {
    if (!enabled) return;
    
    // Randomly select an event from the possible events (25% chance)
    if (Math.random() < 0.25) {
      const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      
      addAuditEvent({
        action: randomEvent.action,
        documentName,
        user: randomEvent.user,
        status: randomEvent.status,
        comments: [],
        icon: randomEvent.getIcon()
      });
    }
  }, [enabled, documentName, addAuditEvent]);
  
  // Set up interval for generating events
  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(
      generateRandomEvent, 
      intervalOverride || EVENT_GENERATION_INTERVAL
    );
    
    return () => clearInterval(interval);
  }, [enabled, generateRandomEvent, intervalOverride]);
  
  return {
    generateEvent: generateRandomEvent
  };
}
