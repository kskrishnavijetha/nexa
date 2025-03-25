
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, RefreshCw } from 'lucide-react';

interface GoogleScannerStatusProps {
  connectedServices: string[];
  lastScanTime?: Date;
  itemsScanned?: number;
  violationsFound?: number;
}

const GoogleScannerStatus: React.FC<GoogleScannerStatusProps> = ({
  connectedServices = [],
  lastScanTime,
  itemsScanned = 0,
  violationsFound = 0
}) => {
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update the current time every second when real-time mode is active
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRealTimeActive) {
      interval = window.setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [isRealTimeActive]);
  
  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };
  
  // Format time difference to show how long ago the last scan was
  const getTimeDiff = (): string => {
    if (!lastScanTime) return 'Not yet scanned';
    
    const diff = currentTime.getTime() - lastScanTime.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hours ago`;
    } else {
      return lastScanTime.toLocaleDateString();
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Scanner Status</CardTitle>
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={toggleRealTime}
            title={isRealTimeActive ? "Disable real-time updates" : "Enable real-time updates"}
          >
            <Badge 
              variant={isRealTimeActive ? "default" : "outline"}
              className={isRealTimeActive ? "bg-green-500" : ""}
            >
              {isRealTimeActive ? "Real-time" : "Static"}
            </Badge>
            <RefreshCw className={`h-4 w-4 ${isRealTimeActive ? "text-green-500 animate-spin-slow" : "text-gray-400"}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Services Connected</p>
            <p className="text-2xl font-bold mt-1">{connectedServices.length}/6</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Last Scan</p>
            <div className="flex items-center mt-1">
              {lastScanTime ? (
                <>
                  <Timer className="h-4 w-4 mr-1 text-blue-500" />
                  <p className="text-sm font-medium">{getTimeDiff()}</p>
                </>
              ) : (
                <p className="text-sm font-medium">Not yet scanned</p>
              )}
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Items Scanned</p>
            <p className="text-2xl font-bold mt-1">{itemsScanned}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Violations Found</p>
            <p className={`text-2xl font-bold mt-1 ${violationsFound > 0 ? "text-red-500" : "text-green-500"}`}>
              {violationsFound}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleScannerStatus;
