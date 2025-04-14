
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import { getHistoricalReports } from '@/utils/historyService';
import HistoryHeader from './HistoryHeader';
import DocumentSelector from './DocumentSelector';
import HistoryTabs from './HistoryTabs';
import RealtimeAnalysisSimulator from './RealtimeAnalysisSimulator';
import { toast } from 'sonner';

const HistoryContainer: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [realTimeEnabled, setRealTimeEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { preventBlink?: boolean; from?: string } | null;
  const { user } = useAuth();

  // Parse URL parameters on component mount
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

  // Update URL based on selected document and active tab
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

  // Update URL when selected document or active tab changes
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

  // Load reports data
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

  const getSelectedReport = () => {
    if (!selectedDocument || reports.length === 0) {
      return null;
    }
    return reports.find(scan => scan.documentName === selectedDocument) || reports[0];
  };

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

  const selectedReport = getSelectedReport();

  return (
    <div className="container mx-auto p-6">
      <HistoryHeader 
        realTimeEnabled={realTimeEnabled} 
        toggleRealTime={toggleRealTime} 
        lastUpdated={lastUpdated} 
      />
      
      <RealtimeAnalysisSimulator 
        enabled={realTimeEnabled}
        reports={reports}
        onReportsUpdate={handleReportsUpdate}
        onAnalyzingUpdate={setAnalyzingDocument}
        onLastUpdatedChange={setLastUpdated}
      />
      
      {reports.length === 0 ? (
        <EmptyHistoryState />
      ) : (
        <HistoryTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedDocument={selectedDocument}
          selectedReport={selectedReport}
          reports={reports}
          onSelectDocument={handleDocumentSelect}
          analyzingDocument={analyzingDocument}
          onReportsChange={loadReports}
        />
      )}
    </div>
  );
};

const EmptyHistoryState: React.FC = () => {
  return (
    <div className="mt-10 text-center p-10 border rounded-lg bg-slate-50">
      <h3 className="text-xl font-medium text-slate-700">No compliance reports found</h3>
      <p className="mt-2 text-slate-500">Upload and analyze documents to see them here</p>
    </div>
  );
};

export default HistoryContainer;
