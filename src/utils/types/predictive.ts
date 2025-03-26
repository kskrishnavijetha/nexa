
import { RiskSeverity } from './common';

// Risk trend type
export interface RiskTrend {
  riskId: string;
  description: string;
  regulation: string;
  currentSeverity: RiskSeverity;
  predictedChange: 'increase' | 'decrease' | 'stable';
  impact: 'high' | 'medium' | 'low';
  previousScore: number;
  predictedScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Predictive analysis type
export interface PredictiveAnalysis {
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
  regulationChanges: {
    regulation: string;
    changeType: 'stricter' | 'updated' | 'relaxed' | 'new';
    impactLevel: 'high' | 'medium' | 'low';
  }[];
  originalScores: {
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  predictedScores: {
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  scoreDifferences: {
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  predictedRisks: any[];
  complianceInsights: {
    title: string;
    description: string;
    actionRequired: boolean;
    priority: 'high' | 'medium' | 'low' | 'critical';
  }[];
  riskTrends: RiskTrend[];
  recommendations: string[];
  lastUpdated: string;
  timestamp: string;
}
