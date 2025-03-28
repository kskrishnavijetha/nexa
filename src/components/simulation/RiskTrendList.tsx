
import React from 'react';
import { PredictiveAnalysis, RiskTrend } from '@/utils/types';
import StatusBadge from '../audit/StatusBadge';
import { TrendingUp, TrendingDown, Check } from 'lucide-react';

interface RiskTrendListProps {
  analysis: PredictiveAnalysis;
}

const RiskTrendList: React.FC<RiskTrendListProps> = ({ analysis }) => {
  // Group risk trends by impact
  const highImpactTrends = analysis.riskTrends.filter(trend => trend.impact === 'high');
  const mediumImpactTrends = analysis.riskTrends.filter(trend => trend.impact === 'medium');
  const lowImpactTrends = analysis.riskTrends.filter(trend => 
    trend.impact === 'low' || trend.trend === 'stable');

  // Get badge for risk trend
  const getRiskTrendBadge = (trend: RiskTrend) => {
    return (
      <StatusBadge 
        status={mapTrendToStatus(trend.trend)}
        trend={mapTrendToStatus(trend.trend)}
        showTrend={true} 
      />
    );
  };
  
  // Helper function to map between different trend naming conventions
  const mapTrendToStatus = (trend: 'increasing' | 'decreasing' | 'stable'): 'increase' | 'decrease' | 'stable' => {
    if (trend === 'increasing') return 'increase';
    if (trend === 'decreasing') return 'decrease';
    return 'stable';
  };

  return (
    <div className="max-h-96 overflow-y-auto">
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
    </div>
  );
};

export default RiskTrendList;
