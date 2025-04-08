
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HelpCircle, RefreshCw, FileJson, FileSpreadsheet, FilePdf } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getScoreColor } from '@/utils/reports';
import { exportAuditLogs, ExportFormat } from '@/utils/audit/exportLogs';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { auditEvents, isGeneratingReport, downloadAuditReport, setLastActivity, industry } = useAuditTrail();

  const handleRefresh = () => {
    // Just update the last activity timestamp to trigger new events
    // without reloading the page or clearing existing events
    setLastActivity(new Date());
  };

  // Calculate compliance score based on audit events
  const calculateComplianceScore = (): number => {
    if (auditEvents.length === 0) return 100;
    
    const completedEvents = auditEvents.filter(event => event.status === 'completed').length;
    const totalEvents = auditEvents.length;
    
    return Math.round((completedEvents / totalEvents) * 100);
  };

  const handleExport = (format: ExportFormat) => {
    try {
      exportAuditLogs(auditEvents, documentName, format);
      toast.success(`Audit logs exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting audit logs as ${format}:`, error);
      toast.error(`Failed to export audit logs. Please try again.`);
    }
  };

  const complianceScore = calculateComplianceScore();
  const scoreColorClass = getScoreColor(complianceScore);

  return (
    <CardHeader className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
      <div>
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          Audit Trail
          <div className="flex items-center gap-2 ml-3 bg-slate-50 px-3 py-1 rounded-md border">
            <span className="text-sm text-slate-500">Overall Score:</span>
            <span className={`font-bold ${scoreColorClass}`}>{complianceScore}%</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-slate-400 hover:text-slate-500">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Score calculation info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold mb-1">How the compliance score is calculated:</p>
                  <p className="text-sm">
                    The overall compliance score is calculated as the percentage of completed audit events
                    out of the total number of events ({auditEvents.filter(event => event.status === 'completed').length} of {auditEvents.length} events completed).
                  </p>
                  <p className="text-sm mt-2">
                    Scores above 80% are considered compliant, 70-80% need improvement, and below 70% indicate significant compliance issues.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center mt-1">
          Compliance tracking for {documentName}
          {industry && <span className="ml-1 text-blue-600">({industry})</span>}
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            {auditEvents.length} events
          </Badge>
        </CardDescription>
      </div>
      
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
              <FileJson className="h-4 w-4 mr-2" />
              JSON Format
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV Spreadsheet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
              <FilePdf className="h-4 w-4 mr-2" />
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
    </CardHeader>
  );
};

export default AuditTrailHeader;
