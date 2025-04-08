
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import ComplianceScore from './ComplianceScore';
import IntegrityBadge from './IntegrityBadge';

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
      <ComplianceScore 
        complianceScore={complianceScore} 
        totalEvents={totalEvents}
        completedEvents={completedEvents}
      />
      <IntegrityBadge integrityVerified={integrityVerified} />
    </CardTitle>
  );
};

export default HeaderTitle;
