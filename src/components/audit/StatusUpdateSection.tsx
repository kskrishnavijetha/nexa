
import React from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default StatusUpdateSection;
