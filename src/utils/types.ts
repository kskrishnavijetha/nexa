
export interface ComplianceReport {
  documentId: string;
  documentName: string;
  originalFileName?: string;
  userId?: string | null;
  timestamp: string;
  overallScore: number;
  industryScore: number;
  regionalScore: number;
  regulationScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  risks: ComplianceRisk[];
  itemsScanned?: number;
  issues?: Issue[];
  industry: Industry;
  region?: Region;
  language?: SupportedLanguage;
  complianceStatus: 'compliant' | 'non-compliant' | 'partially-compliant';
  documentType?: string;
  pageCount?: number;
  fileSize?: number;
  author?: string;
  lastModified?: string;
  regulations: string[];
  summary?: string;
  suggestions?: Suggestion[];
  recommendations?: string[];
  simulationResults?: SimulationResult[];
  vulnerabilities?: Vulnerability[];
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  regionalRegulations?: Record<string, string>;
}

export interface ComplianceRisk {
  id?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
  mitigation?: string;
}

export type RiskSeverity = 'high' | 'medium' | 'low';

export interface Risk {
  id?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
  mitigation?: string;
}

export interface Issue {
  title: string;
  description: string;
  severity: RiskSeverity;
  location: string;
}

export interface Suggestion {
  id?: string;
  title: string;
  description: string;
}

export interface SimulationResult {
  regulation: string;
  originalScore: number;
  improvedScore: number;
  actionsTaken: string[];
}

export interface Vulnerability {
  title: string;
  description: string;
  severity: RiskSeverity;
  remediation: string;
}

export type Industry =
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'technology'
  | 'retail'
  | 'government'
  | 'Technology'
  | 'Healthcare'
  | 'Financial Services'
  | 'Technology & IT';

export type Region =
  | 'us'
  | 'eu'
  | 'uk'
  | 'ca'
  | 'au'
  | 'North America'
  | 'European Union'
  | 'Asia Pacific'
  | 'United Kingdom'
  | 'Latin America'
  | 'Middle East'
  | 'Africa'
  | 'Global';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh';

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Risk trend interface
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

// Simulation scenario interface
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  industry?: Industry;
  region?: Region;
  actions: string[];
  predictedImprovements: {
    overallScore: number;
    gdprScore?: number;
    hipaaScore?: number;
    soc2Score?: number;
    pciDssScore?: number;
  };
}

// Predictive analysis interface
export interface PredictiveAnalysis {
  riskPredictions: RiskPrediction[];
  trendAnalysis: RiskTrend[];
  recommendedActions: string[];
  complianceForecasts: {
    overallScore: number;
    gdprScore: number;
    hipaaScore: number;
    soc2Score: number;
    pciDssScore?: number;
  };
}

// Risk prediction interface
export interface RiskPrediction {
  title: string;
  description: string;
  severity: RiskSeverity;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  regulation: string;
}

// Risk item (used in predictive analytics)
export interface RiskItem {
  id: string;
  name: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  likelihood: number;
}

// Industry regulations mapping
export const INDUSTRY_REGULATIONS: Record<string, string[]> = {
  'finance': ['GDPR', 'SOC 2', 'PCI-DSS', 'ISO/IEC 27001'],
  'healthcare': ['HIPAA', 'GDPR', 'ISO/IEC 27001'],
  'education': ['FERPA', 'GDPR', 'COPPA'],
  'technology': ['GDPR', 'SOC 2', 'ISO/IEC 27001'],
  'retail': ['PCI-DSS', 'GDPR', 'CCPA'],
  'government': ['FISMA', 'GDPR', 'ISO/IEC 27001'],
  'Technology': ['GDPR', 'SOC 2', 'ISO/IEC 27001'],
  'Healthcare': ['HIPAA', 'GDPR', 'ISO/IEC 27001'],
  'Financial Services': ['GDPR', 'SOC 2', 'PCI-DSS', 'ISO/IEC 27001']
};

// Region regulations mapping
export const REGION_REGULATIONS: Record<string, Record<string, string>> = {
  'us': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act'
  },
  'eu': {
    'GDPR': 'General Data Protection Regulation'
  },
  'uk': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act'
  },
  'ca': {
    'PIPEDA': 'Personal Information Protection and Electronic Documents Act'
  },
  'au': {
    'Privacy Act': 'Privacy Act 1988'
  },
  'North America': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act',
    'PIPEDA': 'Personal Information Protection and Electronic Documents Act'
  },
  'European Union': {
    'GDPR': 'General Data Protection Regulation',
    'ePrivacy': 'ePrivacy Directive'
  },
  'Asia Pacific': {
    'PDPA': 'Personal Data Protection Act',
    'PIPL': 'Personal Information Protection Law'
  },
  'United Kingdom': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act',
    'PECR': 'Privacy and Electronic Communications Regulations'
  },
  'Latin America': {
    'LGPD': 'Lei Geral de Proteção de Dados',
    'PDPL': 'Personal Data Protection Law'
  },
  'Middle East': {
    'PDPL': 'Personal Data Protection Law',
    'DPL': 'Data Protection Law'
  },
  'Africa': {
    'POPIA': 'Protection of Personal Information Act'
  },
  'Global': {
    'ISO/IEC': 'ISO/IEC 27001',
    'GDPR': 'General Data Protection Regulation'
  }
};
