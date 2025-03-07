
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getScoreDifferenceColor } from '@/utils/scoreService';
import { PredictiveAnalysis } from '@/utils/types';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  // Prepare data for score comparison chart
  const prepareScoreData = () => {
    return [
      {
        name: 'Overall',
        current: analysis.originalScores.overall,
        predicted: analysis.predictedScores.overall,
        difference: analysis.scoreDifferences.overall
      },
      {
        name: 'GDPR',
        current: analysis.originalScores.gdpr,
        predicted: analysis.predictedScores.gdpr,
        difference: analysis.scoreDifferences.gdpr
      },
      {
        name: 'HIPAA',
        current: analysis.originalScores.hipaa,
        predicted: analysis.predictedScores.hipaa,
        difference: analysis.scoreDifferences.hipaa
      },
      {
        name: 'SOC 2',
        current: analysis.originalScores.soc2,
        predicted: analysis.predictedScores.soc2,
        difference: analysis.scoreDifferences.soc2
      },
      {
        name: 'PCI-DSS',
        current: analysis.originalScores.pciDss,
        predicted: analysis.predictedScores.pciDss,
        difference: analysis.scoreDifferences.pciDss
      }
    ];
  };

  // Get color for bar based on predicted score
  const getBarColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#fbbf24';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={prepareScoreData()}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'difference') {
                  // Convert ValueType to string/number before comparison
                  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                  return [`${numValue >= 0 ? '+' : ''}${value}%`, 'Change'];
                }
                return [`${value}%`, name === 'current' ? 'Current' : 'Predicted'];
              }}
            />
            <Legend />
            <Bar dataKey="current" name="Current" fill="#64748b" />
            <Bar dataKey="predicted" name="Predicted">
              {prepareScoreData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.predicted)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {prepareScoreData().map((item, index) => (
          <div key={index} className="bg-slate-50 p-2 rounded">
            <div className="text-xs text-slate-500">{item.name}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.current}% → {item.predicted}%</span>
              <span className={`text-sm font-medium ${getScoreDifferenceColor(item.difference)}`}>
                {item.difference > 0 ? '+' : ''}{item.difference}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ScoreComparisonChart;
