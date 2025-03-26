
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/types';
import ReportHeader from './report/ReportHeader';
import ReportTabs from './report/ReportTabs';
import useLanguagePreference from '@/hooks/useLanguagePreference';

interface ComplianceReportProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ComplianceReportComponent: React.FC<ComplianceReportProps> = ({ report, onClose }) => {
  const { language, setLanguage } = useLanguagePreference();
  
  // Convert from utils/types.ComplianceReport to utils/apiService.ComplianceReport if needed
  const formattedReport = {
    ...report,
    // Add any missing fields that might be expected by the report components
    id: report.id || String(report.documentId),
    documentId: String(report.documentId),
    timestamp: report.timestamp,
    overallScore: report.overallScore,
    gdprScore: report.gdprScore,
    hipaaScore: report.hipaaScore,
    soc2Score: report.soc2Score,
    risks: report.risks.map(risk => ({
      ...risk,
      id: risk.id,
      description: risk.description,
      severity: risk.severity,
      regulation: risk.regulation
    })),
    summary: report.summary,
    documentName: report.documentName,
    // Add any other fields needed by ReportTabs or ReportHeader
    suggestions: [],
    regionalScores: {}
  };

  return (
    <div className="animate-fade-up bg-background rounded-xl border shadow-soft overflow-hidden max-w-3xl w-full mx-auto">
      <ReportHeader 
        report={formattedReport} 
        language={language} 
        onBack={onClose}
      />
      <ReportTabs 
        report={formattedReport} 
        onClose={onClose} 
        language={language} 
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default ComplianceReportComponent;
