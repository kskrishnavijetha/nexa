
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface DocumentSelectorProps {
  selectedDocument: string | null;
  reports: ComplianceReport[];
  onSelectDocument: (documentName: string) => void;
  analyzingDocument?: string | null;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ 
  selectedDocument, 
  reports, 
  onSelectDocument,
  analyzingDocument
}) => {
  // Group reports by document name to avoid duplicates in the selector
  const uniqueDocuments = Array.from(
    new Set(reports.map(report => report.documentName))
  );

  return (
    <Select
      value={selectedDocument || undefined}
      onValueChange={onSelectDocument}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a document" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {uniqueDocuments.map(documentName => (
            <SelectItem 
              key={documentName} 
              value={documentName}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                {documentName}
                {analyzingDocument === documentName && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DocumentSelector;
