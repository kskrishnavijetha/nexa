
import React from 'react';
import { ComplianceReport as ComplianceReportType, RiskSeverity } from '@/utils/apiService';
import { SupportedLanguage, translate } from '@/utils/languageService';

interface IssuesSummaryProps {
  report: ComplianceReportType;
  language?: SupportedLanguage;
}

const IssuesSummary: React.FC<IssuesSummaryProps> = ({ report, language = 'en' }) => {
  const countRisksBySeverity = (severity: RiskSeverity) => {
    return report.risks.filter(risk => risk.severity === severity).length;
  };

  const getRiskLabel = (severity: RiskSeverity): string => {
    switch (severity) {
      case 'high':
        return language === 'en' ? 'High Risk' : 
               language === 'es' ? 'Riesgo Alto' :
               language === 'fr' ? 'Risque Élevé' :
               language === 'de' ? 'Hohes Risiko' : '高风险';
      case 'medium':
        return language === 'en' ? 'Medium Risk' : 
               language === 'es' ? 'Riesgo Medio' :
               language === 'fr' ? 'Risque Moyen' :
               language === 'de' ? 'Mittleres Risiko' : '中等风险';
      case 'low':
        return language === 'en' ? 'Low Risk' : 
               language === 'es' ? 'Riesgo Bajo' :
               language === 'fr' ? 'Risque Faible' :
               language === 'de' ? 'Niedriges Risiko' : '低风险';
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{translate('compliance_issues', language)}</h3>
      <div className="flex space-x-3">
        <div className="flex-1 p-3 rounded-lg bg-red-50 border border-red-100">
          <p className="text-center text-2xl font-bold text-red-600">
            {countRisksBySeverity('high')}
          </p>
          <p className="text-center text-sm text-red-600">{getRiskLabel('high')}</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-center text-2xl font-bold text-amber-600">
            {countRisksBySeverity('medium')}
          </p>
          <p className="text-center text-sm text-amber-600">{getRiskLabel('medium')}</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-green-50 border border-green-100">
          <p className="text-center text-2xl font-bold text-green-600">
            {countRisksBySeverity('low')}
          </p>
          <p className="text-center text-sm text-green-600">{getRiskLabel('low')}</p>
        </div>
      </div>
    </div>
  );
};

export default IssuesSummary;
