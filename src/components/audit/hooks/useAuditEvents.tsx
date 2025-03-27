import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Clock, Eye, Check, Users } from 'lucide-react';
import { AuditEvent } from '../types';
import { generateMockAuditTrail } from '../auditUtils';

interface UseAuditEventsProps {
  documentName: string;
}

export function useAuditEvents({ documentName }: UseAuditEventsProps) {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Initialize auditEvents
  useEffect(() => {
    setAuditEvents(generateMockAuditTrail(documentName));
    setLastActivity(new Date());
  }, [documentName]);

  // Real-time updates simulation
  useEffect(() => {
    // Create a function that will add a new event occasionally
    const addRealTimeEvent = () => {
      const now = new Date();
      const icons = [
        <Eye className="h-4 w-4 text-gray-500" key="eye" />,
        <Check className="h-4 w-4 text-green-500" key="check" />,
        <Users className="h-4 w-4 text-orange-500" key="users" />
      ];
      
      const actions = [
        'Document reviewed',
        'Changes suggested',
        'Compliance check performed',
        'Remediation task updated',
        'Security scan completed',
        'Audit log exported'
      ];
      
      const users = [
        'System', 
        'Compliance Officer', 
        'Legal Advisor', 
        'Developer',
        'Security Analyst',
        'Data Protection Officer'
      ];

      const newEvent: AuditEvent = {
        id: `auto-${Date.now()}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        documentName,
        timestamp: now.toISOString(),
        user: users[Math.floor(Math.random() * users.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        status: Math.random() > 0.5 ? 'completed' : 'in-progress',
        comments: []
      };

      setAuditEvents(prev => [newEvent, ...prev]);
      toast.info(`New activity: ${newEvent.action} by ${newEvent.user}`);
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
    const timer = setTimeout(() => {
      const now = new Date();
      const newEvent: AuditEvent = {
        id: `initial-${Date.now()}`,
        action: 'Real-time monitoring started',
        documentName,
        timestamp: now.toISOString(),
        user: 'System',
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        status: 'completed',
        comments: []
      };

      setAuditEvents(prev => [newEvent, ...prev]);
      toast.info('Real-time audit trail activated');
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [documentName]);

  const updateAuditEvents = (updatedEvents: AuditEvent[]) => {
    setAuditEvents(updatedEvents);
  };

  const addSystemResponse = (eventId: string) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const systemResponse = {
          id: `c${Date.now()}`,
          user: 'System',
          text: 'This comment has been recorded in the audit log and notified to relevant stakeholders.',
          timestamp: new Date().toISOString()
        };
        
        setAuditEvents(current => current.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              comments: event.comments ? [...event.comments, systemResponse] : [systemResponse]
            };
          }
          return event;
        }));
        
        toast.info('System notification added to the audit trail');
      }
    }, 3000);
  };

  return {
    auditEvents,
    updateAuditEvents,
    addSystemResponse,
    setLastActivity
  };
}
