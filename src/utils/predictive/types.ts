
// Types for predictive analytics features
export type RiskPrediction = {
  riskType: string;
  probability: number;
  regulation: string;
  severity: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
};

export type ComplianceInsight = {
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
};

export type PredictiveAnalyticsResult = {
  predictedRisks: RiskPrediction[];
  complianceInsights: ComplianceInsight[];
  riskTrends: {
    regulation: string;
    previousScore: number;
    predictedScore: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  recommendations: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effortToImplement: 'high' | 'medium' | 'low';
  }[];
  lastUpdated: string;
};
