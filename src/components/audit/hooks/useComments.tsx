
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Comment } from '../types';
import { getCommentsForEvent, addCommentToEvent } from './mockAuditData';

export function useComments(eventId: string) {
  const [comments, setComments] = useState<Comment[]>(() => getCommentsForEvent(eventId));
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const fetchComments = useCallback(() => {
    setIsLoadingComments(true);
    // Simulate API call with a small delay
    setTimeout(() => {
      const updatedComments = getCommentsForEvent(eventId);
      setComments(updatedComments);
      setIsLoadingComments(false);
    }, 300);
  }, [eventId]);

  const addComment = useCallback((text: string, user: string = 'Current User') => {
    if (!text.trim()) {
      return;
    }
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user,
      text,
      timestamp: new Date().toISOString()
    };
    
    addCommentToEvent(eventId, newComment);
    fetchComments();
    toast.success('Comment added successfully');
  }, [eventId, fetchComments]);

  return {
    comments,
    addComment,
    isLoadingComments,
    fetchComments
  };
}
