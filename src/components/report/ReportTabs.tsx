
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComplianceDetailsTab from './ComplianceDetailsTab';
import ComplianceRisksTab from './ComplianceRisksTab';
import ComplianceRecommendationsTab from './ComplianceRecommendationsTab';
import MultiFrameworkScoresTab from './MultiFrameworkScoresTab';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface ReportTabsProps {
  report: ComplianceReport;
  onClose: () => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({
  report,
  onClose,
  language,
  setLanguage,
}) => {
  // Check if this is a multi-framework report
  const isMultiFramework = report.isMultiFramework && 
    report.selectedFrameworks && 
    report.selectedFrameworks.length > 1;

  return (
    <Tabs defaultValue={isMultiFramework ? "frameworks" : "details"} className="p-6">
      <TabsList className="grid grid-cols-4 mb-8">
        {isMultiFramework && (
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
        )}
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      {isMultiFramework && (
        <TabsContent value="frameworks">
          <MultiFrameworkScoresTab report={report} />
        </TabsContent>
      )}

      <TabsContent value="details">
        <ComplianceDetailsTab 
          report={report}
          onClose={onClose}
          language={language}
        />
      </TabsContent>

      <TabsContent value="risks">
        <ComplianceRisksTab 
          report={report}
          language={language}
        />
      </TabsContent>

      <TabsContent value="recommendations">
        <ComplianceRecommendationsTab 
          report={report}
          language={language}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
