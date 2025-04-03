
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ViewModeToggleProps {
  isCompactView: boolean;
  onToggle: () => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ isCompactView, onToggle }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // On mobile devices, always use compact view and don't show the toggle
    return null;
  }
  
  return (
    <div className="flex items-center mb-4">
      <span className="text-sm text-muted-foreground mr-2">View:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        title={isCompactView ? "Switch to standard view" : "Switch to compact view"}
        className="px-2"
      >
        {isCompactView ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
        <span className="ml-2 hidden sm:inline">
          {isCompactView ? "Standard" : "Compact"}
        </span>
      </Button>
    </div>
  );
};

export default ViewModeToggle;
