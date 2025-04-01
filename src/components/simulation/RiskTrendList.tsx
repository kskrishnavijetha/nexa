
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import { ArrowDown, ArrowUp, Minus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RiskTrendListProps {
  analysis: PredictiveAnalysis;
}

const RiskTrendList: React.FC<RiskTrendListProps> = ({ analysis }) => {
  // Helper function to format regulation names
  const formatRegulationName = (regulation: string): string => {
    const displayNames: Record<string, string> = {
      'GDPR': 'GDPR',
      'HIPAA': 'HIPAA',
      'SOC 2': 'SOC 2',
      'PCI-DSS': 'PCI DSS',
      'SOX': 'SOX',
      'GLBA': 'GLBA',
      'HITECH': 'HITECH',
      'FedRAMP': 'FedRAMP',
      'CCPA': 'CCPA',
      'FERPA': 'FERPA',
      'COPPA': 'COPPA',
      'FISMA': 'FISMA',
      'NERC': 'NERC CIP',
      'ITAR': 'ITAR',
      'CMMC': 'CMMC',
      'ISO/IEC 27001': 'ISO 27001',
      'ISO 9001': 'ISO 9001',
      'ISO 13485': 'ISO 13485',
      'FDA CFR Part 11': 'FDA CFR Part 11',
      'NYDFS': 'NYDFS',
      'FCC': 'FCC Regulations',
      'CPRA': 'CPRA',
      'FERC': 'FERC',
      'ISO 14001': 'ISO 14001',
      'FTC Act': 'FTC Act',
      'FDA': 'FDA Regulations',
      'EMA': 'EMA Regulations',
      'C-TPAT': 'C-TPAT',
      'RoHS': 'RoHS',
      'ISO 26262': 'ISO 26262',
      'TS 16949': 'TS 16949'
    };
    
    return displayNames[regulation] || regulation;
  };

  if (!analysis.riskTrends || analysis.riskTrends.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No risk trends available for this scenario</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
      {analysis.riskTrends.map((trend, index) => (
        <div 
          key={index} 
          className="p-3 border rounded-md bg-background/50"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle 
                className={`h-4 w-4 ${
                  trend.currentSeverity === 'high' 
                    ? 'text-red-500' 
                    : trend.currentSeverity === 'medium' 
                      ? 'text-amber-500' 
                      : 'text-blue-500'
                }`} 
              />
              <span className="font-medium text-sm line-clamp-1">{trend.description}</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                trend.trend === 'increase' 
                  ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30' 
                  : trend.trend === 'decrease' 
                    ? 'text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30' 
                    : 'text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/30'
              }`}
            >
              {trend.trend === 'increase' ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : trend.trend === 'decrease' ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : (
                <Minus className="h-3 w-3 mr-1" />
              )}
              {trend.trend === 'increase' 
                ? 'Increasing' 
                : trend.trend === 'decrease' 
                  ? 'Decreasing' 
                  : 'Stable'}
            </Badge>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-medium text-primary/80">{formatRegulationName(trend.regulation)}</span>
            <span className="text-foreground/70 font-medium">
              Impact: {trend.impact.charAt(0).toUpperCase() + trend.impact.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskTrendList;
