
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type SortOption = 'newest' | 'oldest' | 'highScore' | 'lowScore';
export type DateRangeFilter = { from: Date | undefined; to: Date | undefined };

interface ScanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  minScore: number | null;
  onMinScoreChange: (score: number | null) => void;
}

const ScanFilters: React.FC<ScanFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  dateRange,
  onDateRangeChange,
  minScore,
  onMinScoreChange
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search document names..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <Select 
          value={sortOption} 
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highScore">Highest score</SelectItem>
            <SelectItem value="lowScore">Lowest score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[240px] justify-start text-left font-normal"
            >
              <span>
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d, yyyy")} -{" "}
                      {format(dateRange.to, "MMM d, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Select date range"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={(selectedRange) => 
                onDateRangeChange({
                  from: selectedRange?.from,
                  to: selectedRange?.to,
                })
              }
              numberOfMonths={2}
              className="pointer-events-auto"
            />
            <div className="p-3 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
              >
                Clear dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select 
          value={minScore !== null ? minScore.toString() : ''} 
          onValueChange={(value) => onMinScoreChange(value ? parseInt(value, 10) : null)}
        >
          <SelectTrigger className={cn("w-full md:w-[180px]", !minScore && "text-muted-foreground")}>
            <SelectValue placeholder="Min. compliance score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any score</SelectItem>
            <SelectItem value="90">90% or higher</SelectItem>
            <SelectItem value="75">75% or higher</SelectItem>
            <SelectItem value="50">50% or higher</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ScanFilters;
