import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditTrailProvider } from '@/components/audit/AuditTrailProvider';
import AuditTrailList from '@/components/audit/AuditTrailList';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ComplianceReport } from '@/utils/types';
import { scheduleNonBlockingOperation, triggerDownload } from '@/utils/memoryUtils';

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
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownloadAuditReport = async (documentName: string) => {
    if (isDownloadingReport) return;
    
    setIsDownloadingReport(true);
    setDownloadProgress(0);
    const toastId = toast.loading('Preparing audit report (0%)...', { duration: 60000 });
    
    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const newValue = Math.min(prev + 5, 90);
          toast.loading(`Preparing audit report (${newValue}%)...`, { id: toastId });
          return newValue;
        });
      }, 500);
      
      const { generateAuditReport, getAuditReportFileName } = await import('@/utils/auditReportService');
      
      const mockAuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `Downloaded service scan report`,
        documentName,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      const reportBlob = await scheduleNonBlockingOperation(
        () => generateAuditReport(documentName, [mockAuditEvent])
      );
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      toast.loading(`Starting download (100%)...`, { id: toastId });
      
      await triggerDownload(reportBlob, getAuditReportFileName(documentName));
      
      toast.dismiss(toastId);
      toast.success(`Audit report for "${documentName}" downloaded successfully`);
      
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
    } finally {
      setIsDownloadingReport(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadAuditLogs = async (documentName: string) => {
    if (isDownloadingLogs) return;
    
    setIsDownloadingLogs(true);
    setDownloadProgress(0);
    const toastId = toast.loading('Preparing audit logs (0%)...', { duration: 60000 });
    
    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const newValue = Math.min(prev + 5, 90);
          toast.loading(`Preparing audit logs (${newValue}%)...`, { id: toastId });
          return newValue;
        });
      }, 500);
      
      const { generateAuditLogsPDF, getAuditLogsFileName } = await import('@/utils/auditReportService');
      
      const mockAuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `Viewed service scan report`,
        documentName,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      const logsBlob = await scheduleNonBlockingOperation(
        () => generateAuditLogsPDF(documentName, [mockAuditEvent])
      );
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      toast.loading(`Starting download (100%)...`, { id: toastId });
      
      await triggerDownload(logsBlob, getAuditLogsFileName(documentName));
      
      toast.dismiss(toastId);
      toast.success(`Audit logs for "${documentName}" downloaded successfully`);
      
    } catch (error) {
      console.error('Error generating audit logs:', error);
      toast.error('Failed to generate audit logs');
    } finally {
      setIsDownloadingLogs(false);
      setDownloadProgress(0);
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
              disabled={isDownloadingLogs || isDownloadingReport}
              className="flex items-center"
            >
              {isDownloadingLogs ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {downloadProgress}%
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
              disabled={isDownloadingReport || isDownloadingLogs}
              className="flex items-center"
            >
              {isDownloadingReport ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {downloadProgress}%
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
