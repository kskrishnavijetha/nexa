
import React, { useState } from 'react';
import { ComplianceReport } from '@/utils/types';
import { PredictiveAnalyticsResult } from '@/utils/predictive/types';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ScoreTrendChart from './previous-analytics/ScoreTrendChart';
import PredictionAccuracyChart from './previous-analytics/PredictionAccuracyChart';
import PreviousInsightSummary from './previous-analytics/PreviousInsightSummary';
import { prepareScoreTrendData, compareInsightAccuracy } from './previous-analytics/utils';

interface PreviousAnalyticsProps {
  currentResult: PredictiveAnalyticsResult;
  previousResults: PredictiveAnalyticsResult[];
  historicalReports: ComplianceReport[];
}

const PreviousAnalytics: React.FC<PreviousAnalyticsProps> = ({ 
  currentResult, 
  previousResults,
  historicalReports
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('gdpr');
  
  if (previousResults.length === 0) {
    return (
      <Alert>
        <AlertTitle>No historical data available</AlertTitle>
        <AlertDescription>
          There are no previous analyses to compare with the current results. 
          As more compliance checks are performed, historical data will become available here.
        </AlertDescription>
      </Alert>
    );
  }
  
  const trendData = prepareScoreTrendData(historicalReports, previousResults, currentResult, selectedMetric);
  const accuracyItems = compareInsightAccuracy(previousResults, historicalReports);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historical Analysis Comparison</h3>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gdpr">GDPR Scores</SelectItem>
            <SelectItem value="hipaa">HIPAA Scores</SelectItem>
            <SelectItem value="soc2">SOC 2 Scores</SelectItem>
            <SelectItem value="overall">Overall Scores</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreTrendChart trendData={trendData} />
        <PredictionAccuracyChart accuracyItems={accuracyItems} />
      </div>
      
      <PreviousInsightSummary 
        previousResults={previousResults} 
        historicalReports={historicalReports} 
      />
    </div>
  );
};

export default PreviousAnalytics;
