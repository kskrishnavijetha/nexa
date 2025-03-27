
import { toast } from 'sonner';
import { UserCheck } from 'lucide-react';
import { AuditEvent } from '../types';

interface UseTaskStatusProps {
  auditEvents: AuditEvent[];
  updateAuditEvents: (events: AuditEvent[]) => void;
  documentName: string;
  setLastActivity: (date: Date) => void;
}

export function useTaskStatus({
  auditEvents,
  updateAuditEvents,
  documentName,
  setLastActivity
}: UseTaskStatusProps) {
  const updateTaskStatus = (eventId: string, status: 'pending' | 'in-progress' | 'completed') => {
    const updatedEvents = auditEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, status };
      }
      return event;
    });

    updateAuditEvents(updatedEvents);
    setLastActivity(new Date()); // Update last activity timestamp
    toast.success(`Task status updated to ${status}`);
    
    // Add a new audit event for the status change
    const now = new Date();
    const statusChangeEvent: AuditEvent = {
      id: `status-${Date.now()}`,
      action: `Task status changed to ${status}`,
      documentName,
      timestamp: now.toISOString(),
      user: 'Current User',
      icon: <UserCheck className="h-4 w-4 text-blue-500" />,
      status: 'completed',
      comments: []
    };
    
    updateAuditEvents([statusChangeEvent, ...updatedEvents]);
  };

  return { updateTaskStatus };
}
