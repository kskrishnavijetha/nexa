
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AuditTrailProvider } from '@/components/audit/AuditTrailProvider';
import AuditTrailList from '@/components/audit/AuditTrailList';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ComplianceReport } from '@/utils/types';

interface AuditTrailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string | null;
  report: ComplianceReport | null;
}

export const AuditTrailDialog: React.FC<AuditTrailDialogProps> = ({
  isOpen,
  onOpenChange,
  documentName,
  report
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isDownloadingLogs, setIsDownloadingLogs] = useState(false);

  const handleDownloadAuditReport = async (documentName: string) => {
    if (isDownloadingReport) return;
    
    setIsDownloadingReport(true);
    toast.loading('Preparing audit report...', { id: 'dialog-report' });
    
    try {
      // Use dynamic import to reduce initial bundle size
      const { generateAuditReport, getAuditReportFileName } = await import('@/utils/auditReportService');
      
      // We don't have the actual audit events for this doc, so create minimal mock data
      const mockAuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `Downloaded service scan report`,
        documentName,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      // Generate and download the report
      const reportBlob = await generateAuditReport(documentName, [mockAuditEvent]);
      
      // Create a download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditReportFileName(documentName);
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up properly to avoid memory leaks
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.dismiss('dialog-report');
      toast.success(`Audit report for "${documentName}" downloaded successfully`);
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.dismiss('dialog-report');
      toast.error('Failed to generate audit report');
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const handleDownloadAuditLogs = async (documentName: string) => {
    if (isDownloadingLogs) return;
    
    setIsDownloadingLogs(true);
    toast.loading('Preparing audit logs...', { id: 'dialog-logs' });
    
    try {
      // Use dynamic import to reduce initial bundle size
      const { generateAuditLogsPDF, getAuditLogsFileName } = await import('@/utils/auditReportService');
      
      // We don't have the actual audit events for this doc, so create minimal mock data
      const mockAuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `Viewed service scan report`,
        documentName,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      // Generate and download the logs
      const logsBlob = await generateAuditLogsPDF(documentName, [mockAuditEvent]);
      
      // Create a download link
      const url = window.URL.createObjectURL(logsBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getAuditLogsFileName(documentName);
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up properly to avoid memory leaks
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.dismiss('dialog-logs');
      toast.success(`Audit logs for "${documentName}" downloaded successfully`);
    } catch (error) {
      console.error('Error generating audit logs:', error);
      toast.dismiss('dialog-logs');
      toast.error('Failed to generate audit logs');
    } finally {
      setIsDownloadingLogs(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Audit Trail: {documentName}</DialogTitle>
          </DialogHeader>
          
          {documentName && (
            <div className="mt-4 flex-1 overflow-auto">
              <AuditTrailProvider documentName={documentName}>
                <AuditTrailList />
              </AuditTrailProvider>
            </div>
          )}
          
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={() => documentName && handleDownloadAuditLogs(documentName)}
              disabled={isDownloadingLogs}
              className="flex items-center"
            >
              {isDownloadingLogs ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Audit Logs
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => documentName && handleDownloadAuditReport(documentName)}
              disabled={isDownloadingReport}
              className="flex items-center"
            >
              {isDownloadingReport ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Enhanced Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      {report && (
        <DocumentPreview 
          report={report}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
};
