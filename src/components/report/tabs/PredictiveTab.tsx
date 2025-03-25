
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import PredictiveAnalytics from '@/components/predictive/PredictiveAnalytics';

interface PredictiveTabProps {
  report: ComplianceReportType;
}

const PredictiveTab: React.FC<PredictiveTabProps> = ({ report }) => {
  return (
    <div className="p-6 pt-4">
      <PredictiveAnalytics report={report} />
    </div>
  );
};

export default PredictiveTab;
