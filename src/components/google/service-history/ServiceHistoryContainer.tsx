
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceHistoryTable } from './ServiceHistoryTable';
import { EmptyState } from './EmptyState';
import { AuditTrailDialog } from './AuditTrailDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ComplianceReport } from '@/utils/types';
import { deleteReportFromHistory, getUserHistoricalReports, getReportById } from '@/utils/historyService';
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
  const intervalRef = useRef<number | null>(null);
  
  const { reports, setReports, loadReports } = useReportState(user, scanHistory);
  
  useEffect(() => {
    console.log('ServiceHistory: User changed, updating history store with user ID:', user?.id);
    if (user) {
      setUserId(user.id);
      loadReports();
    } else {
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
  
  useEffect(() => {
    // Clear existing interval to prevent memory leaks
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    
    // Set a new interval
    intervalRef.current = window.setInterval(() => {
      loadReports();
    }, 5000);
    
    // Cleanup function
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loadReports]);
  
  const handleDocumentClick = (document: string, report?: ComplianceReport) => {
    setSelectedDocument(document);
    
    if (report && report.risks && report.risks.length > 0) {
      setSelectedReport(report);
      setAuditDialogOpen(true);
      return;
    }
    
    if (report?.documentId) {
      const completeReport = getReportById(report.documentId);
      if (completeReport) {
        console.log('Found more complete report data:', completeReport.documentName);
        setSelectedReport(completeReport);
      } else {
        setSelectedReport(report);
      }
    } else {
      setSelectedReport(report || null);
    }
    
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
          setReports(getUserHistoricalReports(user.id));
        } else {
          toast.error("Failed to delete document");
        }
      } else {
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

      <AuditTrailDialog
        isOpen={auditDialogOpen}
        onOpenChange={setAuditDialogOpen}
        documentName={selectedDocument}
        report={selectedReport}
      />
      
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
