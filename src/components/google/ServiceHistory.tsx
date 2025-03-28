
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, AlertTriangle, Calendar, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ComplianceReport } from '@/utils/types';
import { AuditTrailProvider } from '@/components/audit/AuditTrailProvider';
import AuditTrailList from '@/components/audit/AuditTrailList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const ServiceHistory: React.FC = () => {
  const { scanHistory } = useServiceHistoryStore();
  const { user } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  
  const handleDocumentClick = (document: string, report?: ComplianceReport) => {
    setSelectedDocument(document);
    setSelectedReport(report || null);
    setAuditDialogOpen(true);
  };

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

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Service Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Please sign in to view your history</h3>
            <p className="text-sm text-gray-500">
              Sign in to view and manage your scan history
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scanHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Service Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No scan history yet</h3>
            <p className="text-sm text-gray-500">
              Connect services and run scans to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Service Scan History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Document/Content</TableHead>
              <TableHead>Scan Date</TableHead>
              <TableHead>Items Scanned</TableHead>
              <TableHead>Violations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanHistory.map((item, index) => (
              <TableRow key={`${item.serviceId}-${index}-${item.scanDate}`}>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {item.serviceName}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={() => handleDocumentClick(item.documentName || 'Document Scan', item.report)}
                  >
                    {item.documentName || 'General Scan'}
                  </Button>
                </TableCell>
                <TableCell>
                  {new Date(item.scanDate).toLocaleString()}
                </TableCell>
                <TableCell>{item.itemsScanned}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    {item.violationsFound > 0 && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />}
                    {item.violationsFound}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Document Preview Modal */}
      {selectedReport && (
        <DocumentPreview 
          report={selectedReport}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {/* Audit Trail Dialog */}
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Audit Trail: {selectedDocument}</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="mt-4 flex-1 overflow-auto">
              <AuditTrailProvider documentName={selectedDocument}>
                <AuditTrailList />
              </AuditTrailProvider>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              onClick={() => selectedDocument && handleDownloadAuditReport(selectedDocument)}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Detailed Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceHistory;
