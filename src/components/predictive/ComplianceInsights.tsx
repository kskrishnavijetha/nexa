
import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ComplianceInsight {
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface ComplianceInsightsProps {
  insights: ComplianceInsight[];
}

const ComplianceInsights: React.FC<ComplianceInsightsProps> = ({ insights }) => {
  // Group insights by priority
  const criticalInsights = insights.filter(insight => insight.priority === 'critical');
  const highInsights = insights.filter(insight => insight.priority === 'high');
  const mediumInsights = insights.filter(insight => insight.priority === 'medium');
  const lowInsights = insights.filter(insight => insight.priority === 'low');

  const getInsightIcon = (priority: string, actionRequired: boolean) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    } else if (priority === 'medium') {
      return <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    }
  };

  const renderInsightGroup = (insightGroup: ComplianceInsight[], title: string) => {
    if (insightGroup.length === 0) return null;
    
    return (
      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <div className="space-y-3">
          {insightGroup.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded flex gap-3 ${
                insight.priority === 'critical' ? 'bg-red-50 border border-red-100' : 
                insight.priority === 'high' ? 'bg-red-50 border border-red-100' : 
                insight.priority === 'medium' ? 'bg-amber-50 border border-amber-100' : 
                'bg-green-50 border border-green-100'
              }`}
            >
              {getInsightIcon(insight.priority, insight.actionRequired)}
              <div>
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <p className="text-sm mt-1">{insight.description}</p>
                {insight.actionRequired && (
                  <p className="text-xs mt-2 font-medium text-slate-700">
                    Action required
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        AI-powered insights based on analysis of this document and historical compliance data.
      </p>
      
      {insights.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No insights available. More compliance data is needed for analysis.
        </div>
      ) : (
        <>
          {renderInsightGroup(criticalInsights, "Critical Insights")}
          {renderInsightGroup(highInsights, "High Priority Insights")}
          {renderInsightGroup(mediumInsights, "Medium Priority Insights")}
          {renderInsightGroup(lowInsights, "General Insights")}
        </>
      )}
    </div>
  );
};

export default ComplianceInsights;
