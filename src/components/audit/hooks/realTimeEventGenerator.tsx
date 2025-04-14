
import { useEffect, useCallback, ReactNode } from 'react';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuditTrail } from '../context/AuditTrailContext';

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
