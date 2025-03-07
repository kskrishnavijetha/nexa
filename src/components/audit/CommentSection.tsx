
import React from 'react';
import { Button } from '@/components/ui/button';
import { Comment } from './types';

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

export default CommentSection;
