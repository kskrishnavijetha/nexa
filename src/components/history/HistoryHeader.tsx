
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface HistoryHeaderProps {
  realTimeEnabled: boolean;
  toggleRealTime: () => void;
  lastUpdated: Date;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ 
  realTimeEnabled, 
  toggleRealTime, 
  lastUpdated 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Compliance History</h1>
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleRealTime}
        title={realTimeEnabled ? "Disable real-time updates" : "Enable real-time updates"}
      >
        <Badge 
          variant={realTimeEnabled ? "default" : "outline"}
          className={realTimeEnabled ? "bg-green-500" : ""}
        >
          {realTimeEnabled ? "Real-time" : "Static"}
        </Badge>
        <Clock className={`h-4 w-4 ${realTimeEnabled ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
        <span className="text-sm text-muted-foreground">
          {realTimeEnabled ? `Updated: ${lastUpdated.toLocaleTimeString()}` : "Updates paused"}
        </span>
      </div>
    </div>
  );
};

export default HistoryHeader;
