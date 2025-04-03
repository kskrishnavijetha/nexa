
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Wifi } from 'lucide-react';

interface RealTimeMonitorProps {
  isActive: boolean;
  lastUpdated: Date;
  isCompactView?: boolean;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ 
  isActive, 
  lastUpdated,
  isCompactView = false
}) => {
  if (!isActive) return null;

  const lastUpdatedText = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <div className={`flex items-center text-sm text-muted-foreground ${isCompactView ? 'text-xs mb-2' : 'mb-4'}`}>
      <Wifi className={`${isCompactView ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-green-500`} />
      {isCompactView ? (
        <span>Updated {lastUpdatedText}</span>
      ) : (
        <span>Real-time monitoring active • Last updated {lastUpdatedText}</span>
      )}
    </div>
  );
};

export default RealTimeMonitor;
