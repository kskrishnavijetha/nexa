
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceReport } from '@/utils/types';
import AuditTrail from '@/components/audit/AuditTrail';
import ComplianceDetails from './ComplianceDetails';

interface HistoryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedReport: ComplianceReport | null;
  selectedDocument: string | null;
  handleDeleteCurrentDocument: () => void;
  analyzingDocument: string | null;
  reports: ComplianceReport[];
  handleDocumentSelect: (document: string) => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({
  activeTab,
  onTabChange,
  selectedReport,
  selectedDocument,
  handleDeleteCurrentDocument,
  analyzingDocument,
  reports,
  handleDocumentSelect,
}) => {
  return (
    <Tabs 
      value={activeTab}
      className="mb-6"
      onValueChange={onTabChange}
    >
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
      </TabsList>
      
      <TabsContent value="reports" className="mt-6">
        <ComplianceDetails 
          selectedReport={selectedReport}
          selectedDocument={selectedDocument}
          onDelete={handleDeleteCurrentDocument}
          analyzingDocument={analyzingDocument}
          reports={reports}
          onDocumentSelect={handleDocumentSelect}
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
  );
};

export default HistoryTabs;
