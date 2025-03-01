
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ComplianceReport as ComplianceReportType,
  RiskItem,
  RiskSeverity,
  generateReportPDF
} from '@/utils/apiService';
import { toast } from 'sonner';
import { 
  Download,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface ComplianceReportProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ComplianceReport: React.FC<ComplianceReportProps> = ({ report, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await generateReportPDF(report);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Report downloaded successfully');
        // In a real app, this would trigger the download
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

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

  const countRisksBySeverity = (severity: RiskSeverity) => {
    return report.risks.filter(risk => risk.severity === severity).length;
  };

  const renderRisks = (regulation: 'GDPR' | 'HIPAA' | 'SOC2') => {
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
    <div className="animate-fade-up bg-background rounded-xl border shadow-soft overflow-hidden max-w-3xl w-full mx-auto">
      <div className="p-6 border-b bg-muted/30">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{report.documentName}</h2>
            <p className="text-muted-foreground">
              Analyzed on {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1 transition-colors">
              <span className={getScoreColor(report.overallScore)}>
                {report.overallScore}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex mb-6 gap-4">
          <Button 
            onClick={handleGeneratePDF} 
            className="flex-1"
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <span className="flex items-center">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <span className="ml-2">Generating...</span>
              </span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Full Report
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Analyze Another Document
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.gdprScore)}`}>
              {report.gdprScore}%
            </div>
            <p className="text-sm">GDPR</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.hipaaScore)}`}>
              {report.hipaaScore}%
            </div>
            <p className="text-sm">HIPAA</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(report.soc2Score)}`}>
              {report.soc2Score}%
            </div>
            <p className="text-sm">SOC 2</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Issues Summary</h3>
          <div className="flex space-x-3">
            <div className="flex-1 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-center text-2xl font-bold text-red-600">
                {countRisksBySeverity('high')}
              </p>
              <p className="text-center text-sm text-red-600">High Risk</p>
            </div>
            <div className="flex-1 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-center text-2xl font-bold text-amber-600">
                {countRisksBySeverity('medium')}
              </p>
              <p className="text-center text-sm text-amber-600">Medium Risk</p>
            </div>
            <div className="flex-1 p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="text-center text-2xl font-bold text-green-600">
                {countRisksBySeverity('low')}
              </p>
              <p className="text-center text-sm text-green-600">Low Risk</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-muted-foreground">{report.summary}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="flex items-center mb-3 text-blue-600">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">GDPR Compliance</h3>
            </div>
            {renderRisks('GDPR')}
          </div>
          
          <div>
            <div className="flex items-center mb-3 text-purple-600">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">HIPAA Compliance</h3>
            </div>
            {renderRisks('HIPAA')}
          </div>
          
          <div>
            <div className="flex items-center mb-3 text-emerald-600">
              <ShieldCheck className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">SOC 2 Compliance</h3>
            </div>
            {renderRisks('SOC2')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReport;
