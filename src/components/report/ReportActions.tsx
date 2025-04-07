
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Send, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ComplianceReport } from '@/utils/apiService';
import { generateReportPDF } from '@/utils/reports';
import { SupportedLanguage } from '@/utils/language';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface ReportActionsProps {
  report: ComplianceReport;
  language?: SupportedLanguage;
}

const ReportActions: React.FC<ReportActionsProps> = ({ report, language = 'en' }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { user } = useAuth();

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
      // Make sure we pass the report with industry and region
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
  
  const handleSendEmail = async () => {
    // Show email dialog
    setEmailDialogOpen(true);
  };

  const handleSendEmailSubmit = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setEmailDialogOpen(false);
    
    try {
      // Format the date
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Prepare report details for the email
      const reportDetails = {
        documentName: report.documentName,
        complianceScore: report.overallScore || 0,
        risks: (report.risks || []).length,
        date: formattedDate,
        industry: report.industry,
        regulations: report.regulations || []
      };

      // Send the email using the edge function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'compliance-report',
          email: recipientEmail,
          name: user?.email || '', // Use email instead of name
          reportDetails
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Report has been sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send the report. Please try again.');
    } finally {
      setIsSending(false);
      setRecipientEmail('');
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

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email Compliance Report</DialogTitle>
            <DialogDescription>
              Enter the email address where you want to send the report for {report.documentName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="col-span-3"
                autoComplete="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmailSubmit} disabled={!recipientEmail.trim()}>
              Send Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DocumentPreview 
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default ReportActions;
