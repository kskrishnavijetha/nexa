
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info } from 'lucide-react';

interface ScenarioHeaderProps {
  analysis: PredictiveAnalysis;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({ analysis }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-xl">{analysis.scenarioName}</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.regulationChanges.map((change, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs ${
                change.impactLevel === 'high'
                  ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                  : change.impactLevel === 'medium'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                  : 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
              }`}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {change.regulation} - {change.changeType} impact
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground mb-4">{analysis.scenarioDescription}</p>

      <div className="bg-primary/10 p-3 rounded-md text-sm flex items-start">
        <Info className="h-4 w-4 text-primary mr-2 mt-0.5" />
        <div>
          <p className="text-foreground font-medium">Simulation Summary</p>
          <p className="text-muted-foreground">
            This simulation predicts how your compliance posture would change if the selected
            regulatory scenario becomes reality. Overall score is predicted to{' '}
            {analysis.scoreDifferences.overall > 0 ? 'increase' : 'decrease'} by{' '}
            {Math.abs(analysis.scoreDifferences.overall)} points.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioHeader;
