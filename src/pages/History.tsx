
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditTrail from '@/components/audit/AuditTrail';
import HistoryHeader from '@/components/history/HistoryHeader';
import RealtimeAnalysisSimulator from '@/components/history/RealtimeAnalysisSimulator';
import InteractiveLogs from '@/components/logs/InteractiveLogs';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoryState } from '@/hooks/useHistoryState';
import ReportsTabContent from '@/components/history/ReportsTabContent';
import DeleteDocumentDialog from '@/components/history/DeleteDocumentDialog';

const History: React.FC = () => {
  const { user } = useAuth();
  const {
    reports,
    selectedDocument,
    activeTab,
    realTimeEnabled,
    lastUpdated,
    analyzingDocument,
    deleteDialogOpen,
    selectedReport,
    setDeleteDialogOpen,
    handleDocumentSelect,
    toggleRealTime,
    handleReportsUpdate,
    handleTabChange,
    handleDeleteCurrentDocument,
    confirmDelete,
    setAnalyzingDocument,
    setLastUpdated
  } = useHistoryState(user);

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
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="logs">Interactive Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <ReportsTabContent
              selectedDocument={selectedDocument}
              reports={reports}
              onSelectDocument={handleDocumentSelect}
              analyzingDocument={analyzingDocument}
              onDeleteClick={handleDeleteCurrentDocument}
              selectedReport={selectedReport}
            />
          </TabsContent>
          
          <TabsContent value="audit" className="mt-6">
            {selectedDocument && selectedReport && (
              <AuditTrail 
                documentName={selectedDocument} 
                industry={selectedReport.industry}
              />
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <InteractiveLogs />
          </TabsContent>
        </Tabs>
      )}
      
      <DeleteDocumentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={selectedDocument}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default History;
