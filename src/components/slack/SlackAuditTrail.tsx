
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlackScanResults } from '@/utils/slack/types';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatTimestamp } from '@/components/audit/auditUtils';
import { 
  generateSlackReportPDF, 
  generateSlackAuditTrailPDF, 
  getSlackReportFileName, 
  getSlackAuditFileName,
  addSlackScanToHistory
} from '@/utils/slack/slackReportGenerator';

interface SlackAuditTrailProps {
  scanResults: SlackScanResults | null;
}

const SlackAuditTrail: React.FC<SlackAuditTrailProps> = ({ scanResults }) => {
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isDownloadingAudit, setIsDownloadingAudit] = useState(false);

  const handleDownloadReport = async () => {
    if (!scanResults || isDownloadingReport) return;
    
    setIsDownloadingReport(true);
    const toastId = toast.loading('Generating PDF report...', { duration: 30000 });
    
    try {
      // Generate the PDF
      const pdfBlob = await generateSlackReportPDF(scanResults);
      
      // Create and download the file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getSlackReportFileName(scanResults);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Add to history (this ensures the report shows up in history)
      addSlackScanToHistory(scanResults);
      
      toast.dismiss(toastId);
      toast.success('Slack report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const handleDownloadAudit = async () => {
    if (!scanResults || isDownloadingAudit) return;
    
    setIsDownloadingAudit(true);
    const toastId = toast.loading('Generating audit trail...', { duration: 30000 });
    
    try {
      // Generate the PDF
      const pdfBlob = await generateSlackAuditTrailPDF(scanResults);
      
      // Create and download the file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getSlackAuditFileName(scanResults);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.dismiss(toastId);
      toast.success('Audit trail downloaded successfully');
    } catch (error) {
      console.error('Error downloading audit trail:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate audit trail. Please try again.');
    } finally {
      setIsDownloadingAudit(false);
    }
  };

  if (!scanResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Slack Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No scan results available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Slack Audit Trail</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleDownloadAudit}
            disabled={isDownloadingAudit}
          >
            {isDownloadingAudit ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            <span>Download Audit PDF</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={handleDownloadReport}
            disabled={isDownloadingReport}
          >
            {isDownloadingReport ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>Download Report</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <p><strong>Scan ID:</strong> {scanResults.scanId}</p>
          <p><strong>Timestamp:</strong> {new Date(scanResults.timestamp).toLocaleString()}</p>
          <p><strong>Messages Scanned:</strong> {scanResults.scannedMessages}</p>
          <p><strong>Files Scanned:</strong> {scanResults.scannedFiles}</p>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanResults.violations.map((violation) => (
                <TableRow key={violation.messageId}>
                  <TableCell className="text-xs">{formatTimestamp(violation.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">{violation.rule}</span>
                    </div>
                  </TableCell>
                  <TableCell>{violation.channel}</TableCell>
                  <TableCell>{violation.user}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      violation.severity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : violation.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {violation.severity}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {scanResults.violations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No violations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackAuditTrail;
