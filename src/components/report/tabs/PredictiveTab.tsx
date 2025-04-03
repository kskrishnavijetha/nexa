
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import Simulation from '@/components/simulation/Simulation';

interface PredictiveTabProps {
  report: ComplianceReportType;
}

const PredictiveTab: React.FC<PredictiveTabProps> = ({ report }) => {
  return (
    <div className="space-y-6 p-6">
      <Simulation report={report} />
    </div>
  );
};

export default PredictiveTab;
