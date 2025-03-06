
import React from 'react';
import { Clock } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const AuditTrailHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        Smart Audit Trail & Collaboration
        <span className="ml-2 text-xs font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse">Live</span>
      </CardTitle>
    </CardHeader>
  );
};

export default AuditTrailHeader;
