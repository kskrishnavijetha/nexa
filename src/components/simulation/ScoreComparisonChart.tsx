
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PredictiveAnalysis } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  // Create chart data from the score differences
  const createChartData = () => {
    const data = [];

    // Overall scores
    if (analysis.originalScores && analysis.predictedScores) {
      data.push({
        name: 'Overall',
        current: analysis.originalScores.overall,
        predicted: analysis.predictedScores.overall,
        difference: analysis.predictedScores.overall - analysis.originalScores.overall
      });
      
      // GDPR scores
      data.push({
        name: 'GDPR',
        current: analysis.originalScores.gdpr,
        predicted: analysis.predictedScores.gdpr,
        difference: analysis.predictedScores.gdpr - analysis.originalScores.gdpr
      });
      
      // HIPAA scores
      data.push({
        name: 'HIPAA',
        current: analysis.originalScores.hipaa,
        predicted: analysis.predictedScores.hipaa,
        difference: analysis.predictedScores.hipaa - analysis.originalScores.hipaa
      });
      
      // SOC 2 scores
      data.push({
        name: 'SOC 2',
        current: analysis.originalScores.soc2,
        predicted: analysis.predictedScores.soc2,
        difference: analysis.predictedScores.soc2 - analysis.originalScores.soc2
      });
      
      // PCI-DSS scores (if available)
      if (analysis.originalScores.pciDss !== undefined && analysis.predictedScores.pciDss !== undefined) {
        data.push({
          name: 'PCI-DSS',
          current: analysis.originalScores.pciDss,
          predicted: analysis.predictedScores.pciDss,
          difference: analysis.predictedScores.pciDss - analysis.originalScores.pciDss
        });
      }
    } else if (analysis.scoreDifferences) {
      // Fallback to scoreDifferences if originalScores and predictedScores are not available
      // This is for backward compatibility
      data.push({
        name: 'Overall',
        current: 75,
        predicted: 75 + (analysis.scoreDifferences.overall || 0),
        difference: analysis.scoreDifferences.overall || 0
      });
      
      data.push({
        name: 'GDPR',
        current: 72,
        predicted: 72 + (analysis.scoreDifferences.gdpr || 0),
        difference: analysis.scoreDifferences.gdpr || 0
      });
      
      data.push({
        name: 'HIPAA',
        current: 68,
        predicted: 68 + (analysis.scoreDifferences.hipaa || 0),
        difference: analysis.scoreDifferences.hipaa || 0
      });
      
      data.push({
        name: 'SOC 2',
        current: 70,
        predicted: 70 + (analysis.scoreDifferences.soc2 || 0),
        difference: analysis.scoreDifferences.soc2 || 0
      });
      
      if (analysis.scoreDifferences.pciDss !== undefined) {
        data.push({
          name: 'PCI-DSS',
          current: 65,
          predicted: 65 + analysis.scoreDifferences.pciDss,
          difference: analysis.scoreDifferences.pciDss
        });
      }
    }
    
    return data;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Score Projection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={createChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'current') return [`${value}%`, 'Current Score'];
                  if (name === 'predicted') return [`${value}%`, 'Projected Score'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="current" name="Current Score" fill="#94A3B8" />
              <Bar dataKey="predicted" name="Projected Score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreComparisonChart;
