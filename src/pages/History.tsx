
import React from 'react';
import HistoryHeader from '@/components/history/HistoryHeader';
import EmptyHistoryState from '@/components/history/EmptyHistoryState';
import HistoryTabs from '@/components/history/HistoryTabs';
import DeleteConfirmationDialog from '@/components/history/DeleteConfirmationDialog';
import RealtimeAnalysisSimulator from '@/components/history/RealtimeAnalysisSimulator';
import { useHistoryState } from '@/hooks/useHistoryState';

const History: React.FC = () => {
  const {
    reports,
    selectedDocument,
    activeTab,
    realTimeEnabled,
    lastUpdated,
    analyzingDocument,
    deleteDialogOpen,
    selectedReport,
    handleDocumentSelect,
    handleTabChange,
    toggleRealTime,
    handleReportsUpdate,
    setAnalyzingDocument,
    setLastUpdated,
    handleDeleteCurrentDocument,
    setDeleteDialogOpen,
    confirmDelete
  } = useHistoryState();

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
          selectedReport={selectedReport}
          selectedDocument={selectedDocument}
          handleDeleteCurrentDocument={handleDeleteCurrentDocument}
          analyzingDocument={analyzingDocument}
          reports={reports}
          handleDocumentSelect={handleDocumentSelect}
        />
      )}
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={selectedDocument}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default History;
