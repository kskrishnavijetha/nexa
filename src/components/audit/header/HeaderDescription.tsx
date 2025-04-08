
import React from 'react';
import { CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Industry } from '@/utils/types';

interface HeaderDescriptionProps {
  documentName: string;
  industry?: Industry;
  eventCount: number;
}

const HeaderDescription: React.FC<HeaderDescriptionProps> = ({ 
  documentName, 
  industry,
  eventCount 
}) => {
  return (
    <CardDescription className="flex items-center mt-1">
      Compliance tracking for {documentName}
      {industry && <span className="ml-1 text-blue-600">({industry})</span>}
      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
        {eventCount} events
      </Badge>
    </CardDescription>
  );
};

export default HeaderDescription;
