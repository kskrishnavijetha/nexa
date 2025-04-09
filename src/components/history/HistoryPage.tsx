
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditTrail from '@/components/audit/AuditTrail';
import HistoryHeader from '@/components/history/HistoryHeader';
import HistoryContent from '@/components/history/HistoryContent';
import RealtimeAnalysisSimulator from '@/components/history/RealtimeAnalysisSimulator';
import useHistoryState from '@/components/history/hooks/useHistoryState';
import { DeleteDocumentDialog } from '@/components/history/DeleteDocumentDialog';

const HistoryPage: React.FC = () => {
  const location = useLocation();
  const { 
    reports, 
    selectedDocument, 
    activeTab, 
    realTimeEnabled, 
    lastUpdated, 
    analyzingDocument, 
    deleteDialogOpen, 
    setDeleteDialogOpen,
    handleReportsUpdate,
    handleDocumentSelect,
    handleTabChange,
    toggleRealTime,
    getSelectedReport,
    handleDeleteCurrentDocument,
    confirmDelete
  } = useHistoryState(location);

  const selectedReport = getSelectedReport();
  
  return (
    <div className="container mx-auto p-6">
      <HistoryHeader 
        realTimeEnabled={realTimeEnabled} 
        toggleRealTime={toggleRealTime} 
        lastUpdated={lastUpdated.value} 
      />
      
      <RealtimeAnalysisSimulator 
        enabled={realTimeEnabled}
        reports={reports}
        onReportsUpdate={handleReportsUpdate}
        onAnalyzingUpdate={analyzingDocument.setter}
        onLastUpdatedChange={lastUpdated.setter}
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
            <HistoryContent
              selectedDocument={selectedDocument}
              selectedReport={selectedReport}
              reports={reports}
              onSelectDocument={handleDocumentSelect}
              analyzingDocument={analyzingDocument.value}
              onDeleteClick={handleDeleteCurrentDocument}
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
        </Tabs>
      )}
      
      <DeleteDocumentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={selectedDocument || ""}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default HistoryPage;
