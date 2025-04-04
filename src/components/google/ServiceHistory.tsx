
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceHistoryTable } from './service-history/ServiceHistoryTable';
import { EmptyState } from './service-history/EmptyState';
import { AuditTrailDialog } from './service-history/AuditTrailDialog';
import { ComplianceReport } from '@/utils/types';
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
import { toast } from 'sonner';
import { deleteReportFromHistory, getUserHistoricalReports } from '@/utils/historyService';

const ServiceHistory: React.FC = () => {
  const { userId, setUserId, scanHistory } = useServiceHistoryStore();
  const { user } = useAuth();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string, name: string} | null>(null);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  
  // Update the user ID in the store when the user changes
  useEffect(() => {
    console.log('ServiceHistory: User changed, updating history store with user ID:', user?.id);
    if (user) {
      setUserId(user.id);
      // Fetch user's historical reports
      const userReports = getUserHistoricalReports(user.id);
      console.log('ServiceHistory: Loaded reports for user:', userReports.length);
      setReports(userReports);
    } else {
      // For anonymous users, try to load from local storage
      const sessionId = localStorage.getItem('nexabloom_session_id');
      const anonymousHistoryStr = localStorage.getItem('nexabloom_anonymous_history');
      
      if (anonymousHistoryStr) {
        try {
          const anonHistory = JSON.parse(anonymousHistoryStr);
          if (anonHistory.scanHistory && anonHistory.scanHistory.length > 0) {
            console.log('Found anonymous history:', anonHistory.scanHistory.length);
            // We're not setting userId here to avoid conflicts
            setReports(
              anonHistory.scanHistory.map((item: any) => ({
                documentId: item.serviceId,
                documentName: item.documentName || 'Anonymous Scan',
                scanDate: item.scanDate,
                timestamp: item.scanDate,
                industry: 'Global',
                overallScore: 85,
                gdprScore: 80,
                hipaaScore: 75,
                soc2Score: 90,
                summary: item.fileName ? `Scan of ${item.fileName}` : 'Anonymous scan',
                risks: [],
                complianceStatus: 'Compliant',
                regulations: ['GDPR', 'HIPAA', 'SOC2']
              }))
            );
          }
        } catch (e) {
          console.error('Error parsing anonymous history:', e);
        }
      } else {
        setUserId(null);
        setReports([]);
      }
    }
  }, [user, setUserId]);
  
  // Force a refresh of reports periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const userReports = getUserHistoricalReports(user.id);
        if (userReports.length !== reports.length) {
          console.log('ServiceHistory: Refreshing reports, found:', userReports.length);
          setReports(userReports);
        }
      } else if (scanHistory.length > 0 && reports.length !== scanHistory.length) {
        // For anonymous users, refresh from the store
        console.log('Anonymous history updated, refreshing view');
        setReports(scanHistory.map((item: any) => ({
          documentId: item.serviceId,
          documentName: item.documentName || 'Anonymous Scan',
          scanDate: item.scanDate,
          timestamp: item.scanDate,
          industry: 'Global',
          overallScore: 85,
          summary: item.fileName ? `Scan of ${item.fileName}` : 'Anonymous scan',
          risks: [],
          complianceStatus: 'Compliant',
          regulations: ['GDPR']
        })));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [user, reports.length, scanHistory]);
  
  const handleDocumentClick = (document: string, report?: ComplianceReport) => {
    setSelectedDocument(document);
    setSelectedReport(report || null);
    setAuditDialogOpen(true);
  };

  const handleDeleteClick = (docId: string, docName: string) => {
    setDocumentToDelete({ id: docId, name: docName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      if (user) {
        const deleted = deleteReportFromHistory(documentToDelete.id, user.id);
        if (deleted) {
          toast.success(`Document "${documentToDelete.name}" has been permanently deleted from history`);
          // Refresh the reports
          setReports(getUserHistoricalReports(user.id));
        } else {
          toast.error("Failed to delete document");
        }
      } else {
        // Handle anonymous deletes
        const anonymousHistoryStr = localStorage.getItem('nexabloom_anonymous_history');
        if (anonymousHistoryStr) {
          try {
            const anonHistory = JSON.parse(anonymousHistoryStr);
            if (anonHistory.scanHistory) {
              const newHistory = anonHistory.scanHistory.filter(
                (item: any) => item.serviceId !== documentToDelete.id
              );
              anonHistory.scanHistory = newHistory;
              localStorage.setItem('nexabloom_anonymous_history', JSON.stringify(anonHistory));
              
              // Update local state
              setReports(prev => prev.filter(r => r.documentId !== documentToDelete.id));
              toast.success(`Document "${documentToDelete.name}" has been deleted`);
            }
          } catch (e) {
            console.error('Error handling anonymous delete:', e);
            toast.error("Failed to delete document");
          }
        }
      }
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Use scanHistory for rendering if no reports but scanHistory exists
  const displayReports = reports.length > 0 ? reports : 
    scanHistory.length > 0 ? scanHistory.map((item: any) => ({
      documentId: item.serviceId,
      documentName: item.documentName || 'Anonymous Scan',
      scanDate: item.scanDate,
      timestamp: item.scanDate,
      industry: 'Global',
      overallScore: 85,
      summary: item.fileName ? `Scan of ${item.fileName}` : 'Anonymous scan',
      risks: [],
      complianceStatus: 'Compliant',
      regulations: ['GDPR']
    })) : [];

  // Render empty state when nothing to show
  if (displayReports.length === 0) {
    return (
      <EmptyState 
        title={user ? "No scan history yet" : "Please sign in to view your history"}
        description={user ? "Connect services and run scans to see your history here" : "Sign in to view and manage your scan history"}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Service Scan History {user && `- ${user.email}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceHistoryTable 
          scanHistory={displayReports} 
          onDocumentClick={handleDocumentClick} 
          onDeleteClick={handleDeleteClick}
        />
      </CardContent>

      {/* Audit Trail Dialog */}
      <AuditTrailDialog
        isOpen={auditDialogOpen}
        onOpenChange={setAuditDialogOpen}
        documentName={selectedDocument}
        report={selectedReport}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{documentToDelete?.name}" from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ServiceHistory;
