
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';
import { RiskTrend } from '@/utils/types';

interface TrendAnalysisProps {
  trends: RiskTrend[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Trends</CardTitle>
          <CardDescription>
            Analysis of how risks are projected to change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No risk trend data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'increase' | 'decrease' | 'stable') => {
    switch (trend) {
      case 'increase':
        return <ArrowUpIcon className="text-red-500 h-5 w-5" />;
      case 'decrease':
        return <ArrowDownIcon className="text-green-500 h-5 w-5" />;
      case 'stable':
        return <ArrowRightIcon className="text-blue-500 h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Trends</CardTitle>
        <CardDescription>
          Analysis of how risks are projected to change
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div 
              key={trend.riskId || index}
              className="flex items-start justify-between border-b pb-3 last:border-0"
            >
              <div>
                <h4 className="font-medium text-sm">{trend.regulation}</h4>
                <p className="text-sm text-muted-foreground">{trend.description}</p>
                <div className="flex items-center mt-1 text-xs">
                  <span className={`font-medium ${
                    trend.currentSeverity === 'high' ? 'text-red-500' : 
                    trend.currentSeverity === 'medium' ? 'text-amber-500' : 'text-green-500'
                  }`}>
                    {trend.currentSeverity.charAt(0).toUpperCase() + trend.currentSeverity.slice(1)}
                  </span>
                  <span className="mx-1">→</span>
                  <span className={`font-medium ${
                    trend.projectedSeverity === 'high' ? 'text-red-500' : 
                    trend.projectedSeverity === 'medium' ? 'text-amber-500' : 
                    trend.projectedSeverity === 'low' ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {trend.projectedSeverity ? trend.projectedSeverity.charAt(0).toUpperCase() + trend.projectedSeverity.slice(1) : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getTrendIcon(trend.trend)}
                <span className={`ml-1 text-sm font-medium ${
                  trend.trend === 'increase' ? 'text-red-500' : 
                  trend.trend === 'decrease' ? 'text-green-500' : 'text-blue-500'
                }`}>
                  {trend.trend === 'increase' ? 'Rising' : trend.trend === 'decrease' ? 'Falling' : 'Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
