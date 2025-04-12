
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveAnalysis } from '@/utils/types';

interface SimulationChartsProps {
  analysis: PredictiveAnalysis;
}

const SimulationCharts: React.FC<SimulationChartsProps> = ({ analysis }) => {
  // Prepare data for score comparison chart
  const prepareScoreData = () => {
    if (!analysis.originalScores || !analysis.predictedScores) return [];
    
    return [
      { 
        name: 'Overall', 
        original: analysis.originalScores.overall, 
        predicted: analysis.predictedScores.overall,
        difference: analysis.scoreDifferences?.overall || 0
      },
      { 
        name: 'GDPR', 
        original: analysis.originalScores.gdpr, 
        predicted: analysis.predictedScores.gdpr,
        difference: analysis.scoreDifferences?.gdpr || 0
      },
      { 
        name: 'HIPAA', 
        original: analysis.originalScores.hipaa, 
        predicted: analysis.predictedScores.hipaa,
        difference: analysis.scoreDifferences?.hipaa || 0
      },
      { 
        name: 'SOC 2', 
        original: analysis.originalScores.soc2, 
        predicted: analysis.predictedScores.soc2,
        difference: analysis.scoreDifferences?.soc2 || 0
      },
      ...(analysis.originalScores.pciDss !== undefined ? [{
        name: 'PCI-DSS',
        original: analysis.originalScores.pciDss,
        predicted: analysis.predictedScores?.pciDss || 0,
        difference: analysis.scoreDifferences?.pciDss || 0
      }] : [])
    ];
  };
  
  // Prepare data for risk trends
  const prepareRiskData = () => {
    if (!analysis.riskTrends || analysis.riskTrends.length === 0) return [];
    
    return analysis.riskTrends.map(trend => ({
      name: trend.regulation.length > 15 ? trend.regulation.substring(0, 15) + '...' : trend.regulation,
      current: trend.previousScore || getSeverityScore(trend.currentSeverity),
      projected: trend.predictedScore || getSeverityScore(trend.projectedSeverity || trend.currentSeverity),
      direction: trend.trend
    }));
  };
  
  const getSeverityScore = (severity: string): number => {
    switch (severity.toLowerCase()) {
      case 'high': return 25;
      case 'medium': return 50;
      case 'low': return 75;
      default: return 50;
    }
  };
  
  const scoreData = prepareScoreData();
  const riskData = prepareRiskData();

  return (
    <div className="grid grid-cols-1 gap-6 simulation-charts">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Legend />
                <Bar dataKey="original" name="Original Score" fill="#8884d8" />
                <Bar dataKey="predicted" name="Predicted Score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {riskData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={riskData}
                  margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}`, 'Risk Score']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    name="Current Risk" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    name="Projected Risk" 
                    stroke="#ff7300" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationCharts;
