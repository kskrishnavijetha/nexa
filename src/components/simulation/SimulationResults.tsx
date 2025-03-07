
import React from 'react';
import { PredictiveAnalysis, RiskTrend } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import StatusBadge from '../audit/StatusBadge';
import { getScoreDifferenceColor } from '@/utils/scoreService';
import { TrendingUp, TrendingDown, ArrowRight, Check } from 'lucide-react';

interface SimulationResultsProps {
  analysis: PredictiveAnalysis;
  onReset: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ analysis, onReset }) => {
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

  // Group risk trends by impact
  const highImpactTrends = analysis.riskTrends.filter(trend => trend.impact === 'high');
  const mediumImpactTrends = analysis.riskTrends.filter(trend => trend.impact === 'medium');
  const lowImpactTrends = analysis.riskTrends.filter(trend => 
    trend.impact === 'low' || trend.predictedChange === 'stable');

  // Get badge for risk trend
  const getRiskTrendBadge = (trend: RiskTrend) => {
    return (
      <StatusBadge 
        status={trend.predictedChange} 
        trend={trend.predictedChange} 
        showTrend={true} 
      />
    );
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
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Scenario: {analysis.scenarioName}</h3>
        <p className="text-sm text-slate-600">{analysis.scenarioDescription}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.regulationChanges.map((change, index) => (
            <div 
              key={index} 
              className="flex items-center text-xs bg-white rounded-full px-3 py-1 border"
            >
              <span className="font-medium">{change.regulation}</span>
              <ArrowRight className="h-3 w-3 mx-1" />
              <span className={`${
                change.changeType === 'stricter' || change.changeType === 'new' 
                  ? 'text-red-600' 
                  : change.changeType === 'relaxed' 
                    ? 'text-green-600' 
                    : 'text-blue-600'
              }`}>
                {change.changeType}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Predicted Score Impact</CardTitle>
          </CardHeader>
          <CardContent>
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
                        // Fix: Convert ValueType to string/number before comparison
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Risk Changes</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {highImpactTrends.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  High Impact Changes
                </h4>
                <div className="space-y-2 mt-2">
                  {highImpactTrends.map((trend, index) => (
                    <div key={index} className="p-2 bg-red-50 rounded border border-red-100">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">{trend.description}</span>
                        {getRiskTrendBadge(trend)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {trend.regulation} - Currently: {trend.currentSeverity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumImpactTrends.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 text-amber-500 mr-1" />
                  Medium Impact Changes
                </h4>
                <div className="space-y-2 mt-2">
                  {mediumImpactTrends.map((trend, index) => (
                    <div key={index} className="p-2 bg-amber-50 rounded border border-amber-100">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">{trend.description}</span>
                        {getRiskTrendBadge(trend)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {trend.regulation} - Currently: {trend.currentSeverity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowImpactTrends.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  Low/No Impact
                </h4>
                <div className="space-y-2 mt-2">
                  {lowImpactTrends.slice(0, 3).map((trend, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium">{trend.description}</span>
                        {getRiskTrendBadge(trend)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {trend.regulation} - Currently: {trend.currentSeverity}
                      </div>
                    </div>
                  ))}
                  {lowImpactTrends.length > 3 && (
                    <div className="text-xs text-center text-slate-500">
                      +{lowImpactTrends.length - 3} more low impact items
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
