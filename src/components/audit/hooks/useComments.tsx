
import { useState } from 'react';
import { toast } from 'sonner';
import { AuditEvent, Comment } from '../types';

interface UseCommentsProps {
  auditEvents: AuditEvent[];
  updateAuditEvents: (events: AuditEvent[]) => void;
  addSystemResponse: (eventId: string) => void;
  setLastActivity: (date: Date) => void;
}

export function useComments({
  auditEvents,
  updateAuditEvents,
  addSystemResponse,
  setLastActivity
}: UseCommentsProps) {
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

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

    updateAuditEvents(updatedEvents);
    setNewComment({ ...newComment, [eventId]: '' });
    setLastActivity(new Date()); // Update last activity timestamp
    toast.success('Comment added successfully');
    
    // Add a system response after a short delay
    addSystemResponse(eventId);
  };

  const handleCommentChange = (eventId: string, value: string) => {
    setNewComment({ ...newComment, [eventId]: value });
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
    setLastActivity(new Date()); // Update last activity timestamp when user interacts
  };

  return {
    newComment,
    expandedEvent,
    handleAddComment,
    handleCommentChange,
    toggleEventExpansion
  };
}
