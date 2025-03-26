
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface RealTimeMonitorProps {
  serviceId?: string;
  serviceType?: string;
  isRealTimeActive?: boolean;
  lastUpdated?: Date;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({
  serviceId,
  serviceType,
  isRealTimeActive = false,
  lastUpdated = new Date()
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'safe' | 'warning' | 'danger'>('safe');

  // Simulate real-time monitoring
  useEffect(() => {
    if (!isRealTimeActive) return;
    
    const interval = setInterval(() => {
      // Random progress between 75-100 for demo
      const newProgress = Math.floor(Math.random() * 25) + 75;
      setProgress(newProgress);
      
      // Randomly change status for demo
      const statuses: ('safe' | 'warning' | 'danger')[] = ['safe', 'warning', 'danger'];
      if (Math.random() > 0.8) {
        const randomStatus = statuses[Math.floor(Math.random() * 3)];
        setStatus(randomStatus);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isRealTimeActive]);

  if (!isRealTimeActive) return null;

  return (
    <div className="space-y-2 my-4 border p-2 rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Real-time compliance status</span>
        <span className="text-xs text-gray-500">
          Last checked: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex items-center text-xs">
        {status === 'safe' ? (
          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
        ) : (
          <AlertTriangle className={`h-3 w-3 ${status === 'warning' ? 'text-yellow-500' : 'text-red-500'} mr-1`} />
        )}
        {status === 'safe' 
          ? 'All compliant' 
          : status === 'warning' 
            ? 'Minor issues detected' 
            : 'Critical issues detected'}
      </div>
    </div>
  );
};

export default RealTimeMonitor;
