import React from 'react';
import { ComplianceRisk } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface RiskAnalysisProps {
  risks: ComplianceRisk[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ risks }) => {
  // Group risks by severity
  const highRisks = risks.filter(risk => risk.severity === 'high');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium');
  const lowRisks = risks.filter(risk => risk.severity === 'low');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const renderRiskGroup = (risksGroup: ComplianceRisk[], title: string) => (
    <div className="mb-4">
      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
        {getSeverityIcon(risksGroup[0]?.severity || '')}
        {title} ({risksGroup.length})
      </h4>
      {risksGroup.length > 0 ? (
        <div className="space-y-3">
          {risksGroup.map((risk, index) => (
            <div 
              key={index} 
              className={`p-4 rounded border-l-4 ${
                risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                'border-green-500 bg-green-50'
              }`}
            >
              <div className="font-medium">{risk.description}</div>
              <p className="text-sm mt-1">
                <span className="font-medium">{risk.regulation}</span>
                {risk.section && ` - ${risk.section}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No {title.toLowerCase()} severity issues found.</p>
      )}
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {renderRiskGroup(highRisks, 'High Severity')}
        {renderRiskGroup(mediumRisks, 'Medium Severity')}
        {renderRiskGroup(lowRisks, 'Low Severity')}
      </CardContent>
    </Card>
  );
};

export default RiskAnalysis;
