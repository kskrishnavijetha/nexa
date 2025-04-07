
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AllScansSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scans: ComplianceReport[];
  onSelectScan: (report: ComplianceReport, tabToNavigate?: string) => void;
  formatDate: (dateString?: string) => string;
}

const AllScansSheet: React.FC<AllScansSheetProps> = ({
  isOpen,
  onOpenChange,
  scans,
  onSelectScan,
  formatDate
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>All Document Scans</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-2">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <div 
                key={scan.documentId}
                className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                onClick={() => onSelectScan(scan)}
              >
                <div>
                  <p className="font-medium">{scan.documentName}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(scan.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <span className={`font-medium ${
                      scan.overallScore >= 90 ? 'text-green-600' : 
                      scan.overallScore >= 75 ? 'text-amber-600' : 
                      'text-red-600'
                    }`}>
                      {scan.overallScore}%
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScan(scan, 'actions');
                      }}
                    >
                      Actions
                    </Button>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No scan history available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllScansSheet;
