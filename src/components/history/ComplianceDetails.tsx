
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Report Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a document to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{report.documentName}</span>
          <span className={
            report.overallScore >= 80 ? 'text-green-500' : 
            report.overallScore >= 70 ? 'text-amber-500' : 
            'text-red-500'
          }>
            {report.overallScore}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{report.summary}</p>
        <ComplianceScoreCards 
          gdprScore={report.gdprScore}
          hipaaScore={report.hipaaScore}
          soc2Score={report.soc2Score}
        />
        <RiskAnalysis risks={report.risks} />
      </CardContent>
    </Card>
  );
};

export default ComplianceDetails;
