
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';

type ChartCaptureFunction = () => Promise<string | undefined>;

export const useDownloadPDF = (
  report: ComplianceReport, 
  language: SupportedLanguage = 'en',
  captureChartAsImage: ChartCaptureFunction
) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const downloadToastIdRef = useRef<string | number>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(true);
    setProgressPercent(0);
    
    // Create new abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    // Show progress toast
    downloadToastIdRef.current = toast.loading(
      `Preparing report for download (0%)...`, 
      { duration: 60000 }
    );
    
    // Update progress periodically to show activity
    const progressInterval = setInterval(() => {
      setProgressPercent(prev => {
        // Cap at 90% - final 10% when actually complete
        const newValue = Math.min(prev + 5, 90);
        toast.loading(
          `Preparing report for download (${newValue}%)...`,
          { id: downloadToastIdRef.current }
        );
        return newValue;
      });
    }, 300); // Less frequent updates
    
    try {
      // Request animation frame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Use microtasks for better UI priority
          queueMicrotask(async () => {
            try {
              // First, try to capture the charts as an image
              const chartImage = await captureChartAsImage();
              if (chartImage) {
                console.log('Chart image captured successfully');
              } else {
                console.warn('No chart image could be captured');
              }
              
              // Signal that we're generating the PDF
              toast.loading(
                `Building PDF document...`,
                { id: downloadToastIdRef.current }
              );
              
              // Make sure we pass the report with industry and region
              const response = await generateReportPDF(report, language, chartImage);
              
              clearInterval(progressInterval);
              
              if (!response.success) {
                toast.error(response.error || 'Failed to generate report', 
                  { id: downloadToastIdRef.current }
                );
                setIsDownloading(false);
                setDownloadProgress(false);
                return;
              }
              
              // Update progress to 100%
              setProgressPercent(100);
              toast.loading(
                `Download starting (100%)...`,
                { id: downloadToastIdRef.current }
              );
              
              // Create a download link with optimized approach
              const url = URL.createObjectURL(response.data);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
              a.style.position = 'absolute';
              a.style.visibility = 'hidden';
              
              // Append to body, click and clean up
              document.body.appendChild(a);
              a.click();
              
              // Clean up properly to avoid memory leaks
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setIsDownloading(false);
                setDownloadProgress(false);
                abortControllerRef.current = null;
                toast.success('Report downloaded successfully', 
                  { id: downloadToastIdRef.current }
                );
              }, 100);
            } catch (error) {
              handleDownloadError(error, progressInterval);
            }
          });
        } catch (error) {
          handleDownloadError(error, progressInterval);
        }
      });
    } catch (error) {
      handleDownloadError(error, progressInterval);
    }
  }, [report, language, isDownloading, captureChartAsImage]);
  
  // Helper function to handle errors consistently
  const handleDownloadError = useCallback((error: unknown, intervalId: NodeJS.Timeout) => {
    console.error('Error downloading PDF:', error);
    clearInterval(intervalId);
    toast.error('Failed to download the report. Please try again.', 
      { id: downloadToastIdRef.current }
    );
    setIsDownloading(false);
    setDownloadProgress(false);
    abortControllerRef.current = null;
  }, []);

  return {
    isDownloading,
    downloadProgress,
    progressPercent,
    handleDownloadPDF
  };
};
