
import React, { useState } from 'react';
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
import { Progress } from '@/components/ui/progress';

interface ReportActionsProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, language = 'en' }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [progress, setProgress] = useState(0);

  const getDownloadButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Descargar Informe';
      case 'fr': return 'Télécharger le Rapport';
      case 'de': return 'Bericht Herunterladen';
      case 'zh': return '下载报告';
      default: return 'Download Report';
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setProgress(10);
    const toastId = toast.loading('Generating PDF report...');
    
    try {
      // Process in chunks to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(30);
      
      // Make sure we pass the report with industry and region
      const response = await generateReportPDF(report, language);
      
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      setProgress(80);
      // Create a download link
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      
      // Use setTimeout to allow UI to update before heavy operation
      setTimeout(() => {
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.dismiss(toastId);
        toast.success('Report downloaded successfully');
        setProgress(100);
        
        // Reset after a short delay
        setTimeout(() => {
          setIsDownloading(false);
          setProgress(0);
        }, 200);
      }, 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.dismiss(toastId);
      toast.error('Failed to download the report. Please try again.');
      setIsDownloading(false);
      setProgress(0);
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (format === 'pdf') {
      handleDownloadPDF();
      return;
    }

    try {
      setExportFormat(format);
      exportReport(report, format);
      toast.success(`Report exported as ${format.toUpperCase()} successfully`);
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
                  Downloading...
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
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('docx')}>
              <FileCog className="h-4 w-4 mr-2" />
              Word Document (DOCX)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileText className="h-4 w-4 mr-2" />
              CSV Spreadsheet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isDownloading && (
        <div className="w-full mt-2">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      <DocumentPreview 
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default ReportActions;
