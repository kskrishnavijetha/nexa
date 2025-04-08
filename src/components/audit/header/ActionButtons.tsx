
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ExportFormat } from '@/utils/audit/exportLogs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionButtonsProps {
  handleRefresh: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  downloadAuditReport: () => void;
  isGeneratingReport: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleRefresh,
  handleExport,
  downloadAuditReport,
  isGeneratingReport
}) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleRefresh}
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh audit trail data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionButtons;
