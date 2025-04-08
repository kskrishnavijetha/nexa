
import React from 'react';
import { CardTitle } from '@/components/ui/card';

interface HeaderTitleProps {
  complianceScore: number;
  totalEvents: number;
  completedEvents: number;
  integrityVerified: boolean | null;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ 
  complianceScore,
  totalEvents,
  completedEvents,
  integrityVerified
}) => {
  return (
    <CardTitle className="text-xl font-semibold flex items-center gap-3">
      Audit Trail
      {complianceScore !== undefined && (
        <span className={`text-sm px-2 py-0.5 rounded ${
          complianceScore >= 80 
            ? 'bg-green-100 text-green-700' 
            : complianceScore >= 70 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-red-100 text-red-700'
        }`}>
          {complianceScore}%
        </span>
      )}
      {integrityVerified === true && (
        <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
          Verified
        </span>
      )}
    </CardTitle>
  );
};

export default HeaderTitle;
