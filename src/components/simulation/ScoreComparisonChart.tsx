
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveAnalysis } from '@/utils/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  // Prepare data for the chart
  const chartData = [
    {
      name: 'Overall',
      original: analysis.originalScores?.overall || 0,
      predicted: analysis.predictedScores?.overall || 0,
      difference: analysis.scoreDifferences?.overall || 0
    },
    {
      name: 'GDPR',
      original: analysis.originalScores?.gdpr || 0,
      predicted: analysis.predictedScores?.gdpr || 0,
      difference: analysis.scoreDifferences?.gdpr || 0
    },
    {
      name: 'HIPAA',
      original: analysis.originalScores?.hipaa || 0,
      predicted: analysis.predictedScores?.hipaa || 0,
      difference: analysis.scoreDifferences?.hipaa || 0
    },
    {
      name: 'SOC 2',
      original: analysis.originalScores?.soc2 || 0,
      predicted: analysis.predictedScores?.soc2 || 0,
      difference: analysis.scoreDifferences?.soc2 || 0
    },
    {
      name: 'PCI-DSS',
      original: analysis.originalScores?.pciDss || 0,
      predicted: analysis.predictedScores?.pciDss || 0,
      difference: analysis.scoreDifferences?.pciDss || 0
    }
  ];

  const getScoreDifferenceLabel = (value: number) => {
    if (value > 0) return `+${value}`;
    if (value < 0) return value.toString();
    return '0';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Score Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="original" name="Current Scores" fill="#94a3b8" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="original" position="top" />
              </Bar>
              <Bar dataKey="predicted" name="Predicted Scores" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="predicted" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center p-2 border rounded">
              <p className="text-xs font-medium">{item.name}</p>
              <p className={`text-lg font-bold ${
                item.difference > 0 ? 'text-green-600' : 
                item.difference < 0 ? 'text-red-600' : ''
              }`}>
                {getScoreDifferenceLabel(item.difference)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreComparisonChart;
