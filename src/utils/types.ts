
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

export const REGION_REGULATIONS: Record<Region, Record<string, string>> = {
  'North America': {'CCPA': 'California Consumer Privacy Act', 'HIPAA': 'Health Insurance Portability and Accountability Act', 'GLBA': 'Gramm-Leach-Bliley Act'},
  'Europe': {'GDPR': 'General Data Protection Regulation', 'ePrivacy': 'ePrivacy Directive', 'NIS2': 'Network and Information Security Directive'},
  'Asia': {'PIPL': 'Personal Information Protection Law', 'APPI': 'Act on Protection of Personal Information', 'PDPA': 'Personal Data Protection Act'},
  'Africa': {'POPIA': 'Protection of Personal Information Act', 'NDPR': 'Nigeria Data Protection Regulation'},
  'Australia': {'Privacy Act': 'Privacy Act 1988', 'CDR': 'Consumer Data Right'},
  'South America': {'LGPD': 'Lei Geral de Proteção de Dados', 'PDPL': 'Personal Data Protection Law'},
  'Global': {'ISO 27001': 'ISO/IEC 27001', 'PCI DSS': 'Payment Card Industry Data Security Standard', 'SOC 2': 'Service Organization Control 2'}
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
  predictedChange: 'increasing' | 'decreasing' | 'stable';
  currentSeverity: RiskSeverity;
  regulation: string;
  description: string;
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
  regulationChanges: Array<{
    regulation: string;
    changeType: string;
    impactLevel: 'high' | 'medium' | 'low';
  }>;
}

export interface PredictiveAnalysis {
  id: string;
  timestamp: string;
  baselineScore: number;
  predictedScore: number;
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
  riskTrends: RiskTrend[];
  recommendations: string[];
  regulationChanges: Array<{
    regulation: string;
    changeType: string;
    impactLevel: 'high' | 'medium' | 'low';
  }>;
  originalScores: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
  };
  predictedScores: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
  };
  scoreDifferences: {
    overall: number;
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
  };
}
