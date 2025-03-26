
export type Industry = 
  | 'finance' 
  | 'healthcare' 
  | 'technology' 
  | 'retail' 
  | 'education'
  | 'government'
  | 'legal'
  | 'manufacturing'
  | 'insurance' 
  | 'telecom'
  | 'energy'
  | 'other'
  | 'Healthcare'
  | 'Financial Services'
  | 'Technology & IT'
  | 'Manufacturing & Industrial';

export type Region = 
  | 'us' 
  | 'eu' 
  | 'uk' 
  | 'asia' 
  | 'australia'
  | 'canada'
  | 'global'
  | 'other'
  | 'North America'
  | 'European Union'
  | 'Asia Pacific'
  | 'United Kingdom'
  | 'Latin America'
  | 'Middle East'
  | 'Africa';

export type RiskSeverity = 'high' | 'medium' | 'low';

// Generic API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Risk item definition
export interface RiskItem {
  id?: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Compliance risk types
export interface ComplianceRisk {
  id: string;
  severity: RiskSeverity;
  description: string;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Compliance report types with all required fields
export interface ComplianceReport {
  id: string;
  documentId: string;
  documentName: string;
  scanDate?: string;
  timestamp: string; // Added timestamp property
  risks: ComplianceRisk[];
  industry?: Industry;
  region?: Region;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  summary: string;
  suggestions?: string[];
  regulations?: string[];
  regionalRegulations?: Record<string, string>;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  language?: string;
}

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

// Industry regulations mapping
export const INDUSTRY_REGULATIONS: Record<string, string[]> = {
  'finance': ['PCI-DSS', 'SOX'],
  'healthcare': ['HIPAA', 'HITECH'],
  'technology': ['GDPR', 'CCPA', 'SOC 2'],
  'retail': ['PCI-DSS', 'CCPA'],
  'education': ['FERPA', 'COPPA'],
  'government': ['FISMA', 'FedRAMP'],
  'legal': ['GDPR', 'CCPA', 'Ethics Rules'],
  'manufacturing': ['ISO 9001', 'FDA', 'OSHA'],
  'insurance': ['NAIC', 'GDPR'],
  'telecom': ['CPNI', 'GDPR'],
  'energy': ['NERC-CIP', 'ISO 14001'],
  'other': ['GDPR'],
  'Healthcare': ['HIPAA', 'HITECH'],
  'Financial Services': ['PCI-DSS', 'SOX'],
  'Technology & IT': ['GDPR', 'CCPA', 'SOC 2'],
  'Manufacturing & Industrial': ['ISO 9001', 'FDA', 'OSHA']
};

// Region regulations mapping
export const REGION_REGULATIONS: Record<string, Record<string, string>> = {
  'us': { 'CCPA': 'California Consumer Privacy Act', 'HIPAA': 'Health Insurance Portability and Accountability Act' },
  'eu': { 'GDPR': 'General Data Protection Regulation' },
  'uk': { 'UK GDPR': 'United Kingdom General Data Protection Regulation', 'DPA': 'Data Protection Act' },
  'asia': { 'PDPA': 'Personal Data Protection Act', 'PIPL': 'Personal Information Protection Law' },
  'australia': { 'Privacy Act': 'Privacy Act 1988', 'NDB': 'Notifiable Data Breaches scheme' },
  'canada': { 'PIPEDA': 'Personal Information Protection and Electronic Documents Act' },
  'global': { 'ISO27001': 'Information Security Management', 'SOC 2': 'Service Organization Control 2' },
  'other': { 'Local': 'Local Regulations' },
  'North America': { 'CCPA': 'California Consumer Privacy Act', 'HIPAA': 'Health Insurance Portability and Accountability Act' },
  'European Union': { 'GDPR': 'General Data Protection Regulation' },
  'Asia Pacific': { 'PDPA': 'Personal Data Protection Act', 'PIPL': 'Personal Information Protection Law' },
  'United Kingdom': { 'UK GDPR': 'United Kingdom General Data Protection Regulation', 'DPA': 'Data Protection Act' },
  'Latin America': { 'LGPD': 'Lei Geral de Proteção de Dados' },
  'Middle East': { 'PDPL': 'Personal Data Protection Law', 'DPL': 'Data Protection Law' },
  'Africa': { 'POPIA': 'Protection of Personal Information Act' }
};
