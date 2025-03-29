
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
import { deleteReportFromHistory } from '@/utils/historyService';

const ServiceHistory: React.FC = () => {
  const { scanHistory, setUserId } = useServiceHistoryStore();
  const { user } = useAuth();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Update the user ID in the store when the user changes
  useEffect(() => {
    console.log('ServiceHistory: User changed, updating history store with user ID:', user?.id);
    if (user) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [user, setUserId]);
  
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
    if (documentToDelete && user) {
      const deleted = deleteReportFromHistory(documentToDelete.id, user.id);
      if (deleted) {
        toast.success(`Document "${documentToDelete.name}" has been permanently deleted`);
        // Reset the document to delete
        setDocumentToDelete(null);
        // Refresh the scanHistory here if needed
      } else {
        toast.error("Failed to delete document");
      }
    }
    setDeleteDialogOpen(false);
  };

  // Render empty state for non-authenticated users
  if (!user) {
    return (
      <EmptyState 
        title="Please sign in to view your history"
        description="Sign in to view and manage your scan history"
      />
    );
  }

  // Render empty state for no scan history
  if (scanHistory.length === 0) {
    return (
      <EmptyState 
        title="No scan history yet"
        description="Connect services and run scans to see your history here"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Service Scan History - {user.email}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceHistoryTable 
          scanHistory={scanHistory} 
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
              Are you sure you want to permanently delete "{documentToDelete?.name}"? This action cannot be undone.
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
