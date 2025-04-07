
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

// Get the appropriate severity icon based on risk severity
export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'low':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

export default getSeverityIcon;
