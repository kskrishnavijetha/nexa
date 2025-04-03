import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileSearch, AlertTriangle } from 'lucide-react';

interface ScanStatsProps {
  lastScanTime?: Date;
  itemsScanned?: number;
  violationsFound?: number;
}

const ScanStats: React.FC<ScanStatsProps> = ({
  lastScanTime,
  itemsScanned = 0,
  violationsFound = 0
}) => {
  // Format the last scan time
  const formatLastScanTime = () => {
    if (!lastScanTime) return 'Never';
    
    // For time within today, show hours and minutes
    const today = new Date();
    const scanDate = new Date(lastScanTime);
    
    if (today.toDateString() === scanDate.toDateString()) {
      return scanDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return scanDate.toLocaleDateString();
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Scan Statistics</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center p-3 bg-background rounded-md">
            <Clock className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Last Scan</p>
              <p className="text-sm font-medium">{formatLastScanTime()}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-background rounded-md">
            <FileSearch className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Items Scanned</p>
              <p className="text-sm font-medium">{itemsScanned}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-background rounded-md">
            <AlertTriangle className={`h-5 w-5 mr-3 ${violationsFound > 0 ? 'text-red-500' : 'text-green-500'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Violations Found</p>
              <div className="flex items-center">
                <p className="text-sm font-medium mr-2">{violationsFound}</p>
                {violationsFound > 0 ? (
                  <Badge variant="destructive" className="text-xs">
                    Action Needed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Compliant
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanStats;
