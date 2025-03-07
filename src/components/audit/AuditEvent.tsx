
import React from 'react';
import { AuditEvent as AuditEventType } from './types';
import EventHeader from './EventHeader';
import CollaborationToggle from './CollaborationToggle';
import CommentSection from './CommentSection';
import StatusUpdateSection from './StatusUpdateSection';

interface AuditEventProps {
  event: AuditEventType;
  isExpanded: boolean;
  newComment: string;
  onToggleExpand: (eventId: string) => void;
  onAddComment: (eventId: string) => void;
  onUpdateStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onCommentChange: (eventId: string, value: string) => void;
  formatTimestamp: (timestamp: string) => string;
}

const AuditEvent: React.FC<AuditEventProps> = ({
  event,
  isExpanded,
  newComment,
  onToggleExpand,
  onAddComment,
  onUpdateStatus,
  onCommentChange,
  formatTimestamp
}) => {
  const handleToggleExpand = () => {
    onToggleExpand(event.id);
  };

  const commentCount = event.comments?.length || 0;
  
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
        {event.icon}
      </div>
      <div className={`bg-gray-50 p-3 rounded border border-gray-100 ${event.id.startsWith('auto-') || event.id.startsWith('status-') ? 'animate-pulse-once' : ''}`}>
        <EventHeader 
          action={event.action}
          status={event.status}
          user={event.user}
          timestamp={event.timestamp}
          formatTimestamp={formatTimestamp}
        />
        
        <CollaborationToggle 
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
          commentCount={commentCount}
        />
        
        {/* Comments and collaboration section */}
        {isExpanded && (
          <div className="mt-3 border-t border-gray-200 pt-2">
            <CommentSection 
              comments={event.comments} 
              newComment={newComment}
              eventId={event.id}
              onAddComment={onAddComment}
              onCommentChange={onCommentChange}
              formatTimestamp={formatTimestamp}
            />
            
            {/* Task status update (only shown for certain types of events) */}
            {event.status && (
              <StatusUpdateSection 
                eventId={event.id} 
                currentStatus={event.status} 
                onUpdateStatus={onUpdateStatus} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditEvent;
