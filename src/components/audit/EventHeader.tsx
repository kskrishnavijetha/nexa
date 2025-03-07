
import React from 'react';
import StatusBadge from './StatusBadge';

interface EventHeaderProps {
  action: string;
  status?: 'pending' | 'in-progress' | 'completed';
  user: string;
  timestamp: string;
  formatTimestamp: (timestamp: string) => string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  action,
  status,
  user,
  timestamp,
  formatTimestamp
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{action}</span>
          {status && <StatusBadge status={status} />}
        </div>
        <div className="text-sm text-gray-600 mt-1">{user}</div>
      </div>
      <span className="text-xs text-gray-500">{formatTimestamp(timestamp)}</span>
    </div>
  );
};

export default EventHeader;
