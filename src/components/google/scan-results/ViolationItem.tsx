
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { ScanViolation } from '../types';

interface ViolationItemProps {
  violation: ScanViolation;
}

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />;
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />;
  }
};

export const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'border-purple-200 bg-purple-100 text-purple-800';
    case 'high':
      return 'border-red-200 bg-red-100 text-red-800';
    case 'medium':
      return 'border-amber-200 bg-amber-100 text-amber-800';
    default:
      return 'border-blue-200 bg-blue-100 text-blue-800';
  }
};

const ViolationItem: React.FC<ViolationItemProps> = ({ violation }) => {
  return (
    <div className="flex items-start p-3 rounded-md bg-muted/50">
      {getSeverityIcon(violation.severity)}
      <div>
        <h4 className="font-medium">
          {violation.title}
          <Badge 
            variant="outline" 
            className={`ml-2 ${getSeverityBadgeClass(violation.severity)}`}
          >
            {violation.severity}
          </Badge>
        </h4>
        <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-2">
            {violation.service}
          </Badge>
          <span>{violation.location}</span>
          {violation.industry && (
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              {violation.industry}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationItem;
