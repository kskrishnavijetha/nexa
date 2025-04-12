
import React from 'react';
import { Check, ChevronDown, ChevronUp, Loader2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ComplianceReport } from '@/utils/types';

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
  const [open, setOpen] = React.useState(false);

  if (reports.length === 0) {
    return <Button disabled>No reports available</Button>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          {selectedDocument ? (
            <span className="truncate max-w-[200px] flex-1 text-left">
              {selectedDocument}
            </span>
          ) : (
            "Select document..."
          )}
          <div className="flex gap-1">
            {analyzingDocument && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {open ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search documents..." />
          <CommandList>
            <CommandEmpty>No documents found.</CommandEmpty>
            <CommandGroup>
              {reports.map((report) => {
                // Check if report is a simulation
                const isSimulation = report.isSimulation || report.documentName.toLowerCase().includes('simulation');
                
                return (
                  <CommandItem
                    key={report.documentId}
                    value={report.documentName}
                    onSelect={() => {
                      onSelectDocument(report.documentName);
                      setOpen(false);
                    }}
                    className="flex items-center"
                  >
                    {isSimulation && <BarChart className="mr-2 h-4 w-4 text-blue-500" />}
                    <span className="flex-1 truncate">{report.documentName}</span>
                    {selectedDocument === report.documentName && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                    {analyzingDocument === report.documentName && (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DocumentSelector;
