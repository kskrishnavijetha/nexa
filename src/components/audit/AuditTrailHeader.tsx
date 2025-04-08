
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getScoreColor } from '@/utils/reports';

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
