
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2, FileText, FileCog } from 'lucide-react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { exportReport, ExportFormat } from '@/utils/reports/exportFormats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportActionsProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, language = 'en' }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [downloadProgress, setDownloadProgress] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const downloadToastIdRef = useRef<string | number>('');
  
  // Add cancellation token
  const abortControllerRef = useRef<AbortController | null>(null);

  const getDownloadButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Descargar Informe';
      case 'fr': return 'Télécharger le Rapport';
      case 'de': return 'Bericht Herunterladen';
      case 'zh': return '下载报告';
      default: return 'Download Report';
    }
  };

  const captureChartAsImage = async (): Promise<string | undefined> => {
    // Find the charts container in the document
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

  const handleDownloadPDF = async () => {
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
    }, 500);
    
    try {
      // Request animation frame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
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
          
          // Create a download link
          const url = URL.createObjectURL(response.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
          
          // Append to body, click and clean up
          document.body.appendChild(a);
          a.click();
          
          // Clean up properly to avoid memory leaks
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsDownloading(false);
            setDownloadProgress(false);
            toast.success('Report downloaded successfully', 
              { id: downloadToastIdRef.current }
            );
          }, 100);
        } catch (error) {
          console.error('Error in animation frame:', error);
          clearInterval(progressInterval);
          toast.error('Failed to download the report. Please try again.', 
            { id: downloadToastIdRef.current }
          );
          setIsDownloading(false);
          setDownloadProgress(false);
        }
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      clearInterval(progressInterval);
      toast.error('Failed to download the report. Please try again.', 
        { id: downloadToastIdRef.current }
      );
      setIsDownloading(false);
      setDownloadProgress(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (format === 'pdf') {
      handleDownloadPDF();
      return;
    }

    try {
      setExportFormat(format);
      const toastId = toast.loading(`Preparing ${format.toUpperCase()} export...`);
      
      // Use setTimeout to prevent UI from freezing
      setTimeout(() => {
        try {
          exportReport(report, format);
          toast.dismiss(toastId);
          toast.success(`Report exported as ${format.toUpperCase()} successfully`);
        } catch (error) {
          toast.dismiss(toastId);
          console.error(`Error exporting as ${format}:`, error);
          toast.error(`Failed to export as ${format}. Please try again.`);
        }
      }, 10);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast.error(`Failed to export as ${format}. Please try again.`);
    }
  };

  const getPreviewButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Vista Previa';
      case 'fr': return 'Aperçu';
      case 'de': return 'Vorschau';
      case 'zh': return '预览';
      default: return 'Preview';
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={() => setPreviewOpen(true)}
          className="flex gap-2 items-center"
        >
          <Eye className="h-4 w-4" />
          {getPreviewButtonLabel()}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="flex gap-2 items-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {downloadProgress ? `${progressPercent}%` : 'Downloading...'}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {getDownloadButtonLabel()}
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isDownloading}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('docx')} disabled={isDownloading}>
              <FileCog className="h-4 w-4 mr-2" />
              Word Document (DOCX)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')} disabled={isDownloading}>
              <FileText className="h-4 w-4 mr-2" />
              CSV Spreadsheet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DocumentPreview 
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default ReportActions;
