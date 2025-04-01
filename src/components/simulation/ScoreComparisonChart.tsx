
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
  Legend,
} from 'recharts';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  // Create chart data from all available regulations
  const generateChartData = () => {
    const data = [
      {
        name: 'Overall',
        original: analysis.originalScores?.overall || 0,
        predicted: analysis.predictedScores?.overall || 0,
        difference: analysis.scoreDifferences?.overall || 0,
      }
    ];
    
    // Add all regulatory frameworks that have data
    if (analysis.originalScores?.gdpr > 0 || analysis.predictedScores?.gdpr > 0) {
      data.push({
        name: 'GDPR',
        original: analysis.originalScores?.gdpr || 0,
        predicted: analysis.predictedScores?.gdpr || 0,
        difference: analysis.scoreDifferences?.gdpr || 0,
      });
    }
    
    if (analysis.originalScores?.hipaa > 0 || analysis.predictedScores?.hipaa > 0) {
      data.push({
        name: 'HIPAA',
        original: analysis.originalScores?.hipaa || 0,
        predicted: analysis.predictedScores?.hipaa || 0,
        difference: analysis.scoreDifferences?.hipaa || 0,
      });
    }
    
    if (analysis.originalScores?.soc2 > 0 || analysis.predictedScores?.soc2 > 0) {
      data.push({
        name: 'SOC 2',
        original: analysis.originalScores?.soc2 || 0,
        predicted: analysis.predictedScores?.soc2 || 0,
        difference: analysis.scoreDifferences?.soc2 || 0,
      });
    }
    
    if (analysis.originalScores?.pciDss > 0 || analysis.predictedScores?.pciDss > 0) {
      data.push({
        name: 'PCI DSS',
        original: analysis.originalScores?.pciDss || 0,
        predicted: analysis.predictedScores?.pciDss || 0,
        difference: analysis.scoreDifferences?.pciDss || 0,
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'original') return [`${value}`, 'Current Score'];
              if (name === 'predicted') return [`${value}`, 'Predicted Score'];
              return [`${value > 0 ? '+' : ''}${value}`, 'Difference'];
            }}
            labelFormatter={(label) => `${label} Score`}
          />
          <Legend formatter={(value) => {
            if (value === 'original') return 'Current';
            if (value === 'predicted') return 'Predicted';
            return 'Difference';
          }} />
          <Bar dataKey="original" name="original" fill="#94a3b8" barSize={20} />
          <Bar dataKey="predicted" name="predicted" fill="#2563eb" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreComparisonChart;
