
import React from 'react';
import { CalendarIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ComplianceInsight } from '@/utils/predictive/types';
import { PredictiveAnalyticsResult } from '@/utils/predictive/types';
import { ComplianceReport } from '@/utils/types';

interface PreviousInsightSummaryProps {
  previousResults: PredictiveAnalyticsResult[];
  historicalReports: ComplianceReport[];
}

const PreviousInsightSummary: React.FC<PreviousInsightSummaryProps> = ({ 
  previousResults, 
  historicalReports 
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Get direction icon for insights
  const getInsightDirectionIcon = (insight: ComplianceInsight) => {
    // Check the priority to determine which icon to show
    if (insight.priority === 'critical' || insight.priority === 'high') {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else if (insight.priority === 'low' && insight.title.includes('improvement')) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else {
      return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          Previous Compliance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {previousResults.slice(0, 2).map((prevResult, idx) => {
            // Find the corresponding report
            const matchingReport = historicalReports.find(report => 
              prevResult.lastUpdated && 
              Math.abs(new Date(report.timestamp).getTime() - new Date(prevResult.lastUpdated).getTime()) < 86400000
            );
            
            if (!matchingReport) return null;
            
            return (
              <div key={idx} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{matchingReport.documentName}</h4>
                    <p className="text-xs text-muted-foreground">
                      Analysis from {formatDate(prevResult.lastUpdated || '')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Score: {matchingReport.overallScore}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium mb-1">Key Insights</h5>
                    <ul className="text-xs space-y-1">
                      {prevResult.complianceInsights.slice(0, 3).map((insight, insightIdx) => (
                        <li key={insightIdx} className="flex items-start gap-1">
                          <span className="mt-0.5">{getInsightDirectionIcon(insight)}</span>
                          <span>{insight.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium mb-1">Top Recommendations</h5>
                    <ul className="text-xs space-y-1">
                      {prevResult.recommendations.slice(0, 3).map((rec, recIdx) => (
                        <li key={recIdx}>{rec.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviousInsightSummary;
