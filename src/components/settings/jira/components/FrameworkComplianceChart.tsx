
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import JiraBarChart from './JiraBarChart';

interface FrameworkComplianceChartProps {
  isLoading: boolean;
}

const FrameworkComplianceChart: React.FC<FrameworkComplianceChartProps> = ({ isLoading }) => {
  const chartData = [
    { name: 'SOC 2', complete: 71, incomplete: 29 },
    { name: 'HIPAA', complete: 82, incomplete: 18 },
    { name: 'GDPR', complete: 67, incomplete: 33 },
    { name: 'PCI DSS', complete: 85, incomplete: 15 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance by Framework</CardTitle>
        <CardDescription>
          Issue distribution across compliance frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="h-64">
            <JiraBarChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FrameworkComplianceChart;
