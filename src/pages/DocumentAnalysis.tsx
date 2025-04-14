
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import DocumentHeader from '@/components/document-analysis/DocumentHeader';
import DocumentUploader from '@/components/document-uploader/DocumentUploader';
import AnalysisResults from '@/components/document-analysis/AnalysisResults';
import { addReportToHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { shouldUpgradeTier, recordScanUsage, getSubscription } from '@/utils/paymentService';

const DocumentAnalysis = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { user } = useAuth();
  const { addScanHistory } = useServiceHistoryStore();
  const chartsContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs to upgrade before allowing more scans
    if (shouldUpgradeTier()) {
      toast.error('You have used all available scans for your current plan');
      navigate('/pricing');
    }
  }, [navigate]);

  const handleReportGenerated = (reportData: ComplianceReport) => {
    // Record scan usage when a report is generated
    recordScanUsage();
    
    // Display remaining scans notification
    const subscription = getSubscription();
    if (subscription) {
      const scansRemaining = subscription.scansLimit - subscription.scansUsed;
      toast.info(`Scan complete. You have ${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} remaining this month.`);
    }
    
    // Add user ID to the report if available
    const reportWithUser = user?.id 
      ? { ...reportData, userId: user.id }
      : reportData;
    
    setReport(reportWithUser);
    
    // Save the report to history for viewing in the history page
    addReportToHistory(reportWithUser);
    console.log('Report saved to history in DocumentAnalysis:', reportWithUser.documentName);
    
    // Also add to the scan history store - ensure all the same data is available in both places
    if (user) {
      addScanHistory({
        serviceId: reportWithUser.documentId,
        serviceName: 'Document Analysis',
        scanDate: new Date().toISOString(),
        itemsScanned: reportWithUser.pageCount || 1,
        violationsFound: (reportWithUser.risks || []).length,
        documentName: reportWithUser.documentName,
        fileName: reportWithUser.originalFileName || reportWithUser.documentName,
        report: reportWithUser,
        industry: reportWithUser.industry,
        organization: reportWithUser.organization,
        regulations: reportWithUser.regulations
      });
    }
    
    toast.success('Report added to history');
  };

  const captureChartAsImage = async (): Promise<string | undefined> => {
    // Look for the compliance-charts-container class
    const chartsContainer = document.querySelector('.compliance-charts-container');
    
    if (!chartsContainer) {
      console.warn('Charts container not found for capture');
      return undefined;
    }
    
    try {
      // Use html2canvas to capture the chart
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartsContainer as HTMLElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture chart:', error);
      return undefined;
    }
  };

  const handleDownloadReport = async () => {
    if (!report) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Get chart image before generating the PDF
      const chartImage = await captureChartAsImage();
      if (chartImage) {
        console.log('Chart image captured successfully');
      } else {
        console.warn('No chart image could be captured');
      }
      
      const response = await generateReportPDF(report, 'en', chartImage);
      
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
          <DocumentUploader onReport={handleReportGenerated} />
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
