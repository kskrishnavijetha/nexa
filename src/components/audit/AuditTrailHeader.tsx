
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, HelpCircle, RefreshCw } from 'lucide-react';
import { useAuditTrail } from './AuditTrailProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getScoreColor } from '@/utils/reports';
import { Progress } from '@/components/ui/progress';

interface AuditTrailHeaderProps {
  documentName: string;
}

const AuditTrailHeader: React.FC<AuditTrailHeaderProps> = ({ documentName }) => {
  const { 
    auditEvents, 
    isGeneratingReport, 
    isGeneratingLogs, 
    downloadAuditReport, 
    downloadAuditLogs, 
    setLastActivity, 
    industry,
    progress = 0
  } = useAuditTrail();

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
    
    // Calculate with two decimal places
    return Number(((completedEvents / totalEvents) * 100).toFixed(2));
  };

  const complianceScore = calculateComplianceScore();
  const scoreColorClass = getScoreColor(complianceScore);

  const isProcessing = isGeneratingReport || isGeneratingLogs;

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
      
      <div className="flex flex-col w-full md:w-auto gap-2">
        {isProcessing && (
          <div className="w-full md:w-64">
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleRefresh}
                  disabled={isProcessing}
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-1 transition-all ${isGeneratingLogs ? 'bg-blue-50' : ''}`}
                  onClick={downloadAuditLogs}
                  disabled={isGeneratingLogs || isGeneratingReport}
                >
                  {isGeneratingLogs ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      <span>Download Logs</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download audit logs as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="default" 
            size="sm" 
            className={`gap-1 transition-all ${isGeneratingReport ? 'opacity-80' : ''}`}
            onClick={downloadAuditReport}
            disabled={isGeneratingReport || isGeneratingLogs}
          >
            {isGeneratingReport ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>AI Enhanced Report</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default AuditTrailHeader;
