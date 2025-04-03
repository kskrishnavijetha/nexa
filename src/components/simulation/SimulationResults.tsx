
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveAnalysis } from '@/utils/types';
import ScoreComparisonChart from './ScoreComparisonChart';
import RiskTrendList from './RiskTrendList';
import RecommendationsList from './RecommendationsList';

interface SimulationResultsProps {
  analysisData: PredictiveAnalysis;
  loading?: boolean;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ analysisData, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData || !analysisData.scenarioId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Select a scenario to view simulation results
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScoreComparisonChart analysis={analysisData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendList riskTrends={analysisData.riskTrends || []} />
        
        <RecommendationsList recommendations={analysisData.recommendations || []} />
      </div>
    </div>
  );
};

export default SimulationResults;
