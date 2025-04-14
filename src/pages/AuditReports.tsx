
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getHistoricalReports, deleteReportFromHistory } from '@/utils/historyService';
import { ComplianceReport } from '@/utils/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { generateAuditReport, getAuditReportFileName } from '@/utils/auditReportService';
import { getAuditEventsForDocument } from '@/components/audit/hooks/useAuditEvents';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AuditReports: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ComplianceReport | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const loadReports = () => {
    // Load reports from history service
    const historicalReports = getHistoricalReports();
    
    // Filter reports by current user's ID
    const userReports = user ? historicalReports.filter(report => report.userId === user.id) : [];
    console.log(`Filtered reports for user ${user?.id} in Audit Reports:`, userReports.length);
    
    setReports(userReports);
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const filteredReports = reports.filter(report => 
    report.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewAudit = (documentName: string) => {
    // Use state to prevent navigation blinking
    navigate({
      pathname: '/history',
      search: `?document=${encodeURIComponent(documentName)}&tab=audit`
    }, { 
      state: { preventBlink: true, from: 'audit-reports' }
    });
  };

  const downloadAuditReport = async (documentName: string) => {
    try {
      setGeneratingReport(documentName);
      toast.info(`Generating AI-enhanced audit report for ${documentName}...`);
      
      // Get audit events for the document
      // Note: In a real app, this would be fetched from a backend API
      const auditEvents = await getAuditEventsForDocument(documentName);
      
      // Generate PDF report
      const pdfBlob = await generateAuditReport(documentName, auditEvents);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = getAuditReportFileName(documentName);
      downloadLink.click();
      
      URL.revokeObjectURL(url);
      toast.success(`Audit report downloaded successfully for ${documentName}`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleDeleteClick = (report: ComplianceReport) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete && user) {
      const deleted = deleteReportFromHistory(reportToDelete.documentId, user.id);
      if (deleted) {
        toast.success(`Document "${reportToDelete.documentName}" has been deleted from audit reports`);
        loadReports();
      } else {
        toast.error("Failed to delete document");
      }
    }
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Reports</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Document Audit Trail Reports</CardTitle>
          <CardDescription>View and download AI-enhanced audit trails for all analyzed documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Analysis Date</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map(report => (
                  <TableRow key={report.documentId}>
                    <TableCell className="font-medium">{report.documentName}</TableCell>
                    <TableCell>{new Date(report.timestamp).toLocaleString()}</TableCell>
                    <TableCell className={
                      report.overallScore >= 80 ? 'text-green-500' : 
                      report.overallScore >= 70 ? 'text-amber-500' : 
                      'text-red-500'
                    }>
                      {report.overallScore}%
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => viewAudit(report.documentName)}>
                        View Audit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadAuditReport(report.documentName)}
                        disabled={generatingReport === report.documentName}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {generatingReport === report.documentName ? 'Generating...' : 'Download Report'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50" 
                        onClick={() => handleDeleteClick(report)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4 border rounded">
              <p className="text-muted-foreground">No audit reports found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{reportToDelete?.documentName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AuditReports;
