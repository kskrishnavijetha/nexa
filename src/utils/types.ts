
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

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
  regulation: 'GDPR' | 'HIPAA' | 'SOC2';
  section?: string;
}

/**
 * Compliance report structure
 */
export interface ComplianceReport {
  documentId: string;
  documentName: string;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  risks: RiskItem[];
  summary: string;
  timestamp: string;
  suggestions?: string[];
}
