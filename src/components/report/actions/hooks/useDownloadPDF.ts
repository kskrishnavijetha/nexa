
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';
import { scheduleNonBlockingOperation, triggerDownload } from '@/utils/memoryUtils';

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
    
    // Update progress periodically but with reduced frequency to improve performance
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
    }, 500); // Increased interval to reduce UI updates
    
    try {
      // First, try to capture the charts as an image with reduced quality
      const chartImage = await captureChartAsImage().catch(() => undefined);
      
      // Signal that we're generating the PDF
      toast.loading(
        `Building PDF document...`,
        { id: downloadToastIdRef.current }
      );
      
      // Use our non-blocking operation utility
      const response = await scheduleNonBlockingOperation(
        () => generateReportPDF(report, language, chartImage),
        (percent) => {
          setProgressPercent(percent);
          toast.loading(
            `Preparing report (${percent}%)...`,
            { id: downloadToastIdRef.current }
          );
        }
      );
      
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
      
      // Use the utility for downloading
      const filename = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      await triggerDownload(response.data, filename);
      
      // Clean up
      setIsDownloading(false);
      setDownloadProgress(false);
      abortControllerRef.current = null;
      toast.success('Report downloaded successfully', 
        { id: downloadToastIdRef.current }
      );
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      clearInterval(progressInterval);
      toast.error('Failed to download the report. Please try again.', 
        { id: downloadToastIdRef.current }
      );
      setIsDownloading(false);
      setDownloadProgress(false);
      abortControllerRef.current = null;
    }
  }, [report, language, isDownloading, captureChartAsImage]);

  return {
    isDownloading,
    downloadProgress,
    progressPercent,
    handleDownloadPDF
  };
};
