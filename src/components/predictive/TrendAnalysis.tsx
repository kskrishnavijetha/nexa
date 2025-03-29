
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskTrend } from '@/utils/types';
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from 'lucide-react';

interface TrendAnalysisProps {
  riskTrends: RiskTrend[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ riskTrends }) => {
  const getTrendIcon = (trend: string) => {
    if (trend === 'increase' || trend === 'increasing') {
      return <TrendingUp className="text-red-500 h-5 w-5" />;
    } else if (trend === 'decrease' || trend === 'decreasing') {
      return <TrendingDown className="text-green-500 h-5 w-5" />;
    } else {
      return <ArrowUp className="text-amber-500 h-5 w-5" />; // Replaced TrendingFlat with ArrowUp
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Risk Trend Analysis</h3>
      <div className="grid grid-cols-1 gap-4">
        {riskTrends.map((trend) => (
          <Card key={trend.riskId} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{trend.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Regulation: {trend.regulation}</p>
                  <p className="text-xs text-muted-foreground">Impact: {trend.impact}</p>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(trend.trend)}
                  <span className={`text-sm font-medium ${getSeverityColor(trend.currentSeverity)}`}>
                    {trend.currentSeverity}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendAnalysis;
