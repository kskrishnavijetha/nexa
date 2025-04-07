
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RiskSummary from './RiskSummary';
import { useSelectedReport } from './RecentScans';

const BottomSection: React.FC = () => {
  const { selectedReport } = useSelectedReport();

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{selectedReport ? `Risk Summary for ${selectedReport.documentName}` : 'Risk Summary'}</CardTitle>
          <CardDescription>
            {selectedReport 
              ? `Detailed risk analysis for the selected document` 
              : 'Overview of all compliance risks across your documents'}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <RiskSummary />
        </CardContent>
      </Card>
    </div>
  );
};

export default BottomSection;
