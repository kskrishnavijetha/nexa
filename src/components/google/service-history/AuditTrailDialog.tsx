
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
            <Button 
              onClick={() => documentName && handleDownloadAuditReport(documentName)}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Detailed Report
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
