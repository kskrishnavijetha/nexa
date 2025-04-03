
export interface AIInsight {
  text: string;
  type: 'info' | 'warning' | 'success' | 'observation' | 'recommendation';
  title?: string;
  actionRequired?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface AuditReportStatistics {
  totalEvents: number;
  userEvents: number;
  systemEvents: number;
  completed: number;
  inProgress: number;
  pending: number;
  // Add aliases for clearer property names in findings files
  completedTasks?: number;
  pendingTasks?: number;
}

export interface ComplianceFinding {
  category: string;
  status: 'Pass' | 'Failed' | 'Warning' | 'N/A';
  criticality: 'High' | 'Medium' | 'Low' | 'Critical';
  details: string;
}

export interface CriticalRisk {
  description: string;
  impact: string;
}

export interface ComplianceRecommendation {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ComplianceRisk {
  id?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  section?: string;
  regulation?: string;
  mitigation?: string;
}

export interface Suggestion {
  id?: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ComplianceReport {
  documentId: string;
  id?: string; // Added for compatibility with some components
  documentName: string;
  scanDate?: string;
  timestamp?: string;
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
}

export type Industry = 
  'Finance & Banking' | 
  'Healthcare' | 
  'Retail & Consumer' | 
  'E-Commerce' | 
  'Cloud & SaaS' | 
  'Government & Defense' | 
  'Energy & Utilities' | 
  'Telecom' | 
  'Manufacturing & Supply Chain' | 
  'Education' | 
  'Automotive' | 
  'Pharmaceutical & Biotech' |
  'Global';

export type Region = 'US' | 'EU' | 'APAC' | 'UK' | 'Global' | 'North America' | 'European Union' | 'Asia Pacific' | 'United Kingdom' | 'Latin America' | 'Middle East' | 'Africa';

export type RiskSeverity = 'high' | 'medium' | 'low' | 'critical';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number; // Added for services that return status
}

// Required for simulation components
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

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  mitigation?: string;
}

export type RiskItem = ComplianceRisk;

// Constants for industry and region regulations needed by many components
export const INDUSTRY_REGULATIONS: Record<string, string[]> = {
  'Finance & Banking': ['GDPR', 'SOC 2', 'PCI-DSS', 'GLBA'],
  'Healthcare': ['HIPAA', 'GDPR', 'HITECH'],
  'Retail & Consumer': ['GDPR', 'PCI-DSS', 'CCPA'],
  'E-Commerce': ['GDPR', 'PCI-DSS', 'CCPA'],
  'Cloud & SaaS': ['GDPR', 'SOC 2', 'ISO/IEC 27001'],
  'Government & Defense': ['FISMA', 'FedRAMP', 'CMMC'],
  'Energy & Utilities': ['NERC', 'GDPR', 'CCPA'],
  'Telecom': ['GDPR', 'CPNI', 'CCPA'],
  'Manufacturing & Supply Chain': ['ISO 9001', 'GDPR', 'CCPA'],
  'Education': ['FERPA', 'GDPR', 'COPPA'],
  'Automotive': ['ISO 26262', 'GDPR', 'CCPA'],
  'Pharmaceutical & Biotech': ['FDA CFR Part 11', 'HIPAA', 'GDPR'],
  'Global': ['GDPR', 'ISO/IEC 27001', 'SOC 2']
};

export const REGION_REGULATIONS: Record<string, Record<string, string>> = {
  'US': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act',
    'SOX': 'Sarbanes-Oxley Act',
    'GLBA': 'Gramm-Leach-Bliley Act'
  },
  'EU': {
    'GDPR': 'General Data Protection Regulation',
    'ePrivacy': 'ePrivacy Directive',
    'NIS2': 'Network and Information Security Directive'
  },
  'UK': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act 2018',
    'PECR': 'Privacy and Electronic Communications Regulations'
  },
  'APAC': {
    'PDPA': 'Personal Data Protection Act (Singapore)',
    'PIPL': 'Personal Information Protection Law (China)',
    'APP': 'Australian Privacy Principles'
  },
  'Global': {
    'ISO/IEC 27001': 'Information Security Management',
    'ISO/IEC 27701': 'Privacy Information Management',
    'SOC 2': 'Service Organization Control 2'
  },
  'North America': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act',
    'PIPEDA': 'Personal Information Protection and Electronic Documents Act'
  },
  'European Union': {
    'GDPR': 'General Data Protection Regulation',
    'ePrivacy': 'ePrivacy Directive',
    'NIS2': 'Network and Information Security Directive'
  },
  'Asia Pacific': {
    'PDPA': 'Personal Data Protection Act (Singapore)',
    'PIPL': 'Personal Information Protection Law (China)',
    'APP': 'Australian Privacy Principles'
  },
  'United Kingdom': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act 2018',
    'PECR': 'Privacy and Electronic Communications Regulations'
  },
  'Latin America': {
    'LGPD': 'Lei Geral de Proteção de Dados (Brazil)',
    'PDPL': 'Personal Data Protection Law (Chile)',
    'LPDP': 'Ley de Protección de Datos Personales (Mexico)'
  },
  'Middle East': {
    'PDPL': 'Personal Data Protection Law (Bahrain)',
    'DPL': 'Data Protection Law (DIFC)',
    'PDPL': 'Personal Data Protection Law (Qatar)'
  },
  'Africa': {
    'POPIA': 'Protection of Personal Information Act (South Africa)',
    'NDPR': 'Nigeria Data Protection Regulation',
    'PDPA': 'Personal Data Protection Act (Kenya)'
  }
};
