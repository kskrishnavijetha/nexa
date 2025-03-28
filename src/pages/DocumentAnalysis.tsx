
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import DocumentHeader from '@/components/document-analysis/DocumentHeader';
import DocumentUploader from '@/components/document-uploader/DocumentUploader';
import AnalysisResults from '@/components/document-analysis/AnalysisResults';
import { addReportToHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';

const DocumentAnalysis = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { user } = useAuth();
  const { addScanHistory } = useServiceHistoryStore();

  const handleReportGenerated = (reportData: ComplianceReport) => {
    // Add user ID to the report if available
    const reportWithUser = user?.id 
      ? { ...reportData, userId: user.id }
      : reportData;
    
    setReport(reportWithUser);
    
    // Save the report to history for viewing in the history page
    addReportToHistory(reportWithUser);
    console.log('Report saved to history in DocumentAnalysis:', reportWithUser.documentName);
    
    // Also add to the scan history store
    if (user) {
      addScanHistory({
        serviceId: 'document-analysis',
        serviceName: 'Document Analysis',
        scanDate: new Date().toISOString(),
        itemsScanned: reportWithUser.pageCount || 1,
        violationsFound: (reportWithUser.risks || []).length,
        documentName: reportWithUser.documentName,
        fileName: reportWithUser.originalFileName || reportWithUser.documentName,
        report: reportWithUser
      });
    }
    
    toast.success('Report added to history');
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
        <DocumentHeader />
        
        {!report ? (
          <DocumentUploader onReportGenerated={handleReportGenerated} />
        ) : (
          <AnalysisResults
            report={report}
            isGeneratingPDF={isGeneratingPDF}
            onDownloadReport={handleDownloadReport}
            onResetAnalysis={() => setReport(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
