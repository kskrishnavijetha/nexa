
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, File } from 'lucide-react';
import { toast } from 'sonner';
import { AuditTrailProvider } from '@/components/audit/AuditTrailProvider';
import AuditTrailList from '@/components/audit/AuditTrailList';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ComplianceReport } from '@/utils/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const handleDownloadAuditReport = async (documentName: string) => {
    try {
      // Use the utility function from auditReportService directly
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
      document.body.removeChild(link);
      
      toast.success(`Audit report for "${documentName}" downloaded successfully`);
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
    }
  };

  const handleDownloadLogsReport = async (documentName: string) => {
    try {
      // Use the utility function from auditReportService directly
      const { generateAuditLogReport } = await import('@/utils/auditReportService');
      
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
      const reportBlob = await generateAuditLogReport(documentName, [mockAuditEvent]);
      
      // Create a download link
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Audit logs for "${documentName}" downloaded successfully`);
    } catch (error) {
      console.error('Error generating audit logs:', error);
      toast.error('Failed to generate audit logs');
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
          
          <DialogFooter className="mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => documentName && handleDownloadAuditReport(documentName)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Full Audit Trail Report
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => documentName && handleDownloadLogsReport(documentName)}
                >
                  <File className="h-4 w-4 mr-2" />
                  Audit Logs Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
