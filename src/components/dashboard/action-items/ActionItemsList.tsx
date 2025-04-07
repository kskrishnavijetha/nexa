
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionItemCard from './ActionItemCard';
import EmptyActionItems from './EmptyActionItems';
import { ActionItem } from './types';

interface ActionItemsListProps {
  actionItems: ActionItem[];
  onResolve: (id: string) => void;
  onViewAll: () => void;
}

const ActionItemsList: React.FC<ActionItemsListProps> = ({ 
  actionItems, 
  onResolve,
  onViewAll 
}) => {
  if (actionItems.length === 0) {
    return <EmptyActionItems />;
  }

  return (
    <div className="space-y-4">
      {actionItems.map((item) => (
        <ActionItemCard key={item.id} item={item} onResolve={onResolve} />
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full flex items-center justify-center"
        onClick={onViewAll}
      >
        <span>View All Action Items</span>
        <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};

export default ActionItemsList;
