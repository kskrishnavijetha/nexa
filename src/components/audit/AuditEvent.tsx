
import React, { useState } from 'react';
import { MessageSquare, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AuditEvent as AuditEventType, Comment } from './types';

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
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
        {event.icon}
      </div>
      <div className={`bg-gray-50 p-3 rounded border border-gray-100 ${event.id.startsWith('auto-') || event.id.startsWith('status-') ? 'animate-pulse-once' : ''}`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{event.action}</span>
              {event.status && <StatusBadge status={event.status} />}
            </div>
            <div className="text-sm text-gray-600 mt-1">{event.user}</div>
          </div>
          <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
        </div>
        
        {/* Collaboration features */}
        <div className="mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => onToggleExpand(event.id)}
          >
            <MessageSquare className="h-3 w-3" />
            {isExpanded ? "Hide comments" : 
             `${event.comments?.length || 0} comment${(event.comments?.length || 0) !== 1 ? 's' : ''}`}
          </Button>
        </div>
        
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

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    'pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'completed': 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface CommentSectionProps {
  comments?: Comment[];
  newComment: string;
  eventId: string;
  onAddComment: (eventId: string) => void;
  onCommentChange: (eventId: string, value: string) => void;
  formatTimestamp: (timestamp: string) => string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  newComment, 
  eventId, 
  onAddComment, 
  onCommentChange,
  formatTimestamp 
}) => {
  return (
    <>
      {comments && comments.length > 0 ? (
        <div className="space-y-2 mb-3">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white p-2 rounded border border-gray-100 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{comment.user}</span>
                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
              </div>
              <p className="mt-1">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-2">No comments yet</p>
      )}
      
      {/* Add comment section */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={newComment}
          onChange={(e) => onCommentChange(eventId, e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddComment(eventId)}
        />
        <Button 
          size="sm" 
          onClick={() => onAddComment(eventId)}
        >
          Add
        </Button>
      </div>
    </>
  );
};

interface StatusUpdateSectionProps {
  eventId: string;
  currentStatus: 'pending' | 'in-progress' | 'completed';
  onUpdateStatus: (eventId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const StatusUpdateSection: React.FC<StatusUpdateSectionProps> = ({ 
  eventId, 
  currentStatus, 
  onUpdateStatus 
}) => {
  return (
    <div className="mt-3 pt-2 border-t border-gray-200">
      <p className="text-xs text-gray-600 mb-1">Update task status:</p>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant={currentStatus === 'pending' ? 'default' : 'outline'}
          className="text-xs"
          onClick={() => onUpdateStatus(eventId, 'pending')}
        >
          Pending
        </Button>
        <Button 
          size="sm" 
          variant={currentStatus === 'in-progress' ? 'default' : 'outline'}
          className="text-xs"
          onClick={() => onUpdateStatus(eventId, 'in-progress')}
        >
          In Progress
        </Button>
        <Button 
          size="sm" 
          variant={currentStatus === 'completed' ? 'default' : 'outline'}
          className="text-xs"
          onClick={() => onUpdateStatus(eventId, 'completed')}
        >
          <UserCheck className="mr-1 h-3 w-3" />
          Completed
        </Button>
      </div>
    </div>
  );
};

export default AuditEvent;
