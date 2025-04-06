
import React, { useMemo } from 'react';
import { ComplianceReport } from '@/utils/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ComplianceScoreChartProps {
  scans: ComplianceReport[];
}

const ComplianceScoreChart: React.FC<ComplianceScoreChartProps> = ({ scans }) => {
  const chartData = useMemo(() => {
    // Sort scans by date (oldest first)
    const sortedScans = [...scans].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Get the last 10 scans for the chart
    const recentScans = sortedScans.slice(-10);
    
    // Format data for the chart
    return recentScans.map(scan => ({
      name: new Date(scan.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: scan.overallScore,
      timestamp: scan.timestamp
    }));
  }, [scans]);

  if (chartData.length === 0) {
    return (
      <div className="text-center p-8 h-64 flex flex-col items-center justify-center border border-dashed rounded-lg">
        <p className="text-muted-foreground">No data available to display the chart.</p>
        <p className="text-sm text-muted-foreground mt-1">Upload more documents to see your score trend.</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ChartContainer
        config={{
          score: {
            label: "Score",
            color: "#3b82f6", // blue-500
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[50, 100]}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ComplianceScoreChart;
