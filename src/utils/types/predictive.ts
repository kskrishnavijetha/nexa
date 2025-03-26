
import { RiskTrend } from './risk';

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

// Simulation scenario type
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  regulationChanges: {
    regulation: string;
    changeType: 'stricter' | 'updated' | 'relaxed' | 'new';
    impactLevel: 'high' | 'medium' | 'low';
  }[];
  impact: {
    gdprScore: number;
    hipaaScore: number;
    soc2Score: number;
    pciDssScore?: number;
    overallScore: number;
  };
}
