
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import Simulation from '@/components/simulation/Simulation';

interface PredictiveTabProps {
  report: ComplianceReportType;
}

const PredictiveTab: React.FC<PredictiveTabProps> = ({ report }) => {
  if (!report) {
    console.error("PredictiveTab received undefined report");
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          No report data available. Please complete a compliance scan first.
        </p>
      </div>
    );
  }

  console.log("PredictiveTab received report:", report);
  
  return (
    <div className="space-y-6 p-6">
      <Simulation report={report} />
    </div>
  );
};

export default PredictiveTab;
