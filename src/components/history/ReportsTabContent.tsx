
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import DocumentSelector from '@/components/history/DocumentSelector';
import ComplianceDetails from '@/components/history/ComplianceDetails';

interface ReportsTabContentProps {
  selectedDocument: string | null;
  reports: ComplianceReport[];
  onSelectDocument: (documentName: string) => void;
  analyzingDocument: string | null;
  onDeleteClick: () => void;
  selectedReport: ComplianceReport | null;
}

const ReportsTabContent: React.FC<ReportsTabContentProps> = ({
  selectedDocument,
  reports,
  onSelectDocument,
  analyzingDocument,
  onDeleteClick,
  selectedReport
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Reports</h2>
        <div className="flex items-center gap-4">
          {selectedDocument && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={onDeleteClick}
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
          <ComplianceDetails report={selectedReport} />
        </div>
      ) : (
        <div className="p-4 border rounded-md bg-slate-50 text-center">
          <p>Select a document to view details</p>
        </div>
      )}
    </div>
  );
};

export default ReportsTabContent;
