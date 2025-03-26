
import React, { useState } from 'react';
import { useRealTimeScan } from '@/contexts/RealTimeScanContext';
import { Badge } from '@/components/ui/badge';
import { Timer, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const ScanStatusIndicator: React.FC = () => {
  const { globalScanStats, recentViolations } = useRealTimeScan();
  const [open, setOpen] = useState(false);

  const formatTimeDiff = (lastScanTime?: Date): string => {
    if (!lastScanTime) return 'Not scanned';
    
    const diff = new Date().getTime() - lastScanTime.getTime();
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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (globalScanStats.itemsScanned === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative mr-1 h-8 flex items-center gap-2 bg-muted/30"
        >
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span>Scanned: {globalScanStats.itemsScanned}</span>
          {globalScanStats.violationsFound > 0 && (
            <Badge 
              variant="destructive" 
              className="h-5 min-w-5 flex items-center justify-center rounded-full p-0 px-[5px]"
            >
              {globalScanStats.violationsFound}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 pb-2 border-b">
          <h3 className="font-medium">Scan Status</h3>
          <div className="text-sm text-muted-foreground">
            <div className="mt-1">
              <span className="font-medium">Last scan:</span> {formatTimeDiff(globalScanStats.lastScanTime)}
            </div>
            <div className="mt-1">
              <span className="font-medium">Items scanned:</span> {globalScanStats.itemsScanned}
            </div>
            <div className="mt-1">
              <span className="font-medium">Violations found:</span> {globalScanStats.violationsFound}
            </div>
          </div>
        </div>
        
        {recentViolations.length > 0 && (
          <div className="p-2">
            <h4 className="text-sm font-medium ml-2 mb-1">Recent Violations</h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 p-2">
                {recentViolations.map((violation, index) => (
                  <div key={index} className="p-2 text-xs rounded-md border">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{violation.title}</div>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity}
                      </Badge>
                    </div>
                    <div className="mt-1 text-muted-foreground">{violation.service}</div>
                    <div className="mt-1 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{violation.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ScanStatusIndicator;
