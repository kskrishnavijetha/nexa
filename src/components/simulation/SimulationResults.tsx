
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScoreComparisonChart from './ScoreComparisonChart';
import RiskTrendList from './RiskTrendList';
import ScenarioHeader from './ScenarioHeader';
import RecommendationsList from './RecommendationsList';

interface SimulationResultsProps {
  analysis: PredictiveAnalysis;
  onReset: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ analysis, onReset }) => {
  return (
    <div className="space-y-6">
      <ScenarioHeader analysis={analysis} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Predicted Score Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreComparisonChart analysis={analysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Risk Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskTrendList analysis={analysis} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationsList recommendations={analysis.recommendedActions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
