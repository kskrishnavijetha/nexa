
import React from 'react';
import { ExtendedReport } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { getScoreColor } from '@/utils/reports';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ExecutiveSummaryProps {
  report: ExtendedReport;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ report }) => {
  const { baseReport } = report;
  
  const getComplianceStatus = (score: number) => {
    if (score >= 80) return { status: 'Compliant', icon: <CheckCircle className="text-green-500" /> };
    if (score >= 60) return { status: 'Needs Remediation', icon: <AlertTriangle className="text-amber-500" /> };
    return { status: 'Critical', icon: <AlertOctagon className="text-red-500" /> };
  };
  
  const complianceStatus = getComplianceStatus(baseReport.overallScore);
  const scoreColorClass = getScoreColor(baseReport.overallScore);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Document(s) Scanned</h4>
              <p className="font-medium">{baseReport.documentName}</p>
              {baseReport.originalFileName && baseReport.originalFileName !== baseReport.documentName && (
                <p className="text-xs text-muted-foreground mt-1">Original: {baseReport.originalFileName}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {baseReport.pageCount ? `${baseReport.pageCount} pages` : 'N/A'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Compliance Framework</h4>
              <div className="space-y-1">
                {report.config.complianceTypes.map((type, i) => (
                  <p key={i} className="font-medium">{type}</p>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Industry: {baseReport.industry || 'Not specified'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
              <h4 className="text-sm font-medium text-gray-500 mb-1">AI-Assigned Risk Score</h4>
              <div className="flex items-center">
                <span className={`text-2xl font-bold ${scoreColorClass}`}>
                  {baseReport.overallScore}%
                </span>
              </div>
              <div className="flex items-center mt-auto">
                {complianceStatus.icon}
                <span className="ml-1 font-medium">
                  {complianceStatus.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h4 className="text-base font-medium mb-2">Purpose of Audit</h4>
            <p className="text-sm text-gray-600">
              This compliance audit was conducted to evaluate the document's alignment with
              {report.config.complianceTypes.join(', ')} regulations and standards.
              The assessment identifies potential compliance gaps, security risks, and provides
              actionable remediation steps to achieve and maintain regulatory compliance.
            </p>
            
            <h4 className="text-base font-medium mb-2 mt-4">Key Findings</h4>
            <p className="text-sm text-gray-600">
              {baseReport.risks && baseReport.risks.length > 0 ? (
                <>
                  The compliance analysis identified {baseReport.risks.length} potential issues
                  that require attention. {' '}
                  {baseReport.risks.filter(risk => risk.severity === 'high').length > 0 ? (
                    `${baseReport.risks.filter(risk => risk.severity === 'high').length} high-severity 
                    issues were detected that may present significant compliance risks.`
                  ) : 'No high-severity issues were detected.'}
                </>
              ) : (
                "No compliance issues were detected in the document based on the selected frameworks."
              )}
            </p>
            
            <h4 className="text-base font-medium mb-2 mt-4">Summary</h4>
            <p className="text-sm text-gray-600">
              {baseReport.summary || "No summary available."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
