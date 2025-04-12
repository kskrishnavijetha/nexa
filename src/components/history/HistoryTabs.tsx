
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceReport } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Trash2, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReportFromHistory } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import AuditTrail from '@/components/audit/AuditTrail';
import DocumentSelector from './DocumentSelector';
import ComplianceDetails from './ComplianceDetails';
import DeleteDocumentDialog from './DeleteDocumentDialog';
import SlackAuditTrail from '../slack/SlackAuditTrail';

interface HistoryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedDocument: string | null;
  selectedReport: ComplianceReport | null;
  reports: ComplianceReport[];
  onSelectDocument: (documentName: string) => void;
  analyzingDocument: string | null;
  onReportsChange: () => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({
  activeTab,
  onTabChange,
  selectedDocument,
  selectedReport,
  reports,
  onSelectDocument,
  analyzingDocument,
  onReportsChange
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

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
          onReportsChange();
          
          if (reports.length > 1) {
            const newSelectedIndex = reports.findIndex(r => r.documentName === selectedDocument);
            const newSelected = reports[newSelectedIndex === 0 ? 1 : newSelectedIndex - 1];
            onSelectDocument(newSelected.documentName);
          } else {
            onSelectDocument("" as any);
          }
        } else {
          toast.error("Failed to delete document");
        }
      }
    }
    setDeleteDialogOpen(false);
  };

  // Check if the selected document is a Slack scan or simulation
  const isSlackScan = selectedDocument?.toLowerCase().includes('slack');
  const isSimulation = selectedReport?.isSimulation || selectedDocument?.toLowerCase().includes('simulation');

  return (
    <>
      <Tabs 
        value={activeTab}
        className="mb-6"
        onValueChange={onTabChange}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isSimulation ? (
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-blue-600" />
                    Simulation Report
                  </div>
                ) : (
                  "Document Reports"
                )}
              </h2>
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
                  onSelectDocument={onSelectDocument}
                  analyzingDocument={analyzingDocument}
                />
              </div>
            </div>
            
            {selectedReport ? (
              <div className="grid grid-cols-1 gap-6">
                {isSimulation && selectedReport.simulationDetails && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-blue-800 font-medium flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Simulation: {selectedReport.simulationDetails.scenarioName}
                    </h3>
                    <p className="text-blue-600 mt-1 text-sm">
                      This is a predictive simulation based on document: {selectedReport.simulationDetails.baseDocumentName || "Unknown"}
                    </p>
                    <p className="text-sm text-blue-500 mt-2">
                      Analysis date: {new Date(selectedReport.simulationDetails.analysisDate).toLocaleString()}
                    </p>
                  </div>
                )}
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
        
        <TabsContent value="logs" className="mt-6">
          {selectedDocument && selectedReport && (
            <div className="mt-4">
              {/* Display Slack-specific audit if it's a Slack scan */}
              {isSlackScan ? (
                <SlackAuditTrail scanResults={{ 
                  scanId: selectedReport.documentId,
                  timestamp: selectedReport.timestamp,
                  violations: selectedReport.risks.map(risk => ({
                    messageId: risk.id || Math.random().toString(),
                    text: risk.description,
                    severity: risk.severity as any,
                    rule: risk.title,
                    context: risk.description,
                    channel: 'general',
                    user: selectedReport.organization || 'User',
                    timestamp: selectedReport.timestamp
                  })),
                  scannedMessages: 100,
                  scannedFiles: 10,
                  status: 'completed'
                }} />
              ) : (
                <AuditTrail 
                  documentName={selectedDocument} 
                  industry={selectedReport.industry}
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DeleteDocumentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentName={selectedDocument || ""}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default HistoryTabs;
