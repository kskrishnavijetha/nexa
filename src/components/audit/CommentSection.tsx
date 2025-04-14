
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComments } from './hooks/useComments';
import { Comment } from './types';
import { formatTimestamp } from './auditUtils';

interface CommentSectionProps {
  eventId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ eventId }) => {
  const [newComment, setNewComment] = useState('');
  const { comments, addComment, isLoadingComments } = useComments(eventId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <h4 className="text-sm font-medium">Comments {comments.length > 0 && `(${comments.length})`}</h4>
      
      <div className="space-y-2 mb-3">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="bg-slate-50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{comment.user}</span>
              <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
          </div>
        ))}
        
        {comments.length === 0 && !isLoadingComments && (
          <p className="text-sm text-gray-500 italic">No comments yet</p>
        )}
        
        {isLoadingComments && (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          className="flex-1 min-h-[60px] p-2 border rounded-md text-sm resize-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="sm"
          onClick={handleAddComment}
          disabled={newComment.trim() === ''}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
