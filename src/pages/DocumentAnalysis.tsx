import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentUploader from '@/components/document-uploader/DocumentUploader';
import { Button } from '@/components/ui/button';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import { ArrowLeft, Download, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';
import ComplianceCharts from '@/components/ComplianceCharts';
import RiskAnalysis from '@/components/RiskAnalysis';
import AuditTrail from '@/components/AuditTrail';
import Simulation from '@/components/simulation/Simulation';

const DocumentAnalysis = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const navigate = useNavigate();

  const handleReportGenerated = (reportData: ComplianceReport) => {
    setReport(reportData);
  };

  const handleDownloadReport = async () => {
    if (!report) return;
    
    try {
      setIsGeneratingPDF(true);
      
      const response = await generateReportPDF(report);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data) {
        const blobUrl = URL.createObjectURL(response.data);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `compliance-report-${report.documentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        
        toast.success('PDF report downloaded successfully');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Document Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload a document to analyze compliance with various industry regulations
          </p>
        </div>
        
        {!report ? (
          <DocumentUploader onReportGenerated={handleReportGenerated} />
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">{report.documentName}</h2>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={handleDownloadReport}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download PDF Report
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mb-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
                {report.industry && (
                  <div className="bg-slate-100 p-3 rounded">
                    <h3 className="font-medium text-slate-700">Industry: {report.industry}</h3>
                    {report.regulations && report.regulations.length > 0 && (
                      <p className="text-sm text-slate-600 mt-1">
                        Applicable Regulations: {report.regulations.join(', ')}
                      </p>
                    )}
                  </div>
                )}
                
                {report.region && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h3 className="font-medium text-blue-700 flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      Region: {report.region}
                    </h3>
                    {report.regionalRegulations && Object.keys(report.regionalRegulations).length > 0 && (
                      <p className="text-sm text-blue-600 mt-1">
                        Regional Frameworks: {Object.entries(report.regionalRegulations)
                          .map(([key, value]) => `${key} (${String(value)})`)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold text-slate-900">{report.overallScore}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm text-muted-foreground">GDPR</p>
                  <p className="text-2xl font-bold text-slate-900">{report.gdprScore}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm text-muted-foreground">HIPAA</p>
                  <p className="text-2xl font-bold text-slate-900">{report.hipaaScore}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded">
                  <p className="text-sm text-muted-foreground">SOC 2</p>
                  <p className="text-2xl font-bold text-slate-900">{report.soc2Score}%</p>
                </div>
              </div>
              
              {report.regionScores && Object.keys(report.regionScores).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Regional Compliance Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(report.regionScores).map(([regulation, score]) => (
                      <div key={regulation} className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-blue-700">{regulation}</p>
                        <p className="text-2xl font-bold text-blue-900">{score}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <ComplianceCharts report={report} />
              
              <RiskAnalysis risks={report.risks} />
              
              <div className="mb-6">
                <Simulation report={report} />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Summary</h3>
                <p className="text-slate-700">{report.summary}</p>
              </div>
              
              {report.suggestions && report.suggestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {report.suggestions.map((suggestion, index) => (
                      <li key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <AuditTrail documentName={report.documentName} />
            </div>
            
            <div className="mt-8 text-center">
              <Button onClick={() => setReport(null)}>Analyze Another Document</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
