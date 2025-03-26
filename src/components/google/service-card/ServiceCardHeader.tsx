
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface ServiceCardHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string; // Make description optional
  isConnected?: boolean;
  isRealTimeActive?: boolean;
  toggleRealTime?: () => void;
}

const ServiceCardHeader: React.FC<ServiceCardHeaderProps> = ({
  icon,
  title,
  description,
  isConnected = false, // Default value
  isRealTimeActive = false, // Default value
  toggleRealTime = () => {} // Default empty function
}) => {
  return (
    <div className="p-4 pb-0">
      <div className="flex justify-between items-center mb-2">
        <CardTitle className="text-base flex items-center gap-2">
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
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
    </div>
  );
};

export default ServiceCardHeader;
