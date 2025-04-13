
import { Industry, RiskSeverity, Region } from './common';
import { Suggestion } from './suggestion';

export interface ComplianceRisk {
  id?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  section?: string;
  regulation?: string;
  mitigation?: string;
}

export interface ComplianceReport {
  documentId: string;
  id?: string; // Added for compatibility with some components
  documentName: string;
  scanDate?: string;
  timestamp?: string;
  date?: Date; // Add date field needed by RealtimeAnalysisSimulator
  industry: Industry;
  organization?: string;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  industryScore?: number;
  regionalScore?: number;
  regulationScore?: number;
  summary: string;
  risks: Array<ComplianceRisk>;
  recommendations?: string[]; // Add recommendations field to resolve the error
  userId?: string;
  complianceStatus?: string;
  regulations?: string[];
  region?: Region;
  regionalRegulations?: Record<string, any>;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  suggestions?: Suggestion[];
  pageCount?: number;
  originalFileName?: string;
  
  // Fields for simulation reports
  isSimulation?: boolean;
  simulationDetails?: {
    scenarioName?: string;
    scenarioDescription?: string;
    regulationChanges?: any[];
    predictedImprovements?: {
      overall: number;
      gdpr: number;
      hipaa: number;
      soc2: number;
      pciDss?: number;
    };
  };
}

export type RiskItem = ComplianceRisk;

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  mitigation?: string;
}
