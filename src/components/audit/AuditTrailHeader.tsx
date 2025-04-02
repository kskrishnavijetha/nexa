
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { auditEvents, isGeneratingReport, downloadAuditReport } = useAuditTrail();

  return (
    <CardHeader className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
      <div>
        <CardTitle className="text-xl font-semibold">Audit Trail</CardTitle>
        <CardDescription className="flex items-center mt-1">
          Compliance tracking for {documentName}
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
                onClick={() => window.location.reload()}
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
