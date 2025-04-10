
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';
import { scheduleNonBlockingOperation, triggerDownload, forceGarbageCollection } from '@/utils/memoryUtils';

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
        const newValue = Math.min(prev + 3, 90);
        toast.loading(
          `Preparing report for download (${newValue}%)...`,
          { id: downloadToastIdRef.current }
        );
        return newValue;
      });
    }, 800); // Much less frequent updates to reduce UI work
    
    try {
      // Force garbage collection before heavy operations
      forceGarbageCollection();
      
      // First, try to capture the charts as an image with drastically reduced quality
      let chartImage: string | undefined;
      
      try {
        // Use a timeout to capture the chart to prevent UI blocking
        chartImage = await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const image = await captureChartAsImage().catch(() => undefined);
              resolve(image);
            } catch (err) {
              console.warn('Chart capture failed, continuing without chart:', err);
              resolve(undefined);
            }
          }, 10);
        });
      } catch (chartError) {
        console.warn('Failed to capture chart, continuing without it:', chartError);
      }
      
      // Signal that we're generating the PDF
      toast.loading(
        `Building PDF document...`,
        { id: downloadToastIdRef.current }
      );
      
      // Use our non-blocking operation utility with significant delays
      // to ensure UI remains responsive
      const response = await scheduleNonBlockingOperation(
        async () => {
          // Add an artificial delay to let the UI breathe
          await new Promise(resolve => setTimeout(resolve, 100));
          return generateReportPDF(report, language, chartImage);
        },
        (percent) => {
          setProgressPercent(Math.min(percent, 90));
          toast.loading(
            `Preparing report (${Math.min(percent, 90)}%)...`,
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
      
      // Use the utility for downloading with a delay to prevent UI blocking
      const filename = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      
      // Add a small delay before starting download to let UI update
      await new Promise(resolve => setTimeout(resolve, 100));
      await triggerDownload(response.data, filename);
      
      // Add a small delay before cleanup to ensure download starts
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force garbage collection after heavy operation
      forceGarbageCollection();
      
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
      
      // Force garbage collection after error
      forceGarbageCollection();
    }
  }, [report, language, isDownloading, captureChartAsImage]);

  return {
    isDownloading,
    downloadProgress,
    progressPercent,
    handleDownloadPDF
  };
};
