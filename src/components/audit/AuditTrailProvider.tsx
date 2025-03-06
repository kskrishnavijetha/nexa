import React, { createContext, useState, useEffect, useContext } from 'react';
import { Clock, Eye, Check, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { generateMockAuditTrail } from './auditUtils';
import { AuditEvent as AuditEventType, Comment } from './types';

interface AuditTrailContextType {
  auditEvents: AuditEventType[];
  newComment: { [key: string]: string };
  expandedEvent: string | null;
  handleAddComment: (eventId: string) => void;
  handleCommentChange: (eventId: string, value: string) => void;
  toggleEventExpansion: (eventId: string) => void;
  updateTaskStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (!context) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};

interface AuditTrailProviderProps {
  children: React.ReactNode;
  documentName: string;
}

export const AuditTrailProvider: React.FC<AuditTrailProviderProps> = ({ children, documentName }) => {
  const [auditEvents, setAuditEvents] = useState<AuditEventType[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Initialize auditEvents
  useEffect(() => {
    setAuditEvents(generateMockAuditTrail(documentName));
    setLastActivity(new Date());
  }, [documentName]);

  // Real-time updates simulation - enhanced for more frequent updates
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

      const newEvent: AuditEventType = {
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

    // Set up interval for real-time updates - more frequent updates (5-15 seconds)
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
      const newEvent: AuditEventType = {
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

  const handleAddComment = (eventId: string) => {
    if (!newComment[eventId] || newComment[eventId].trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        const newCommentObj: Comment = {
          id: `c${Date.now()}`,
          user: 'Current User',
          text: newComment[eventId],
          timestamp: new Date().toISOString()
        };

        return {
          ...event,
          comments: event.comments ? [...event.comments, newCommentObj] : [newCommentObj]
        };
      }
      return event;
    });

    setAuditEvents(updatedEvents);
    setNewComment({ ...newComment, [eventId]: '' });
    setLastActivity(new Date()); // Update last activity timestamp
    toast.success('Comment added successfully');
    
    // Add a system response after a short delay
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const systemResponse: Comment = {
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

  const updateTaskStatus = (eventId: string, status: 'pending' | 'in-progress' | 'completed') => {
    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, status };
      }
      return event;
    });

    setAuditEvents(updatedEvents);
    setLastActivity(new Date()); // Update last activity timestamp
    toast.success(`Task status updated to ${status}`);
    
    // Add a new audit event for the status change
    const now = new Date();
    const statusChangeEvent: AuditEventType = {
      id: `status-${Date.now()}`,
      action: `Task status changed to ${status}`,
      documentName,
      timestamp: now.toISOString(),
      user: 'Current User',
      icon: <UserCheck className="h-4 w-4 text-blue-500" />,
      status: 'completed',
    };
    
    setAuditEvents(prev => [statusChangeEvent, ...prev]);
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
    setLastActivity(new Date()); // Update last activity timestamp when user interacts
  };

  const handleCommentChange = (eventId: string, value: string) => {
    setNewComment({ ...newComment, [eventId]: value });
  };

  const contextValue: AuditTrailContextType = {
    auditEvents,
    newComment,
    expandedEvent,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion,
    updateTaskStatus
  };

  return (
    <AuditTrailContext.Provider value={contextValue}>
      {children}
    </AuditTrailContext.Provider>
  );
};
