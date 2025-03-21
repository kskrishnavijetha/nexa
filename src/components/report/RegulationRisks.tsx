import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ComplianceReport as ComplianceReportType, RiskSeverity } from '@/utils/types';
import { SupportedLanguage, translate } from '@/utils/language';

interface RegulationRisksProps {
  report: ComplianceReportType;
  regulation: 'GDPR' | 'HIPAA' | 'SOC2';
  title: string;
  colorClass: string;
  language?: SupportedLanguage;
}

const RegulationRisks: React.FC<RegulationRisksProps> = ({ 
  report, 
  regulation, 
  title,
  colorClass,
  language = 'en'
}) => {
  const getSeverityLabel = (severity: RiskSeverity): string => {
    switch (severity) {
      case 'high':
        return language === 'en' ? 'High' : 
               language === 'es' ? 'Alto' :
               language === 'fr' ? 'Élevé' :
               language === 'de' ? 'Hoch' : '高';
      case 'medium':
        return language === 'en' ? 'Medium' : 
               language === 'es' ? 'Medio' :
               language === 'fr' ? 'Moyen' :
               language === 'de' ? 'Mittel' : '中';
      case 'low':
        return language === 'en' ? 'Low' : 
               language === 'es' ? 'Bajo' :
               language === 'fr' ? 'Faible' :
               language === 'de' ? 'Niedrig' : '低';
    }
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (severity) {
      case 'high':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {getSeverityLabel(severity)}
          </span>
        );
      case 'medium':
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {getSeverityLabel(severity)}
          </span>
        );
      case 'low':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {getSeverityLabel(severity)}
          </span>
        );
    }
  };

  const getNoIssuesText = (): string => {
    switch (language) {
      case 'es': return 'No se encontraron problemas';
      case 'fr': return 'Aucun problème trouvé';
      case 'de': return 'Keine Probleme gefunden';
      case 'zh': return '未发现问题';
      default: return 'No issues found';
    }
  };

  const getReferenceText = (): string => {
    switch (language) {
      case 'es': return 'Referencia';
      case 'fr': return 'Référence';
      case 'de': return 'Referenz';
      case 'zh': return '参考';
      default: return 'Reference';
    }
  };

  const renderRisks = () => {
    const filteredRisks = report.risks.filter(risk => risk.regulation === regulation);
    
    if (filteredRisks.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          {getNoIssuesText()}
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
                {getReferenceText()}: {risk.section}
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
