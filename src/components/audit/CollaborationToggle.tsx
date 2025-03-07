
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollaborationToggleProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  commentCount: number;
}

const CollaborationToggle: React.FC<CollaborationToggleProps> = ({
  isExpanded,
  onToggleExpand,
  commentCount
}) => {
  return (
    <div className="mt-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs flex items-center gap-1"
        onClick={onToggleExpand}
      >
        <MessageSquare className="h-3 w-3" />
        {isExpanded ? "Hide comments" : 
         `${commentCount} comment${commentCount !== 1 ? 's' : ''}`}
      </Button>
    </div>
  );
};

export default CollaborationToggle;
