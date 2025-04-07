
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ScanItemProps {
  scan: ComplianceReport;
  onViewClick: (report: ComplianceReport, tabToNavigate?: string) => void;
  formatDate: (dateString?: string) => string;
}

const ScanItem: React.FC<ScanItemProps> = ({ scan, onViewClick, formatDate }) => {
  return (
    <div 
      className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
      onClick={() => onViewClick(scan)}
    >
      <div>
        <p className="font-medium">{scan.documentName}</p>
        <p className="text-sm text-muted-foreground">{formatDate(scan.timestamp)}</p>
      </div>
      <div className="flex items-center gap-2">
        <div>
          <span className={`font-medium ${
            scan.overallScore >= 90 ? 'text-green-600' : 
            scan.overallScore >= 75 ? 'text-amber-600' : 
            'text-red-600'
          }`}>
            {scan.overallScore}%
          </span>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary h-7"
            onClick={(e) => {
              e.stopPropagation();
              onViewClick(scan);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-800 h-7"
            onClick={(e) => {
              e.stopPropagation();
              onViewClick(scan, 'actions');
            }}
          >
            Actions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanItem;
