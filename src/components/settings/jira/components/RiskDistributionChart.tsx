
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskDistribution } from '@/utils/jira/types';
import JiraPieChart from './JiraPieChart';

interface RiskDistributionChartProps {
  distribution: RiskDistribution;
  isLoading: boolean;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution, isLoading }) => {
  const chartData = [
    { name: 'High', value: distribution.high, color: '#ef4444' },
    { name: 'Medium', value: distribution.medium, color: '#f59e0b' },
    { name: 'Low', value: distribution.low, color: '#10b981' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>
          Distribution of compliance issues by risk level
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="h-64">
            <JiraPieChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
