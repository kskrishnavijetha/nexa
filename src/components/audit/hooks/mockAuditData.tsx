
import { AuditEvent, Comment } from '../types';
import { generateMockAuditTrail } from '../auditUtils';

// In-memory storage for audit events
const auditEventsStorage = new Map<string, AuditEvent[]>();

// Get or generate audit events for a specific document
export const getAuditEventsForDocument = async (documentName: string): Promise<AuditEvent[]> => {
  // Check if we already have events for this document
  if (!auditEventsStorage.has(documentName)) {
    // Generate mock audit events
    const mockEvents = generateMockAuditTrail(documentName);
    auditEventsStorage.set(documentName, mockEvents);
  }
  
  return auditEventsStorage.get(documentName) || [];
};

// Update audit events for a specific document
export const updateAuditEvents = (documentName: string, events: AuditEvent[]) => {
  auditEventsStorage.set(documentName, events);
};

// Mock comments for audit events
const commentsStorage = new Map<string, Comment[]>();

export const getCommentsForEvent = (eventId: string): Comment[] => {
  if (!commentsStorage.has(eventId)) {
    const mockComments: Comment[] = [];
    
    // For demo purposes, add a comment to the first event
    if (eventId === '1') {
      mockComments.push({
        id: 'comment-1',
        user: 'Compliance Officer',
        text: 'Document uploaded successfully and validation passed.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Add comment to the third event
    if (eventId === '3') {
      mockComments.push({
        id: 'comment-2',
        user: 'Risk Manager',
        text: 'Report looks good. Please schedule a review meeting.',
        timestamp: new Date().toISOString()
      });
    }
    
    commentsStorage.set(eventId, mockComments);
  }
  
  return commentsStorage.get(eventId) || [];
};

export const addCommentToEvent = (eventId: string, comment: Comment): void => {
  const currentComments = commentsStorage.get(eventId) || [];
  commentsStorage.set(eventId, [...currentComments, comment]);
};

export const getAllEvents = (): AuditEvent[] => {
  let allEvents: AuditEvent[] = [];
  
  auditEventsStorage.forEach((events) => {
    allEvents = [...allEvents, ...events];
  });
  
  return allEvents;
};
