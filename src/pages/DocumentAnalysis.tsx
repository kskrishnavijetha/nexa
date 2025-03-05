
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentUploader from '@/components/DocumentUploader';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import { toast } from 'sonner';
import ComplianceReportViewer from '@/components/DocumentAnalysis/ComplianceReportViewer';

const DocumentAnalysis = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const navigate = useNavigate();

  const handleReportGenerated = (reportData: ComplianceReport) => {
    setReport(reportData);
  };

  const handleBackToHome = () => {
    navigate('/');
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
        {!report ? (
          <>
            <button 
              onClick={handleBackToHome}
              className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Back to Home
            </button>
            
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold">Document Analysis</h1>
              <p className="text-muted-foreground mt-2">
                Upload a document to analyze compliance with various industry regulations
              </p>
            </div>
            
            <DocumentUploader onReportGenerated={handleReportGenerated} />
          </>
        ) : (
          <ComplianceReportViewer 
            report={report}
            isGeneratingPDF={isGeneratingPDF}
            onDownloadReport={handleDownloadReport}
            onBack={handleBackToHome}
            onAnalyzeAnother={() => setReport(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
