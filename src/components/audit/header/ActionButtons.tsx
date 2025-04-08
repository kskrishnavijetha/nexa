
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, FileText, FileSpreadsheet, File } from 'lucide-react';
import { toast } from 'sonner';
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExport('json')} className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            JSON Format
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV Spreadsheet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
            <File className="h-4 w-4 mr-2" />
            PDF Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="default" 
        size="sm" 
        className="gap-1"
        onClick={downloadAuditReport}
        disabled={isGeneratingReport}
      >
        {isGeneratingReport ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>AI Enhanced Report</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
