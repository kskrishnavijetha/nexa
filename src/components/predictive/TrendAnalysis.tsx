
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ReferenceLine
} from 'recharts';

interface RiskTrend {
  regulation: string;
  previousScore: number;
  predictedScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface TrendAnalysisProps {
  trends: RiskTrend[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trends }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '#10b981'; // green-500
      case 'decreasing':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  // Prepare data for the chart
  const chartData = trends.map(trend => ({
    name: trend.regulation,
    previous: trend.previousScore,
    predicted: trend.predictedScore,
    trend: trend.trend
  }));

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Analysis of compliance score trends and predictions for future assessments.
      </p>
      
      {trends.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No trend data available. More compliance history is needed for analysis.
        </div>
      ) : (
        <>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar dataKey="previous" name="Previous Score" fill="#94a3b8" />
                <Bar dataKey="predicted" name="Predicted Score">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTrendColor(entry.trend)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index} className="border rounded-md p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{trend.regulation}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Previous</p>
                      <p className="text-sm font-medium">{trend.previousScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Predicted</p>
                      <p className="text-sm font-medium">{trend.predictedScore}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {getTrendIcon(trend.trend)}
                  <span className={`text-xs font-medium ${
                    trend.trend === 'increasing' ? 'text-green-500' :
                    trend.trend === 'decreasing' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendAnalysis;
