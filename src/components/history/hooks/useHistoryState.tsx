
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ComplianceReport } from '@/utils/types';
import { getHistoricalReports, deleteReportFromHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const useHistoryState = (location: ReturnType<typeof useLocation>) => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [realTimeEnabled, setRealTimeEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const locationState = location.state as { preventBlink?: boolean; from?: string } | null;
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const documentParam = params.get('document');
    const tabParam = params.get('tab');
    
    if (documentParam) {
      setSelectedDocument(documentParam);
    }
    
    if (tabParam && (tabParam === 'reports' || tabParam === 'audit')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const updateUrl = useCallback(() => {
    if (locationState?.preventBlink) {
      return;
    }
    
    const params = new URLSearchParams();
    if (selectedDocument) {
      params.set('document', selectedDocument);
    }
    params.set('tab', activeTab);
    
    navigate(`/history?${params.toString()}`, { 
      replace: true,
      state: null
    });
  }, [selectedDocument, activeTab, navigate, locationState]);

  useEffect(() => {
    if (!locationState?.preventBlink) {
      updateUrl();
    } else if (locationState.from === 'action-items' || locationState.from === 'audit-reports') {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null
      });
    }
  }, [selectedDocument, activeTab, updateUrl, locationState, navigate, location.pathname, location.search]);

  const loadReports = useCallback(() => {
    const historicalReports = getHistoricalReports();
    console.log('History page loaded reports (total):', historicalReports.length);
    
    const userReports = user ? historicalReports.filter(report => report.userId === user.id) : [];
    console.log(`Filtered reports for user ${user?.id}:`, userReports.length);
    
    setReports(userReports);
    
    if (userReports.length > 0 && !selectedDocument) {
      setSelectedDocument(userReports[0].documentName);
      console.log('Selected document set to:', userReports[0].documentName);
    } else if (userReports.length === 0) {
      console.log('No historical reports found for this user');
      setSelectedDocument(null);
    }
  }, [user, selectedDocument]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDocumentSelect = (documentName: string) => {
    console.log('Document selected:', documentName);
    setSelectedDocument(documentName);
  };

  const toggleRealTime = () => {
    setRealTimeEnabled(!realTimeEnabled);
    if (!realTimeEnabled) {
      setLastUpdated(new Date());
    }
  };

  const getSelectedReport = useCallback(() => {
    if (!selectedDocument || reports.length === 0) {
      return null;
    }
    return reports.find(scan => scan.documentName === selectedDocument) || reports[0];
  }, [selectedDocument, reports]);

  const handleReportsUpdate = (updatedReports: ComplianceReport[]) => {
    console.log('Reports updated, new count:', updatedReports.length);
    
    const userReports = user ? updatedReports.filter(report => report.userId === user.id) : [];
    setReports(userReports);
    
    if (!selectedDocument && userReports.length > 0) {
      setSelectedDocument(userReports[0].documentName);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDeleteCurrentDocument = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument && user) {
      const reportToDelete = reports.find(r => r.documentName === selectedDocument);
      if (reportToDelete) {
        const deleted = deleteReportFromHistory(reportToDelete.documentId, user.id);
        if (deleted) {
          toast.success(`Document "${selectedDocument}" has been permanently deleted from history`);
          loadReports();
          
          if (reports.length > 1) {
            const newSelectedIndex = reports.findIndex(r => r.documentName === selectedDocument);
            const newSelected = reports[newSelectedIndex === 0 ? 1 : newSelectedIndex - 1];
            setSelectedDocument(newSelected.documentName);
          } else {
            setSelectedDocument(null);
          }
        } else {
          toast.error("Failed to delete document");
        }
      }
    }
    setDeleteDialogOpen(false);
  };

  return {
    reports,
    selectedDocument,
    activeTab,
    realTimeEnabled,
    lastUpdated,
    setLastUpdated, // Export the setter function for lastUpdated
    analyzingDocument: { 
      value: analyzingDocument, 
      setter: setAnalyzingDocument 
    },
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleReportsUpdate,
    handleDocumentSelect,
    handleTabChange,
    toggleRealTime,
    getSelectedReport,
    handleDeleteCurrentDocument,
    confirmDelete
  };
};

export default useHistoryState;
