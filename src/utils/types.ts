
export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  regulation?: string;
  section?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
}

export interface ComplianceReport {
  id: string;
  documentId: string;
  documentName: string;
  timestamp: string;
  overallScore: number;
  risks: Risk[];
  suggestions: Suggestion[];
  summary: string;
  industry: string;
  region: string;
  userId?: string;
  // Additional fields needed by components
  gdprScore?: number;
  hipaaScore?: number;
  soc2Score?: number;
  pciDssScore?: number;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  regulations?: string[];
  regionalRegulations?: string[];
}

export interface AuditEvent {
    id: string;
    timestamp: string;
    action: string;
    documentName: string;
    user: string;
    status: 'pending' | 'in-progress' | 'completed';
    comments: string[];
    icon?: React.ReactNode;
}

// Type definitions for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types for industries and regions
export type Industry = string;
export type Region = string;

// Risk severity type
export type RiskSeverity = 'high' | 'medium' | 'low';
export type ComplianceRisk = Risk;
export type RiskItem = Risk;

// Constants for regulations
export const INDUSTRY_REGULATIONS: Record<Industry, string[]> = {
  'Healthcare': ['HIPAA', 'GDPR', 'FDA'],
  'Finance': ['PCI DSS', 'SOX', 'GLBA'],
  'Technology': ['GDPR', 'CCPA', 'SOC 2'],
  'Manufacturing': ['ISO 9001', 'GMP', 'RoHS'],
  'Retail': ['PCI DSS', 'CCPA', 'CAN-SPAM'],
  'Education': ['FERPA', 'COPPA', 'GDPR'],
  'Government': ['FISMA', 'FedRAMP', 'ITAR'],
  'Transportation': ['DOT', 'FMCSA', 'TSA'],
  'Energy': ['NERC', 'FERC', 'EPA']
};

export const REGION_REGULATIONS: Record<Region, string[]> = {
  'North America': ['HIPAA', 'SOX', 'GLBA', 'CCPA', 'CPRA'],
  'Europe': ['GDPR', 'ePrivacy', 'NIS2'],
  'Asia': ['PIPL', 'APPI', 'PDPA'],
  'Africa': ['POPIA', 'NDPR'],
  'Australia': ['Privacy Act', 'CDR'],
  'South America': ['LGPD', 'PDPL'],
  'Global': ['ISO 27001', 'PCI DSS', 'SOC 2']
};

// Predictive analysis types
export interface RiskTrend {
  id: string;
  riskId: string;
  severity: RiskSeverity;
  title: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  impact: number;
  probability: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  industry: Industry;
  impactLevel: 'high' | 'medium' | 'low';
  scoreImpact: {
    overall: number;
    gdpr?: number;
    hipaa?: number;
    soc2?: number;
    pciDss?: number;
  };
}

export interface PredictiveAnalysis {
  id: string;
  timestamp: string;
  baselineScore: number;
  predictedScore: number;
  scenarioId: string;
  scenarioName: string;
  risks: RiskTrend[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    impact: number;
    effort: 'high' | 'medium' | 'low';
  }[];
}
