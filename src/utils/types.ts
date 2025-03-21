
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Available industry types for compliance analysis
 */
export type Industry = 
  | 'Healthcare' 
  | 'Financial Services' 
  | 'Technology & IT' 
  | 'Manufacturing & Industrial'
  | 'Energy & Utilities'
  | 'Food & Beverage'
  | 'Education'
  | 'Government & Public Sector'
  | 'Telecommunications'
  | 'Environmental & Sustainability'
  | 'Life Sciences'
  | 'SaaS & Tech'
  | 'E-commerce & Payments';

/**
 * Geographic regions for regulatory compliance
 */
export type Region = 
  | 'North America'
  | 'European Union'
  | 'Asia Pacific'
  | 'United Kingdom'
  | 'Latin America'
  | 'Middle East'
  | 'Africa';

/**
 * Mapping of industries to their regulations
 */
export const INDUSTRY_REGULATIONS: Record<Industry, string[]> = {
  'Healthcare': ['HIPAA', 'HITECH', 'FDA Regulations', 'GDPR'],
  'Financial Services': ['PCI-DSS', 'SOX', 'AML/KYC', 'Basel III', 'GDPR', 'CCPA'],
  'Technology & IT': ['GDPR', 'CCPA', 'SOC 2', 'ISO/IEC 27001', 'NIST Cybersecurity Framework'],
  'Manufacturing & Industrial': ['ISO 9001', 'ISO 14001', 'OSHA', 'FDA'],
  'Energy & Utilities': ['NERC CIP', 'FERC', 'ISO 50001'],
  'Food & Beverage': ['FDA', 'FSMA', 'HACCP'],
  'Education': ['FERPA', 'COPPA'],
  'Government & Public Sector': ['FISMA', 'CJIS', 'GDPR'],
  'Telecommunications': ['FCC Regulations', 'GDPR', 'CCPA'],
  'Environmental & Sustainability': ['EPA', 'REACH', 'ISO 14001'],
  'Life Sciences': ['FDA', 'GxP', 'ICH', 'GDPR', '21 CFR Part 11'],
  'SaaS & Tech': ['SOC 2', 'GDPR', 'CCPA', 'ISO/IEC 27001', 'ISO 27018'],
  'E-commerce & Payments': ['PCI-DSS', 'GDPR', 'CCPA', 'APPI', 'ePrivacy Directive']
};

/**
 * Mapping of regions to their specific regulations
 */
export const REGION_REGULATIONS: Record<Region, Record<string, string>> = {
  'North America': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act',
    'GLBA': 'Gramm-Leach-Bliley Act',
    'CPRA': 'California Privacy Rights Act',
    'PIPEDA': 'Personal Information Protection and Electronic Documents Act'
  },
  'European Union': {
    'GDPR': 'General Data Protection Regulation',
    'ePrivacy': 'ePrivacy Directive',
    'NIS2': 'Network and Information Security Directive',
    'DORA': 'Digital Operational Resilience Act',
    'PSD2': 'Payment Services Directive 2'
  },
  'Asia Pacific': {
    'PDPA': 'Personal Data Protection Act (Singapore)',
    'APPI': 'Act on Protection of Personal Information (Japan)',
    'PIPL': 'Personal Information Protection Law (China)',
    'Privacy Act': 'Privacy Act 1988 (Australia)',
    'PDPB': 'Personal Data Protection Bill (India)'
  },
  'United Kingdom': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act 2018',
    'PECR': 'Privacy and Electronic Communications Regulations',
    'FCA': 'Financial Conduct Authority Regulations',
    'NIS': 'Network and Information Systems Regulations'
  },
  'Latin America': {
    'LGPD': 'Lei Geral de Proteção de Dados (Brazil)',
    'PDPL': 'Personal Data Protection Law (Argentina)',
    'LFPDPPP': 'Federal Law on Protection of Personal Data (Mexico)',
    'CPL': 'Consumer Protection Law'
  },
  'Middle East': {
    'PDPL': 'Personal Data Protection Law (Bahrain)',
    'DPL': 'Data Protection Law (DIFC)',
    'PDPL-SA': 'Personal Data Protection Law (Saudi Arabia)',
    'QADPL': 'Qatar Data Protection Law'
  },
  'Africa': {
    'POPIA': 'Protection of Personal Information Act (South Africa)',
    'NDPR': 'Nigeria Data Protection Regulation',
    'PDPA-Kenya': 'Data Protection Act (Kenya)',
    'PDPA-Egypt': 'Data Protection Law (Egypt)'
  }
};

/**
 * Risk severity levels
 */
export type RiskSeverity = 'high' | 'medium' | 'low';

/**
 * Risk item structure
 */
export interface RiskItem {
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
}

/**
 * Compliance report structure
 */
export interface ComplianceReport {
  documentId: string;
  documentName: string;
  industry?: Industry;
  region?: Region;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  regulations?: string[];
  regionalRegulations?: Record<string, string>;
  risks: RiskItem[];
  summary: string;
  timestamp: string;
  suggestions?: string[];
  language?: string;
}

/**
 * Regulation change types
 */
export type RegulationChangeType = 'stricter' | 'updated' | 'new' | 'relaxed';

/**
 * Impact level for regulation changes
 */
export type ImpactLevel = 'high' | 'medium' | 'low';

/**
 * Structure for a regulation change
 */
export interface RegulationChange {
  regulation: string;
  changeType: RegulationChangeType;
  impactLevel: ImpactLevel;
}

/**
 * Simulation scenario for predictive analysis
 */
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  regulationChanges: RegulationChange[];
}

/**
 * Risk trend prediction
 */
export interface RiskTrend {
  riskId: string;
  description: string;
  regulation: string;
  currentSeverity: RiskSeverity;
  predictedChange: 'increase' | 'decrease' | 'stable';
  impact: ImpactLevel;
}

/**
 * Score comparison structure
 */
export interface ScoreComparison {
  gdpr: number;
  hipaa: number;
  soc2: number;
  pciDss: number;
  overall: number;
}

/**
 * Predictive analysis result
 */
export interface PredictiveAnalysis {
  scenarioId: string;
  scenarioName: string;
  scenarioDescription: string;
  regulationChanges: RegulationChange[];
  originalScores: ScoreComparison;
  predictedScores: ScoreComparison;
  scoreDifferences: ScoreComparison;
  predictedRisks: RiskItem[];
  riskTrends: RiskTrend[];
  recommendations: string[];
  timestamp: string;
}
