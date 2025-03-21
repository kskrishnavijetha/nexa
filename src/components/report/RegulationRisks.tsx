
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ComplianceReport as ComplianceReportType, RiskSeverity } from '@/utils/apiService';

interface RegulationRisksProps {
  report: ComplianceReportType;
  regulation: 'GDPR' | 'HIPAA' | 'SOC2';
  title: string;
  colorClass: string;
}

const RegulationRisks: React.FC<RegulationRisksProps> = ({ 
  report, 
  regulation, 
  title,
  colorClass
}) => {
  const getSeverityBadge = (severity: RiskSeverity) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (severity) {
      case 'high':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Low
          </span>
        );
    }
  };

  const renderRisks = () => {
    const filteredRisks = report.risks.filter(risk => risk.regulation === regulation);
    
    if (filteredRisks.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No issues found
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {filteredRisks.map((risk, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg border bg-card/50"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium">{risk.description}</p>
              {getSeverityBadge(risk.severity)}
            </div>
            {risk.section && (
              <p className="text-xs text-muted-foreground mt-1">
                Reference: {risk.section}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className={`flex items-center mb-3 ${colorClass}`}>
        <ShieldCheck className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {renderRisks()}
    </div>
  );
};

export default RegulationRisks;
