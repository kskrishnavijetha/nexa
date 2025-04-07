
import React from 'react';
import { RiskPieChart } from './index';
import RisksTable from './RisksTable';
import { RiskCount } from './types';
import { ComplianceRisk } from '@/utils/types';

interface OverallRiskViewProps {
  riskData: RiskCount[];
  risks: ComplianceRisk[];
}

const OverallRiskView: React.FC<OverallRiskViewProps> = ({
  riskData,
  risks
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 text-sm font-medium text-center">
        Overall Risk Distribution
      </div>
      <div className="flex-1">
        <RiskPieChart 
          riskData={riskData} 
          showLabels={true}
          innerRadius={55}
          outerRadius={80}
        />
      </div>

      {risks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Top Risks:</h4>
          <RisksTable risks={risks} />
        </div>
      )}
    </div>
  );
};

export default OverallRiskView;
