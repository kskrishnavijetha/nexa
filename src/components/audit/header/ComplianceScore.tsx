
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getScoreColor } from '@/utils/reports';

interface ComplianceScoreProps {
  complianceScore: number;
  totalEvents: number;
  completedEvents: number;
}

const ComplianceScore: React.FC<ComplianceScoreProps> = ({
  complianceScore,
  totalEvents,
  completedEvents
}) => {
  const scoreColorClass = getScoreColor(complianceScore);
  
  return (
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
              out of the total number of events ({completedEvents} of {totalEvents} events completed).
            </p>
            <p className="text-sm mt-2">
              Scores above 80% are considered compliant, 70-80% need improvement, and below 70% indicate significant compliance issues.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ComplianceScore;
