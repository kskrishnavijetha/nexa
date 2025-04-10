
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditTrail from '@/components/audit/AuditTrail';
import HistoryHeader from '@/components/history/HistoryHeader';
import DocumentSelector from '@/components/history/DocumentSelector';
import ComplianceDetails from '@/components/history/ComplianceDetails';
import RealtimeAnalysisSimulator from '@/components/history/RealtimeAnalysisSimulator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import DeleteConfirmationDialog from '@/components/history/DeleteConfirmationDialog';
import EmptyHistoryState from '@/components/history/EmptyHistoryState';
import { useHistoryState } from '@/hooks/useHistoryState';
import { useHistoryUrlState } from '@/hooks/useHistoryUrlState';

const History: React.FC = () => {
  const {
    reports,
    selectedDocument,
    activeTab,
    realTimeEnabled,
    lastUpdated,
    analyzingDocument,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedReport,
    handleDocumentSelect,
    toggleRealTime,
    handleReportsUpdate,
    handleDeleteCurrentDocument,
    confirmDelete,
    handleTabChange,
    setAnalyzingDocument,
    setLastUpdated,
  } = useHistoryState();

  // Manage URL state
  useHistoryUrlState({
    selectedDocument,
    activeTab,
  });

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
                <div className="flex items-center gap-4">
                  {selectedDocument && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={handleDeleteCurrentDocument}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Document
                    </Button>
                  )}
                  <DocumentSelector 
                    selectedDocument={selectedDocument}
                    reports={reports}
                    onSelectDocument={handleDocumentSelect}
                    analyzingDocument={analyzingDocument}
                  />
                </div>
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
            {selectedDocument && selectedReport && (
              <AuditTrail 
                documentName={selectedDocument} 
                industry={selectedReport.industry}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedDocument={selectedDocument}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default History;
