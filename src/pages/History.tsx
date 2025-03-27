
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceReport } from '@/utils/types';
import AuditTrail from '@/components/audit/AuditTrail';
import HistoryHeader from '@/components/history/HistoryHeader';
import DocumentSelector from '@/components/history/DocumentSelector';
import ComplianceDetails from '@/components/history/ComplianceDetails';
import RealtimeAnalysisSimulator from '@/components/history/RealtimeAnalysisSimulator';
import { getHistoricalReports } from '@/utils/historyService';
import { useLocation, useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [realTimeEnabled, setRealTimeEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { preventBlink?: boolean; from?: string } | null;

  // Parse URL parameters
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

  // Update URL when selections change, but only if not handling a "preventBlink" state transition
  const updateUrl = useCallback(() => {
    // Skip URL updates during preventBlink navigation to avoid the blinking issue
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
      state: null // Clear the state
    });
  }, [selectedDocument, activeTab, navigate, locationState]);

  // Only update URL when state changes naturally (not from URL)
  useEffect(() => {
    if (!locationState?.preventBlink) {
      updateUrl();
    } else if (locationState.from === 'audit-reports') {
      // If we came from audit-reports, clear the preventBlink state after initial render
      navigate(location.pathname + location.search, {
        replace: true,
        state: null
      });
    }
  }, [selectedDocument, activeTab, updateUrl, locationState, navigate, location.pathname, location.search]);

  useEffect(() => {
    // Load reports from history service
    const historicalReports = getHistoricalReports();
    console.log('History page loaded reports:', historicalReports.length);
    setReports(historicalReports);
    
    // Set selected document to the first report if available
    if (historicalReports.length > 0 && !selectedDocument) {
      setSelectedDocument(historicalReports[0].documentName);
      console.log('Selected document set to:', historicalReports[0].documentName);
    } else if (historicalReports.length === 0) {
      console.log('No historical reports found');
    }
  }, []);

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
    setReports(updatedReports);
    
    // If we don't have a selected document yet, select the first one
    if (!selectedDocument && updatedReports.length > 0) {
      setSelectedDocument(updatedReports[0].documentName);
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
        <div className="mt-10 text-center p-10 border rounded-lg bg-slate-50">
          <h3 className="text-xl font-medium text-slate-700">No compliance reports found</h3>
          <p className="mt-2 text-slate-500">Upload and analyze documents to see them here</p>
        </div>
      ) : (
        <Tabs 
          value={activeTab}
          className="mb-6"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Document Reports</h2>
                <DocumentSelector 
                  selectedDocument={selectedDocument}
                  reports={reports}
                  onSelectDocument={handleDocumentSelect}
                  analyzingDocument={analyzingDocument}
                />
              </div>
              
              {selectedReport ? (
                <div className="grid grid-cols-1 gap-6">
                  <ComplianceDetails report={selectedReport} />
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-slate-50 text-center">
                  <p>Select a document to view details</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="audit" className="mt-6">
            {selectedDocument && (
              <AuditTrail documentName={selectedDocument} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default History;
