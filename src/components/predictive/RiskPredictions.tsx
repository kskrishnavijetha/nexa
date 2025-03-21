
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RiskPrediction {
  riskType: string;
  probability: number;
  regulation: string;
  severity: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface RiskPredictionsProps {
  predictions: RiskPrediction[];
}

const RiskPredictions: React.FC<RiskPredictionsProps> = ({ predictions }) => {
  // Sort predictions by probability (highest first)
  const sortedPredictions = [...predictions].sort((a, b) => b.probability - a.probability);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 70) return 'bg-red-500';
    if (probability >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        AI-predicted compliance risks based on historical patterns and current document analysis.
      </p>
      
      {sortedPredictions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No risk predictions available. More compliance data is needed for analysis.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPredictions.map((prediction, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{prediction.riskType}</h4>
                <div className="flex items-center gap-1">
                  {getTrendIcon(prediction.trend)}
                  <span className={`text-xs font-medium ${
                    prediction.trend === 'increasing' ? 'text-red-500' :
                    prediction.trend === 'decreasing' ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  prediction.severity === 'high' ? 'bg-red-100 text-red-700' :
                  prediction.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {prediction.severity.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {prediction.regulation}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Likelihood</span>
                  <span className="font-medium">{prediction.probability}%</span>
                </div>
                <Progress 
                  value={prediction.probability} 
                  max={100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={getProgressColor(prediction.probability)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskPredictions;
