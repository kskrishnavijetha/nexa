
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
  | 'Environmental & Sustainability';

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
  'Environmental & Sustainability': ['EPA', 'REACH', 'ISO 14001']
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
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  industryScores?: Record<string, number>;
  regulations?: string[];
  risks: RiskItem[];
  summary: string;
  timestamp: string;
  suggestions?: string[];
}

