
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Send, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reportService';
import { SupportedLanguage } from '@/utils/language';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

interface ReportActionsProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, language = 'en' }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const getDownloadButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Descargar Informe PDF';
      case 'fr': return 'Télécharger le Rapport PDF';
      case 'de': return 'PDF-Bericht Herunterladen';
      case 'zh': return '下载PDF报告';
      default: return 'Download PDF Report';
    }
  };

  const getSendButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Enviar Informe por Correo';
      case 'fr': return 'Envoyer le Rapport par Email';
      case 'de': return 'Bericht per E-Mail Senden';
      case 'zh': return '通过电子邮件发送报告';
      default: return 'Email Report';
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await generateReportPDF(report, language);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      // Create a download link
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download the report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleSendEmail = () => {
    setIsSending(true);
    // Simulate email sending
    setTimeout(() => {
      toast.success('Report has been sent to your email');
      setIsSending(false);
    }, 2000);
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
        
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex gap-2 items-center"
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
        
        <Button 
          onClick={handleSendEmail}
          disabled={isSending}
          className="flex gap-2 items-center"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {getSendButtonLabel()}
            </>
          )}
        </Button>
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
