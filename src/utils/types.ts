
export interface ComplianceReport {
  id?: string; // Add optional id field
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

// Add RiskItem interface needed by predictive analysis
export interface RiskItem {
  id: string;
  name: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  likelihood: number;
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
  | 'Technology & IT'
  | 'Global'; // Add Global to fix industry type errors

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
  id?: string; // Add optional id field
  title?: string; // Add optional title field
  severity?: RiskSeverity; // Add optional severity field
  probability?: number; // Add optional probability field
  description: string;
  regulation: string;
  currentSeverity: RiskSeverity;
  predictedChange: 'increase' | 'decrease' | 'stable';
  impact: 'high' | 'medium' | 'low';
  previousScore: number;
  predictedScore: number;
  trend: 'increase' | 'decrease' | 'stable'; // Fixed to match expected values
}

// Simulation scenario interface
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  industry?: Industry;
  region?: Region;
  actions: string[];
  regulationChanges: RegulationChange[]; // Add this field
  predictedImprovements: {
    overallScore: number;
    gdprScore?: number;
    hipaaScore?: number;
    soc2Score?: number;
    pciDssScore?: number;
  };
}

// Add RegulationChange interface
export interface RegulationChange {
  regulation: string;
  changeType: 'stricter' | 'relaxed' | 'new' | 'updated';
  impactLevel: 'high' | 'medium' | 'low';
}

// Predictive analysis interface
export interface PredictiveAnalysis {
  scenarioId?: string; // Added to match usage
  scenarioName?: string; // Added to match usage
  scenarioDescription?: string; // Added to match usage
  regulationChanges?: RegulationChange[]; // Added to match usage
  originalScores?: { // Added to match usage
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  predictedScores?: { // Added to match usage
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  scoreDifferences?: { // Added to match usage
    gdpr: number;
    hipaa: number;
    soc2: number;
    pciDss: number;
    overall: number;
  };
  riskPredictions: RiskPrediction[];
  riskTrends: RiskTrend[]; // Added to match usage
  recommendedActions: string[];
  recommendations?: string[]; // Added to match usage in SimulationResults
  timestamp?: string; // Added to match usage
  lastUpdated?: string; // Added to match usage
  complianceForecasts: {
    overallScore: number;
    gdprScore: number;
    hipaaScore: number;
    soc2Score: number;
    pciDssScore?: number;
  };
  predictedRisks?: RiskItem[]; // Added to match usage
  complianceInsights?: ComplianceInsight[]; // Added to match usage
}

// Add missing ComplianceInsight interface
export interface ComplianceInsight {
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'high' | 'medium' | 'low' | 'critical';
}

// Risk prediction interface
export interface RiskPrediction {
  title?: string;
  riskType?: string;
  description?: string;
  severity: RiskSeverity;
  probability: number;
  impact?: 'high' | 'medium' | 'low';
  regulation: string;
  trend?: 'increase' | 'decrease' | 'stable';
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
  'Financial Services': ['GDPR', 'SOC 2', 'PCI-DSS', 'ISO/IEC 27001'],
  'Global': ['GDPR', 'ISO/IEC 27001', 'PCI-DSS']
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

// Add missing INDUSTRY_RISKS constant to fix imports
export const INDUSTRY_RISKS: Record<string, ComplianceRisk[]> = {
  'GDPR': [
    {
      id: 'gdpr-ind-1',
      title: 'Cross-border Data Transfer Risk',
      description: 'Inadequate safeguards for international data transfers',
      severity: 'high',
      regulation: 'GDPR',
      mitigation: 'Implement Standard Contractual Clauses (SCCs)'
    },
    {
      id: 'gdpr-ind-2',
      title: 'Data Subject Rights Processing',
      description: 'Insufficient processes for handling data subject requests',
      severity: 'medium',
      regulation: 'GDPR',
      mitigation: 'Establish formal data subject request procedures'
    }
  ],
  'HIPAA': [
    {
      id: 'hipaa-ind-1',
      title: 'Healthcare Data Access Controls',
      description: 'Inadequate access controls for PHI',
      severity: 'high',
      regulation: 'HIPAA',
      mitigation: 'Implement role-based access control'
    }
  ],
  'SOC 2': [
    {
      id: 'soc2-ind-1',
      title: 'Vendor Management Risk',
      description: 'Insufficient monitoring of third-party service providers',
      severity: 'medium',
      regulation: 'SOC 2',
      mitigation: 'Establish vendor assessment program'
    }
  ]
};

// Add missing REGION_RISKS constant to fix imports
export const REGION_RISKS: Record<string, ComplianceRisk[]> = {
  'us': [
    {
      id: 'us-risk-1',
      title: 'CCPA Compliance Gap',
      description: 'Missing consumer notice requirements',
      severity: 'medium',
      regulation: 'CCPA',
      mitigation: 'Update privacy notices for California residents'
    }
  ],
  'eu': [
    {
      id: 'eu-risk-1',
      title: 'Data Protection Impact Assessment',
      description: 'DPIA not conducted for high-risk processing',
      severity: 'high',
      regulation: 'GDPR',
      mitigation: 'Conduct DPIAs for high-risk processing activities'
    }
  ],
  'uk': [
    {
      id: 'uk-risk-1',
      title: 'UK GDPR Alignment',
      description: 'Policies not updated for UK GDPR specifics',
      severity: 'medium',
      regulation: 'UK GDPR',
      mitigation: 'Review and update policies for UK GDPR compliance'
    }
  ],
  'North America': [
    {
      id: 'na-risk-1',
      title: 'State Privacy Law Patchwork',
      description: 'Not compliant with multiple state privacy laws',
      severity: 'medium',
      regulation: 'State Laws',
      mitigation: 'Create a unified compliance approach for state laws'
    }
  ],
  'Global': [
    {
      id: 'global-risk-1',
      title: 'Global Data Transfer Mechanism',
      description: 'Inconsistent approach to international data transfers',
      severity: 'high',
      regulation: 'Multiple',
      mitigation: 'Implement a global data transfer framework'
    }
  ]
};
