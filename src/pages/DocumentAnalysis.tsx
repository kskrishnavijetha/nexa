
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ComplianceReport, generateReportPDF } from '../utils/apiService';
import DocumentHeader from '@/components/document-analysis/DocumentHeader';
import DocumentUploader from '@/components/document-uploader/DocumentUploader';
import AnalysisResults from '@/components/document-analysis/AnalysisResults';
import { addReportToHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { hasScansRemaining, recordScanUsage, getScansRemaining, getSubscription } from '@/utils/payment/subscriptionService';
import { useNavigate } from 'react-router-dom';

const DocumentAnalysis = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { user } = useAuth();
  const { addScanHistory } = useServiceHistoryStore();
  const chartsContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has scans remaining
    if (user && !hasScansRemaining()) {
      const subscription = getSubscription();
      const plan = subscription?.plan || 'free';
      
      toast.error(`You've reached the scan limit for your ${plan} plan. Please upgrade to continue scanning.`, {
        action: {
          label: 'View Plans',
          onClick: () => navigate('/pricing'),
        },
        duration: 8000,
      });
      
      // Redirect to pricing page
      navigate('/pricing');
    }
  }, [user, navigate]);

  const handleReportGenerated = (reportData: ComplianceReport) => {
    // Record scan usage
    recordScanUsage();
    
    // Check remaining scans after recording usage
    const remainingScans = getScansRemaining();
    if (remainingScans <= 3 && remainingScans > 0) {
      toast.warning(`You have ${remainingScans} scan${remainingScans === 1 ? '' : 's'} remaining in your current plan.`, {
        action: {
          label: 'View Plans',
          onClick: () => navigate('/pricing'),
        },
        duration: 8000,
      });
    } else if (remainingScans === 0) {
      // Will show toast but allow this last scan to complete
      const subscription = getSubscription();
      const plan = subscription?.plan || 'free';
      
      toast.error(`You've reached the scan limit for your ${plan} plan. This is your last scan.`, {
        action: {
          label: 'Upgrade Now',
          onClick: () => navigate('/pricing'),
        },
        duration: 10000,
      });
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
        
        {!hasScansRemaining() ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Scan Limit Reached</h2>
            <p className="mb-6 text-muted-foreground">
              You've reached the scan limit for your current plan. Please upgrade to continue scanning documents.
            </p>
            <button 
              onClick={() => navigate('/pricing')}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
            >
              View Pricing Plans
            </button>
          </div>
        ) : !report ? (
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
