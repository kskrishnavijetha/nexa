
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { GoogleService } from './types';

interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);
  
  // Real-time updates simulation
  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      // Set up interval for real-time updates
      const interval = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000); // Update every 10 seconds
      
      setRealtimeTimer(interval);
      
      return () => {
        if (realtimeTimer !== null) {
          window.clearInterval(realtimeTimer);
        }
      };
    } else if (!isRealTimeActive && realtimeTimer !== null) {
      window.clearInterval(realtimeTimer);
      setRealtimeTimer(null);
    }
  }, [isConnected, isRealTimeActive, realtimeTimer]);

  // Auto-activate real-time mode when connected
  useEffect(() => {
    if (isConnected) {
      setIsRealTimeActive(true);
    } else {
      setIsRealTimeActive(false);
    }
  }, [isConnected]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
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
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        {isConnected && isRealTimeActive && (
          <div className="mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Real-time monitoring active
            </div>
            <div className="mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
        
        <Button 
          variant={isConnected ? "outline" : "default"} 
          className="w-full"
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isConnecting || isScanning}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : isConnected ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
