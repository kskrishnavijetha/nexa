
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceHistoryTable } from './ServiceHistoryTable';
import { EmptyState } from './EmptyState';
import { AuditTrailDialog } from './AuditTrailDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ComplianceReport } from '@/utils/types';
import { deleteReportFromHistory, getUserHistoricalReports } from '@/utils/historyService';
import { toast } from 'sonner';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { translate } from '@/utils/language';
import { useReportState } from './hooks/useReportState';

const ServiceHistoryContainer: React.FC = () => {
  const { userId, setUserId, scanHistory } = useServiceHistoryStore();
  const { user } = useAuth();
  const { language } = useLanguagePreference();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Use our custom hook to manage report state and loading
  const { reports, setReports, loadReports } = useReportState(user, scanHistory);
  
  // Update the user ID in the store when the user changes
  useEffect(() => {
    console.log('ServiceHistory: User changed, updating history store with user ID:', user?.id);
    if (user) {
      setUserId(user.id);
      loadReports();
    } else {
      // For anonymous users, try to load from local storage
      const anonymousHistoryStr = localStorage.getItem('nexabloom_anonymous_history');
      
      if (anonymousHistoryStr) {
        try {
          const anonHistory = JSON.parse(anonymousHistoryStr);
          if (anonHistory.scanHistory && anonHistory.scanHistory.length > 0) {
            console.log('Found anonymous history:', anonHistory.scanHistory.length);
            loadReports();
          }
        } catch (e) {
          console.error('Error parsing anonymous history:', e);
        }
      } else {
        setUserId(null);
        setReports([]);
      }
    }
  }, [user, setUserId, loadReports, setReports]);
  
  // Force a refresh of reports periodically, but use a longer interval to prevent excessive renders
  useEffect(() => {
    const interval = setInterval(() => {
      loadReports();
    }, 5000); // Increased to 5 seconds to reduce potential recursive renders
    return () => clearInterval(interval);
  }, [loadReports]);
  
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
      industry: 'Global' as any,
      overallScore: 85,
      gdprScore: 80,
      hipaaScore: 75,
      soc2Score: 90,
      summary: item.fileName ? `Scan of ${item.fileName}` : 'Anonymous scan',
      risks: [],
      complianceStatus: 'Compliant',
      regulations: ['GDPR']
    })) : [];

  // Render empty state when nothing to show
  if (displayReports.length === 0) {
    return (
      <EmptyState 
        title={user ? translate("no_scan_history_yet", language) : translate("please_sign_in", language)}
        description={user ? translate("connect_services_text", language) : translate("sign_in_to_view", language)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          {translate("service_scan_history", language)} {user && `- ${user.email}`}
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
      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={documentToDelete?.name || ""}
        language={language}
        onConfirm={confirmDelete}
      />
    </Card>
  );
};

export default ServiceHistoryContainer;
