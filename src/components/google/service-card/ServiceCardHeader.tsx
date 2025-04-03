
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardHeaderProps {
  icon: LucideIcon;
  title: string;
  isConnected: boolean;
  isRealTimeActive: boolean;
  toggleRealTime: () => void;
  isCompactView?: boolean;
}

const ServiceCardHeader: React.FC<ServiceCardHeaderProps> = ({
  icon: Icon,
  title,
  isConnected,
  isRealTimeActive,
  toggleRealTime,
  isCompactView = false
}) => {
  return (
    <CardHeader className={isCompactView ? "p-3 pb-1" : "pb-2"}>
      <div className="flex justify-between items-center">
        <CardTitle className={`flex items-center ${isCompactView ? 'text-sm' : 'text-base'}`}>
          <Icon className="h-4 w-4 mr-2" />
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div 
              className="cursor-pointer" 
              onClick={toggleRealTime}
              title={isRealTimeActive ? "Real-time monitoring active" : "Activate real-time monitoring"}
            >
              <RefreshCw className={`h-4 w-4 ${isRealTimeActive ? "text-green-500 animate-spin-slow" : "text-gray-400"}`} />
            </div>
          )}
          <Badge variant={isConnected ? "default" : "outline"} className={`${isConnected ? "bg-green-500" : ""} ${isCompactView ? "text-xs px-1.5 py-0" : ""}`}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};

export default ServiceCardHeader;
