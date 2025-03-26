
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface ServiceCardHeaderProps {
  icon: React.ReactNode;
  title: string;
  isConnected: boolean;
  isRealTimeActive: boolean;
  toggleRealTime: () => void;
}

const ServiceCardHeader: React.FC<ServiceCardHeaderProps> = ({
  icon,
  title,
  isConnected,
  isRealTimeActive,
  toggleRealTime
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-base flex items-center">
        {icon}
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
        <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-500" : ""}>
          {isConnected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>
    </div>
  );
};

export default ServiceCardHeader;
