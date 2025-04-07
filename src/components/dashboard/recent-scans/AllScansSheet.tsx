
import React, { useState, useMemo } from 'react';
import { ComplianceReport } from '@/utils/types';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import ScanFilters, { SortOption, DateRangeFilter } from './ScanFilters';

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
  // Filtering and sorting state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ from: undefined, to: undefined });
  const [minScore, setMinScore] = useState<number | null>(null);

  // Filter and sort scans based on current filter settings
  const filteredScans = useMemo(() => {
    return scans
      .filter(scan => {
        // Apply document name search filter
        const nameMatch = !searchQuery || 
          scan.documentName.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Apply date range filter
        const scanDate = scan.timestamp ? new Date(scan.timestamp) : null;
        const dateMatch = (!dateRange.from || !scanDate) || 
          (scanDate >= dateRange.from && 
           (!dateRange.to || scanDate <= dateRange.to));
        
        // Apply minimum score filter
        const scoreMatch = minScore === null || scan.overallScore >= minScore;
        
        return nameMatch && dateMatch && scoreMatch;
      })
      .sort((a, b) => {
        // Apply sorting
        switch (sortOption) {
          case 'newest':
            return new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime();
          case 'oldest':
            return new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime();
          case 'highScore':
            return b.overallScore - a.overallScore;
          case 'lowScore':
            return a.overallScore - b.overallScore;
          default:
            return 0;
        }
      });
  }, [scans, searchQuery, sortOption, dateRange, minScore]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>All Document Scans</SheetTitle>
          <SheetDescription>
            View and filter your compliance scan history
          </SheetDescription>
        </SheetHeader>
        
        {/* Filters Section */}
        <ScanFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          minScore={minScore}
          onMinScoreChange={setMinScore}
        />
        
        <div className="py-4 space-y-2 mt-4">
          {filteredScans.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                Found {filteredScans.length} {filteredScans.length === 1 ? 'scan' : 'scans'}
              </div>
              {filteredScans.map((scan) => (
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
              ))}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {scans.length > 0 ? 'No scans match your filters.' : 'No scan history available.'}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AllScansSheet;
