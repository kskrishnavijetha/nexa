
import React from 'react';

interface RealTimeMonitorProps {
  isActive: boolean;
  lastUpdated: Date;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ isActive, lastUpdated }) => {
  if (!isActive) return null;
  
  return (
    <div className="mb-4 text-xs text-muted-foreground">
      <div className="flex items-center">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
        Real-time monitoring active
      </div>
      <div className="mt-1">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default RealTimeMonitor;
