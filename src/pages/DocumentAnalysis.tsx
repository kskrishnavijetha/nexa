import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentUploader from '@/components/DocumentUploader';
import { Button } from '@/components/ui/button';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

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
      
      // Generate PDF report
      const response = await generateReportPDF(report);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data) {
        // Create a blob URL for the PDF
        const blobUrl = URL.createObjectURL(response.data);
        
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `compliance-report-${report.documentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
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
            Upload a document to analyze compliance with GDPR, HIPAA, SOC 2, and PCI-DSS regulations
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
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Compliance Issues</h3>
                <div className="space-y-3">
                  {report.risks.map((risk, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded border-l-4 ${
                        risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                        risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{risk.description}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          risk.severity === 'high' ? 'bg-red-100 text-red-800' : 
                          risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        <span className="font-medium">{risk.regulation}</span>
                        {risk.section && ` - ${risk.section}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
