
import React from 'react';
import { RiskPieChart } from './index';
import RiskCategoryList from './RiskCategoryList';
import RisksTable from './RisksTable';
import { RiskCount, RiskCategory } from './types';
import { ComplianceRisk, ComplianceReport } from '@/utils/types';

interface SpecificReportViewProps {
  selectedReport: ComplianceReport;
  riskData: RiskCount[];
  categoryData: RiskCategory[];
  risks: ComplianceRisk[];
}

const SpecificReportView: React.FC<SpecificReportViewProps> = ({
  selectedReport,
  riskData,
  categoryData,
  risks
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 text-sm font-medium">
        Risk Summary for: {selectedReport.documentName}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="h-[170px]">
            <RiskPieChart riskData={riskData} />
          </div>
          <RiskCategoryList categoryData={categoryData} />
        </div>
        
        <div className="overflow-hidden">
          <RisksTable 
            risks={risks} 
            selectedReport={selectedReport}
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificReportView;
