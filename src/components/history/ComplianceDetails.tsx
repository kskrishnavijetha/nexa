
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import DocumentSelector from './DocumentSelector';

interface ComplianceDetailsProps {
  selectedReport: ComplianceReport | null;
  selectedDocument: string | null;
  onDelete: () => void;
  analyzingDocument: string | null;
  reports: ComplianceReport[];
  onDocumentSelect: (document: string) => void;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({
  selectedReport,
  selectedDocument,
  onDelete,
  analyzingDocument,
  reports,
  onDocumentSelect
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
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Document
            </Button>
          )}
          <DocumentSelector 
            selectedDocument={selectedDocument}
            reports={reports}
            onSelectDocument={onDocumentSelect}
            analyzingDocument={analyzingDocument}
          />
        </div>
      </div>
      
      {selectedReport ? (
        <div className="grid grid-cols-1 gap-6">
          <ComplianceReport report={selectedReport} />
        </div>
      ) : (
        <div className="p-4 border rounded-md bg-slate-50 text-center">
          <p>Select a document to view details</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceDetails;
