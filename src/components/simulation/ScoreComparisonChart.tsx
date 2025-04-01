
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  const chartData = [
    {
      name: 'Overall',
      original: analysis.originalScores.overall,
      predicted: analysis.predictedScores.overall,
      difference: analysis.scoreDifferences.overall,
    },
    {
      name: 'GDPR',
      original: analysis.originalScores.gdpr,
      predicted: analysis.predictedScores.gdpr,
      difference: analysis.scoreDifferences.gdpr,
    },
    {
      name: 'HIPAA',
      original: analysis.originalScores.hipaa,
      predicted: analysis.predictedScores.hipaa,
      difference: analysis.scoreDifferences.hipaa,
    },
    {
      name: 'SOC 2',
      original: analysis.originalScores.soc2,
      predicted: analysis.predictedScores.soc2,
      difference: analysis.scoreDifferences.soc2,
    },
    {
      name: 'PCI DSS',
      original: analysis.originalScores.pciDss,
      predicted: analysis.predictedScores.pciDss,
      difference: analysis.scoreDifferences.pciDss,
    },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData.filter(item => item.original > 0 || item.predicted > 0)} // Only show scores that have values
          margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value: number) => [`${value}`, 'Score']}
            labelFormatter={(label) => `${label} Score`}
          />
          <Bar dataKey="original" name="Current" fill="#94a3b8" barSize={20} />
          <Bar dataKey="predicted" name="Predicted" fill="#2563eb" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreComparisonChart;
