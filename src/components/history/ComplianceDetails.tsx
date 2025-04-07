
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplianceScoreCards from './ComplianceScoreCards';
import RiskAnalysis from '@/components/RiskAnalysis';
import { Button } from '@/components/ui/button';
import { Download, Eye, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
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

interface ComplianceDetailsProps {
  report: ComplianceReport;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ report }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { user } = useAuth();
  
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.info(`Preparing download for "${report.documentName}"...`);
      
      // Pass the complete report to ensure all data is available
      const result = await generateReportPDF(report, 'en');
      
      if (result.data) {
        // Create a download link for the PDF
        const url = URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.documentName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success('Report downloaded successfully');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download the report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Report Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a document to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>{report.documentName}</span>
            {report.industry && (
              <span className="text-sm text-muted-foreground">
                Industry: {report.industry} {report.region && `| Region: ${report.region}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Email
                </>
              )}
            </Button>
            <span className={
              report.overallScore >= 80 ? 'text-green-500' : 
              report.overallScore >= 70 ? 'text-amber-500' : 
              'text-red-500'
            }>
              {report.overallScore}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{report.summary}</p>
        <ComplianceScoreCards 
          gdprScore={report.gdprScore}
          hipaaScore={report.hipaaScore}
          soc2Score={report.soc2Score}
        />
        <RiskAnalysis risks={report.risks} />
      </CardContent>

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

      {/* Document Preview Modal */}
      <DocumentPreview
        report={report}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </Card>
  );
};

export default ComplianceDetails;
