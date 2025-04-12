
import { RiskSeverity } from './common';

export interface PredictiveAnalysis {
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
  industry?: string;
  regulationChanges?: RegulationChange[];
  scoreDifferences?: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss?: number;
  };
  riskTrends?: RiskTrend[];
  recommendations?: string[];
  originalScores?: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss?: number;
  };
  predictedScores?: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss?: number;
  };
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  industry?: string;
  regulationChanges: RegulationChange[];
  actions: string[];
  predictedImprovements?: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss?: number;
  };
}

export interface RegulationChange {
  regulation: string;
  changeType: 'new' | 'update' | 'repeal';
  impactLevel: 'high' | 'medium' | 'low';
  description: string;
}

export interface RiskTrend {
  regulation: string;
  description: string;
  trend: 'increase' | 'decrease' | 'stable';
  impact: 'high' | 'medium' | 'low';
  currentSeverity: RiskSeverity;
  projectedSeverity?: RiskSeverity;
  riskId?: string;
  previousScore?: number;
  predictedScore?: number;
}

export interface SimulationDetails {
  simulationType: 'predictive-analysis' | 'real-time-monitoring' | 'what-if';
  scenarioName: string;
  scenarioId?: string;
  analysisDate: string;
  baseDocumentId?: string;
  baseDocumentName?: string;
  predictedImprovements?: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss?: number;
  };
}
