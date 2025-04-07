
import React, { useState } from 'react';
import { FileText, Download, Eye, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import { toast } from 'sonner';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DocumentInfoHeaderProps {
  report: ComplianceReport;
  isGeneratingPDF: boolean;
  onDownloadReport: () => void;
  onPreviewReport: () => void;
}

const DocumentInfoHeader: React.FC<DocumentInfoHeaderProps> = ({ 
  report, 
  isGeneratingPDF, 
  onDownloadReport,
  onPreviewReport
}) => {
  const [isSending, setIsSending] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { user } = useAuth();

  const handleSendEmail = () => {
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
          name: user?.name || '',
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

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <FileText className="h-6 w-6 text-primary mr-2" />
        <div>
          <h2 className="text-xl font-semibold">{report.documentName}</h2>
          {report.industry && (
            <p className="text-sm text-muted-foreground">
              Industry: {report.industry} {report.region && `| Region: ${report.region}`}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={onPreviewReport}
        >
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={onDownloadReport}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Email Report
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
    </div>
  );
};

export default DocumentInfoHeader;
