
import React from 'react';
import { ComplianceReport, ComplianceRisk, RiskSeverity } from '@/utils/types';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComplianceRisksTabProps {
  report: ComplianceReport;
  onClose?: () => void;
  language?: string;
}

const ComplianceRisksTab: React.FC<ComplianceRisksTabProps> = ({ report }) => {
  // Mock risks data - in a real app, this would come from the API or report
  const mockRisks: ComplianceRisk[] = [
    {
      id: '1',
      title: 'Insufficient Data Protection Measures',
      description: 'The document contains personally identifiable information (PII) without proper encryption or access controls.',
      severity: 'high' as RiskSeverity,
      regulation: 'GDPR Article 32',
      section: 'Section 3.4',
      remediationSteps: 'Implement encryption for all stored PII and restrict access based on job responsibilities.'
    },
    {
      id: '2',
      title: 'Missing Consent Mechanism',
      description: 'No clear user consent mechanism defined for data collection purposes.',
      severity: 'medium' as RiskSeverity,
      regulation: 'GDPR Article 7',
      section: 'Section 2.1',
      remediationSteps: 'Add explicit consent collection process before gathering any user data.'
    },
    {
      id: '3',
      title: 'Incomplete Data Retention Policy',
      description: 'The document lacks specific timeframes for data retention and deletion procedures.',
      severity: 'low' as RiskSeverity,
      regulation: 'CCPA Section 1798.105',
      section: 'Section 5.2',
      remediationSteps: 'Define clear data retention periods and automated deletion processes.'
    }
  ];

  const getSeverityIcon = (severity: RiskSeverity) => {
    if (severity === 'high') {
      return <AlertOctagon className="h-5 w-5 text-destructive mr-2" />;
    } else if (severity === 'medium') {
      return <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />;
    }
  };

  const getSeverityClass = (severity: RiskSeverity) => {
    if (severity === 'high') {
      return 'bg-destructive/10 border-destructive/20';
    } else if (severity === 'medium') {
      return 'bg-amber-500/10 border-amber-500/20';
    } else {
      return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Compliance Risks</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These risks were identified based on your document and selected compliance frameworks.
        </p>
      </div>

      {mockRisks.length > 0 ? (
        <div className="space-y-4">
          {mockRisks.map((risk) => (
            <Card key={risk.id} className={`border ${getSeverityClass(risk.severity)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  {getSeverityIcon(risk.severity)}
                  <div>
                    <h4 className="font-medium">{risk.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="font-medium">Regulation</p>
                        <p className="text-muted-foreground">{risk.regulation}</p>
                      </div>
                      <div>
                        <p className="font-medium">Document Section</p>
                        <p className="text-muted-foreground">{risk.section}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="font-medium text-sm">Recommended Action</p>
                      <p className="text-sm text-muted-foreground">{risk.remediationSteps}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p>No compliance risks detected.</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceRisksTab;
