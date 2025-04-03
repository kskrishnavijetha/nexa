
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskTrend } from '@/utils/types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RiskTrendListProps {
  riskTrends: RiskTrend[];
}

const RiskTrendList: React.FC<RiskTrendListProps> = ({ riskTrends }) => {
  if (!riskTrends || riskTrends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No risk trends available for this simulation.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'increase' | 'decrease' | 'stable') => {
    if (trend === 'increase') {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (trend === 'decrease') {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
    } else if (severity === 'medium') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskTrends.map((trend, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${
                    trend.currentSeverity === 'high' ? 'text-red-500' :
                    trend.currentSeverity === 'medium' ? 'text-amber-500' :
                    'text-green-500'
                  }`} />
                  <p className="font-medium text-sm">{trend.regulation}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trend.trend)}
                  <span className="text-xs font-medium">
                    {trend.trend === 'increase' ? 'Increasing' : 
                     trend.trend === 'decrease' ? 'Decreasing' : 
                     'Stable'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{trend.description}</p>
              
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-muted-foreground mr-1">Current:</span>
                  {getSeverityBadge(trend.currentSeverity)}
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">Projected:</span>
                  {getSeverityBadge(trend.projectedSeverity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskTrendList;
