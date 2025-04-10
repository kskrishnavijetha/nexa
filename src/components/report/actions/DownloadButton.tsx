
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText, FileCog } from 'lucide-react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';
import { exportReport, ExportFormat } from '@/utils/reports/exportFormats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChartCapture } from './hooks/useChartCapture';
import { useDownloadPDF } from './hooks/useDownloadPDF';

interface DownloadButtonProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ report, language = 'en' }) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { captureChartAsImage } = useChartCapture();
  
  const { 
    isDownloading, 
    downloadProgress, 
    progressPercent, 
    handleDownloadPDF 
  } = useDownloadPDF(report, language, captureChartAsImage);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const getDownloadButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Descargar Informe';
      case 'fr': return 'Télécharger le Rapport';
      case 'de': return 'Bericht Herunterladen';
      case 'zh': return '下载报告';
      default: return 'Download Report';
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
      
      // Use requestAnimationFrame + setTimeout to prevent UI from freezing
      requestAnimationFrame(() => {
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
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast.error(`Failed to export as ${format}. Please try again.`);
    }
  };

  return (
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
  );
};

export default DownloadButton;
