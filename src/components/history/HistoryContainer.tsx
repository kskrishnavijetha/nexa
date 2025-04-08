
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceReport } from '@/utils/types';
import AuditTrail from '@/components/audit/AuditTrail';
import HistoryHeader from './HistoryHeader';
import DocumentSelector from './DocumentSelector';
import ComplianceDetails from './ComplianceDetails';
import RealtimeAnalysisSimulator from './RealtimeAnalysisSimulator';
import { useHistoryState } from './hooks/useHistoryState';
import DeleteDocumentDialog from './DeleteDocumentDialog';

const HistoryContainer: React.FC = () => {
  const {
    reports,
    selectedDocument,
    setSelectedDocument,
    activeTab,
    setActiveTab,
    realTimeEnabled,
    setRealTimeEnabled,
    lastUpdated,
    setLastUpdated,
    analyzingDocument,
    setAnalyzingDocument,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteCurrentDocument,
    confirmDelete,
    loadReports,
  } = useHistoryState();

  const getSelectedReport = () => {
    if (!selectedDocument || reports.length === 0) {
      return null;
    }
    return reports.find(scan => scan.documentName === selectedDocument) || reports[0];
  };

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

  const handleReportsUpdate = (updatedReports: ComplianceReport[]) => {
    loadReports();
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
                <div className="flex items-center gap-4">
                  {selectedDocument && (
                    <DeleteDocumentDialog 
                      selectedDocument={selectedDocument}
                      onDelete={handleDeleteCurrentDocument}
                    />
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
      
      <DeleteDocumentDialog.Confirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={selectedDocument || ""}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default HistoryContainer;
