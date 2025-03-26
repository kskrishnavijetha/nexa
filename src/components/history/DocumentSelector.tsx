
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText } from 'lucide-react';

interface DocumentSelectorProps {
  selectedDocument: string | null;
  reports: ComplianceReport[];
  onSelectDocument: (documentName: string) => void;
  analyzingDocument: string | null;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selectedDocument,
  reports,
  onSelectDocument,
  analyzingDocument
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {selectedDocument || 'Select Document'}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-[300px]">
              <div className="font-medium mb-2">Documents</div>
              <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {reports.map((scan) => (
                  <li 
                    key={scan.documentId}
                    className="cursor-pointer rounded p-2 hover:bg-slate-100"
                    onClick={() => onSelectDocument(scan.documentName)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{scan.documentName}</span>
                      {scan.documentName === selectedDocument && (
                        <Badge variant="outline" className="ml-2">Selected</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {analyzingDocument && (
                <div className="mt-4 p-2 border border-blue-200 rounded bg-blue-50">
                  <div className="flex items-center text-sm text-blue-600">
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    <FileText className="h-3 w-3 mr-2" />
                    <span>Analyzing: {analyzingDocument}</span>
                  </div>
                </div>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DocumentSelector;
