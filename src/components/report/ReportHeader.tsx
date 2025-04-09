
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { SupportedLanguage } from '@/utils/language';

interface ReportHeaderProps {
  report: ComplianceReportType;
  onBack?: () => void;
  language?: SupportedLanguage;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  report, 
  onBack,
  language = 'en' 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const scoreColorClass = getScoreColor(report.overallScore);
  
  return (
    <div className="bg-card/50 px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-xl font-semibold">{report.documentName}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Overall Score' : 'Puntaje General'}
            </div>
            <div className={`text-xl font-semibold ${scoreColorClass}`}>
              {report.overallScore.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
